{
  "modules": [
    {
      "file": "/app/app/__init__.py",
      "functions": []
    },
    {
      "file": "/app/app/auth.py",
      "functions": [
        {
          "name": "auth_error",
          "line": 19,
          "end": 20,
          "body": "def auth_error(code: str, status_code: int = status.HTTP_401_UNAUTHORIZED) -> HTTPException:\n    return HTTPException(status_code=status_code, detail={\"code\": code})"
        },
        {
          "name": "_cognito_subject",
          "line": 23,
          "end": 39,
          "body": "def _cognito_subject(token: str, settings: Settings) -> str:\n    if not settings.cognito_issuer or not settings.cognito_client_id or not settings.cognito_jwks_url:\n        raise auth_error(\"AUTH_CONFIGURATION_INVALID\", status.HTTP_503_SERVICE_UNAVAILABLE)\n    try:\n        key = PyJWKClient(str(settings.cognito_jwks_url)).get_signing_key_from_jwt(token).key\n        claims = jwt.decode(\n            token,\n            key,\n            algorithms=[\"RS256\"],\n            audience=settings.cognito_client_id,\n            issuer=str(settings.cognito_issuer).rstrip(\"/\"),\n        )\n    except (InvalidTokenError, PyJWKClientError) as error:\n        raise auth_error(\"INVALID_ACCESS_TOKEN\") from error\n    if claims.get(\"token_use\") != \"access\" or not isinstance(claims.get(\"sub\"), str):\n        raise auth_error(\"INVALID_ACCESS_TOKEN\")\n    return claims[\"sub\"]"
        },
        {
          "name": "authenticated_subject",
          "line": 42,
          "end": 58,
          "body": "def authenticated_subject(\n    authorization: Annotated[str | None, Header()] = None,\n    demo_identity: Annotated[str | None, Header(alias=\"x-workshopos-identity\")] = None,\n    settings: Settings = Depends(get_settings),\n) -> str:\n    \"\"\"Return a Cognito subject, or the deliberately local-only demo subject.\"\"\"\n    if settings.auth_mode == \"cognito\":\n        if not authorization or not authorization.startswith(\"Bearer \"):\n            raise auth_error(\"AUTHENTICATION_REQUIRED\")\n        return _cognito_subject(authorization.removeprefix(\"Bearer \").strip(), settings)\n    if settings.auth_mode == \"database\":\n        return \"\"\n    if not settings.demo_auth_enabled:\n        raise auth_error(\"AUTH_CONFIGURATION_INVALID\", status.HTTP_503_SERVICE_UNAVAILABLE)\n    if not demo_identity or len(demo_identity) > 255:\n        raise auth_error(\"AUTHENTICATION_REQUIRED\")\n    return demo_identity"
        },
        {
          "name": "_rows",
          "line": 61,
          "end": 62,
          "body": "def _rows(session: Session, statement: str, parameters: dict[str, object]) -> list[dict[str, object]]:\n    return [dict(row) for row in session.execute(text(statement), parameters).mappings().all()]"
        },
        {
          "name": "resolve_tenant_scope",
          "line": 65,
          "end": 139,
          "body": "def resolve_tenant_scope(session: Session, subject: str, *, database_identity: tuple[UUID, UUID, UUID] | None = None) -> TenantScope:\n    \"\"\"Resolve the one server-selected active membership for an authenticated subject.\"\"\"\n    membership = _rows(\n        session,\n        \"\"\"\n        SELECT u.id AS actor_id, u.display_name, u.email, m.id AS membership_id,\n               m.tenant_id, m.version, t.name AS tenant_name, t.lifecycle_state\n        FROM platform_users AS u\n        JOIN tenant_memberships AS m ON m.id = COALESCE(CAST(:database_membership AS uuid), u.active_membership_id)\n            AND m.user_id = u.id\n        JOIN tenants AS t ON t.id = m.tenant_id\n        WHERE ((CAST(:database_user AS uuid) IS NULL AND u.cognito_subject = :subject)\n            OR (u.id = CAST(:database_user AS uuid) AND m.tenant_id = CAST(:database_tenant AS uuid)\n                AND m.id = CAST(:database_membership AS uuid)))\n          AND u.status = 'ACTIVE'\n          AND m.status = 'ACTIVE'\n          AND t.lifecycle_state IN ('trial', 'active', 'payment_due', 'suspended')\n        \"\"\",\n        {\"subject\": subject,\n         \"database_user\": str(database_identity[0]) if database_identity else None,\n         \"database_tenant\": str(database_identity[1]) if database_identity else None,\n         \"database_membership\": str(database_identity[2]) if database_identity else None},\n    )\n    if len(membership) != 1:\n        raise auth_error(\"TENANT_ACCESS_DENIED\", status.HTTP_403_FORBIDDEN)\n    current = membership[0]\n    membership_id = UUID(str(current[\"membership_id\"]))\n    tenant_id = UUID(str(current[\"tenant_id\"]))\n    branches = _rows(\n        session,\n        \"\"\"\n        SELECT b.id, b.name\n        FROM membership_branches AS mb\n        JOIN branches AS b ON b.id = mb.branch_id AND b.tenant_id = :tenant_id\n        WHERE mb.membership_id = :membership_id\n        ORDER BY b.name, b.id\n        \"\"\",\n        {\"membership_id\": str(membership_id), \"tenant_id\": str(tenant_id)},\n    )\n    if not branches:\n        raise auth_error(\"BRANCH_ACCESS_DENIED\", status.HTTP_403_FORBIDDEN)\n    roles = _rows(\n        session,\n        \"\"\"\n        SELECT r.id, r.name, COALESCE(array_agg(rp.permission ORDER BY rp.permission)\n               FILTER (WHERE rp.permission IS NOT NULL), '{}') AS permissions\n        FROM membership_roles AS mr\n        JOIN tenant_roles AS r ON r.id = mr.role_id AND r.tenant_id = :tenant_id AND r.status = 'ACTIVE'\n        LEFT JOIN role_permissions AS rp ON rp.role_id = r.id\n        WHERE mr.membership_id = :membership_id\n        GROUP BY r.id, r.name\n        ORDER BY r.name, r.id\n        \"\"\",\n        {\"membership_id\": str(membership_id), \"tenant_id\": str(tenant_id)},\n    )\n    parsed_branches = tuple(BranchScope(id=UUID(str(row[\"id\"])), name=str(row[\"name\"])) for row in branches)\n    parsed_roles = tuple(\n        (UUID(str(row[\"id\"])), str(row[\"name\"]), tuple(row[\"permissions\"] or ())) for row in roles\n    )\n    return TenantScope(\n        actor_id=UUID(str(current[\"actor_id\"])),\n        membership_id=membership_id,\n        tenant_id=tenant_id,\n        tenant_name=str(current[\"tenant_name\"]),\n        display_name=str(current[\"display_name\"]),\n        email=str(current[\"email\"]),\n        branch_ids=tuple(branch.id for branch in parsed_branches),\n        branches=parsed_branches,\n        role_ids=tuple(role[0] for role in parsed_roles),\n        roles=parsed_roles,\n        permissions=tuple(sorted({permission for _, _, permissions in parsed_roles for permission in permissions})),\n        version=int(current[\"version\"]),\n        lifecycle_state=str(current[\"lifecycle_state\"]),\n        read_only=str(current[\"lifecycle_state\"]) == \"suspended\",\n    )"
        },
        {
          "name": "resolve_emulated_tenant_scope",
          "line": 142,
          "end": 183,
          "body": "def resolve_emulated_tenant_scope(session: Session, subject: str, emulation_id: UUID) -> TenantScope:\n    \"\"\"Resolve a Superadmin-owned, active, read-only support emulation.\"\"\"\n    records = _rows(\n        session,\n        \"\"\"\n        SELECT e.id AS emulation_id, e.tenant_id, u.id AS actor_id, u.display_name, u.email,\n               t.name AS tenant_name, t.lifecycle_state, b.id AS branch_id, b.name AS branch_name\n        FROM support_emulations AS e\n        JOIN platform_users AS u ON u.id = e.superadmin_id\n        JOIN superadmins AS sa ON sa.user_id = u.id\n        JOIN tenants AS t ON t.id = e.tenant_id\n        JOIN branches AS b ON b.tenant_id = t.id AND b.is_primary\n        WHERE e.id = :emulation_id\n          AND u.cognito_subject = :subject\n          AND u.status = 'ACTIVE'\n          AND e.status = 'ACTIVE'\n          AND t.lifecycle_state IN ('trial', 'active', 'payment_due', 'suspended')\n        \"\"\",\n        {\"emulation_id\": str(emulation_id), \"subject\": subject},\n    )\n    if len(records) != 1:\n        raise auth_error(\"EMULATION_ACCESS_DENIED\", status.HTTP_403_FORBIDDEN)\n    record = records[0]\n    branch = BranchScope(id=UUID(str(record[\"branch_id\"])), name=str(record[\"branch_name\"]))\n    return TenantScope(\n        actor_id=UUID(str(record[\"actor_id\"])),\n        membership_id=UUID(str(record[\"emulation_id\"])),\n        tenant_id=UUID(str(record[\"tenant_id\"])),\n        tenant_name=str(record[\"tenant_name\"]),\n        display_name=str(record[\"display_name\"]),\n        email=str(record[\"email\"]),\n        branch_ids=(branch.id,),\n        branches=(branch,),\n        role_ids=(),\n        roles=(),\n        permissions=(),\n        version=1,\n        lifecycle_state=str(record[\"lifecycle_state\"]),\n        actor_type=\"support_emulation\",\n        emulation_id=UUID(str(record[\"emulation_id\"])),\n        read_only=True,\n    )"
        },
        {
          "name": "tenant_scope",
          "line": 186,
          "end": 203,
          "body": "def tenant_scope(\n    request: Request,\n    subject: str = Depends(authenticated_subject),\n    session: Session = Depends(get_session),\n    emulation_id: Annotated[UUID | None, Header(alias=\"x-workshopos-emulation-id\")] = None,\n) -> Generator[tuple[Session, TenantScope], None, None]:\n    \"\"\"Open a transaction after authorization and install the trusted RLS scope.\"\"\"\n    with session.begin():\n        if get_settings().auth_mode == \"database\":\n            if emulation_id:\n                raise auth_error(\"EMULATION_ACCESS_DENIED\", status.HTTP_403_FORBIDDEN)\n            from app.database_auth import database_identity as resolve_database_identity\n            identity = resolve_database_identity(request, session)\n            scope = resolve_tenant_scope(session, subject, database_identity=identity)\n        else:\n            scope = resolve_emulated_tenant_scope(session, subject, emulation_id) if emulation_id else resolve_tenant_scope(session, subject)\n        apply_rls_context(session, scope)\n        yield session, scope"
        },
        {
          "name": "session_payload",
          "line": 209,
          "end": 230,
          "body": "def session_payload(scope: TenantScope) -> dict[str, object]:\n    return {\n        \"actorType\": scope.actor_type,\n        \"actorId\": str(scope.actor_id),\n        \"membership\": {\n            \"id\": str(scope.membership_id),\n            \"displayName\": scope.display_name,\n            \"email\": scope.email,\n            \"status\": \"READ_ONLY\" if scope.read_only else \"ACTIVE\",\n            \"roleIds\": [str(role_id) for role_id in scope.role_ids],\n            \"roles\": [\n                {\"id\": str(role_id), \"name\": name, \"permissions\": list(permissions)}\n                for role_id, name, permissions in scope.roles\n            ],\n            \"branchIds\": [str(branch_id) for branch_id in scope.branch_ids],\n            \"branches\": [{\"id\": str(branch.id), \"name\": branch.name} for branch in scope.branches],\n            \"permissions\": list(scope.permissions),\n            \"version\": scope.version,\n        },\n        \"tenant\": {\"id\": str(scope.tenant_id), \"name\": scope.tenant_name, \"lifecycleState\": scope.lifecycle_state},\n        \"emulation\": None if not scope.emulation_id else {\"id\": str(scope.emulation_id), \"readOnly\": True},\n    }"
        }
      ]
    },
    {
      "file": "/app/app/checklists.py",
      "functions": [
        {
          "name": "_permission",
          "line": 33,
          "end": 44,
          "body": "def _permission(scope: ScopedTenant, *, write: bool = False) -> None:\n    current = scope[1]\n    if write:\n        try:\n            require_mutation_allowed(current)\n        except PermissionError as error:\n            raise auth_error(\"TENANT_READ_ONLY\", status.HTTP_403_FORBIDDEN) from error\n    if current.actor_type == \"support_emulation\" and not write:\n        return\n    suffix = \"write\" if write else \"read\"\n    if not any(f\"page.{page}.{suffix}\" in current.permissions for page in READ_PAGES):\n        raise auth_error(\"PERMISSION_DENIED\", status.HTTP_403_FORBIDDEN)"
        },
        {
          "name": "_cycles",
          "line": 47,
          "end": 66,
          "body": "def _cycles(scope: ScopedTenant, job_id: int) -> list[dict[str, object]]:\n    session, _ = scope\n    job = session.execute(text(\"SELECT id FROM job_cards WHERE id=:id\"), {\"id\": job_id}).scalar_one_or_none()\n    if job is None:\n        raise auth_error(\"JOB_NOT_FOUND\", status.HTTP_404_NOT_FOUND)\n    cycles = session.execute(text(\"\"\"SELECT * FROM job_checklist_cycles WHERE job_card_id=:job\n        ORDER BY started_at, id\"\"\"), {\"job\": job_id}).mappings().all()\n    result = []\n    for cycle in cycles:\n        items = session.execute(text(\"\"\"SELECT * FROM job_checklist_items WHERE cycle_id=:cycle\n            ORDER BY sort_order,id\"\"\"), {\"cycle\": cycle[\"id\"]}).mappings().all()\n        result.append({\"id\": cycle[\"id\"], \"jobId\": job_id, \"stage\": cycle[\"stage\"],\n                       \"cycleNumber\": cycle[\"cycle_number\"], \"startedAt\": cycle[\"started_at\"],\n                       \"completedAt\": cycle[\"completed_at\"],\n                       \"items\": [{\"id\": item[\"id\"], \"key\": item[\"item_key\"], \"label\": item[\"label\"],\n                                  \"sortOrder\": item[\"sort_order\"], \"required\": item[\"required\"],\n                                  \"checkedAt\": item[\"checked_at\"], \"checkedBy\": str(item[\"checked_by\"]) if item[\"checked_by\"] else None,\n                                  \"naAt\": item[\"na_at\"], \"naBy\": str(item[\"na_by\"]) if item[\"na_by\"] else None}\n                                 for item in items]})\n    return result"
        },
        {
          "name": "list_checklists",
          "line": 70,
          "end": 72,
          "body": "def list_checklists(scope: ScopedTenant, job_id: int = Query(alias=\"jobId\")) -> list[dict[str, object]]:\n    _permission(scope)\n    return _cycles(scope, job_id)"
        },
        {
          "name": "create_cycle",
          "line": 76,
          "end": 98,
          "body": "def create_cycle(input: CycleInput, scope: ScopedTenant) -> list[dict[str, object]]:\n    _permission(scope, write=True)\n    session, current = scope\n    job = session.execute(text(\"SELECT id,branch_id,status FROM job_cards WHERE id=:id\"), {\"id\": input.jobId}).mappings().one_or_none()\n    if job is None:\n        raise auth_error(\"JOB_NOT_FOUND\", status.HTTP_404_NOT_FOUND)\n    if job[\"status\"] in (\"CLOSED\", \"CANCELLED\") or job[\"status\"] != input.stage.strip():\n        raise auth_error(\"CHECKLIST_STAGE_NOT_CURRENT\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    if len({item.key for item in input.items}) != len(input.items):\n        raise auth_error(\"DUPLICATE_CHECKLIST_ITEM\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    number = session.execute(text(\"\"\"SELECT COALESCE(max(cycle_number),0)+1 FROM job_checklist_cycles\n        WHERE job_card_id=:job AND stage=:stage\"\"\"), {\"job\": input.jobId, \"stage\": input.stage}).scalar_one()\n    cycle_id = session.execute(text(\"\"\"INSERT INTO job_checklist_cycles(tenant_id,branch_id,job_card_id,stage,cycle_number,started_at)\n        VALUES (:tenant,:branch,:job,:stage,:number,now()) RETURNING id\"\"\"),\n        {\"tenant\": str(current.tenant_id), \"branch\": str(job[\"branch_id\"]), \"job\": input.jobId,\n         \"stage\": input.stage.strip(), \"number\": number}).scalar_one()\n    for index, item in enumerate(input.items, 1):\n        session.execute(text(\"\"\"INSERT INTO job_checklist_items(tenant_id,branch_id,cycle_id,job_card_id,item_key,\n            label,sort_order,required,started_at) VALUES (:tenant,:branch,:cycle,:job,:key,:label,:sort,:required,now())\"\"\"),\n            {\"tenant\": str(current.tenant_id), \"branch\": str(job[\"branch_id\"]), \"cycle\": cycle_id,\n             \"job\": input.jobId, \"key\": item.key.strip(), \"label\": item.label.strip(),\n             \"sort\": index, \"required\": item.required})\n    return _cycles(scope, input.jobId)"
        },
        {
          "name": "decide_item",
          "line": 102,
          "end": 124,
          "body": "def decide_item(item_id: int, input: DecisionInput, scope: ScopedTenant) -> list[dict[str, object]]:\n    _permission(scope, write=True)\n    session, current = scope\n    row = session.execute(text(\"\"\"SELECT item.cycle_id,item.job_card_id,item.required,cycle.stage,job.status\n        FROM job_checklist_items item JOIN job_checklist_cycles cycle ON cycle.id=item.cycle_id\n        JOIN job_cards job ON job.id=item.job_card_id WHERE item.id=:id\"\"\"),\n                          {\"id\": item_id}).mappings().one_or_none()\n    if row is None:\n        raise auth_error(\"CHECKLIST_ITEM_NOT_FOUND\", status.HTTP_404_NOT_FOUND)\n    if row[\"status\"] in (\"CLOSED\", \"CANCELLED\") or row[\"stage\"] != row[\"status\"]:\n        raise auth_error(\"CHECKLIST_STAGE_NOT_CURRENT\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    if input.state == \"na\" and row[\"required\"]:\n        raise auth_error(\"REQUIRED_CHECKLIST_ITEM\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    session.execute(text(\"\"\"UPDATE job_checklist_items SET\n        checked_by=CASE WHEN :state='checked' THEN CAST(:actor AS uuid) ELSE NULL END,\n        checked_at=CASE WHEN :state='checked' THEN now() ELSE NULL END,\n        na_by=CASE WHEN :state='na' THEN CAST(:actor AS uuid) ELSE NULL END,\n        na_at=CASE WHEN :state='na' THEN now() ELSE NULL END\n        WHERE id=:id\"\"\"), {\"state\": input.state, \"actor\": str(current.actor_id), \"id\": item_id})\n    session.execute(text(\"\"\"UPDATE job_checklist_cycles SET completed_at=CASE WHEN NOT EXISTS (\n        SELECT 1 FROM job_checklist_items WHERE cycle_id=:cycle AND checked_at IS NULL AND na_at IS NULL\n    ) THEN COALESCE(completed_at,now()) ELSE NULL END WHERE id=:cycle\"\"\"), {\"cycle\": row[\"cycle_id\"]})\n    return _cycles(scope, row[\"job_card_id\"])"
        }
      ]
    },
    {
      "file": "/app/app/config.py",
      "functions": [
        {
          "name": "get_settings",
          "line": 41,
          "end": 42,
          "body": "def get_settings() -> Settings:\n    return Settings()"
        }
      ]
    },
    {
      "file": "/app/app/database.py",
      "functions": [
        {
          "name": "get_engine",
          "line": 10,
          "end": 12,
          "body": "def get_engine() -> Engine:\n    \"\"\"Create a process-local engine from the configured PostgreSQL URL.\"\"\"\n    return create_engine(str(get_settings().database_url), pool_pre_ping=True, connect_args={\"connect_timeout\": 3})"
        },
        {
          "name": "get_session",
          "line": 15,
          "end": 18,
          "body": "def get_session() -> Generator[Session, None, None]:\n    session_factory = sessionmaker(bind=get_engine(), autoflush=False, autocommit=False)\n    with session_factory() as session:\n        yield session"
        }
      ]
    },
    {
      "file": "/app/app/database_auth.py",
      "functions": [
        {
          "name": "hash_password",
          "line": 27,
          "end": 30,
          "body": "def hash_password(password: str, *, salt: bytes | None = None) -> str:\n    salt = salt or secrets.token_bytes(16)\n    digest = hashlib.pbkdf2_hmac(\"sha256\", password.encode(), salt, 600_000)\n    return f\"pbkdf2_sha256$600000${salt.hex()}${digest.hex()}\""
        },
        {
          "name": "verify_password",
          "line": 33,
          "end": 41,
          "body": "def verify_password(password: str, encoded: str | None) -> bool:\n    try:\n        scheme, rounds, salt, digest = (encoded or \"\").split(\"$\")\n        if scheme != \"pbkdf2_sha256\" or int(rounds) < 600_000:\n            return False\n        actual = hashlib.pbkdf2_hmac(\"sha256\", password.encode(), bytes.fromhex(salt), int(rounds))\n        return hmac.compare_digest(actual, bytes.fromhex(digest))\n    except (ValueError, TypeError):\n        return False"
        },
        {
          "name": "_digest",
          "line": 44,
          "end": 45,
          "body": "def _digest(value: str) -> str:\n    return hashlib.sha256(value.encode()).hexdigest()"
        },
        {
          "name": "_database_mode",
          "line": 48,
          "end": 50,
          "body": "def _database_mode() -> None:\n    if get_settings().auth_mode != \"database\":\n        raise auth_error(\"AUTH_MODE_UNAVAILABLE\", status.HTTP_404_NOT_FOUND)"
        },
        {
          "name": "_code",
          "line": 53,
          "end": 57,
          "body": "def _code(code: str) -> str:\n    code = code.strip().lower()\n    if not CODE_PATTERN.fullmatch(code):\n        raise auth_error(\"TENANT_NOT_FOUND\", status.HTTP_404_NOT_FOUND)\n    return code"
        },
        {
          "name": "list_login_workshops",
          "line": 78,
          "end": 89,
          "body": "def list_login_workshops(session: Session = Depends(get_session)) -> list[dict[str, str]]:\n    _database_mode()\n    rows = session.execute(text(\"\"\"\n        SELECT DISTINCT t.code, t.name\n        FROM tenants t\n        JOIN tenant_memberships m ON m.tenant_id = t.id AND m.status = 'ACTIVE'\n        JOIN platform_users u ON u.id = m.user_id AND u.status = 'ACTIVE'\n        WHERE t.code IS NOT NULL AND t.lifecycle_state IN ('trial', 'active', 'payment_due')\n          AND u.password_hash IS NOT NULL\n        ORDER BY t.name, t.code\n    \"\"\")).mappings()\n    return [{\"code\": row[\"code\"], \"name\": row[\"name\"]} for row in rows]"
        },
        {
          "name": "list_login_users",
          "line": 93,
          "end": 104,
          "body": "def list_login_users(code: str, session: Session = Depends(get_session)) -> list[dict[str, str]]:\n    _database_mode()\n    rows = session.execute(text(\"\"\"\n        SELECT u.id, u.display_name\n        FROM tenants t\n        JOIN tenant_memberships m ON m.tenant_id = t.id AND m.status = 'ACTIVE'\n        JOIN platform_users u ON u.id = m.user_id AND u.status = 'ACTIVE'\n        WHERE lower(t.code) = :code AND t.lifecycle_state IN ('trial', 'active', 'payment_due')\n          AND u.password_hash IS NOT NULL\n        ORDER BY u.display_name, u.id\n    \"\"\"), {\"code\": _code(code)}).mappings()\n    return [{\"id\": str(row[\"id\"]), \"name\": row[\"display_name\"]} for row in rows]"
        },
        {
          "name": "login",
          "line": 108,
          "end": 145,
          "body": "def login(input: LoginInput, response: Response, session: Session = Depends(get_session)) -> dict[str, str]:\n    _database_mode()\n    configured_tenant = get_settings().database_tenant_code\n    # Email sign-in is deployment scoped. A browser cannot choose its tenant.\n    if input.email is not None:\n        if not configured_tenant:\n            raise auth_error(\"AUTH_CONFIGURATION_INVALID\", status.HTTP_503_SERVICE_UNAVAILABLE)\n        tenant_code = _code(configured_tenant)\n        if input.tenant_code is not None and _code(input.tenant_code) != tenant_code:\n            raise auth_error(\"INVALID_CREDENTIALS\")\n    else:\n        tenant_code = _code(input.tenant_code or configured_tenant or \"\")\n    identity_clause = \"lower(u.email) = :identity\" if input.email is not None else \"u.id = CAST(:identity AS uuid)\"\n    with session.begin():\n        session.execute(text(\"DELETE FROM database_sessions WHERE expires_at <= now()\"))\n        matches = session.execute(text(f\"\"\"\n            SELECT t.id AS tenant_id, m.id AS membership_id, u.id AS user_id, u.password_hash\n            FROM tenants t\n            JOIN tenant_memberships m ON m.tenant_id = t.id AND m.status = 'ACTIVE'\n            JOIN platform_users u ON u.id = m.user_id AND u.status = 'ACTIVE'\n            WHERE lower(t.code) = :code AND {identity_clause}\n              AND t.lifecycle_state IN ('trial', 'active', 'payment_due')\n        \"\"\"), {\"code\": tenant_code, \"identity\": input.email if input.email is not None else str(input.user_id)}).mappings().all()\n        # Ambiguous imported identities must never choose an arbitrary account.\n        row = matches[0] if len(matches) == 1 else None\n        if not row or not verify_password(input.password, row[\"password_hash\"]):\n            raise auth_error(\"INVALID_CREDENTIALS\")\n        token, csrf = secrets.token_urlsafe(48), secrets.token_urlsafe(32)\n        session.execute(text(\"\"\"\n            INSERT INTO database_sessions(token_hash, csrf_hash, tenant_id, user_id, membership_id, expires_at)\n            VALUES (:token, :csrf, :tenant, :user, :membership, :expiry)\n        \"\"\"), {\"token\": _digest(token), \"csrf\": _digest(csrf), \"tenant\": str(row[\"tenant_id\"]),\n               \"user\": str(row[\"user_id\"]), \"membership\": str(row[\"membership_id\"]),\n               \"expiry\": datetime.now(timezone.utc) + timedelta(seconds=SESSION_SECONDS)})\n    secure = get_settings().environment != \"local\"\n    response.set_cookie(SESSION_COOKIE, token, max_age=SESSION_SECONDS, httponly=True, secure=secure, samesite=\"lax\", path=\"/\")\n    response.set_cookie(CSRF_COOKIE, csrf, max_age=SESSION_SECONDS, httponly=False, secure=secure, samesite=\"lax\", path=\"/\")\n    return {\"status\": \"ok\"}"
        },
        {
          "name": "database_identity",
          "line": 148,
          "end": 168,
          "body": "def database_identity(request: Request, session: Session) -> tuple[UUID, UUID, UUID]:\n    token = request.cookies.get(SESSION_COOKIE)\n    if not token:\n        raise auth_error(\"AUTHENTICATION_REQUIRED\")\n    row = session.execute(text(\"\"\"\n        SELECT s.tenant_id, s.user_id, s.membership_id, s.csrf_hash\n        FROM database_sessions s\n        JOIN tenant_memberships m ON m.id = s.membership_id AND m.tenant_id = s.tenant_id AND m.user_id = s.user_id\n        JOIN platform_users u ON u.id = s.user_id\n        JOIN tenants t ON t.id = s.tenant_id\n        WHERE s.token_hash = :token AND s.expires_at > now()\n          AND m.status = 'ACTIVE' AND u.status = 'ACTIVE'\n          AND t.lifecycle_state IN ('trial', 'active', 'payment_due', 'suspended')\n    \"\"\"), {\"token\": _digest(token)}).mappings().one_or_none()\n    if not row:\n        raise auth_error(\"AUTHENTICATION_REQUIRED\")\n    if request.method not in (\"GET\", \"HEAD\", \"OPTIONS\"):\n        csrf = request.headers.get(\"x-workshopos-csrf\", \"\")\n        if not csrf or not hmac.compare_digest(_digest(csrf), row[\"csrf_hash\"]):\n            raise auth_error(\"CSRF_INVALID\", status.HTTP_403_FORBIDDEN)\n    return UUID(str(row[\"user_id\"])), UUID(str(row[\"tenant_id\"])), UUID(str(row[\"membership_id\"]))"
        },
        {
          "name": "logout",
          "line": 172,
          "end": 180,
          "body": "def logout(request: Request, response: Response, session: Session = Depends(get_session)) -> dict[str, str]:\n    _database_mode()\n    database_identity(request, session)\n    session.execute(text(\"DELETE FROM database_sessions WHERE token_hash = :token\"),\n                    {\"token\": _digest(request.cookies[SESSION_COOKIE])})\n    session.commit()\n    response.delete_cookie(SESSION_COOKIE, path=\"/\")\n    response.delete_cookie(CSRF_COOKIE, path=\"/\")\n    return {\"status\": \"ok\"}"
        }
      ]
    },
    {
      "file": "/app/app/execution.py",
      "functions": [
        {
          "name": "_permission",
          "line": 89,
          "end": 90,
          "body": "def _permission(scope: ScopedTenant, mutation: bool) -> None:\n    _require_any(scope, ((\"page.my-tasks.write\" if mutation else \"page.my-tasks.read\"), (\"page.work-update.write\" if mutation else \"page.work-update.read\"), (\"page.qc-prep.write\" if mutation else \"page.qc-prep.read\")), mutation=mutation)"
        },
        {
          "name": "_decode_attachment",
          "line": 93,
          "end": 103,
          "body": "def _decode_attachment(data_base64: str, content_type: str) -> bytes:\n    \"\"\"Validate evidence before it becomes an immutable database artifact.\"\"\"\n    if content_type not in ALLOWED_ATTACHMENT_CONTENT_TYPES:\n        raise auth_error(\"ATTACHMENT_CONTENT_TYPE_INVALID\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    try:\n        content = base64.b64decode(data_base64, validate=True)\n    except (binascii.Error, ValueError) as error:\n        raise auth_error(\"ATTACHMENT_DATA_INVALID\", status.HTTP_422_UNPROCESSABLE_ENTITY) from error\n    if not content or len(content) > MAX_ATTACHMENT_BYTES:\n        raise auth_error(\"ATTACHMENT_SIZE_INVALID\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    return content"
        },
        {
          "name": "_task",
          "line": 106,
          "end": 107,
          "body": "def _task(row: dict[str, object]) -> dict[str, object]:\n    return {\"id\": row[\"id\"], \"jobId\": row[\"job_card_id\"], \"assignedTo\": str(row[\"assigned_to\"]), \"title\": row[\"title\"], \"notes\": row[\"notes\"], \"status\": row[\"status\"], \"completedAt\": row[\"completed_at\"], \"updatedAt\": row[\"updated_at\"]}"
        },
        {
          "name": "list_my_tasks",
          "line": 111,
          "end": 114,
          "body": "def list_my_tasks(scope: ScopedTenant) -> list[dict[str, object]]:\n    session, current = scope; _permission(scope, False)\n    rows = session.execute(text(\"SELECT * FROM technician_tasks WHERE assigned_to=:actor ORDER BY updated_at DESC,id DESC\"), {\"actor\": str(current.actor_id)}).mappings().all()\n    return [_task(dict(row)) for row in rows]"
        },
        {
          "name": "assign_task",
          "line": 118,
          "end": 134,
          "body": "def assign_task(input: TaskCreate, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope; _permission(scope, True)\n    if \"tenant.users.manage\" not in current.permissions:\n        raise auth_error(\"TASK_ASSIGNMENT_FORBIDDEN\", status.HTTP_403_FORBIDDEN)\n    job = _row_or_404(session, \"job_cards\", input.job_id, \"JOB_NOT_FOUND\")\n    if job[\"branch_id\"] not in current.branch_ids: raise auth_error(\"BRANCH_ACCESS_DENIED\", status.HTTP_403_FORBIDDEN)\n    valid_assignee = session.execute(text(\"\"\"SELECT 1 FROM tenant_memberships membership\n        JOIN membership_roles assignment ON assignment.membership_id=membership.id\n        JOIN role_permissions permission ON permission.role_id=assignment.role_id\n        JOIN membership_branches branch_assignment ON branch_assignment.membership_id=membership.id\n        WHERE membership.tenant_id=:tenant AND membership.user_id=:user AND membership.status='ACTIVE'\n          AND branch_assignment.branch_id=:branch\n          AND permission.permission IN ('page.my-tasks.write','page.work-update.write') LIMIT 1\"\"\"), {\"tenant\": str(current.tenant_id), \"user\": str(input.assigned_to), \"branch\": str(job[\"branch_id\"])}).scalar()\n    if not valid_assignee: raise auth_error(\"TECHNICIAN_NOT_IN_TENANT\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    row = session.execute(text(\"\"\"INSERT INTO technician_tasks (tenant_id,branch_id,job_card_id,assigned_to,title,notes,created_by,updated_by)\n        VALUES (:tenant,:branch,:job,:assignee,:title,:notes,:actor,:actor) RETURNING *\"\"\"), {\"tenant\":str(current.tenant_id),\"branch\":str(job[\"branch_id\"]),\"job\":input.job_id,\"assignee\":str(input.assigned_to),\"title\":input.title.strip(),\"notes\":input.notes.strip(),\"actor\":str(current.actor_id)}).mappings().one()\n    payload = _task(dict(row)); _audit(session,current,\"TECHNICIAN_TASK_ASSIGNED\",input.title.strip(),{},payload); return payload"
        },
        {
          "name": "update_task",
          "line": 138,
          "end": 147,
          "body": "def update_task(task_id: int, input: TaskUpdate, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope; _permission(scope, True); before = _row_or_404(session,\"technician_tasks\",task_id,\"TASK_NOT_FOUND\")\n    if before[\"assigned_to\"] != current.actor_id: raise auth_error(\"TASK_NOT_ASSIGNED_TO_ACTOR\", status.HTTP_403_FORBIDDEN)\n    if before[\"status\"] in {\"COMPLETED\",\"CANCELLED\"}: raise auth_error(\"TASK_NOT_EDITABLE\",status.HTTP_422_UNPROCESSABLE_ENTITY)\n    if input.status == \"BLOCKED\" and not input.note.strip(): raise auth_error(\"BLOCKER_NOTE_REQUIRED\",status.HTTP_422_UNPROCESSABLE_ENTITY)\n    row = session.execute(text(\"UPDATE technician_tasks SET status=:status,notes=:notes,updated_by=:actor,updated_at=now(),completed_at=CASE WHEN :status='COMPLETED' THEN now() ELSE NULL END WHERE id=:id RETURNING *\"), {\"status\":input.status,\"notes\":input.note.strip() or before[\"notes\"],\"actor\":str(current.actor_id),\"id\":task_id}).mappings().one()\n    update = session.execute(text(\"INSERT INTO work_updates (tenant_id,branch_id,job_card_id,task_id,body,status,actor_id) VALUES (:tenant,:branch,:job,:task,:body,:status,:actor) RETURNING id,created_at\"), {\"tenant\":str(current.tenant_id),\"branch\":str(before[\"branch_id\"]),\"job\":before[\"job_card_id\"],\"task\":task_id,\"body\":input.note.strip() or f\"Task marked {input.status}\",\"status\":input.status,\"actor\":str(current.actor_id)}).mappings().one()\n    payload = {\"task\": _task(dict(row)), \"workUpdate\": {\"id\": update[\"id\"], \"createdAt\": update[\"created_at\"]}}\n    _audit(session, current, \"TECHNICIAN_TASK_UPDATED\", input.note.strip() or input.status, _task(before), payload)\n    return payload"
        },
        {
          "name": "upload_attachment",
          "line": 151,
          "end": 162,
          "body": "async def upload_attachment(update_id: int, scope: ScopedTenant, file: UploadFile = File(...), label: Annotated[str, Form(max_length=1000)] = \"\") -> dict[str, object]:\n    session, current = scope; _permission(scope, True); update = _row_or_404(session,\"work_updates\",update_id,\"WORK_UPDATE_NOT_FOUND\")\n    if update[\"actor_id\"] != current.actor_id: raise auth_error(\"WORK_UPDATE_NOT_OWNED\",status.HTTP_403_FORBIDDEN)\n    content = await file.read(10_485_761)\n    if not content or len(content)>10_485_760: raise auth_error(\"ATTACHMENT_SIZE_INVALID\",status.HTTP_422_UNPROCESSABLE_ENTITY)\n    if not file.filename or not file.content_type: raise auth_error(\"ATTACHMENT_METADATA_REQUIRED\",status.HTTP_422_UNPROCESSABLE_ENTITY)\n    digest=hashlib.sha256(content).hexdigest()\n    row=session.execute(text(\"\"\"INSERT INTO evidence_attachments (tenant_id,branch_id,job_card_id,work_update_id,filename,content_type,size_bytes,sha256,content,uploaded_by)\n      VALUES (:tenant,:branch,:job,:update,:name,:type,:size,:hash,:content,:actor) RETURNING id,filename,content_type,size_bytes,sha256,created_at\"\"\"),{\"tenant\":str(current.tenant_id),\"branch\":str(update[\"branch_id\"]),\"job\":update[\"job_card_id\"],\"update\":update_id,\"name\":label.strip() or file.filename,\"type\":file.content_type,\"size\":len(content),\"hash\":digest,\"content\":content,\"actor\":str(current.actor_id)}).mappings().one()\n    payload = {\"id\":row[\"id\"],\"filename\":row[\"filename\"],\"contentType\":row[\"content_type\"],\"sizeBytes\":row[\"size_bytes\"],\"sha256\":row[\"sha256\"],\"createdAt\":row[\"created_at\"]}\n    _audit(session, current, \"WORK_EVIDENCE_ATTACHED\", payload[\"filename\"], {}, payload)\n    return payload"
        },
        {
          "name": "read_attachment",
          "line": 166,
          "end": 174,
          "body": "def read_attachment(attachment_id: int, scope: ScopedTenant) -> Response:\n    \"\"\"Return attachment bytes only after the request's RLS scope has found it.\"\"\"\n    session, _ = scope; _permission(scope, False)\n    row = _row_or_404(session, \"evidence_attachments\", attachment_id, \"ATTACHMENT_NOT_FOUND\")\n    return Response(\n        content=bytes(row[\"content\"]),\n        media_type=str(row[\"content_type\"]),\n        headers={\"Content-Disposition\": f'attachment; filename=\"{str(row[\"filename\"]).replace(chr(34), \"\")}\"'},\n    )"
        },
        {
          "name": "create_qc_check",
          "line": 178,
          "end": 184,
          "body": "def create_qc_check(input: QcCheckCreate, scope: ScopedTenant) -> dict[str, object]:\n    session,current=scope; _permission(scope,True); job=_row_or_404(session,\"job_cards\",input.job_id,\"JOB_NOT_FOUND\")\n    if job[\"status\"] not in {\"IN_PROGRESS\", \"HOLD\"}: raise auth_error(\"QC_NOT_AVAILABLE_FOR_JOB_STATUS\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    row=session.execute(text(\"INSERT INTO qc_checks (tenant_id,branch_id,job_card_id,label,required,created_by) VALUES (:tenant,:branch,:job,:label,:required,:actor) RETURNING *\"),{\"tenant\":str(current.tenant_id),\"branch\":str(job[\"branch_id\"]),\"job\":input.job_id,\"label\":input.label.strip(),\"required\":input.required,\"actor\":str(current.actor_id)}).mappings().one()\n    payload = {\"id\":row[\"id\"],\"jobId\":row[\"job_card_id\"],\"label\":row[\"label\"],\"required\":row[\"required\"],\"status\":row[\"status\"]}\n    _audit(session, current, \"QC_CHECK_CREATED\", input.label.strip(), {}, payload)\n    return payload"
        },
        {
          "name": "record_qc_result",
          "line": 188,
          "end": 200,
          "body": "def record_qc_result(check_id:int,input:QcResult,scope:ScopedTenant)->dict[str,object]:\n    session,current=scope; _permission(scope,True); check=_row_or_404(session,\"qc_checks\",check_id,\"QC_CHECK_NOT_FOUND\")\n    job = _row_or_404(session, \"job_cards\", int(check[\"job_card_id\"]), \"JOB_NOT_FOUND\")\n    if job[\"status\"] not in {\"IN_PROGRESS\", \"HOLD\"}: raise auth_error(\"QC_NOT_AVAILABLE_FOR_JOB_STATUS\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    if input.outcome==\"PASSED\":\n        rework=session.execute(text(\"SELECT 1 FROM technician_tasks WHERE job_card_id=:job AND title LIKE 'Rework:%' AND status<>'COMPLETED'\"),{\"job\":check[\"job_card_id\"]}).scalar()\n        if rework: raise auth_error(\"QC_REWORK_REQUIRED\",status.HTTP_422_UNPROCESSABLE_ENTITY)\n    session.execute(text(\"INSERT INTO qc_results (tenant_id,branch_id,qc_check_id,outcome,note,actor_id) VALUES (:tenant,:branch,:check,:outcome,:note,:actor)\"),{\"tenant\":str(current.tenant_id),\"branch\":str(check[\"branch_id\"]),\"check\":check_id,\"outcome\":input.outcome,\"note\":input.note.strip(),\"actor\":str(current.actor_id)})\n    if input.outcome==\"FAILED\":\n        session.execute(text(\"INSERT INTO technician_tasks (tenant_id,branch_id,job_card_id,assigned_to,title,notes,status,created_by,updated_by) VALUES (:tenant,:branch,:job,:actor,:title,:note,'PENDING',:actor,:actor)\"),{\"tenant\":str(current.tenant_id),\"branch\":str(check[\"branch_id\"]),\"job\":check[\"job_card_id\"],\"actor\":str(current.actor_id),\"title\":f\"Rework: {check['label']}\",\"note\":input.note.strip()})\n    session.execute(text(\"UPDATE qc_checks SET status=:status WHERE id=:id\"),{\"status\":input.outcome,\"id\":check_id})\n    _audit(session,current,\"QC_RESULT_RECORDED\",input.note.strip() or input.outcome,{}, {\"checkId\":check_id,\"outcome\":input.outcome})\n    return {\"id\":check_id,\"status\":input.outcome}"
        },
        {
          "name": "_remote_task",
          "line": 203,
          "end": 212,
          "body": "def _remote_task(row: dict[str, object]) -> dict[str, object]:\n    \"\"\"Translate persisted execution facts to the Technician workspace contract.\"\"\"\n    return {\n        \"id\": row[\"id\"], \"jobId\": row[\"job_card_id\"], \"branchId\": str(row[\"branch_id\"]),\n        \"technicianId\": str(row[\"assigned_to\"]), \"sourceQcCheckId\": None,\n        \"title\": row[\"title\"], \"instructions\": row[\"notes\"],\n        \"status\": \"PAUSED\" if row[\"status\"] == \"BLOCKED\" else row[\"status\"],\n        \"startedAt\": row[\"updated_at\"] if row[\"status\"] != \"PENDING\" else None,\n        \"completedAt\": row[\"completed_at\"], \"createdAt\": row[\"created_at\"], \"updatedAt\": row[\"updated_at\"],\n    }"
        },
        {
          "name": "list_remote_tasks",
          "line": 216,
          "end": 220,
          "body": "def list_remote_tasks(scope: ScopedTenant) -> list[dict[str, object]]:\n    session, current = scope\n    _permission(scope, False)\n    rows = session.execute(text(\"SELECT * FROM technician_tasks WHERE assigned_to=:actor ORDER BY updated_at DESC,id DESC\"), {\"actor\": str(current.actor_id)}).mappings().all()\n    return [_remote_task(dict(row)) for row in rows]"
        },
        {
          "name": "assign_remote_task",
          "line": 224,
          "end": 244,
          "body": "def assign_remote_task(job_id: int, input: TaskAssignment, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    if \"tenant.users.manage\" not in current.permissions:\n        raise auth_error(\"TASK_ASSIGNMENT_FORBIDDEN\", status.HTTP_403_FORBIDDEN)\n    job = _row_or_404(session, \"job_cards\", job_id, \"JOB_NOT_FOUND\")\n    if job[\"branch_id\"] not in current.branch_ids:\n        raise auth_error(\"BRANCH_ACCESS_DENIED\", status.HTTP_403_FORBIDDEN)\n    assignee = session.execute(text(\"\"\"SELECT 1 FROM tenant_memberships membership\n        JOIN membership_roles assignment ON assignment.membership_id=membership.id\n        JOIN role_permissions permission ON permission.role_id=assignment.role_id\n        JOIN membership_branches branch_assignment ON branch_assignment.membership_id=membership.id\n        WHERE membership.tenant_id=:tenant AND membership.user_id=:user AND membership.status='ACTIVE'\n          AND branch_assignment.branch_id=:branch\n          AND permission.permission IN ('page.my-tasks.write','page.work-update.write') LIMIT 1\"\"\"), {\"tenant\": str(current.tenant_id), \"user\": str(input.technician_id), \"branch\": str(job[\"branch_id\"])}).scalar()\n    if not assignee:\n        raise auth_error(\"TECHNICIAN_NOT_IN_TENANT\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    row = session.execute(text(\"\"\"INSERT INTO technician_tasks (tenant_id,branch_id,job_card_id,assigned_to,title,notes,created_by,updated_by)\n        VALUES (:tenant,:branch,:job,:assignee,:title,:notes,:actor,:actor) RETURNING *\"\"\"), {\"tenant\": str(current.tenant_id), \"branch\": str(job[\"branch_id\"]), \"job\": job_id, \"assignee\": str(input.technician_id), \"title\": input.title.strip(), \"notes\": input.instructions.strip(), \"actor\": str(current.actor_id)}).mappings().one()\n    payload = _remote_task(dict(row))\n    _audit(session, current, \"TECHNICIAN_TASK_ASSIGNED\", input.title.strip(), {}, payload)\n    return payload"
        },
        {
          "name": "command_remote_task",
          "line": 248,
          "end": 263,
          "body": "def command_remote_task(task_id: int, command: Literal[\"start\", \"pause\", \"resume\", \"complete\", \"cancel\"], input: TaskCommand, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    _permission(scope, True)\n    before = _row_or_404(session, \"technician_tasks\", task_id, \"TASK_NOT_FOUND\")\n    if before[\"assigned_to\"] != current.actor_id:\n        raise auth_error(\"TASK_NOT_ASSIGNED_TO_ACTOR\", status.HTTP_403_FORBIDDEN)\n    expected = {\"start\": (\"PENDING\", \"IN_PROGRESS\"), \"pause\": (\"IN_PROGRESS\", \"PAUSED\"), \"resume\": (\"PAUSED\", \"IN_PROGRESS\"), \"complete\": (\"IN_PROGRESS\", \"COMPLETED\"), \"cancel\": ((\"PENDING\", \"IN_PROGRESS\", \"PAUSED\"), \"CANCELLED\")}\n    allowed, next_status = expected[command]\n    if before[\"status\"] not in (allowed if isinstance(allowed, tuple) else (allowed,)):\n        raise auth_error(\"INVALID_TASK_TRANSITION\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    if command in {\"pause\", \"cancel\"} and not input.reason.strip():\n        raise auth_error(\"TASK_REASON_REQUIRED\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    row = session.execute(text(\"\"\"UPDATE technician_tasks SET status=:status, notes=:notes, updated_by=:actor, updated_at=now(),\n        completed_at=CASE WHEN :status='COMPLETED' THEN now() ELSE NULL END WHERE id=:id RETURNING *\"\"\"), {\"status\": next_status, \"notes\": input.reason.strip() or before[\"notes\"], \"actor\": str(current.actor_id), \"id\": task_id}).mappings().one()\n    _audit(session, current, \"TECHNICIAN_TASK_UPDATED\", input.reason.strip() or command, _remote_task(before), _remote_task(dict(row)))\n    return _remote_task(dict(row))"
        },
        {
          "name": "create_remote_work_update",
          "line": 267,
          "end": 279,
          "body": "def create_remote_work_update(job_id: int, input: WorkUpdateCreate, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    _permission(scope, True)\n    task = _row_or_404(session, \"technician_tasks\", input.task_id, \"TASK_NOT_FOUND\")\n    if task[\"job_card_id\"] != job_id or task[\"assigned_to\"] != current.actor_id:\n        raise auth_error(\"TASK_NOT_ASSIGNED_TO_ACTOR\", status.HTTP_403_FORBIDDEN)\n    if task[\"status\"] not in {\"IN_PROGRESS\", \"PAUSED\"}:\n        raise auth_error(\"TASK_NOT_ACTIVE\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    status_value = \"PAUSED\" if input.kind == \"blocker\" else \"IN_PROGRESS\"\n    row = session.execute(text(\"\"\"INSERT INTO work_updates (tenant_id,branch_id,job_card_id,task_id,body,status,actor_id)\n        VALUES (:tenant,:branch,:job,:task,:body,:status,:actor) RETURNING *\"\"\"), {\"tenant\": str(current.tenant_id), \"branch\": str(task[\"branch_id\"]), \"job\": job_id, \"task\": input.task_id, \"body\": input.body.strip(), \"status\": status_value, \"actor\": str(current.actor_id)}).mappings().one()\n    _audit(session, current, \"WORK_UPDATE_RECORDED\", input.body.strip(), {}, {\"id\": row[\"id\"], \"jobId\": job_id, \"taskId\": input.task_id, \"kind\": input.kind})\n    return {\"id\": row[\"id\"], \"jobId\": row[\"job_card_id\"], \"taskId\": row[\"task_id\"], \"body\": row[\"body\"], \"kind\": input.kind, \"actorId\": str(row[\"actor_id\"]), \"createdAt\": row[\"created_at\"]}"
        },
        {
          "name": "create_remote_attachment",
          "line": 283,
          "end": 291,
          "body": "def create_remote_attachment(job_id: int, input: AttachmentCreate, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    _permission(scope, True)\n    job = _row_or_404(session, \"job_cards\", job_id, \"JOB_NOT_FOUND\")\n    content = _decode_attachment(input.data_base64, input.content_type)\n    row = session.execute(text(\"\"\"INSERT INTO evidence_attachments (tenant_id,branch_id,job_card_id,filename,content_type,size_bytes,sha256,content,uploaded_by,category,caption)\n        VALUES (:tenant,:branch,:job,:filename,:content_type,:size,:sha256,:content,:actor,:category,:caption) RETURNING *\"\"\"), {\"tenant\": str(current.tenant_id), \"branch\": str(job[\"branch_id\"]), \"job\": job_id, \"filename\": input.filename.strip(), \"content_type\": input.content_type, \"size\": len(content), \"sha256\": hashlib.sha256(content).hexdigest(), \"content\": content, \"actor\": str(current.actor_id), \"category\": input.category, \"caption\": input.caption.strip()}).mappings().one()\n    _audit(session, current, \"EVIDENCE_ATTACHED\", input.caption.strip() or input.filename.strip(), {}, {\"id\": row[\"id\"], \"jobId\": job_id, \"category\": input.category})\n    return {\"id\": row[\"id\"], \"jobId\": row[\"job_card_id\"], \"category\": row[\"category\"], \"filename\": row[\"filename\"], \"contentType\": row[\"content_type\"], \"byteSize\": row[\"size_bytes\"], \"caption\": row[\"caption\"], \"createdBy\": str(row[\"uploaded_by\"]), \"createdAt\": row[\"created_at\"], \"contentPath\": f\"/api/v1/attachments/{row['id']}/content\"}"
        },
        {
          "name": "_remote_qc_check",
          "line": 294,
          "end": 296,
          "body": "def _remote_qc_check(session, row: dict[str, object]) -> dict[str, object]:\n    results = session.execute(text(\"SELECT * FROM qc_results WHERE qc_check_id=:check ORDER BY id\"), {\"check\": row[\"id\"]}).mappings().all()\n    return {\"id\": row[\"id\"], \"jobId\": row[\"job_card_id\"], \"label\": row[\"label\"], \"required\": row[\"required\"], \"status\": str(row[\"status\"]).lower(), \"createdAt\": row[\"created_at\"], \"updatedAt\": row[\"created_at\"], \"results\": [{\"id\": result[\"id\"], \"outcome\": str(result[\"outcome\"]).lower().removesuffix(\"ed\"), \"note\": result[\"note\"], \"actorId\": str(result[\"actor_id\"]), \"createdAt\": result[\"created_at\"]} for result in results]}"
        },
        {
          "name": "get_remote_execution",
          "line": 300,
          "end": 308,
          "body": "def get_remote_execution(job_id: int, scope: ScopedTenant) -> dict[str, object]:\n    session, _ = scope\n    _permission(scope, False)\n    job = _row_or_404(session, \"job_cards\", job_id, \"JOB_NOT_FOUND\")\n    tasks = session.execute(text(\"SELECT * FROM technician_tasks WHERE job_card_id=:job ORDER BY id\"), {\"job\": job_id}).mappings().all()\n    updates = session.execute(text(\"SELECT * FROM work_updates WHERE job_card_id=:job ORDER BY id\"), {\"job\": job_id}).mappings().all()\n    attachments = session.execute(text(\"SELECT * FROM evidence_attachments WHERE job_card_id=:job ORDER BY id\"), {\"job\": job_id}).mappings().all()\n    checks = session.execute(text(\"SELECT * FROM qc_checks WHERE job_card_id=:job ORDER BY id\"), {\"job\": job_id}).mappings().all()\n    return {\"job\": {\"id\": job[\"id\"], \"jobNo\": job[\"job_no\"], \"status\": job[\"status\"]}, \"tasks\": [_remote_task(dict(row)) for row in tasks], \"updates\": [{\"id\": row[\"id\"], \"jobId\": row[\"job_card_id\"], \"taskId\": row[\"task_id\"], \"body\": row[\"body\"], \"kind\": \"blocker\" if row[\"status\"] in {\"BLOCKED\", \"PAUSED\"} else \"progress\", \"actorId\": str(row[\"actor_id\"]), \"createdAt\": row[\"created_at\"]} for row in updates], \"attachments\": [{\"id\": row[\"id\"], \"jobId\": row[\"job_card_id\"], \"category\": row[\"category\"], \"filename\": row[\"filename\"], \"contentType\": row[\"content_type\"], \"byteSize\": row[\"size_bytes\"], \"caption\": row[\"caption\"], \"createdBy\": str(row[\"uploaded_by\"]), \"createdAt\": row[\"created_at\"], \"contentPath\": f\"/api/v1/attachments/{row['id']}/content\"} for row in attachments], \"qcChecks\": [_remote_qc_check(session, dict(row)) for row in checks]}"
        },
        {
          "name": "create_remote_qc_check",
          "line": 312,
          "end": 321,
          "body": "def create_remote_qc_check(job_id: int, input: JobQcCheckCreate, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    _permission(scope, True)\n    job = _row_or_404(session, \"job_cards\", job_id, \"JOB_NOT_FOUND\")\n    if job[\"status\"] not in {\"IN_PROGRESS\", \"HOLD\"}:\n        raise auth_error(\"QC_NOT_AVAILABLE_FOR_JOB_STATUS\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    row = session.execute(text(\"\"\"INSERT INTO qc_checks (tenant_id,branch_id,job_card_id,label,required,created_by)\n        VALUES (:tenant,:branch,:job,:label,:required,:actor) RETURNING *\"\"\"), {\"tenant\": str(current.tenant_id), \"branch\": str(job[\"branch_id\"]), \"job\": job_id, \"label\": input.label.strip(), \"required\": input.required, \"actor\": str(current.actor_id)}).mappings().one()\n    _audit(session, current, \"QC_CHECK_CREATED\", input.label.strip(), {}, {\"id\": row[\"id\"], \"jobId\": job_id, \"required\": input.required})\n    return _remote_qc_check(session, dict(row))"
        },
        {
          "name": "record_remote_qc_result",
          "line": 325,
          "end": 345,
          "body": "def record_remote_qc_result(check_id: int, input: JobQcResult, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    _permission(scope, True)\n    check = _row_or_404(session, \"qc_checks\", check_id, \"QC_CHECK_NOT_FOUND\")\n    job = _row_or_404(session, \"job_cards\", int(check[\"job_card_id\"]), \"JOB_NOT_FOUND\")\n    if job[\"status\"] not in {\"IN_PROGRESS\", \"HOLD\"}:\n        raise auth_error(\"QC_NOT_AVAILABLE_FOR_JOB_STATUS\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    if input.outcome == \"pass\":\n        outstanding = session.execute(text(\"SELECT 1 FROM technician_tasks WHERE job_card_id=:job AND title LIKE 'Rework:%' AND status <> 'COMPLETED'\"), {\"job\": check[\"job_card_id\"]}).scalar()\n        if outstanding:\n            raise auth_error(\"QC_REWORK_REQUIRED\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    outcome = \"PASSED\" if input.outcome == \"pass\" else \"FAILED\"\n    session.execute(text(\"\"\"INSERT INTO qc_results (tenant_id,branch_id,qc_check_id,outcome,note,actor_id)\n        VALUES (:tenant,:branch,:check,:outcome,:note,:actor)\"\"\"), {\"tenant\": str(current.tenant_id), \"branch\": str(check[\"branch_id\"]), \"check\": check_id, \"outcome\": outcome, \"note\": input.note.strip(), \"actor\": str(current.actor_id)})\n    rework = None\n    if outcome == \"FAILED\":\n        rework = session.execute(text(\"\"\"INSERT INTO technician_tasks (tenant_id,branch_id,job_card_id,assigned_to,title,notes,status,created_by,updated_by)\n            VALUES (:tenant,:branch,:job,:actor,:title,:note,'PENDING',:actor,:actor) RETURNING *\"\"\"), {\"tenant\": str(current.tenant_id), \"branch\": str(check[\"branch_id\"]), \"job\": check[\"job_card_id\"], \"actor\": str(current.actor_id), \"title\": f\"Rework: {check['label']}\", \"note\": input.note.strip()}).mappings().one()\n    row = session.execute(text(\"UPDATE qc_checks SET status=:status WHERE id=:id RETURNING *\"), {\"status\": outcome, \"id\": check_id}).mappings().one()\n    _audit(session, current, \"QC_RESULT_RECORDED\", input.note.strip() or input.outcome, {\"checkId\": check_id, \"status\": check[\"status\"]}, {\"checkId\": check_id, \"status\": outcome, \"reworkTaskId\": rework[\"id\"] if rework else None})\n    return {\"check\": _remote_qc_check(session, dict(row)), \"reworkTask\": _remote_task(dict(rework)) if rework else None}"
        }
      ]
    },
    {
      "file": "/app/app/finance.py",
      "functions": [
        {
          "name": "_is_owner",
          "line": 83,
          "end": 84,
          "body": "def _is_owner(current: TenantScope) -> bool:\n    return any(name == \"Owner/Admin\" for _, name, _ in current.roles)"
        },
        {
          "name": "_permission",
          "line": 87,
          "end": 98,
          "body": "def _permission(scope: ScopedTenant, *, mutation: bool) -> TenantScope:\n    \"\"\"Accounts has the explicit finance pages; Owner/Admin remains an override.\"\"\"\n    _, current = scope\n    if _is_owner(current):\n        if mutation:\n            try:\n                require_mutation_allowed(current)\n            except PermissionError as error:\n                raise auth_error(\"TENANT_READ_ONLY\", status.HTTP_403_FORBIDDEN) from error\n        return current\n    verb = \"write\" if mutation else \"read\"\n    return _require_any(scope, tuple(f\"page.{page}.{verb}\" for page in (\"ready-to-invoice\", \"invoice\", \"payment\", \"delivery\")), mutation=mutation)"
        },
        {
          "name": "_decode_attachment",
          "line": 101,
          "end": 110,
          "body": "def _decode_attachment(input: AttachmentInput | None) -> tuple[str | None, str | None, bytes | None, str | None]:\n    if input is None:\n        return None, None, None, None\n    try:\n        payload = base64.b64decode(input.data_base64, validate=True)\n    except (binascii.Error, ValueError) as error:\n        raise auth_error(\"INVALID_SUPPORTING_ATTACHMENT\", status.HTTP_422_UNPROCESSABLE_ENTITY) from error\n    if not payload or len(payload) > MAX_ARTIFACT_BYTES:\n        raise auth_error(\"SUPPORTING_ATTACHMENT_SIZE_INVALID\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    return input.filename.strip(), input.content_type, payload, hashlib.sha256(payload).hexdigest()"
        },
        {
          "name": "_fiscal_year",
          "line": 113,
          "end": 115,
          "body": "def _fiscal_year(now: datetime) -> str:\n    year = now.year if now.month >= 4 else now.year - 1\n    return f\"FY{year}-{str(year + 1)[-2:]}\""
        },
        {
          "name": "_branch_profile",
          "line": 118,
          "end": 120,
          "body": "def _branch_profile(session, branch_id: object) -> dict[str, object]:\n    row = session.execute(text(\"SELECT settings FROM branch_settings WHERE branch_id=:branch_id\"), {\"branch_id\": str(branch_id)}).mappings().one_or_none()\n    return dict(row[\"settings\"]) if row and row[\"settings\"] else {}"
        },
        {
          "name": "_prefix",
          "line": 123,
          "end": 129,
          "body": "def _prefix(profile: dict[str, object], document_type: str) -> str:\n    configured = profile.get(\"documentPrefixes\")\n    if isinstance(configured, dict) and isinstance(configured.get(document_type), str) and configured[document_type].strip():\n        candidate = re.sub(r\"[^A-Z0-9-]\", \"\", configured[document_type].strip().upper())[:24]\n        if candidate:\n            return candidate\n    return {\"INVOICE\": \"INV\", \"RECEIPT\": \"RCP\", \"GATE_PASS\": \"GP\", \"CREDIT_NOTE\": \"CRN\"}[document_type]"
        },
        {
          "name": "_allocate_number",
          "line": 132,
          "end": 143,
          "body": "def _allocate_number(session, current: TenantScope, branch_id: object, document_type: str, profile: dict[str, object]) -> tuple[str, str, int]:\n    fiscal_year = _fiscal_year(datetime.now(timezone.utc))\n    # The upsert row lock makes duplicate concurrent allocations impossible.\n    sequence = session.execute(text(\"\"\"\n        INSERT INTO document_sequences (tenant_id,branch_id,document_type,fiscal_year,next_value)\n        VALUES (:tenant_id,:branch_id,:document_type,:fiscal_year,2)\n        ON CONFLICT (tenant_id,branch_id,document_type,fiscal_year) DO UPDATE\n            SET next_value=document_sequences.next_value + 1\n        RETURNING next_value - 1 AS value\n    \"\"\"), {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(branch_id), \"document_type\": document_type, \"fiscal_year\": fiscal_year}).scalar_one()\n    number = f\"{_prefix(profile, document_type)}-{fiscal_year}-{int(sequence):05d}\"\n    return number, fiscal_year, int(sequence)"
        },
        {
          "name": "_render_html",
          "line": 146,
          "end": 157,
          "body": "def _render_html(document_no: str, document_type: str, snapshot: dict[str, object]) -> str:\n    # Both document metadata and every snapshot field may originate with a user.\n    # This is a stored artifact, so escaping here is a security boundary, not UI\n    # decoration. The JSON remains canonical and the HTML is a safe presentation.\n    title = html.escape(document_no, quote=True)\n    heading = html.escape(document_type.replace(\"_\", \" \").title(), quote=True)\n    body = html.escape(json.dumps(snapshot, default=str, sort_keys=True, separators=(\",\", \":\")), quote=False)\n    return \"\".join((\n        \"<!doctype html><html><meta charset='utf-8'><title>\", title, \"</title><body>\",\n        f\"<h1>{heading} {title}</h1><pre>\", body,\n        \"</pre></body></html>\",\n    ))"
        },
        {
          "name": "_issue_document",
          "line": 160,
          "end": 179,
          "body": "def _issue_document(session, current: TenantScope, *, job: dict[str, object], document_type: str, snapshot: dict[str, object], predecessor_document_id: int | None = None) -> dict[str, object]:\n    profile = _branch_profile(session, job[\"branch_id\"])\n    document_no, fiscal_year, sequence = _allocate_number(session, current, job[\"branch_id\"], document_type, profile)\n    full_snapshot = {**snapshot, \"documentNo\": document_no, \"documentType\": document_type, \"fiscalYear\": fiscal_year,\n                     \"branchProfile\": profile, \"templateVersion\": str(profile.get(\"documentTemplateVersion\", \"1\"))}\n    rendered_html = _render_html(document_no, document_type, full_snapshot)\n    artifact = rendered_html.encode(\"utf-8\")\n    row = session.execute(text(\"\"\"\n        INSERT INTO financial_documents\n          (tenant_id,branch_id,job_card_id,document_type,fiscal_year,sequence_value,document_no,template_version,snapshot,rendered_html,artifact,sha256,predecessor_document_id,issued_by)\n        VALUES\n          (:tenant_id,:branch_id,:job_id,:document_type,:fiscal_year,:sequence_value,:document_no,:template_version,\n           CAST(:snapshot AS jsonb),:rendered_html,:artifact,:sha256,:predecessor_document_id,:actor_id)\n        RETURNING *\n    \"\"\"), {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(job[\"branch_id\"]), \"job_id\": job[\"id\"],\n             \"document_type\": document_type, \"fiscal_year\": fiscal_year, \"sequence_value\": sequence, \"document_no\": document_no,\n             \"template_version\": full_snapshot[\"templateVersion\"], \"snapshot\": json.dumps(full_snapshot, default=str),\n             \"rendered_html\": rendered_html, \"artifact\": artifact, \"sha256\": hashlib.sha256(artifact).hexdigest(),\n             \"predecessor_document_id\": predecessor_document_id, \"actor_id\": str(current.actor_id)}).mappings().one()\n    return dict(row)"
        },
        {
          "name": "_document",
          "line": 182,
          "end": 185,
          "body": "def _document(row: dict[str, object], *, voided: bool = False) -> dict[str, object]:\n    return {\"id\": row[\"id\"], \"jobId\": row[\"job_card_id\"], \"type\": row[\"document_type\"], \"number\": row[\"document_no\"],\n            \"fiscalYear\": row[\"fiscal_year\"], \"templateVersion\": row[\"template_version\"], \"issuedAt\": row[\"issued_at\"],\n            \"voided\": voided, \"contentPath\": f\"/api/v1/financial-documents/{row['id']}/content\"}"
        },
        {
          "name": "_download_filename",
          "line": 188,
          "end": 191,
          "body": "def _download_filename(value: object, extension: str = \"\") -> str:\n    \"\"\"Keep Content-Disposition a header, never an injection surface.\"\"\"\n    name = re.sub(r\"[^A-Za-z0-9._-]\", \"_\", str(value)).strip(\"._\")[:180] or \"download\"\n    return f\"{name}{extension}\" if extension and not name.endswith(extension) else name"
        },
        {
          "name": "_voided",
          "line": 194,
          "end": 195,
          "body": "def _voided(session, document_id: int) -> bool:\n    return bool(session.execute(text(\"SELECT 1 FROM financial_document_events WHERE document_id=:document_id AND event_type='VOID'\"), {\"document_id\": document_id}).scalar())"
        },
        {
          "name": "_invoice",
          "line": 198,
          "end": 214,
          "body": "def _invoice(session, invoice_id: int) -> dict[str, object]:\n    row = session.execute(text(\"\"\"SELECT invoice.*, document.document_no, document.fiscal_year, document.template_version, document.issued_at\n        FROM invoices invoice JOIN financial_documents document ON document.id=invoice.issued_document_id WHERE invoice.id=:invoice_id\"\"\"), {\"invoice_id\": invoice_id}).mappings().one_or_none()\n    if row is None:\n        raise auth_error(\"INVOICE_NOT_FOUND\", status.HTTP_404_NOT_FOUND)\n    data = dict(row)\n    paid = int(session.execute(text(\"SELECT COALESCE(SUM(amount_paise),0) FROM payments WHERE invoice_id=:invoice_id\"), {\"invoice_id\": invoice_id}).scalar_one())\n    credited = int(session.execute(text(\"SELECT COALESCE(SUM(amount_paise),0) FROM credit_notes WHERE invoice_id=:invoice_id\"), {\"invoice_id\": invoice_id}).scalar_one())\n    voided = _voided(session, int(data[\"issued_document_id\"]))\n    balance = int(data[\"total_paise\"]) - paid\n    lines = [dict(line) for line in session.execute(text(\"SELECT * FROM invoice_lines WHERE invoice_id=:invoice_id ORDER BY line_no\"), {\"invoice_id\": invoice_id}).mappings().all()]\n    return {\"id\": data[\"id\"], \"jobId\": data[\"job_card_id\"], \"documentId\": data[\"issued_document_id\"], \"number\": data[\"document_no\"],\n            \"fiscalYear\": data[\"fiscal_year\"], \"subtotalPaise\": data[\"subtotal_paise\"], \"discountPaise\": data[\"discount_paise\"],\n            \"taxPaise\": data[\"tax_paise\"], \"totalPaise\": data[\"total_paise\"], \"paidPaise\": paid, \"creditedPaise\": credited, \"balancePaise\": balance,\n            \"status\": \"VOID\" if voided else \"CREDITED\" if credited >= int(data[\"total_paise\"]) else \"SETTLED\" if balance == 0 else \"PARTIAL\" if paid else \"UNPAID\", \"voided\": voided,\n            \"issuedAt\": data[\"issued_at\"], \"contentPath\": f\"/api/v1/financial-documents/{data['issued_document_id']}/content\",\n            \"lines\": [{\"lineNo\": line[\"line_no\"], \"description\": line[\"description\"], \"quantity\": line[\"quantity\"], \"unitAmountPaise\": line[\"unit_amount_paise\"], \"gstRateBps\": line[\"gst_rate_bps\"], \"taxablePaise\": line[\"taxable_paise\"], \"taxPaise\": line[\"tax_paise\"], \"totalPaise\": line[\"total_paise\"]} for line in lines]}"
        },
        {
          "name": "_active_invoice",
          "line": 217,
          "end": 224,
          "body": "def _active_invoice(session, job_id: int, *, lock: bool = False) -> dict[str, object] | None:\n    statement = \"\"\"SELECT invoice.* FROM active_invoice_claims claim\n       JOIN invoices invoice ON invoice.id=claim.invoice_id\n       WHERE claim.job_card_id=:job_id\"\"\"\n    if lock:\n        statement += \" FOR UPDATE\"\n    row = session.execute(text(statement), {\"job_id\": job_id}).mappings().one_or_none()\n    return dict(row) if row else None"
        },
        {
          "name": "_approved_estimate_snapshot",
          "line": 227,
          "end": 236,
          "body": "def _approved_estimate_snapshot(session, job_id: int) -> dict[str, object]:\n    row = session.execute(text(\"\"\"SELECT approved_snapshot FROM estimates\n        WHERE job_card_id=:job_id AND status='APPROVED' AND superseded_at IS NULL\n        ORDER BY revision DESC LIMIT 1\"\"\"), {\"job_id\": job_id}).mappings().one_or_none()\n    if row is None or not row[\"approved_snapshot\"]:\n        raise auth_error(\"ESTIMATE_APPROVAL_REQUIRED\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    snapshot = dict(row[\"approved_snapshot\"])\n    if not isinstance(snapshot.get(\"lines\"), list) or not snapshot[\"lines\"]:\n        raise auth_error(\"APPROVED_ESTIMATE_LINES_REQUIRED\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    return snapshot"
        },
        {
          "name": "_estimate_calculations",
          "line": 239,
          "end": 266,
          "body": "def _estimate_calculations(snapshot: dict[str, object], discount_paise: int, gst_kind: str) -> list[dict[str, object]]:\n    calculations: list[dict[str, object]] = []\n    remaining_discount = discount_paise\n    for raw_line in snapshot[\"lines\"]:\n        if not isinstance(raw_line, dict):\n            raise auth_error(\"APPROVED_ESTIMATE_INVALID\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n        try:\n            quantity = Decimal(str(raw_line[\"quantity\"]))\n            rate = Decimal(str(raw_line[\"rate\"]))\n            gst_rate = Decimal(str(raw_line[\"gstRate\"]))\n        except (KeyError, ArithmeticError) as error:\n            raise auth_error(\"APPROVED_ESTIMATE_INVALID\", status.HTTP_422_UNPROCESSABLE_ENTITY) from error\n        description = str(raw_line.get(\"description\", \"\")).strip()\n        if not description or quantity <= 0 or rate < 0 or gst_rate < 0 or gst_rate > 100:\n            raise auth_error(\"APPROVED_ESTIMATE_INVALID\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n        unit_paise = int((rate * 100).to_integral_value(rounding=ROUND_HALF_UP))\n        raw = int((quantity * Decimal(unit_paise)).to_integral_value(rounding=ROUND_HALF_UP))\n        discount = min(raw, remaining_discount)\n        remaining_discount -= discount\n        taxable = raw - discount\n        gst_rate_bps = int((gst_rate * 100).to_integral_value(rounding=ROUND_HALF_UP))\n        tax = (taxable * gst_rate_bps + 5_000) // 10_000\n        calculations.append({\"description\": description, \"quantity\": float(quantity), \"unitAmountPaise\": unit_paise,\n                             \"gstRateBps\": gst_rate_bps, \"discountPaise\": discount, \"taxablePaise\": taxable, \"taxPaise\": tax,\n                             \"cgstPaise\": tax // 2 if gst_kind == \"CGST_SGST\" else 0,\n                             \"sgstPaise\": tax - tax // 2 if gst_kind == \"CGST_SGST\" else 0,\n                             \"igstPaise\": tax if gst_kind == \"IGST\" else 0, \"totalPaise\": taxable + tax})\n    return calculations"
        },
        {
          "name": "list_job_invoices",
          "line": 270,
          "end": 275,
          "body": "def list_job_invoices(job_id: int, scope: ScopedTenant) -> list[dict[str, object]]:\n    session, _ = scope\n    _permission(scope, mutation=False)\n    _row_or_404(session, \"job_cards\", job_id, \"JOB_NOT_FOUND\")\n    rows = session.execute(text(\"SELECT id FROM invoices WHERE job_card_id=:job_id ORDER BY created_at\"), {\"job_id\": job_id}).mappings().all()\n    return [_invoice(session, int(row[\"id\"])) for row in rows]"
        },
        {
          "name": "issue_invoice",
          "line": 279,
          "end": 344,
          "body": "def issue_invoice(job_id: int, input: InvoiceIssue, scope: ScopedTenant, request_key: Annotated[str | None, Header(alias=\"Idempotency-Key\")] = None) -> dict[str, object]:\n    session, current = scope\n    _permission(scope, mutation=True)\n    job = _row_or_404(session, \"job_cards\", job_id, \"JOB_NOT_FOUND\")\n    if job[\"status\"] in (\"CANCELLED\", \"CLOSED\"):\n        raise auth_error(\"JOB_TERMINAL\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    # Serialise competing issue commands for this job before checking either\n    # idempotency or the active-invoice claim. The claim table then preserves\n    # the invariant even if a second transaction began before this lock.\n    session.execute(text(\"SELECT id FROM job_cards WHERE id=:job_id FOR UPDATE\"), {\"job_id\": job_id})\n    if request_key:\n        replay = session.execute(text(\"SELECT id FROM invoices WHERE job_card_id=:job_id AND request_key=:request_key\"), {\"job_id\": job_id, \"request_key\": request_key.strip()}).scalar()\n        if replay:\n            return _invoice(session, int(replay))\n    approved = _approved_estimate_snapshot(session, job_id)\n    existing = _active_invoice(session, job_id, lock=True)\n    if existing:\n        raise auth_error(\"ACTIVE_INVOICE_EXISTS\", status.HTTP_409_CONFLICT)\n    has_prior_invoice = bool(session.execute(text(\"SELECT 1 FROM invoices WHERE job_card_id=:job_id\"), {\"job_id\": job_id}).scalar())\n    if has_prior_invoice and input.replaces_invoice_id is None:\n        raise auth_error(\"INVOICE_REPLACEMENT_REQUIRED\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    predecessor_document_id = None\n    if input.replaces_invoice_id is not None:\n        replacement = _row_or_404(session, \"invoices\", input.replaces_invoice_id, \"INVOICE_NOT_FOUND\")\n        fully_credited = int(session.execute(text(\"SELECT COALESCE(SUM(amount_paise),0) FROM credit_notes WHERE invoice_id=:invoice_id\"), {\"invoice_id\": input.replaces_invoice_id}).scalar_one()) >= int(replacement[\"total_paise\"])\n        if int(replacement[\"job_card_id\"]) != job_id or not (_voided(session, int(replacement[\"issued_document_id\"])) or fully_credited):\n            raise auth_error(\"INVOICE_REPLACEMENT_NOT_ALLOWED\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n        predecessor_document_id = int(replacement[\"issued_document_id\"])\n    profile = _branch_profile(session, job[\"branch_id\"])\n    branch_state = str(profile.get(\"state\", \"\")).strip().casefold()\n    customer_state = input.customer_state.strip().casefold()\n    gst_kind = \"CGST_SGST\" if branch_state and customer_state and branch_state == customer_state else \"IGST\"\n    estimate_discount = Decimal(str(approved.get(\"discount\", 0)))\n    discount_paise = int((estimate_discount * 100).to_integral_value(rounding=ROUND_HALF_UP))\n    calculations = _estimate_calculations(approved, discount_paise, gst_kind)\n    subtotal = sum(int(line[\"taxablePaise\"]) + int(line[\"discountPaise\"]) for line in calculations)\n    tax_total = sum(int(line[\"taxPaise\"]) for line in calculations)\n    total = subtotal - discount_paise + tax_total\n    snapshot = {\"jobId\": job_id, \"currency\": str(profile.get(\"currency\", \"INR\")), \"gstKind\": gst_kind,\n                \"customerState\": input.customer_state.strip(), \"lines\": calculations, \"subtotalPaise\": subtotal,\n                \"discountPaise\": discount_paise, \"taxPaise\": tax_total, \"totalPaise\": total,\n                \"approvedEstimate\": approved}\n    document = _issue_document(session, current, job=job, document_type=\"INVOICE\", snapshot=snapshot, predecessor_document_id=predecessor_document_id)\n    invoice = session.execute(text(\"\"\"\n        INSERT INTO invoices (tenant_id,branch_id,job_card_id,issued_document_id,replaces_invoice_id,subtotal_paise,discount_paise,tax_paise,total_paise,request_key,created_by)\n        VALUES (:tenant_id,:branch_id,:job_id,:document_id,:replaces_invoice_id,:subtotal,:discount,:tax,:total,:request_key,:actor_id) RETURNING id\n    \"\"\"), {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(job[\"branch_id\"]), \"job_id\": job_id, \"document_id\": document[\"id\"],\n             \"replaces_invoice_id\": input.replaces_invoice_id, \"subtotal\": subtotal, \"discount\": discount_paise, \"tax\": tax_total,\n             \"total\": total, \"request_key\": request_key.strip() if request_key else None, \"actor_id\": str(current.actor_id)}).mappings().one()\n    for index, line in enumerate(calculations, start=1):\n        session.execute(text(\"\"\"INSERT INTO invoice_lines (tenant_id,branch_id,invoice_id,line_no,description,quantity,unit_amount_paise,gst_rate_bps,taxable_paise,tax_paise,total_paise)\n            VALUES (:tenant_id,:branch_id,:invoice_id,:line_no,:description,:quantity,:unit_amount_paise,:gst_rate_bps,:taxable_paise,:tax_paise,:total_paise)\"\"\"),\n            {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(job[\"branch_id\"]), \"invoice_id\": invoice[\"id\"], \"line_no\": index,\n             \"description\": line[\"description\"], \"quantity\": line[\"quantity\"], \"unit_amount_paise\": line[\"unitAmountPaise\"], \"gst_rate_bps\": line[\"gstRateBps\"], \"taxable_paise\": line[\"taxablePaise\"], \"tax_paise\": line[\"taxPaise\"], \"total_paise\": line[\"totalPaise\"]})\n    try:\n        session.execute(text(\"INSERT INTO active_invoice_claims (tenant_id,branch_id,job_card_id,invoice_id) VALUES (:tenant_id,:branch_id,:job_id,:invoice_id)\"),\n            {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(job[\"branch_id\"]), \"job_id\": job_id, \"invoice_id\": invoice[\"id\"]})\n    except Exception as error:\n        raise auth_error(\"ACTIVE_INVOICE_EXISTS\", status.HTTP_409_CONFLICT) from error\n    if predecessor_document_id:\n        session.execute(text(\"\"\"INSERT INTO financial_document_events (tenant_id,branch_id,document_id,event_type,reason,related_document_id,actor_id)\n            VALUES (:tenant_id,:branch_id,:document_id,'REPLACED','Replacement invoice issued',:related_document_id,:actor_id)\"\"\"),\n            {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(job[\"branch_id\"]), \"document_id\": predecessor_document_id, \"related_document_id\": document[\"id\"], \"actor_id\": str(current.actor_id)})\n    payload = _invoice(session, int(invoice[\"id\"]))\n    _audit(session, current, \"INVOICE_ISSUED\", f\"Issued {document['document_no']}\", {}, payload)\n    return payload"
        },
        {
          "name": "void_invoice",
          "line": 348,
          "end": 364,
          "body": "def void_invoice(invoice_id: int, input: VoidInput, scope: ScopedTenant, request_key: Annotated[str | None, Header(alias=\"Idempotency-Key\")] = None) -> dict[str, object]:\n    session, current = scope\n    _permission(scope, mutation=True)\n    invoice = _row_or_404(session, \"invoices\", invoice_id, \"INVOICE_NOT_FOUND\")\n    session.execute(text(\"SELECT id FROM invoices WHERE id=:invoice_id FOR UPDATE\"), {\"invoice_id\": invoice_id})\n    if _voided(session, int(invoice[\"issued_document_id\"])):\n        return _invoice(session, invoice_id)\n    if session.execute(text(\"SELECT 1 FROM payments WHERE invoice_id=:invoice_id\"), {\"invoice_id\": invoice_id}).scalar():\n        raise auth_error(\"POST_PAYMENT_VOID_REQUIRES_CREDIT_NOTE\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    session.execute(text(\"\"\"INSERT INTO financial_document_events (tenant_id,branch_id,document_id,event_type,reason,request_key,actor_id)\n        VALUES (:tenant_id,:branch_id,:document_id,'VOID',:reason,:request_key,:actor_id)\"\"\"),\n        {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(invoice[\"branch_id\"]), \"document_id\": invoice[\"issued_document_id\"], \"reason\": input.reason.strip(),\n         \"request_key\": request_key.strip() if request_key else None, \"actor_id\": str(current.actor_id)})\n    session.execute(text(\"DELETE FROM active_invoice_claims WHERE invoice_id=:invoice_id\"), {\"invoice_id\": invoice_id})\n    payload = _invoice(session, invoice_id)\n    _audit(session, current, \"INVOICE_VOIDED\", input.reason.strip(), {}, payload)\n    return payload"
        },
        {
          "name": "_credit_note",
          "line": 367,
          "end": 376,
          "body": "def _credit_note(session, credit_note_id: int) -> dict[str, object]:\n    row = session.execute(text(\"\"\"SELECT note.*, document.document_no, document.issued_at\n        FROM credit_notes note JOIN financial_documents document ON document.id=note.issued_document_id\n        WHERE note.id=:id\"\"\"), {\"id\": credit_note_id}).mappings().one_or_none()\n    if row is None:\n        raise auth_error(\"CREDIT_NOTE_NOT_FOUND\", status.HTTP_404_NOT_FOUND)\n    refunded = int(session.execute(text(\"SELECT COALESCE(SUM(amount_paise),0) FROM refunds WHERE credit_note_id=:id\"), {\"id\": credit_note_id}).scalar_one())\n    return {\"id\": row[\"id\"], \"invoiceId\": row[\"invoice_id\"], \"documentId\": row[\"issued_document_id\"], \"number\": row[\"document_no\"],\n            \"amountPaise\": row[\"amount_paise\"], \"reason\": row[\"reason\"], \"refundedPaise\": refunded, \"issuedAt\": row[\"issued_at\"],\n            \"contentPath\": f\"/api/v1/financial-documents/{row['issued_document_id']}/content\"}"
        },
        {
          "name": "issue_credit_note",
          "line": 380,
          "end": 408,
          "body": "def issue_credit_note(invoice_id: int, input: CreditNoteIssue, scope: ScopedTenant, request_key: Annotated[str | None, Header(alias=\"Idempotency-Key\")] = None) -> dict[str, object]:\n    session, current = scope\n    _permission(scope, mutation=True)\n    invoice = _row_or_404(session, \"invoices\", invoice_id, \"INVOICE_NOT_FOUND\")\n    session.execute(text(\"SELECT id FROM invoices WHERE id=:invoice_id FOR UPDATE\"), {\"invoice_id\": invoice_id})\n    if request_key:\n        replay = session.execute(text(\"SELECT id FROM credit_notes WHERE invoice_id=:invoice_id AND request_key=:request_key\"), {\"invoice_id\": invoice_id, \"request_key\": request_key.strip()}).scalar()\n        if replay:\n            return _credit_note(session, int(replay))\n    paid = int(session.execute(text(\"SELECT COALESCE(SUM(amount_paise),0) FROM payments WHERE invoice_id=:invoice_id\"), {\"invoice_id\": invoice_id}).scalar_one())\n    credited = int(session.execute(text(\"SELECT COALESCE(SUM(amount_paise),0) FROM credit_notes WHERE invoice_id=:invoice_id\"), {\"invoice_id\": invoice_id}).scalar_one())\n    if not paid:\n        raise auth_error(\"CREDIT_NOTE_REQUIRES_PAYMENT\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    if input.amount_paise > paid - credited:\n        raise auth_error(\"CREDIT_EXCEEDS_PAID_AMOUNT\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    job = _row_or_404(session, \"job_cards\", int(invoice[\"job_card_id\"]), \"JOB_NOT_FOUND\")\n    document = _issue_document(session, current, job=job, document_type=\"CREDIT_NOTE\", snapshot={\"invoiceId\": invoice_id, \"invoiceDocumentId\": invoice[\"issued_document_id\"], \"amountPaise\": input.amount_paise, \"reason\": input.reason.strip() }, predecessor_document_id=int(invoice[\"issued_document_id\"]))\n    row = session.execute(text(\"\"\"INSERT INTO credit_notes (tenant_id,branch_id,invoice_id,issued_document_id,amount_paise,reason,request_key,created_by)\n        VALUES (:tenant_id,:branch_id,:invoice_id,:document_id,:amount,:reason,:request_key,:actor_id) RETURNING id\"\"\"),\n        {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(invoice[\"branch_id\"]), \"invoice_id\": invoice_id, \"document_id\": document[\"id\"], \"amount\": input.amount_paise, \"reason\": input.reason.strip(), \"request_key\": request_key.strip() if request_key else None, \"actor_id\": str(current.actor_id)}).mappings().one()\n    session.execute(text(\"\"\"INSERT INTO financial_document_events\n        (tenant_id,branch_id,document_id,event_type,reason,related_document_id,request_key,actor_id)\n        VALUES (:tenant_id,:branch_id,:document_id,'CREDITED',:reason,:related_document_id,:request_key,:actor_id)\"\"\"),\n        {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(invoice[\"branch_id\"]), \"document_id\": invoice[\"issued_document_id\"], \"reason\": input.reason.strip(), \"related_document_id\": document[\"id\"], \"request_key\": request_key.strip() if request_key else None, \"actor_id\": str(current.actor_id)})\n    if credited + input.amount_paise >= int(invoice[\"total_paise\"]):\n        session.execute(text(\"DELETE FROM active_invoice_claims WHERE invoice_id=:invoice_id\"), {\"invoice_id\": invoice_id})\n    payload = _credit_note(session, int(row[\"id\"]))\n    _audit(session, current, \"CREDIT_NOTE_ISSUED\", input.reason.strip(), {}, payload)\n    return payload"
        },
        {
          "name": "record_refund",
          "line": 412,
          "end": 429,
          "body": "def record_refund(credit_note_id: int, input: RefundRecord, scope: ScopedTenant, request_key: Annotated[str | None, Header(alias=\"Idempotency-Key\")] = None) -> dict[str, object]:\n    session, current = scope\n    _permission(scope, mutation=True)\n    note = _row_or_404(session, \"credit_notes\", credit_note_id, \"CREDIT_NOTE_NOT_FOUND\")\n    session.execute(text(\"SELECT id FROM credit_notes WHERE id=:id FOR UPDATE\"), {\"id\": credit_note_id})\n    if request_key:\n        replay = session.execute(text(\"SELECT id FROM refunds WHERE credit_note_id=:id AND request_key=:request_key\"), {\"id\": credit_note_id, \"request_key\": request_key.strip()}).scalar()\n        if replay:\n            return {\"id\": replay, \"creditNoteId\": credit_note_id, \"replayed\": True}\n    refunded = int(session.execute(text(\"SELECT COALESCE(SUM(amount_paise),0) FROM refunds WHERE credit_note_id=:id\"), {\"id\": credit_note_id}).scalar_one())\n    if refunded + input.amount_paise > int(note[\"amount_paise\"]):\n        raise auth_error(\"REFUND_EXCEEDS_CREDIT_NOTE\", status.HTTP_409_CONFLICT)\n    row = session.execute(text(\"\"\"INSERT INTO refunds (tenant_id,branch_id,credit_note_id,amount_paise,method,reference,request_key,created_by)\n        VALUES (:tenant_id,:branch_id,:credit_note_id,:amount,:method,:reference,:request_key,:actor_id) RETURNING id\"\"\"),\n        {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(note[\"branch_id\"]), \"credit_note_id\": credit_note_id, \"amount\": input.amount_paise, \"method\": input.method.upper(), \"reference\": input.reference.strip(), \"request_key\": request_key.strip() if request_key else None, \"actor_id\": str(current.actor_id)}).mappings().one()\n    payload = {\"id\": row[\"id\"], \"creditNoteId\": credit_note_id, \"amountPaise\": input.amount_paise, \"method\": input.method.upper(), \"reference\": input.reference.strip()}\n    _audit(session, current, \"REFUND_RECORDED\", f\"Credit note #{credit_note_id}\", {}, payload)\n    return payload"
        },
        {
          "name": "record_payment",
          "line": 433,
          "end": 461,
          "body": "def record_payment(invoice_id: int, input: PaymentRecord, scope: ScopedTenant, request_key: Annotated[str | None, Header(alias=\"Idempotency-Key\")] = None) -> dict[str, object]:\n    session, current = scope\n    _permission(scope, mutation=True)\n    if request_key:\n        existing = session.execute(text(\"SELECT id FROM payments WHERE invoice_id=:invoice_id AND request_key=:request_key\"), {\"invoice_id\": invoice_id, \"request_key\": request_key.strip()}).scalar()\n        if existing:\n            return _payment(session, int(existing))\n    invoice = _row_or_404(session, \"invoices\", invoice_id, \"INVOICE_NOT_FOUND\")\n    session.execute(text(\"SELECT id FROM invoices WHERE id=:invoice_id FOR UPDATE\"), {\"invoice_id\": invoice_id})\n    if _voided(session, int(invoice[\"issued_document_id\"])):\n        raise auth_error(\"PAYMENT_ON_VOID_INVOICE\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    paid = int(session.execute(text(\"SELECT COALESCE(SUM(amount_paise),0) FROM payments WHERE invoice_id=:invoice_id\"), {\"invoice_id\": invoice_id}).scalar_one())\n    if paid + input.amount_paise > int(invoice[\"total_paise\"]):\n        raise auth_error(\"PAYMENT_EXCEEDS_BALANCE\", status.HTTP_409_CONFLICT)\n    job = _row_or_404(session, \"job_cards\", int(invoice[\"job_card_id\"]), \"JOB_NOT_FOUND\")\n    receipt_snapshot = {\"invoiceId\": invoice_id, \"invoiceDocumentId\": invoice[\"issued_document_id\"], \"amountPaise\": input.amount_paise,\n                        \"method\": input.method.upper(), \"reference\": input.reference.strip(), \"payer\": input.payer.strip(), \"receivedAt\": input.received_at.isoformat()}\n    receipt = _issue_document(session, current, job=job, document_type=\"RECEIPT\", snapshot=receipt_snapshot, predecessor_document_id=int(invoice[\"issued_document_id\"]))\n    filename, content_type, artifact, checksum = _decode_attachment(input.supporting_attachment)\n    payment = session.execute(text(\"\"\"INSERT INTO payments\n        (tenant_id,branch_id,invoice_id,receipt_document_id,amount_paise,method,reference,payer,supporting_filename,supporting_content_type,supporting_artifact,supporting_sha256,received_at,request_key,received_by)\n        VALUES (:tenant_id,:branch_id,:invoice_id,:receipt_document_id,:amount_paise,:method,:reference,:payer,:filename,:content_type,:artifact,:checksum,:received_at,:request_key,:actor_id) RETURNING id\"\"\"),\n        {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(invoice[\"branch_id\"]), \"invoice_id\": invoice_id, \"receipt_document_id\": receipt[\"id\"],\n         \"amount_paise\": input.amount_paise, \"method\": input.method.upper(), \"reference\": input.reference.strip(), \"payer\": input.payer.strip(),\n         \"filename\": filename, \"content_type\": content_type, \"artifact\": artifact, \"checksum\": checksum, \"received_at\": input.received_at,\n         \"request_key\": request_key.strip() if request_key else None, \"actor_id\": str(current.actor_id)}).mappings().one()\n    payload = _payment(session, int(payment[\"id\"]))\n    _audit(session, current, \"PAYMENT_RECORDED\", f\"Payment receipt {receipt['document_no']}\", {}, payload)\n    return payload"
        },
        {
          "name": "_payment",
          "line": 464,
          "end": 472,
          "body": "def _payment(session, payment_id: int) -> dict[str, object]:\n    row = session.execute(text(\"\"\"SELECT payment.*, document.document_no, document.issued_at FROM payments payment\n        JOIN financial_documents document ON document.id=payment.receipt_document_id WHERE payment.id=:payment_id\"\"\"), {\"payment_id\": payment_id}).mappings().one_or_none()\n    if row is None:\n        raise auth_error(\"PAYMENT_NOT_FOUND\", status.HTTP_404_NOT_FOUND)\n    return {\"id\": row[\"id\"], \"invoiceId\": row[\"invoice_id\"], \"receiptDocumentId\": row[\"receipt_document_id\"], \"receiptNumber\": row[\"document_no\"],\n            \"amountPaise\": row[\"amount_paise\"], \"method\": row[\"method\"], \"reference\": row[\"reference\"], \"payer\": row[\"payer\"],\n            \"receivedAt\": row[\"received_at\"], \"contentPath\": f\"/api/v1/financial-documents/{row['receipt_document_id']}/content\",\n            \"supportingAttachmentPath\": f\"/api/v1/payments/{row['id']}/supporting-attachment\" if row[\"supporting_artifact\"] else None}"
        },
        {
          "name": "list_payments",
          "line": 476,
          "end": 480,
          "body": "def list_payments(invoice_id: int, scope: ScopedTenant) -> list[dict[str, object]]:\n    session, _ = scope\n    _permission(scope, mutation=False)\n    _row_or_404(session, \"invoices\", invoice_id, \"INVOICE_NOT_FOUND\")\n    return [_payment(session, int(row[\"id\"])) for row in session.execute(text(\"SELECT id FROM payments WHERE invoice_id=:invoice_id ORDER BY created_at,id\"), {\"invoice_id\": invoice_id}).mappings().all()]"
        },
        {
          "name": "complete_handover",
          "line": 484,
          "end": 514,
          "body": "def complete_handover(job_id: int, input: HandoverInput, scope: ScopedTenant, request_key: Annotated[str | None, Header(alias=\"Idempotency-Key\")] = None) -> dict[str, object]:\n    session, current = scope\n    _permission(scope, mutation=True)\n    job = _row_or_404(session, \"job_cards\", job_id, \"JOB_NOT_FOUND\")\n    existing = session.execute(text(\"SELECT * FROM delivery_acknowledgements WHERE job_card_id=:job_id\"), {\"job_id\": job_id}).mappings().one_or_none()\n    if existing:\n        return _handover(session, dict(existing))\n    if job[\"status\"] != \"COMPLETED\":\n        raise auth_error(\"HANDOVER_REQUIRES_COMPLETED_JOB\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    invoice = _active_invoice(session, job_id, lock=True)\n    if invoice is None:\n        raise auth_error(\"HANDOVER_REQUIRES_INVOICE\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    paid = int(session.execute(text(\"SELECT COALESCE(SUM(amount_paise),0) FROM payments WHERE invoice_id=:invoice_id\"), {\"invoice_id\": invoice[\"id\"]}).scalar_one())\n    if paid != int(invoice[\"total_paise\"]):\n        raise auth_error(\"HANDOVER_REQUIRES_SETTLED_INVOICE\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    snapshot = {\"jobId\": job_id, \"invoiceId\": invoice[\"id\"], \"invoiceDocumentId\": invoice[\"issued_document_id\"], \"deliveredBy\": input.delivered_by.strip(),\n                \"finalOdometer\": input.final_odometer, \"acknowledgement\": input.acknowledgement.strip(), \"handoverAt\": datetime.now(timezone.utc).isoformat()}\n    gate_pass = _issue_document(session, current, job=job, document_type=\"GATE_PASS\", snapshot=snapshot, predecessor_document_id=int(invoice[\"issued_document_id\"]))\n    row = session.execute(text(\"\"\"INSERT INTO delivery_acknowledgements\n        (tenant_id,branch_id,job_card_id,invoice_id,gate_pass_document_id,delivered_by,final_odometer,acknowledgement,request_key,actor_id)\n        VALUES (:tenant_id,:branch_id,:job_id,:invoice_id,:gate_pass_id,:delivered_by,:final_odometer,:acknowledgement,:request_key,:actor_id) RETURNING *\"\"\"),\n        {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(job[\"branch_id\"]), \"job_id\": job_id, \"invoice_id\": invoice[\"id\"], \"gate_pass_id\": gate_pass[\"id\"],\n         \"delivered_by\": input.delivered_by.strip(), \"final_odometer\": input.final_odometer, \"acknowledgement\": input.acknowledgement.strip(),\n         \"request_key\": request_key.strip() if request_key else None, \"actor_id\": str(current.actor_id)}).mappings().one()\n    session.execute(text(\"UPDATE job_cards SET status='CLOSED',updated_by=:actor_id,updated_at=now() WHERE id=:job_id\"), {\"actor_id\": str(current.actor_id), \"job_id\": job_id})\n    session.execute(text(\"\"\"INSERT INTO job_events (tenant_id,branch_id,job_card_id,command,from_status,to_status,reason,request_key,actor_id)\n        VALUES (:tenant_id,:branch_id,:job_id,'complete-handover','COMPLETED','CLOSED','Settled invoice handover',:request_key,:actor_id)\"\"\"),\n        {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(job[\"branch_id\"]), \"job_id\": job_id, \"request_key\": request_key.strip() if request_key else None, \"actor_id\": str(current.actor_id)})\n    payload = _handover(session, dict(row))\n    _audit(session, current, \"JOB_HANDOVER_COMPLETED\", f\"Gate pass {gate_pass['document_no']}\", _job(job), payload)\n    return payload"
        },
        {
          "name": "_handover",
          "line": 517,
          "end": 521,
          "body": "def _handover(session, row: dict[str, object]) -> dict[str, object]:\n    document = _row_or_404(session, \"financial_documents\", int(row[\"gate_pass_document_id\"]), \"GATE_PASS_NOT_FOUND\")\n    return {\"id\": row[\"id\"], \"jobId\": row[\"job_card_id\"], \"invoiceId\": row[\"invoice_id\"], \"gatePassDocumentId\": row[\"gate_pass_document_id\"],\n            \"gatePassNumber\": document[\"document_no\"], \"deliveredBy\": row[\"delivered_by\"], \"finalOdometer\": row[\"final_odometer\"],\n            \"acknowledgement\": row[\"acknowledgement\"], \"handoverAt\": row[\"handover_at\"], \"contentPath\": f\"/api/v1/financial-documents/{document['id']}/content\"}"
        },
        {
          "name": "get_delivery",
          "line": 525,
          "end": 530,
          "body": "def get_delivery(job_id: int, scope: ScopedTenant) -> dict[str, object] | None:\n    session, _ = scope\n    _permission(scope, mutation=False)\n    _row_or_404(session, \"job_cards\", job_id, \"JOB_NOT_FOUND\")\n    row = session.execute(text(\"SELECT * FROM delivery_acknowledgements WHERE job_card_id=:job_id\"), {\"job_id\": job_id}).mappings().one_or_none()\n    return _handover(session, dict(row)) if row else None"
        },
        {
          "name": "get_document_content",
          "line": 534,
          "end": 544,
          "body": "def get_document_content(document_id: int, scope: ScopedTenant) -> Response:\n    session, _ = scope\n    _permission(scope, mutation=False)\n    row = session.execute(text(\"SELECT document_no,content_type,artifact FROM financial_documents WHERE id=:document_id\"), {\"document_id\": document_id}).mappings().one_or_none()\n    if row is None:\n        raise auth_error(\"FINANCIAL_DOCUMENT_NOT_FOUND\", status.HTTP_404_NOT_FOUND)\n    return Response(content=bytes(row[\"artifact\"]), media_type=row[\"content_type\"], headers={\n        \"Content-Disposition\": f'attachment; filename=\"{_download_filename(row[\"document_no\"], \".html\")}\"',\n        \"Content-Security-Policy\": \"sandbox; default-src 'none'; style-src 'unsafe-inline'\",\n        \"X-Content-Type-Options\": \"nosniff\",\n    })"
        },
        {
          "name": "get_supporting_attachment",
          "line": 548,
          "end": 557,
          "body": "def get_supporting_attachment(payment_id: int, scope: ScopedTenant) -> Response:\n    session, _ = scope\n    _permission(scope, mutation=False)\n    row = session.execute(text(\"SELECT supporting_filename,supporting_content_type,supporting_artifact FROM payments WHERE id=:payment_id\"), {\"payment_id\": payment_id}).mappings().one_or_none()\n    if row is None or row[\"supporting_artifact\"] is None:\n        raise auth_error(\"SUPPORTING_ATTACHMENT_NOT_FOUND\", status.HTTP_404_NOT_FOUND)\n    return Response(content=bytes(row[\"supporting_artifact\"]), media_type=row[\"supporting_content_type\"], headers={\n        \"Content-Disposition\": f'attachment; filename=\"{_download_filename(row[\"supporting_filename\"])}\"',\n        \"X-Content-Type-Options\": \"nosniff\",\n    })"
        }
      ]
    },
    {
      "file": "/app/app/followups.py",
      "functions": [
        {
          "name": "_permission",
          "line": 48,
          "end": 49,
          "body": "def _permission(scope: ScopedTenant, *, mutation: bool) -> TenantScope:\n    return _require_any(scope, (f\"page.follow-ups.{'write' if mutation else 'read'}\",), mutation=mutation)"
        },
        {
          "name": "_search_permission",
          "line": 52,
          "end": 53,
          "body": "def _search_permission(scope: ScopedTenant) -> TenantScope:\n    return _require_any(scope, (\"page.search.read\",), mutation=False)"
        },
        {
          "name": "_clean",
          "line": 56,
          "end": 60,
          "body": "def _clean(value: str) -> str:\n    cleaned = value.strip()\n    if not cleaned:\n        raise auth_error(\"BLANK_VALUE\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    return cleaned"
        },
        {
          "name": "_followup_row",
          "line": 63,
          "end": 75,
          "body": "def _followup_row(session, followup_id: int) -> dict[str, object]:\n    row = session.execute(text(\"\"\"\n        SELECT f.*, j.job_no, c.name AS customer_name, v.number AS vehicle_no\n        FROM followups f\n        JOIN job_cards j ON j.id=f.job_card_id\n        JOIN visits visit ON visit.id=j.visit_id\n        JOIN customers c ON c.id=visit.customer_id\n        JOIN vehicles v ON v.id=visit.vehicle_id\n        WHERE f.id=:id\n    \"\"\"), {\"id\": followup_id}).mappings().one_or_none()\n    if row is None:\n        raise auth_error(\"FOLLOWUP_NOT_FOUND\", status.HTTP_404_NOT_FOUND)\n    return dict(row)"
        },
        {
          "name": "_payload",
          "line": 78,
          "end": 86,
          "body": "def _payload(row: dict[str, object]) -> dict[str, object]:\n    return {\n        \"id\": row[\"id\"], \"jobId\": row[\"job_card_id\"], \"branchId\": str(row[\"branch_id\"]),\n        \"jobNo\": row[\"job_no\"], \"customerName\": row[\"customer_name\"], \"vehicleNo\": row[\"vehicle_no\"],\n        \"note\": row[\"note\"], \"dueAt\": row[\"due_at\"], \"status\": row[\"status\"], \"outcome\": row[\"outcome\"],\n        \"completedAt\": row[\"completed_at\"], \"archivedAt\": row[\"archived_at\"],\n        \"archiveReason\": row[\"archive_reason\"], \"version\": row[\"version\"],\n        \"createdAt\": row[\"created_at\"], \"updatedAt\": row[\"updated_at\"],\n    }"
        },
        {
          "name": "list_followups",
          "line": 90,
          "end": 118,
          "body": "def list_followups(\n    scope: ScopedTenant,\n    job_id: int | None = Query(default=None, alias=\"jobId\", gt=0),\n    branch_id: UUID | None = Query(default=None, alias=\"branchId\"),\n    archived: bool = False,\n) -> list[dict[str, object]]:\n    session, current = scope\n    _permission(scope, mutation=False)\n    if branch_id is not None:\n        _branch(current, branch_id)\n    filters = [\"(f.archived_at IS NOT NULL)\" if archived else \"f.archived_at IS NULL\"]\n    values: dict[str, object] = {}\n    if job_id is not None:\n        filters.append(\"f.job_card_id=:job_id\")\n        values[\"job_id\"] = job_id\n    if branch_id is not None:\n        filters.append(\"f.branch_id=:branch_id\")\n        values[\"branch_id\"] = str(branch_id)\n    rows = session.execute(text(f\"\"\"\n        SELECT f.*, j.job_no, c.name AS customer_name, v.number AS vehicle_no\n        FROM followups f\n        JOIN job_cards j ON j.id=f.job_card_id\n        JOIN visits visit ON visit.id=j.visit_id\n        JOIN customers c ON c.id=visit.customer_id\n        JOIN vehicles v ON v.id=visit.vehicle_id\n        WHERE {' AND '.join(filters)}\n        ORDER BY (f.status='OPEN') DESC, f.due_at NULLS LAST, f.updated_at DESC, f.id DESC\n    \"\"\"), values).mappings().all()\n    return [_payload(dict(row)) for row in rows]"
        },
        {
          "name": "followup_jobs",
          "line": 122,
          "end": 135,
          "body": "def followup_jobs(scope: ScopedTenant, branch_id: UUID | None = Query(default=None, alias=\"branchId\")) -> list[dict[str, object]]:\n    \"\"\"Minimal job context for Follow-up creation without granting the full job page.\"\"\"\n    session, current = scope\n    _permission(scope, mutation=False)\n    if branch_id is not None:\n        _branch(current, branch_id)\n    rows = session.execute(text(\"\"\"\n        SELECT j.id, j.branch_id, j.job_no, j.status, c.name AS customer_name, v.number AS vehicle_no\n        FROM job_cards j JOIN visits visit ON visit.id=j.visit_id\n        JOIN customers c ON c.id=visit.customer_id JOIN vehicles v ON v.id=visit.vehicle_id\n        WHERE (CAST(:branch_id AS uuid) IS NULL OR j.branch_id=:branch_id) AND j.status NOT IN ('CANCELLED','CLOSED')\n        ORDER BY j.created_at DESC, j.id DESC\n    \"\"\"), {\"branch_id\": str(branch_id) if branch_id else None}).mappings().all()\n    return [{\"id\": row[\"id\"], \"branchId\": str(row[\"branch_id\"]), \"jobNo\": row[\"job_no\"], \"status\": row[\"status\"], \"customerName\": row[\"customer_name\"], \"vehicleNo\": row[\"vehicle_no\"]} for row in rows]"
        },
        {
          "name": "create_followup",
          "line": 139,
          "end": 152,
          "body": "def create_followup(input: FollowupCreate, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    _permission(scope, mutation=True)\n    job = _row_or_404(session, \"job_cards\", input.job_id, \"JOB_NOT_FOUND\")\n    if job[\"status\"] in (\"CANCELLED\", \"CLOSED\"):\n        raise auth_error(\"JOB_TERMINAL\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    row = session.execute(text(\"\"\"\n        INSERT INTO followups (tenant_id,branch_id,job_card_id,note,due_at,created_by,updated_by)\n        VALUES (:tenant_id,:branch_id,:job_id,:note,:due_at,:actor_id,:actor_id) RETURNING id\n    \"\"\"), {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(job[\"branch_id\"]), \"job_id\": input.job_id,\n             \"note\": _clean(input.note), \"due_at\": input.due_at, \"actor_id\": str(current.actor_id)}).mappings().one()\n    payload = _payload(_followup_row(session, int(row[\"id\"])))\n    _audit(session, current, \"FOLLOWUP_CREATED\", f\"Created follow-up #{payload['id']}\", {}, payload)\n    return payload"
        },
        {
          "name": "update_followup",
          "line": 156,
          "end": 169,
          "body": "def update_followup(followup_id: int, input: FollowupUpdate, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    _permission(scope, mutation=True)\n    before = _payload(_followup_row(session, followup_id))\n    if before[\"archivedAt\"] is not None:\n        raise auth_error(\"FOLLOWUP_ARCHIVED\", status.HTTP_409_CONFLICT)\n    session.execute(text(\"\"\"\n        UPDATE followups SET note=:note,due_at=:due_at,outcome=:outcome,updated_by=:actor_id,\n          updated_at=now(),version=version+1 WHERE id=:id\n    \"\"\"), {\"id\": followup_id, \"note\": _clean(input.note), \"due_at\": input.due_at,\n             \"outcome\": input.outcome.strip(), \"actor_id\": str(current.actor_id)})\n    payload = _payload(_followup_row(session, followup_id))\n    _audit(session, current, \"FOLLOWUP_UPDATED\", f\"Updated follow-up #{followup_id}\", before, payload)\n    return payload"
        },
        {
          "name": "complete_followup",
          "line": 173,
          "end": 185,
          "body": "def complete_followup(followup_id: int, input: FollowupComplete, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    _permission(scope, mutation=True)\n    before = _payload(_followup_row(session, followup_id))\n    if before[\"archivedAt\"] is not None:\n        raise auth_error(\"FOLLOWUP_ARCHIVED\", status.HTTP_409_CONFLICT)\n    session.execute(text(\"\"\"\n        UPDATE followups SET status='COMPLETED',outcome=:outcome,completed_at=COALESCE(completed_at,now()),\n          completed_by=COALESCE(completed_by,:actor_id),updated_by=:actor_id,updated_at=now(),version=version+1 WHERE id=:id\n    \"\"\"), {\"id\": followup_id, \"outcome\": input.outcome.strip(), \"actor_id\": str(current.actor_id)})\n    payload = _payload(_followup_row(session, followup_id))\n    _audit(session, current, \"FOLLOWUP_COMPLETED\", f\"Completed follow-up #{followup_id}\", before, payload)\n    return payload"
        },
        {
          "name": "archive_followup",
          "line": 189,
          "end": 201,
          "body": "def archive_followup(followup_id: int, input: ArchiveInput, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    _permission(scope, mutation=True)\n    before = _payload(_followup_row(session, followup_id))\n    if before[\"archivedAt\"] is not None:\n        raise auth_error(\"FOLLOWUP_ARCHIVED\", status.HTTP_409_CONFLICT)\n    session.execute(text(\"\"\"\n        UPDATE followups SET archived_at=now(),archived_by=:actor_id,archive_reason=:reason,\n          updated_by=:actor_id,updated_at=now(),version=version+1 WHERE id=:id\n    \"\"\"), {\"id\": followup_id, \"reason\": _clean(input.reason), \"actor_id\": str(current.actor_id)})\n    payload = _payload(_followup_row(session, followup_id))\n    _audit(session, current, \"FOLLOWUP_ARCHIVED\", f\"Archived follow-up #{followup_id}\", before, payload)\n    return payload"
        },
        {
          "name": "search",
          "line": 205,
          "end": 247,
          "body": "def search(\n    scope: ScopedTenant,\n    q: Annotated[str, Query(min_length=2, max_length=200)],\n    branch_id: UUID | None = Query(default=None, alias=\"branchId\"),\n    limit: Annotated[int, Query(ge=1, le=100)] = 30,\n    entities: list[SearchEntity] | None = Query(default=None),\n) -> dict[str, object]:\n    session, current = scope\n    _search_permission(scope)\n    if branch_id is not None:\n        _branch(current, branch_id)\n    requested = tuple(dict.fromkeys(entities or (\"customer\", \"vehicle\", \"job\", \"invoice\")))\n    needle = f\"%{q.strip()}%\"\n    prefix = f\"{q.strip()}%\"\n    exact = q.strip()\n    branch_filters = {alias: \"\" if branch_id is None else f\" AND {alias}.branch_id=:branch_id\" for alias in (\"c\", \"v\", \"j\", \"i\")}\n    values: dict[str, object] = {\"needle\": needle, \"prefix\": prefix, \"exact\": exact, \"entities\": list(requested), \"limit\": limit}\n    if branch_id is not None:\n        values[\"branch_id\"] = str(branch_id)\n    rows = session.execute(text(f\"\"\"\n        SELECT * FROM (\n          SELECT 'customer' AS entity, c.id, c.branch_id, c.name AS title, c.mobile AS subtitle,\n            CASE WHEN lower(c.name)=lower(:exact) OR lower(c.mobile)=lower(:exact) THEN 0 WHEN c.name ILIKE :prefix OR c.mobile ILIKE :prefix THEN 1 ELSE 2 END AS rank\n          FROM customers c WHERE c.archived_at IS NULL{branch_filters['c']} AND (c.name ILIKE :needle OR c.mobile ILIKE :needle)\n          UNION ALL\n          SELECT 'vehicle', v.id, v.branch_id, v.number, concat_ws(' \u00b7 ',v.make,v.model,c.name),\n            CASE WHEN upper(v.number)=upper(:exact) THEN 0 WHEN v.number ILIKE :prefix THEN 1 ELSE 2 END\n          FROM vehicles v JOIN customers c ON c.id=v.customer_id WHERE v.archived_at IS NULL AND c.archived_at IS NULL{branch_filters['v']} AND (v.number ILIKE :needle OR v.make ILIKE :needle OR v.model ILIKE :needle OR c.name ILIKE :needle)\n          UNION ALL\n          SELECT 'job', j.id, j.branch_id, j.job_no, concat_ws(' \u00b7 ',v.number,c.name,j.status),\n            CASE WHEN lower(j.job_no)=lower(:exact) THEN 0 WHEN j.job_no ILIKE :prefix THEN 1 ELSE 2 END\n          FROM job_cards j JOIN visits visit ON visit.id=j.visit_id JOIN customers c ON c.id=visit.customer_id JOIN vehicles v ON v.id=visit.vehicle_id\n          WHERE TRUE{branch_filters['j']} AND (j.job_no ILIKE :needle OR v.number ILIKE :needle OR c.name ILIKE :needle)\n          UNION ALL\n          SELECT 'invoice', i.id, i.branch_id, d.document_no, concat_ws(' \u00b7 ',j.job_no,v.number,c.name),\n            CASE WHEN lower(d.document_no)=lower(:exact) THEN 0 WHEN d.document_no ILIKE :prefix THEN 1 ELSE 2 END\n          FROM invoices i JOIN financial_documents d ON d.id=i.issued_document_id JOIN job_cards j ON j.id=i.job_card_id\n            JOIN visits visit ON visit.id=j.visit_id JOIN customers c ON c.id=visit.customer_id JOIN vehicles v ON v.id=visit.vehicle_id\n          WHERE NOT EXISTS (SELECT 1 FROM financial_document_events event WHERE event.document_id=d.id AND event.event_type='VOID')\n            {branch_filters['i']} AND (d.document_no ILIKE :needle OR j.job_no ILIKE :needle OR v.number ILIKE :needle OR c.name ILIKE :needle)\n        ) AS searchable WHERE entity = ANY(:entities) ORDER BY rank, entity, title, id LIMIT :limit\n    \"\"\"), values).mappings().all()\n    return {\"query\": q.strip(), \"results\": [{\"entity\": row[\"entity\"], \"id\": row[\"id\"], \"branchId\": str(row[\"branch_id\"]), \"title\": row[\"title\"], \"subtitle\": row[\"subtitle\"], \"rank\": row[\"rank\"]} for row in rows]}"
        }
      ]
    },
    {
      "file": "/app/app/intake.py",
      "functions": [
        {
          "name": "_clean",
          "line": 105,
          "end": 109,
          "body": "def _clean(value: str) -> str:\n    cleaned = value.strip()\n    if not cleaned:\n        raise auth_error(\"INVALID_INTAKE_INPUT\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    return cleaned"
        },
        {
          "name": "_require",
          "line": 112,
          "end": 125,
          "body": "def _require(scope: ScopedTenant, permission: str, *, mutation: bool = False) -> TenantScope:\n    _, current = scope\n    if current.actor_type == \"support_emulation\":\n        if mutation:\n            raise auth_error(\"TENANT_READ_ONLY\", status.HTTP_403_FORBIDDEN)\n        return current\n    if permission not in current.permissions:\n        raise auth_error(\"PERMISSION_DENIED\", status.HTTP_403_FORBIDDEN)\n    if mutation:\n        try:\n            require_mutation_allowed(current)\n        except PermissionError as error:\n            raise auth_error(\"TENANT_READ_ONLY\", status.HTTP_403_FORBIDDEN) from error\n    return current"
        },
        {
          "name": "_require_any",
          "line": 128,
          "end": 147,
          "body": "def _require_any(scope: ScopedTenant, permissions: tuple[str, ...], *, mutation: bool = False) -> TenantScope:\n    \"\"\"Allow intake from the existing Reception and Service workspaces.\n\n    Reception has Customer/Vehicle screens while Service works from My Queue.\n    The operation remains deny-by-default: at least one explicit page write or\n    read permission is required, and support emulation never mutates.\n    \"\"\"\n    _, current = scope\n    if current.actor_type == \"support_emulation\":\n        if mutation:\n            raise auth_error(\"TENANT_READ_ONLY\", status.HTTP_403_FORBIDDEN)\n        return current\n    if not any(permission in current.permissions for permission in permissions):\n        raise auth_error(\"PERMISSION_DENIED\", status.HTTP_403_FORBIDDEN)\n    if mutation:\n        try:\n            require_mutation_allowed(current)\n        except PermissionError as error:\n            raise auth_error(\"TENANT_READ_ONLY\", status.HTTP_403_FORBIDDEN) from error\n    return current"
        },
        {
          "name": "_branch",
          "line": 150,
          "end": 159,
          "body": "def _branch(current: TenantScope, branch_id: UUID | None) -> UUID:\n    if branch_id is None:\n        if len(current.branch_ids) != 1:\n            raise auth_error(\"BRANCH_REQUIRED\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n        return current.branch_ids[0]\n    try:\n        require_branch(current, branch_id)\n    except PermissionError as error:\n        raise auth_error(\"BRANCH_ACCESS_DENIED\", status.HTTP_403_FORBIDDEN) from error\n    return branch_id"
        },
        {
          "name": "_row_or_404",
          "line": 162,
          "end": 166,
          "body": "def _row_or_404(session, table: str, record_id: int) -> dict[str, object]:\n    row = session.execute(text(f\"SELECT * FROM {table} WHERE id = :id\"), {\"id\": record_id}).mappings().one_or_none()\n    if row is None:\n        raise auth_error(\"INTAKE_RECORD_NOT_FOUND\", status.HTTP_404_NOT_FOUND)\n    return dict(row)"
        },
        {
          "name": "_customer",
          "line": 169,
          "end": 170,
          "body": "def _customer(row: dict[str, object]) -> dict[str, object]:\n    return {\"id\": row[\"id\"], \"branchId\": str(row[\"branch_id\"]), \"name\": row[\"name\"], \"mobile\": row[\"mobile\"], \"type\": row[\"type\"], \"address\": row[\"address\"], \"archivedAt\": row[\"archived_at\"], \"createdAt\": row[\"created_at\"], \"updatedAt\": row[\"updated_at\"]}"
        },
        {
          "name": "_vehicle",
          "line": 173,
          "end": 174,
          "body": "def _vehicle(row: dict[str, object]) -> dict[str, object]:\n    return {\"id\": row[\"id\"], \"branchId\": str(row[\"branch_id\"]), \"customer_id\": row[\"customer_id\"], \"customerId\": row[\"customer_id\"], \"number\": row[\"number\"], \"make\": row[\"make\"], \"model\": row[\"model\"], \"color\": row[\"color\"], \"km\": row[\"km\"], \"engine_no\": row[\"engine_no\"], \"engineNo\": row[\"engine_no\"], \"archivedAt\": row[\"archived_at\"], \"createdAt\": row[\"created_at\"], \"updatedAt\": row[\"updated_at\"]}"
        },
        {
          "name": "_visit",
          "line": 177,
          "end": 178,
          "body": "def _visit(row: dict[str, object]) -> dict[str, object]:\n    return {\"id\": row[\"id\"], \"branchId\": str(row[\"branch_id\"]), \"customerId\": row[\"customer_id\"], \"vehicleId\": row[\"vehicle_id\"], \"advisorId\": str(row[\"advisor_id\"]) if row[\"advisor_id\"] else None, \"receivedBy\": str(row[\"received_by\"]), \"receivedAt\": row[\"received_at\"], \"fuel\": row[\"fuel\"], \"odoReading\": row[\"odo_reading\"], \"fuelLevelValue\": row[\"fuel_level_value\"], \"fuelLevelUnit\": row[\"fuel_level_unit\"], \"keys\": row[\"keys\"], \"accessories\": row[\"accessories\"], \"requestedWork\": row[\"requested_work\"], \"photosNote\": row[\"photos_note\"], \"archivedAt\": row[\"archived_at\"], \"createdAt\": row[\"created_at\"], \"updatedAt\": row[\"updated_at\"]}"
        },
        {
          "name": "_booking",
          "line": 181,
          "end": 189,
          "body": "def _booking(row: dict[str, object]) -> dict[str, object]:\n    return {\n        \"id\": row[\"id\"], \"branchId\": str(row[\"branch_id\"]), \"customerId\": row[\"customer_id\"],\n        \"vehicleId\": row[\"vehicle_id\"], \"bookingDate\": row[\"booking_date\"],\n        \"serviceType\": row[\"service_type\"], \"arrivalWindow\": row[\"arrival_window\"],\n        \"requestedWork\": row[\"requested_work\"], \"status\": row[\"status\"],\n        \"visitId\": row[\"visit_id\"], \"jobCardId\": row[\"job_card_id\"], \"arrivedAt\": row[\"arrived_at\"],\n        \"createdAt\": row[\"created_at\"], \"updatedAt\": row[\"updated_at\"],\n    }"
        },
        {
          "name": "_assert_active_customer",
          "line": 192,
          "end": 196,
          "body": "def _assert_active_customer(session, customer_id: int, branch_id: UUID) -> dict[str, object]:\n    row = _row_or_404(session, \"customers\", customer_id)\n    if row[\"branch_id\"] != branch_id or row[\"archived_at\"] is not None:\n        raise auth_error(\"CUSTOMER_NOT_AVAILABLE\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    return row"
        },
        {
          "name": "_assert_active_vehicle",
          "line": 199,
          "end": 203,
          "body": "def _assert_active_vehicle(session, vehicle_id: int, branch_id: UUID, customer_id: int) -> dict[str, object]:\n    row = _row_or_404(session, \"vehicles\", vehicle_id)\n    if row[\"branch_id\"] != branch_id or row[\"customer_id\"] != customer_id or row[\"archived_at\"] is not None:\n        raise auth_error(\"VEHICLE_NOT_AVAILABLE\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    return row"
        },
        {
          "name": "_booking_capacity",
          "line": 206,
          "end": 221,
          "body": "def _booking_capacity(session, current: TenantScope, branch_id: UUID, booking_date: date, service_type: BookingServiceType) -> tuple[int, int]:\n    \"\"\"Serialize one date/type allocation so simultaneous requests cannot oversell it.\"\"\"\n    lock_key = f\"{branch_id}:{booking_date.isoformat()}:{service_type}\"\n    session.execute(text(\"SELECT pg_advisory_xact_lock(hashtextextended(:lock_key, 0))\"), {\"lock_key\": lock_key})\n    limits = session.execute(text(\"\"\"\n        SELECT service_work_capacity, general_checkup_followup_capacity\n        FROM booking_capacity_limits\n        WHERE tenant_id=:tenant_id AND branch_id=:branch_id AND booking_date=:booking_date\n    \"\"\"), {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(branch_id), \"booking_date\": booking_date}).mappings().one_or_none()\n    limit = int(limits[\"service_work_capacity\"] if limits and service_type == \"Service Work\" else limits[\"general_checkup_followup_capacity\"] if limits else 10)\n    allocated = int(session.execute(text(\"\"\"\n        SELECT count(*) FROM bookings\n        WHERE tenant_id=:tenant_id AND branch_id=:branch_id AND booking_date=:booking_date\n          AND service_type=:service_type AND status IN ('BOOKED','CONFIRMED','RESCHEDULED')\n    \"\"\"), {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(branch_id), \"booking_date\": booking_date, \"service_type\": service_type}).scalar_one())\n    return allocated, limit"
        },
        {
          "name": "list_bookings",
          "line": 225,
          "end": 239,
          "body": "def list_bookings(scope: ScopedTenant, booking_date: date | None = Query(default=None, alias=\"bookingDate\"), branch_id: UUID | None = Query(default=None, alias=\"branchId\")) -> list[dict[str, object]]:\n    session, current = scope\n    _require_any(scope, (\"page.receive-vehicle.read\", \"page.my-queue.read\", \"page.advance-bookings.read\"))\n    if branch_id is not None:\n        _branch(current, branch_id)\n    clauses, parameters = [], {}\n    if branch_id is not None:\n        clauses.append(\"branch_id=:branch_id\")\n        parameters[\"branch_id\"] = str(branch_id)\n    if booking_date is not None:\n        clauses.append(\"booking_date=:booking_date\")\n        parameters[\"booking_date\"] = booking_date\n    where = f\" WHERE {' AND '.join(clauses)}\" if clauses else \"\"\n    rows = session.execute(text(f\"SELECT * FROM bookings{where} ORDER BY booking_date, id\"), parameters).mappings().all()\n    return [_booking(dict(row)) for row in rows]"
        },
        {
          "name": "create_booking",
          "line": 243,
          "end": 260,
          "body": "def create_booking(input: BookingCreate, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    branch_id = _branch(_require_any(scope, (\"page.receive-vehicle.write\", \"page.my-queue.write\", \"page.advance-bookings.write\"), mutation=True), input.branch_id)\n    _assert_active_customer(session, input.customer_id, branch_id)\n    _assert_active_vehicle(session, input.vehicle_id, branch_id, input.customer_id)\n    allocated, limit = _booking_capacity(session, current, branch_id, input.booking_date, input.service_type)\n    if allocated >= limit:\n        raise auth_error(\"BOOKING_CAPACITY_EXHAUSTED\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    row = session.execute(text(\"\"\"\n        INSERT INTO bookings (tenant_id,branch_id,customer_id,vehicle_id,booking_date,service_type,arrival_window,requested_work,created_by,updated_by)\n        VALUES (:tenant_id,:branch_id,:customer_id,:vehicle_id,:booking_date,:service_type,:arrival_window,:requested_work,:actor_id,:actor_id)\n        RETURNING *\n    \"\"\"), {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(branch_id), \"customer_id\": input.customer_id,\n             \"vehicle_id\": input.vehicle_id, \"booking_date\": input.booking_date, \"service_type\": input.service_type,\n             \"arrival_window\": input.arrival_window.strip(), \"requested_work\": _clean(input.requested_work), \"actor_id\": str(current.actor_id)}).mappings().one()\n    payload = _booking(dict(row))\n    _audit(session, current, \"BOOKING_CREATED\", \"Capacity-aware booking created\", {}, payload)\n    return payload"
        },
        {
          "name": "get_booking",
          "line": 264,
          "end": 270,
          "body": "def get_booking(booking_id: int, scope: ScopedTenant) -> dict[str, object]:\n    session, _ = scope\n    _require_any(scope, (\"page.receive-vehicle.read\", \"page.my-queue.read\", \"page.advance-bookings.read\"))\n    row = session.execute(text(\"SELECT * FROM bookings WHERE id=:id\"), {\"id\": booking_id}).mappings().one_or_none()\n    if row is None:\n        raise auth_error(\"BOOKING_NOT_FOUND\", status.HTTP_404_NOT_FOUND)\n    return _booking(dict(row))"
        },
        {
          "name": "check_in_booking",
          "line": 274,
          "end": 331,
          "body": "def check_in_booking(booking_id: int, input: BookingCheckIn, scope: ScopedTenant) -> dict[str, object]:\n    \"\"\"Atomically turn one arrival into its durable Visit and routed Job Card.\"\"\"\n    session, current = scope\n    _require_any(scope, (\"page.receive-vehicle.write\", \"page.job-card.write\", \"page.my-queue.write\", \"page.advance-bookings.write\"), mutation=True)\n    booking_row = session.execute(text(\"SELECT * FROM bookings WHERE id=:id FOR UPDATE\"), {\"id\": booking_id}).mappings().one_or_none()\n    if booking_row is None:\n        raise auth_error(\"BOOKING_NOT_FOUND\", status.HTTP_404_NOT_FOUND)\n    booking = dict(booking_row)\n    if booking[\"status\"] not in (\"BOOKED\", \"CONFIRMED\", \"RESCHEDULED\"):\n        raise auth_error(\"BOOKING_CHECK_IN_NOT_ALLOWED\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    branch_id = UUID(str(booking[\"branch_id\"]))\n    # Import lazily because the Job router already depends on the intake helpers above.\n    from app.jobs import _job_with_estimates, _record_assignment\n    department_id, manager_id = input.department_id, input.responsible_manager_id\n    if (department_id is None) != (manager_id is None):\n        raise auth_error(\"BOOKING_ROUTING_REQUIRED\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    route_filter = \"\" if department_id is None else \"AND d.id=:department_id AND membership.user_id=:manager_id\"\n    routes = session.execute(text(f\"\"\"\n            SELECT d.id AS department_id, membership.user_id AS manager_id\n            FROM service_departments d\n            JOIN service_department_managers manager_link ON manager_link.department_id=d.id\n            JOIN tenant_memberships membership ON membership.id=manager_link.manager_membership_id AND membership.status='ACTIVE'\n            JOIN membership_branches branch_membership ON branch_membership.membership_id=membership.id AND branch_membership.branch_id=d.branch_id\n            JOIN membership_roles roles ON roles.membership_id=membership.id\n            JOIN tenant_roles role ON role.id=roles.role_id AND role.system_key='service_manager' AND role.status='ACTIVE'\n            WHERE d.tenant_id=:tenant_id AND d.branch_id=:branch_id AND d.status='ACTIVE'\n              {route_filter}\n            ORDER BY d.name, membership.user_id LIMIT 2\n        \"\"\"), {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(branch_id), \"department_id\": str(department_id) if department_id else None, \"manager_id\": str(manager_id) if manager_id else None}).mappings().all()\n    if len(routes) != 1:\n        raise auth_error(\"BOOKING_ROUTING_REQUIRED\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    department_id, manager_id = UUID(str(routes[0][\"department_id\"])), UUID(str(routes[0][\"manager_id\"]))\n    visit_row = session.execute(text(\"\"\"\n        INSERT INTO visits (tenant_id,branch_id,customer_id,vehicle_id,received_by,fuel,odo_reading,fuel_level_value,fuel_level_unit,keys,accessories,requested_work,photos_note)\n        VALUES (:tenant_id,:branch_id,:customer_id,:vehicle_id,:actor_id,:fuel,:odo_reading,:fuel_level_value,:fuel_level_unit,:keys,:accessories,:requested_work,:photos_note)\n        RETURNING *\n    \"\"\"), {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(branch_id), \"customer_id\": booking[\"customer_id\"],\n             \"vehicle_id\": booking[\"vehicle_id\"], \"actor_id\": str(current.actor_id), \"fuel\": _clean(input.fuel),\n             \"odo_reading\": input.odo_reading, \"fuel_level_value\": input.fuel_level_value.strip(), \"fuel_level_unit\": input.fuel_level_unit.strip(),\n             \"keys\": input.keys.strip(), \"accessories\": input.accessories.strip(), \"requested_work\": _clean(input.requested_work),\n             \"photos_note\": input.photos_note.strip()}).mappings().one()\n    job_row = session.execute(text(\"\"\"\n        INSERT INTO job_cards (tenant_id,branch_id,job_no,visit_id,department_id,responsible_manager_id,assignment_state,status,work_list,created_by,updated_by)\n        VALUES (:tenant_id,:branch_id,'PENDING',:visit_id,:department_id,:manager_id,'AWAITING_ADVISOR_ASSIGNMENT','NEW',:work_list,:actor_id,:actor_id)\n        RETURNING *\n    \"\"\"), {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(branch_id), \"visit_id\": visit_row[\"id\"],\n             \"department_id\": str(department_id), \"manager_id\": str(manager_id),\n             \"work_list\": _clean(input.requested_work), \"actor_id\": str(current.actor_id)}).mappings().one()\n    job_row = session.execute(text(\"UPDATE job_cards SET job_no=:job_no,updated_at=now() WHERE id=:id RETURNING *\"), {\"id\": job_row[\"id\"], \"job_no\": f\"JC-{int(job_row['id']):06d}\"}).mappings().one()\n    _record_assignment(session, current, int(job_row[\"id\"]), branch_id, department_id, manager_id, None, \"ROUTED_TO_MANAGER\", \"Booking checked in; awaiting advisor assignment\")\n    updated = session.execute(text(\"\"\"\n        UPDATE bookings SET status='ARRIVED',visit_id=:visit_id,job_card_id=:job_card_id,arrived_at=now(),updated_by=:actor_id,updated_at=now()\n        WHERE id=:id RETURNING *\n    \"\"\"), {\"id\": booking_id, \"visit_id\": visit_row[\"id\"], \"job_card_id\": job_row[\"id\"], \"actor_id\": str(current.actor_id)}).mappings().one()\n    booking_payload = _booking(dict(updated))\n    job_payload = _job_with_estimates(session, int(job_row[\"id\"]))\n    _audit(session, current, \"BOOKING_CHECKED_IN\", \"Booking checked in to Visit and Job Card\", _booking(booking), {\"booking\": booking_payload, \"visit\": _visit(dict(visit_row)), \"job\": job_payload})\n    return {\"booking\": booking_payload, \"visit\": _visit(dict(visit_row)), \"job\": job_payload}"
        },
        {
          "name": "list_customers",
          "line": 335,
          "end": 347,
          "body": "def list_customers(scope: ScopedTenant, q: str = \"\", archived: bool = False, branch_id: UUID | None = Query(default=None, alias=\"branchId\")) -> list[dict[str, object]]:\n    session, current = scope\n    _require_any(scope, (\"page.customers.read\", \"page.my-queue.read\"))\n    if branch_id is not None:\n        _branch(current, branch_id)\n    rows = session.execute(text(\"\"\"\n        SELECT * FROM customers\n        WHERE (:archived = (archived_at IS NOT NULL))\n          AND (CAST(:branch_id AS uuid) IS NULL OR branch_id = :branch_id)\n          AND (:q = '' OR name ILIKE :needle OR mobile ILIKE :needle)\n        ORDER BY name, id\n    \"\"\"), {\"archived\": archived, \"branch_id\": str(branch_id) if branch_id else None, \"q\": q.strip(), \"needle\": f\"%{q.strip()}%\"}).mappings().all()\n    return [_customer(dict(row)) for row in rows]"
        },
        {
          "name": "create_customer",
          "line": 351,
          "end": 359,
          "body": "def create_customer(input: CustomerInput, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    branch_id = _branch(_require_any(scope, (\"page.customers.write\", \"page.my-queue.write\"), mutation=True), input.branch_id)\n    row = session.execute(text(\"\"\"\n        INSERT INTO customers (tenant_id, branch_id, name, mobile, type, address, created_by, updated_by)\n        VALUES (:tenant_id, :branch_id, :name, :mobile, :type, :address, :actor_id, :actor_id) RETURNING *\n    \"\"\"), {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(branch_id), \"name\": _clean(input.name), \"mobile\": _clean(input.mobile), \"type\": _clean(input.type), \"address\": input.address.strip(), \"actor_id\": str(current.actor_id)}).mappings().one()\n    payload = _customer(dict(row)); _audit(session, current, \"CUSTOMER_CREATED\", \"Customer created\", {}, payload)\n    return payload"
        },
        {
          "name": "get_customer",
          "line": 363,
          "end": 365,
          "body": "def get_customer(customer_id: int, scope: ScopedTenant) -> dict[str, object]:\n    session, _ = scope; _require_any(scope, (\"page.customers.read\", \"page.my-queue.read\"))\n    return _customer(_row_or_404(session, \"customers\", customer_id))"
        },
        {
          "name": "update_customer",
          "line": 369,
          "end": 376,
          "body": "def update_customer(customer_id: int, input: CustomerInput, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope; _require_any(scope, (\"page.customers.write\", \"page.my-queue.write\"), mutation=True)\n    before = _row_or_404(session, \"customers\", customer_id)\n    if before[\"archived_at\"] is not None or before[\"branch_id\"] != _branch(current, input.branch_id or before[\"branch_id\"]):\n        raise auth_error(\"CUSTOMER_NOT_AVAILABLE\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    row = session.execute(text(\"\"\"UPDATE customers SET name=:name, mobile=:mobile, type=:type, address=:address, updated_by=:actor_id, updated_at=now() WHERE id=:id RETURNING *\"\"\"), {\"id\": customer_id, \"name\": _clean(input.name), \"mobile\": _clean(input.mobile), \"type\": _clean(input.type), \"address\": input.address.strip(), \"actor_id\": str(current.actor_id)}).mappings().one()\n    payload = _customer(dict(row)); _audit(session, current, \"CUSTOMER_UPDATED\", \"Customer updated\", _customer(before), payload)\n    return payload"
        },
        {
          "name": "archive_customer",
          "line": 380,
          "end": 387,
          "body": "def archive_customer(customer_id: int, input: ArchiveInput, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope; _require_any(scope, (\"page.customers.write\", \"page.my-queue.write\"), mutation=True)\n    before = _row_or_404(session, \"customers\", customer_id)\n    if before[\"archived_at\"] is not None:\n        raise auth_error(\"INTAKE_RECORD_ARCHIVED\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    row = session.execute(text(\"\"\"UPDATE customers SET archived_at=now(), archived_by=:actor_id, archive_reason=:reason, updated_by=:actor_id, updated_at=now() WHERE id=:id RETURNING *\"\"\"), {\"id\": customer_id, \"reason\": _clean(input.reason), \"actor_id\": str(current.actor_id)}).mappings().one()\n    payload = _customer(dict(row)); _audit(session, current, \"CUSTOMER_ARCHIVED\", input.reason.strip(), _customer(before), payload)\n    return payload"
        },
        {
          "name": "list_vehicles",
          "line": 391,
          "end": 395,
          "body": "def list_vehicles(scope: ScopedTenant, q: str = \"\", archived: bool = False, branch_id: UUID | None = Query(default=None, alias=\"branchId\")) -> list[dict[str, object]]:\n    session, current = scope; _require_any(scope, (\"page.vehicles.read\", \"page.my-queue.read\"))\n    if branch_id is not None: _branch(current, branch_id)\n    rows = session.execute(text(\"\"\"SELECT * FROM vehicles WHERE (:archived = (archived_at IS NOT NULL)) AND (CAST(:branch_id AS uuid) IS NULL OR branch_id=:branch_id) AND (:q='' OR number ILIKE :needle OR make ILIKE :needle OR model ILIKE :needle) ORDER BY number, id\"\"\"), {\"archived\": archived, \"branch_id\": str(branch_id) if branch_id else None, \"q\": q.strip(), \"needle\": f\"%{q.strip()}%\"}).mappings().all()\n    return [_vehicle(dict(row)) for row in rows]"
        },
        {
          "name": "create_vehicle",
          "line": 399,
          "end": 404,
          "body": "def create_vehicle(input: VehicleInput, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope; branch_id = _branch(_require_any(scope, (\"page.vehicles.write\", \"page.my-queue.write\"), mutation=True), input.branch_id)\n    _assert_active_customer(session, input.customer_id, branch_id)\n    row = session.execute(text(\"\"\"INSERT INTO vehicles (tenant_id, branch_id, customer_id, number, make, model, color, km, engine_no, created_by, updated_by) VALUES (:tenant_id,:branch_id,:customer_id,:number,:make,:model,:color,:km,:engine_no,:actor_id,:actor_id) RETURNING *\"\"\"), {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(branch_id), \"customer_id\": input.customer_id, \"number\": _clean(input.number).upper(), \"make\": _clean(input.make), \"model\": _clean(input.model), \"color\": input.color.strip(), \"km\": input.km, \"engine_no\": input.engine_no.strip(), \"actor_id\": str(current.actor_id)}).mappings().one()\n    payload = _vehicle(dict(row)); _audit(session, current, \"VEHICLE_CREATED\", \"Vehicle created\", {}, payload)\n    return payload"
        },
        {
          "name": "get_vehicle",
          "line": 408,
          "end": 410,
          "body": "def get_vehicle(vehicle_id: int, scope: ScopedTenant) -> dict[str, object]:\n    session, _ = scope; _require_any(scope, (\"page.vehicles.read\", \"page.my-queue.read\"))\n    return _vehicle(_row_or_404(session, \"vehicles\", vehicle_id))"
        },
        {
          "name": "update_vehicle",
          "line": 414,
          "end": 421,
          "body": "def update_vehicle(vehicle_id: int, input: VehicleInput, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope; _require_any(scope, (\"page.vehicles.write\", \"page.my-queue.write\"), mutation=True)\n    before = _row_or_404(session, \"vehicles\", vehicle_id); branch_id = _branch(current, input.branch_id or before[\"branch_id\"])\n    if before[\"archived_at\"] is not None or before[\"branch_id\"] != branch_id: raise auth_error(\"VEHICLE_NOT_AVAILABLE\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    _assert_active_customer(session, input.customer_id, branch_id)\n    row = session.execute(text(\"\"\"UPDATE vehicles SET customer_id=:customer_id, number=:number, make=:make, model=:model, color=:color, km=:km, engine_no=:engine_no, updated_by=:actor_id, updated_at=now() WHERE id=:id RETURNING *\"\"\"), {\"id\": vehicle_id, \"customer_id\": input.customer_id, \"number\": _clean(input.number).upper(), \"make\": _clean(input.make), \"model\": _clean(input.model), \"color\": input.color.strip(), \"km\": input.km, \"engine_no\": input.engine_no.strip(), \"actor_id\": str(current.actor_id)}).mappings().one()\n    payload = _vehicle(dict(row)); _audit(session, current, \"VEHICLE_UPDATED\", \"Vehicle updated\", _vehicle(before), payload)\n    return payload"
        },
        {
          "name": "archive_vehicle",
          "line": 425,
          "end": 430,
          "body": "def archive_vehicle(vehicle_id: int, input: ArchiveInput, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope; _require_any(scope, (\"page.vehicles.write\", \"page.my-queue.write\"), mutation=True); before = _row_or_404(session, \"vehicles\", vehicle_id)\n    if before[\"archived_at\"] is not None: raise auth_error(\"INTAKE_RECORD_ARCHIVED\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    row = session.execute(text(\"\"\"UPDATE vehicles SET archived_at=now(), archived_by=:actor_id, archive_reason=:reason, updated_by=:actor_id, updated_at=now() WHERE id=:id RETURNING *\"\"\"), {\"id\": vehicle_id, \"reason\": _clean(input.reason), \"actor_id\": str(current.actor_id)}).mappings().one()\n    payload = _vehicle(dict(row)); _audit(session, current, \"VEHICLE_ARCHIVED\", input.reason.strip(), _vehicle(before), payload)\n    return payload"
        },
        {
          "name": "list_visits",
          "line": 434,
          "end": 438,
          "body": "def list_visits(scope: ScopedTenant, q: str = \"\", archived: bool = False, branch_id: UUID | None = Query(default=None, alias=\"branchId\")) -> list[dict[str, object]]:\n    session, current = scope; _require_any(scope, (\"page.receive-vehicle.read\", \"page.customers.read\", \"page.my-queue.read\"))\n    if branch_id is not None: _branch(current, branch_id)\n    rows = session.execute(text(\"\"\"SELECT v.* FROM visits v JOIN customers c ON c.id=v.customer_id JOIN vehicles h ON h.id=v.vehicle_id WHERE (:archived = (v.archived_at IS NOT NULL)) AND (CAST(:branch_id AS uuid) IS NULL OR v.branch_id=:branch_id) AND (:q='' OR c.name ILIKE :needle OR c.mobile ILIKE :needle OR h.number ILIKE :needle OR v.requested_work ILIKE :needle) ORDER BY v.received_at DESC, v.id DESC\"\"\"), {\"archived\": archived, \"branch_id\": str(branch_id) if branch_id else None, \"q\": q.strip(), \"needle\": f\"%{q.strip()}%\"}).mappings().all()\n    return [_visit(dict(row)) for row in rows]"
        },
        {
          "name": "create_visit",
          "line": 442,
          "end": 447,
          "body": "def create_visit(input: VisitCreate, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope; branch_id = _branch(_require_any(scope, (\"page.receive-vehicle.write\", \"page.customers.write\", \"page.my-queue.write\"), mutation=True), input.branch_id)\n    _assert_active_customer(session, input.customer_id, branch_id); _assert_active_vehicle(session, input.vehicle_id, branch_id, input.customer_id)\n    row = session.execute(text(\"\"\"INSERT INTO visits (tenant_id,branch_id,customer_id,vehicle_id,advisor_id,received_by,fuel,odo_reading,fuel_level_value,fuel_level_unit,keys,accessories,requested_work,photos_note) VALUES (:tenant_id,:branch_id,:customer_id,:vehicle_id,:advisor_id,:actor_id,:fuel,:odo_reading,:fuel_level_value,:fuel_level_unit,:keys,:accessories,:requested_work,:photos_note) RETURNING *\"\"\"), {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(branch_id), \"customer_id\": input.customer_id, \"vehicle_id\": input.vehicle_id, \"advisor_id\": str(input.advisor_id) if input.advisor_id else None, \"actor_id\": str(current.actor_id), \"fuel\": _clean(input.fuel), \"odo_reading\": input.odo_reading, \"fuel_level_value\": input.fuel_level_value.strip(), \"fuel_level_unit\": input.fuel_level_unit.strip(), \"keys\": input.keys.strip(), \"accessories\": input.accessories.strip(), \"requested_work\": _clean(input.requested_work), \"photos_note\": input.photos_note.strip()}).mappings().one()\n    payload = _visit(dict(row)); _audit(session, current, \"VISIT_CREATED\", \"Vehicle received\", {}, payload)\n    return payload"
        },
        {
          "name": "get_visit",
          "line": 451,
          "end": 453,
          "body": "def get_visit(visit_id: int, scope: ScopedTenant) -> dict[str, object]:\n    session, _ = scope; _require_any(scope, (\"page.receive-vehicle.read\", \"page.customers.read\", \"page.my-queue.read\"))\n    return _visit(_row_or_404(session, \"visits\", visit_id))"
        },
        {
          "name": "update_visit",
          "line": 457,
          "end": 462,
          "body": "def update_visit(visit_id: int, input: VisitUpdate, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope; _require_any(scope, (\"page.receive-vehicle.write\", \"page.customers.write\", \"page.my-queue.write\"), mutation=True); before = _row_or_404(session, \"visits\", visit_id)\n    if before[\"archived_at\"] is not None: raise auth_error(\"INTAKE_RECORD_ARCHIVED\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    row = session.execute(text(\"\"\"UPDATE visits SET advisor_id=:advisor_id,fuel=:fuel,odo_reading=:odo_reading,fuel_level_value=:fuel_level_value,fuel_level_unit=:fuel_level_unit,keys=:keys,accessories=:accessories,requested_work=:requested_work,photos_note=:photos_note,updated_at=now() WHERE id=:id RETURNING *\"\"\"), {\"id\": visit_id, \"advisor_id\": str(input.advisor_id) if input.advisor_id else None, \"fuel\": _clean(input.fuel), \"odo_reading\": input.odo_reading, \"fuel_level_value\": input.fuel_level_value.strip(), \"fuel_level_unit\": input.fuel_level_unit.strip(), \"keys\": input.keys.strip(), \"accessories\": input.accessories.strip(), \"requested_work\": _clean(input.requested_work), \"photos_note\": input.photos_note.strip()}).mappings().one()\n    payload = _visit(dict(row)); _audit(session, current, \"VISIT_UPDATED\", \"Visit updated\", _visit(before), payload)\n    return payload"
        },
        {
          "name": "archive_visit",
          "line": 466,
          "end": 471,
          "body": "def archive_visit(visit_id: int, input: ArchiveInput, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope; _require_any(scope, (\"page.receive-vehicle.write\", \"page.customers.write\", \"page.my-queue.write\"), mutation=True); before = _row_or_404(session, \"visits\", visit_id)\n    if before[\"archived_at\"] is not None: raise auth_error(\"INTAKE_RECORD_ARCHIVED\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    row = session.execute(text(\"\"\"UPDATE visits SET archived_at=now(),archived_by=:actor_id,archive_reason=:reason,updated_at=now() WHERE id=:id RETURNING *\"\"\"), {\"id\": visit_id, \"reason\": _clean(input.reason), \"actor_id\": str(current.actor_id)}).mappings().one()\n    payload = _visit(dict(row)); _audit(session, current, \"VISIT_ARCHIVED\", input.reason.strip(), _visit(before), payload)\n    return payload"
        }
      ]
    },
    {
      "file": "/app/app/inventory.py",
      "functions": [
        {
          "name": "_permission",
          "line": 115,
          "end": 117,
          "body": "def _permission(scope: ScopedTenant, *, mutation: bool) -> TenantScope:\n    verb = \"write\" if mutation else \"read\"\n    return _require_any(scope, (f\"page.stock.{verb}\", f\"page.inward-purchases.{verb}\"), mutation=mutation)"
        },
        {
          "name": "_purchase_admin",
          "line": 120,
          "end": 124,
          "body": "def _purchase_admin(scope: ScopedTenant) -> TenantScope:\n    current = _permission(scope, mutation=True)\n    if not any(name == \"Owner/Admin\" for _, name, _ in current.roles):\n        raise auth_error(\"PURCHASE_DELIVERY_ADMIN_REQUIRED\", status.HTTP_403_FORBIDDEN)\n    return current"
        },
        {
          "name": "_adjustment_quantity",
          "line": 127,
          "end": 130,
          "body": "def _adjustment_quantity(quantity: float) -> float:\n    if quantity == 0:\n        raise auth_error(\"STOCK_ADJUSTMENT_ZERO\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    return quantity"
        },
        {
          "name": "_row_or_404",
          "line": 133,
          "end": 137,
          "body": "def _row_or_404(session, table: str, record_id: int, code: str) -> dict[str, object]:\n    row = session.execute(text(f\"SELECT * FROM {table} WHERE id=:id\"), {\"id\": record_id}).mappings().one_or_none()\n    if row is None:\n        raise auth_error(code, status.HTTP_404_NOT_FOUND)\n    return dict(row)"
        },
        {
          "name": "_locked_purchase",
          "line": 140,
          "end": 144,
          "body": "def _locked_purchase(session, purchase_id: int) -> dict[str, object]:\n    row = session.execute(text(\"SELECT * FROM purchase_orders WHERE id=:id FOR UPDATE\"), {\"id\": purchase_id}).mappings().one_or_none()\n    if row is None:\n        raise auth_error(\"PURCHASE_ORDER_NOT_FOUND\", status.HTTP_404_NOT_FOUND)\n    return dict(row)"
        },
        {
          "name": "_catalogue",
          "line": 147,
          "end": 148,
          "body": "def _catalogue(row: dict[str, object]) -> dict[str, object]:\n    return {\"id\": row[\"id\"], \"branchId\": str(row[\"branch_id\"]), \"sku\": row[\"sku\"], \"category\": row[\"category\"], \"name\": row[\"name\"], \"unit\": row[\"unit\"], \"lowStockQty\": float(row[\"low_stock_qty\"]), \"sellingPrice\": float(row[\"selling_price\"]), \"onHand\": float(row.get(\"on_hand\") or 0), \"archivedAt\": row[\"archived_at\"], \"createdAt\": row[\"created_at\"], \"updatedAt\": row[\"updated_at\"]}"
        },
        {
          "name": "_supplier",
          "line": 151,
          "end": 152,
          "body": "def _supplier(row: dict[str, object]) -> dict[str, object]:\n    return {\"id\": row[\"id\"], \"branchId\": str(row[\"branch_id\"]), \"name\": row[\"name\"], \"mobile\": row[\"mobile\"], \"email\": row[\"email\"], \"address\": row[\"address\"], \"archivedAt\": row[\"archived_at\"], \"createdAt\": row[\"created_at\"], \"updatedAt\": row[\"updated_at\"]}"
        },
        {
          "name": "_line",
          "line": 155,
          "end": 156,
          "body": "def _line(row: dict[str, object]) -> dict[str, object]:\n    return {\"id\": row[\"id\"], \"itemId\": row[\"item_id\"], \"lineNo\": row[\"line_no\"], \"orderedQty\": float(row[\"ordered_qty\"]), \"unitCost\": float(row[\"unit_cost\"]), \"discount\": float(row[\"discount\"]), \"gstRate\": float(row[\"gst_rate\"]), \"receivedQty\": float(row.get(\"received_qty\") or 0), \"deliveredQty\": float(row.get(\"delivered_qty\") or 0), \"acceptedQty\": float(row.get(\"accepted_qty\") or 0), \"rejectedQty\": float(row.get(\"rejected_qty\") or 0)}"
        },
        {
          "name": "_purchase",
          "line": 159,
          "end": 161,
          "body": "def _purchase(row: dict[str, object], lines: list[dict[str, object]] | None = None) -> dict[str, object]:\n    payload = {\"id\": row[\"id\"], \"branchId\": str(row[\"branch_id\"]), \"supplierId\": row[\"supplier_id\"], \"poNumber\": row[\"po_number\"], \"orderDate\": row[\"order_date\"], \"status\": row[\"status\"], \"notes\": row[\"notes\"], \"createdAt\": row[\"created_at\"], \"updatedAt\": row[\"updated_at\"]}\n    return {**payload, **({\"lines\": lines} if lines is not None else {})}"
        },
        {
          "name": "_inward",
          "line": 164,
          "end": 165,
          "body": "def _inward(row: dict[str, object]) -> dict[str, object]:\n    return {\"id\": row[\"id\"], \"branchId\": str(row[\"branch_id\"]), \"itemId\": row[\"item_id\"], \"purchaseOrderId\": row[\"purchase_order_id\"], \"purchaseOrderLineId\": row[\"purchase_order_line_id\"], \"qty\": float(row[\"qty\"]), \"unitCost\": float(row[\"unit_cost\"]), \"note\": row[\"note\"], \"receivedBy\": str(row[\"received_by\"]), \"receivedAt\": row[\"received_at\"]}"
        },
        {
          "name": "_delivery_receipt",
          "line": 168,
          "end": 171,
          "body": "def _delivery_receipt(session, receipt_id: int) -> dict[str, object]:\n    receipt = _row_or_404(session, \"purchase_order_delivery_receipts\", receipt_id, \"PURCHASE_DELIVERY_RECEIPT_NOT_FOUND\")\n    lines = session.execute(text(\"SELECT * FROM purchase_order_delivery_receipt_lines WHERE receipt_id=:id ORDER BY id\"), {\"id\": receipt_id}).mappings().all()\n    return {\"id\": receipt[\"id\"], \"purchaseOrderId\": receipt[\"purchase_order_id\"], \"requestKey\": receipt[\"request_key\"], \"note\": receipt[\"note\"], \"receivedAt\": receipt[\"received_at\"], \"lines\": [{\"lineId\": row[\"purchase_order_line_id\"], \"deliveredQty\": float(row[\"delivered_qty\"])} for row in lines]}"
        },
        {
          "name": "_delivery_confirmations",
          "line": 174,
          "end": 176,
          "body": "def _delivery_confirmations(session, purchase_id: int, request_key: str) -> list[dict[str, object]]:\n    rows = session.execute(text(\"SELECT * FROM purchase_order_delivery_confirmations WHERE purchase_order_id=:purchase AND request_key=:key ORDER BY purchase_order_line_id\"), {\"purchase\": purchase_id, \"key\": request_key}).mappings().all()\n    return [{\"id\": row[\"id\"], \"lineId\": row[\"purchase_order_line_id\"], \"acceptedQty\": float(row[\"accepted_qty\"]), \"rejectedQty\": float(row[\"rejected_qty\"]), \"rejectionReason\": row[\"rejection_reason\"], \"confirmedAt\": row[\"confirmed_at\"]} for row in rows]"
        },
        {
          "name": "_item_available",
          "line": 179,
          "end": 183,
          "body": "def _item_available(session, item_id: int, branch_id: UUID) -> dict[str, object]:\n    row = _row_or_404(session, \"catalogue_items\", item_id, \"CATALOGUE_ITEM_NOT_FOUND\")\n    if row[\"branch_id\"] != branch_id or row[\"archived_at\"] is not None:\n        raise auth_error(\"CATALOGUE_ITEM_NOT_AVAILABLE\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    return row"
        },
        {
          "name": "_supplier_available",
          "line": 186,
          "end": 190,
          "body": "def _supplier_available(session, supplier_id: int, branch_id: UUID) -> dict[str, object]:\n    row = _row_or_404(session, \"suppliers\", supplier_id, \"SUPPLIER_NOT_FOUND\")\n    if row[\"branch_id\"] != branch_id or row[\"archived_at\"] is not None:\n        raise auth_error(\"SUPPLIER_NOT_AVAILABLE\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    return row"
        },
        {
          "name": "_purchase_with_lines",
          "line": 193,
          "end": 203,
          "body": "def _purchase_with_lines(session, purchase_id: int) -> dict[str, object]:\n    purchase = _row_or_404(session, \"purchase_orders\", purchase_id, \"PURCHASE_ORDER_NOT_FOUND\")\n    rows = session.execute(text(\"\"\"SELECT line.*, COALESCE(inwards.received_qty, 0) AS received_qty,\n            COALESCE(deliveries.delivered_qty, 0) AS delivered_qty, COALESCE(confirmations.accepted_qty, 0) AS accepted_qty,\n            COALESCE(confirmations.rejected_qty, 0) AS rejected_qty\n        FROM purchase_order_lines line\n        LEFT JOIN LATERAL (SELECT SUM(qty) received_qty FROM stock_inwards WHERE purchase_order_line_id=line.id) inwards ON true\n        LEFT JOIN LATERAL (SELECT SUM(receipt_line.delivered_qty) delivered_qty FROM purchase_order_delivery_receipt_lines receipt_line WHERE receipt_line.purchase_order_line_id=line.id) deliveries ON true\n        LEFT JOIN LATERAL (SELECT SUM(accepted_qty) accepted_qty,SUM(rejected_qty) rejected_qty FROM purchase_order_delivery_confirmations WHERE purchase_order_line_id=line.id) confirmations ON true\n        WHERE line.purchase_order_id=:id ORDER BY line.line_no\"\"\"), {\"id\": purchase_id}).mappings().all()\n    return _purchase(purchase, [_line(dict(row)) for row in rows])"
        },
        {
          "name": "_replace_lines",
          "line": 206,
          "end": 215,
          "body": "def _replace_lines(session, current: TenantScope, purchase_id: int, branch_id: UUID, lines: list[PurchaseLineInput]) -> None:\n    seen: set[int] = set()\n    for line in lines:\n        if line.item_id in seen:\n            raise auth_error(\"DUPLICATE_PURCHASE_ITEM\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n        seen.add(line.item_id); _item_available(session, line.item_id, branch_id)\n    session.execute(text(\"DELETE FROM purchase_order_lines WHERE purchase_order_id=:id\"), {\"id\": purchase_id})\n    for index, line in enumerate(lines, 1):\n        session.execute(text(\"\"\"INSERT INTO purchase_order_lines (tenant_id,branch_id,purchase_order_id,item_id,line_no,ordered_qty,unit_cost,discount,gst_rate)\n            VALUES (:tenant_id,:branch_id,:purchase_order_id,:item_id,:line_no,:ordered_qty,:unit_cost,:discount,:gst_rate)\"\"\"), {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(branch_id), \"purchase_order_id\": purchase_id, \"item_id\": line.item_id, \"line_no\": index, \"ordered_qty\": line.ordered_qty, \"unit_cost\": line.unit_cost, \"discount\": line.discount, \"gst_rate\": line.gst_rate})"
        },
        {
          "name": "_reconcile_purchase",
          "line": 218,
          "end": 227,
          "body": "def _reconcile_purchase(session, purchase_id: int) -> None:\n    rows = session.execute(text(\"\"\"SELECT line.ordered_qty, COALESCE(SUM(inward.qty),0) received\n        FROM purchase_order_lines line LEFT JOIN stock_inwards inward ON inward.purchase_order_line_id=line.id\n        WHERE line.purchase_order_id=:id GROUP BY line.id\"\"\"), {\"id\": purchase_id}).mappings().all()\n    if not rows:\n        return\n    received = [float(row[\"received\"]) for row in rows]\n    ordered = [float(row[\"ordered_qty\"]) for row in rows]\n    next_status = \"READY_TO_CLOSE\" if all(got >= expected for got, expected in zip(received, ordered)) else \"PARTIALLY_RECEIVED\" if any(got > 0 for got in received) else \"SENT\"\n    session.execute(text(\"UPDATE purchase_orders SET status=:status,updated_at=now() WHERE id=:id\"), {\"id\": purchase_id, \"status\": next_status})"
        },
        {
          "name": "list_catalogue",
          "line": 231,
          "end": 245,
          "body": "def list_catalogue(scope: ScopedTenant, q: str = \"\", archived: bool = False, branch_id: UUID | None = Query(default=None, alias=\"branchId\")) -> list[dict[str, object]]:\n    session, current = scope; _permission(scope, mutation=False)\n    if branch_id is not None: _branch(current, branch_id)\n    clauses = [\"item.archived_at IS NOT NULL\" if archived else \"item.archived_at IS NULL\"]\n    params: dict[str, object] = {}\n    if branch_id is not None:\n        clauses.append(\"item.branch_id=:branch_id\")\n        params[\"branch_id\"] = str(branch_id)\n    if needle := q.strip():\n        clauses.append(\"(item.sku ILIKE :needle OR item.name ILIKE :needle OR item.category ILIKE :needle)\")\n        params[\"needle\"] = f\"%{needle}%\"\n    rows = session.execute(text(f\"\"\"SELECT item.*, COALESCE(SUM(ledger.quantity),0) on_hand FROM catalogue_items item\n        LEFT JOIN stock_ledger ledger ON ledger.item_id=item.id WHERE {' AND '.join(clauses)}\n        GROUP BY item.id ORDER BY item.name,item.id\"\"\"), params).mappings().all()\n    return [_catalogue(dict(row)) for row in rows]"
        },
        {
          "name": "create_catalogue",
          "line": 249,
          "end": 253,
          "body": "def create_catalogue(input: CatalogueItemInput, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope; branch_id = _branch(_permission(scope, mutation=True), input.branch_id)\n    row = session.execute(text(\"\"\"INSERT INTO catalogue_items (tenant_id,branch_id,sku,category,name,unit,low_stock_qty,selling_price,created_by,updated_by)\n        VALUES (:tenant_id,:branch_id,:sku,:category,:name,:unit,:low_stock_qty,:selling_price,:actor_id,:actor_id) RETURNING *\"\"\"), {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(branch_id), \"sku\": _clean(input.sku).upper(), \"category\": input.category.strip(), \"name\": _clean(input.name), \"unit\": _clean(input.unit), \"low_stock_qty\": input.low_stock_qty, \"selling_price\": input.selling_price, \"actor_id\": str(current.actor_id)}).mappings().one()\n    payload = _catalogue(dict(row)); _audit(session, current, \"CATALOGUE_ITEM_CREATED\", \"Catalogue item created\", {}, payload); return payload"
        },
        {
          "name": "update_catalogue",
          "line": 257,
          "end": 261,
          "body": "def update_catalogue(item_id: int, input: CatalogueItemInput, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope; _permission(scope, mutation=True); before = _row_or_404(session, \"catalogue_items\", item_id, \"CATALOGUE_ITEM_NOT_FOUND\"); branch_id = _branch(current, input.branch_id or before[\"branch_id\"])\n    if before[\"archived_at\"] is not None or before[\"branch_id\"] != branch_id: raise auth_error(\"CATALOGUE_ITEM_NOT_AVAILABLE\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    row = session.execute(text(\"\"\"UPDATE catalogue_items SET sku=:sku,category=:category,name=:name,unit=:unit,low_stock_qty=:low_stock_qty,selling_price=:selling_price,updated_by=:actor_id,updated_at=now() WHERE id=:id RETURNING *\"\"\"), {\"id\": item_id, \"sku\": _clean(input.sku).upper(), \"category\": input.category.strip(), \"name\": _clean(input.name), \"unit\": _clean(input.unit), \"low_stock_qty\": input.low_stock_qty, \"selling_price\": input.selling_price, \"actor_id\": str(current.actor_id)}).mappings().one()\n    payload = _catalogue(dict(row)); _audit(session, current, \"CATALOGUE_ITEM_UPDATED\", \"Catalogue item updated\", _catalogue(before), payload); return payload"
        },
        {
          "name": "archive_catalogue",
          "line": 265,
          "end": 271,
          "body": "def archive_catalogue(item_id: int, input: ArchiveInput, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope; _permission(scope, mutation=True); before = _row_or_404(session, \"catalogue_items\", item_id, \"CATALOGUE_ITEM_NOT_FOUND\")\n    if before[\"archived_at\"] is not None: raise auth_error(\"CATALOGUE_ITEM_ARCHIVED\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    linked = session.execute(text(\"SELECT 1 FROM purchase_order_lines WHERE item_id=:id LIMIT 1\"), {\"id\": item_id}).scalar()\n    if linked: raise auth_error(\"CATALOGUE_ITEM_HAS_PURCHASE_HISTORY\", status.HTTP_409_CONFLICT)\n    row = session.execute(text(\"UPDATE catalogue_items SET archived_at=now(),archived_by=:actor_id,archive_reason=:reason,updated_by=:actor_id,updated_at=now() WHERE id=:id RETURNING *\"), {\"id\": item_id, \"actor_id\": str(current.actor_id), \"reason\": _clean(input.reason)}).mappings().one()\n    payload = _catalogue(dict(row)); _audit(session, current, \"CATALOGUE_ITEM_ARCHIVED\", input.reason.strip(), _catalogue(before), payload); return payload"
        },
        {
          "name": "list_suppliers",
          "line": 275,
          "end": 279,
          "body": "def list_suppliers(scope: ScopedTenant, q: str = \"\", archived: bool = False, branch_id: UUID | None = Query(default=None, alias=\"branchId\")) -> list[dict[str, object]]:\n    session, current = scope; _permission(scope, mutation=False)\n    if branch_id is not None: _branch(current, branch_id)\n    rows = session.execute(text(\"SELECT * FROM suppliers WHERE (:archived=(archived_at IS NOT NULL)) AND (CAST(:branch_id AS uuid) IS NULL OR branch_id=:branch_id) AND (:q='' OR name ILIKE :needle OR mobile ILIKE :needle) ORDER BY name,id\"), {\"archived\": archived, \"branch_id\": str(branch_id) if branch_id else None, \"q\": q.strip(), \"needle\": f\"%{q.strip()}%\"}).mappings().all()\n    return [_supplier(dict(row)) for row in rows]"
        },
        {
          "name": "create_supplier",
          "line": 283,
          "end": 286,
          "body": "def create_supplier(input: SupplierInput, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope; branch_id = _branch(_permission(scope, mutation=True), input.branch_id)\n    row = session.execute(text(\"INSERT INTO suppliers (tenant_id,branch_id,name,mobile,email,address,created_by,updated_by) VALUES (:tenant_id,:branch_id,:name,:mobile,:email,:address,:actor_id,:actor_id) RETURNING *\"), {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(branch_id), \"name\": _clean(input.name), \"mobile\": input.mobile.strip(), \"email\": input.email.strip().lower(), \"address\": input.address.strip(), \"actor_id\": str(current.actor_id)}).mappings().one()\n    payload = _supplier(dict(row)); _audit(session, current, \"SUPPLIER_CREATED\", \"Supplier created\", {}, payload); return payload"
        },
        {
          "name": "update_supplier",
          "line": 290,
          "end": 294,
          "body": "def update_supplier(supplier_id: int, input: SupplierInput, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope; _permission(scope, mutation=True); before = _row_or_404(session, \"suppliers\", supplier_id, \"SUPPLIER_NOT_FOUND\"); branch_id = _branch(current, input.branch_id or before[\"branch_id\"])\n    if before[\"archived_at\"] is not None or before[\"branch_id\"] != branch_id: raise auth_error(\"SUPPLIER_NOT_AVAILABLE\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    row = session.execute(text(\"UPDATE suppliers SET name=:name,mobile=:mobile,email=:email,address=:address,updated_by=:actor_id,updated_at=now() WHERE id=:id RETURNING *\"), {\"id\": supplier_id, \"name\": _clean(input.name), \"mobile\": input.mobile.strip(), \"email\": input.email.strip().lower(), \"address\": input.address.strip(), \"actor_id\": str(current.actor_id)}).mappings().one()\n    payload = _supplier(dict(row)); _audit(session, current, \"SUPPLIER_UPDATED\", \"Supplier updated\", _supplier(before), payload); return payload"
        },
        {
          "name": "archive_supplier",
          "line": 298,
          "end": 304,
          "body": "def archive_supplier(supplier_id: int, input: ArchiveInput, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope; _permission(scope, mutation=True); before = _row_or_404(session, \"suppliers\", supplier_id, \"SUPPLIER_NOT_FOUND\")\n    if before[\"archived_at\"] is not None: raise auth_error(\"SUPPLIER_ARCHIVED\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    linked = session.execute(text(\"SELECT 1 FROM purchase_orders WHERE supplier_id=:id LIMIT 1\"), {\"id\": supplier_id}).scalar()\n    if linked: raise auth_error(\"SUPPLIER_HAS_PURCHASE_HISTORY\", status.HTTP_409_CONFLICT)\n    row = session.execute(text(\"UPDATE suppliers SET archived_at=now(),archived_by=:actor_id,archive_reason=:reason,updated_by=:actor_id,updated_at=now() WHERE id=:id RETURNING *\"), {\"id\": supplier_id, \"actor_id\": str(current.actor_id), \"reason\": _clean(input.reason)}).mappings().one()\n    payload = _supplier(dict(row)); _audit(session, current, \"SUPPLIER_ARCHIVED\", input.reason.strip(), _supplier(before), payload); return payload"
        },
        {
          "name": "list_purchase_orders",
          "line": 308,
          "end": 312,
          "body": "def list_purchase_orders(scope: ScopedTenant, branch_id: UUID | None = Query(default=None, alias=\"branchId\")) -> list[dict[str, object]]:\n    session, current = scope; _permission(scope, mutation=False)\n    if branch_id is not None: _branch(current, branch_id)\n    rows = session.execute(text(\"SELECT * FROM purchase_orders\" + (\" WHERE branch_id=:branch_id\" if branch_id else \"\") + \" ORDER BY order_date DESC,id DESC\"), {\"branch_id\": str(branch_id)} if branch_id else {}).mappings().all()\n    return [_purchase_with_lines(session, int(row[\"id\"])) for row in rows]"
        },
        {
          "name": "create_purchase_order",
          "line": 316,
          "end": 320,
          "body": "def create_purchase_order(input: PurchaseOrderInput, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope; branch_id = _branch(_permission(scope, mutation=True), input.branch_id); _supplier_available(session, input.supplier_id, branch_id)\n    row = session.execute(text(\"\"\"INSERT INTO purchase_orders (tenant_id,branch_id,supplier_id,po_number,order_date,status,notes,created_by,updated_by)\n        VALUES (:tenant_id,:branch_id,:supplier_id,:po_number,:order_date,'DRAFT',:notes,:actor_id,:actor_id) RETURNING *\"\"\"), {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(branch_id), \"supplier_id\": input.supplier_id, \"po_number\": _clean(input.po_number), \"order_date\": input.order_date, \"notes\": input.notes.strip(), \"actor_id\": str(current.actor_id)}).mappings().one()\n    _replace_lines(session, current, int(row[\"id\"]), branch_id, input.lines); payload = _purchase_with_lines(session, int(row[\"id\"])); _audit(session, current, \"PURCHASE_ORDER_CREATED\", \"Purchase order drafted\", {}, payload); return payload"
        },
        {
          "name": "update_purchase_order",
          "line": 324,
          "end": 329,
          "body": "def update_purchase_order(purchase_id: int, input: PurchaseOrderInput, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope; _permission(scope, mutation=True); before = _row_or_404(session, \"purchase_orders\", purchase_id, \"PURCHASE_ORDER_NOT_FOUND\"); branch_id = _branch(current, input.branch_id or before[\"branch_id\"])\n    if before[\"status\"] != \"DRAFT\" or before[\"branch_id\"] != branch_id: raise auth_error(\"PURCHASE_ORDER_NOT_EDITABLE\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    _supplier_available(session, input.supplier_id, branch_id)\n    session.execute(text(\"UPDATE purchase_orders SET supplier_id=:supplier_id,po_number=:po_number,order_date=:order_date,notes=:notes,updated_by=:actor_id,updated_at=now() WHERE id=:id\"), {\"id\": purchase_id, \"supplier_id\": input.supplier_id, \"po_number\": _clean(input.po_number), \"order_date\": input.order_date, \"notes\": input.notes.strip(), \"actor_id\": str(current.actor_id)})\n    _replace_lines(session, current, purchase_id, branch_id, input.lines); payload = _purchase_with_lines(session, purchase_id); _audit(session, current, \"PURCHASE_ORDER_UPDATED\", \"Purchase order draft updated\", _purchase(before), payload); return payload"
        },
        {
          "name": "purchase_order_command",
          "line": 333,
          "end": 358,
          "body": "def purchase_order_command(purchase_id: int, command: Literal[\"send\", \"cancel\", \"close\"], input: PurchaseOrderCommand, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope; _permission(scope, mutation=True); before = _locked_purchase(session, purchase_id) if command == \"close\" else _row_or_404(session, \"purchase_orders\", purchase_id, \"PURCHASE_ORDER_NOT_FOUND\")\n    if command == \"close\" and before[\"status\"] == \"CLOSED\":\n        return _purchase_with_lines(session, purchase_id)\n    transitions = {\"send\": {\"DRAFT\": \"SENT\"}, \"cancel\": {\"DRAFT\": \"CANCELLED\", \"SENT\": \"CANCELLED\", \"PARTIALLY_RECEIVED\": \"CANCELLED\", \"READY_TO_CLOSE\": \"CANCELLED\"}, \"close\": {\"SENT\": \"CLOSED\", \"PARTIALLY_RECEIVED\": \"CLOSED\", \"READY_TO_CLOSE\": \"CLOSED\"}}\n    next_status = transitions[command].get(str(before[\"status\"]))\n    if not next_status: raise auth_error(\"INVALID_PURCHASE_ORDER_TRANSITION\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    if command in {\"cancel\", \"close\"} and not input.reason.strip(): raise auth_error(\"PURCHASE_ORDER_REASON_REQUIRED\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    deliveries = session.execute(text(\"SELECT 1 FROM purchase_order_delivery_receipts WHERE purchase_order_id=:id LIMIT 1\"), {\"id\": purchase_id}).scalar()\n    if command == \"close\" and deliveries:\n        confirmations = session.execute(text(\"SELECT count(*) FROM purchase_order_delivery_confirmations WHERE purchase_order_id=:id\"), {\"id\": purchase_id}).scalar_one()\n        delivered_lines = session.execute(text(\"SELECT count(DISTINCT purchase_order_line_id) FROM purchase_order_delivery_receipt_lines WHERE receipt_id IN (SELECT id FROM purchase_order_delivery_receipts WHERE purchase_order_id=:id)\"), {\"id\": purchase_id}).scalar_one()\n        if before[\"status\"] != \"READY_TO_CLOSE\" or confirmations != delivered_lines:\n            raise auth_error(\"PURCHASE_DELIVERY_CONFIRMATION_REQUIRED\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n        confirmed = session.execute(text(\"\"\"SELECT confirmation.*, line.item_id, line.unit_cost\n            FROM purchase_order_delivery_confirmations confirmation\n            JOIN purchase_order_lines line ON line.id=confirmation.purchase_order_line_id\n            WHERE confirmation.purchase_order_id=:id AND confirmation.accepted_qty > 0\n            ORDER BY confirmation.purchase_order_line_id\"\"\"), {\"id\": purchase_id}).mappings().all()\n        for confirmation in confirmed:\n            inward = session.execute(text(\"\"\"INSERT INTO stock_inwards (tenant_id,branch_id,item_id,purchase_order_id,purchase_order_line_id,delivery_confirmation_id,qty,unit_cost,note,received_by)\n                VALUES (:tenant,:branch,:item,:purchase,:line,:confirmation,:qty,:cost,:note,:actor) RETURNING *\"\"\"), {\"tenant\": str(current.tenant_id), \"branch\": str(before[\"branch_id\"]), \"item\": confirmation[\"item_id\"], \"purchase\": purchase_id, \"line\": confirmation[\"purchase_order_line_id\"], \"confirmation\": confirmation[\"id\"], \"qty\": confirmation[\"accepted_qty\"], \"cost\": confirmation[\"unit_cost\"], \"note\": f\"Accepted delivery confirmation #{confirmation['id']}\", \"actor\": str(current.actor_id)}).mappings().one()\n            session.execute(text(\"\"\"INSERT INTO stock_ledger (tenant_id,branch_id,item_id,inward_id,entry_type,quantity,unit_cost,reason,actor_id)\n                VALUES (:tenant,:branch,:item,:inward,'INWARD',:qty,:cost,:reason,:actor)\"\"\"), {\"tenant\": str(current.tenant_id), \"branch\": str(before[\"branch_id\"]), \"item\": confirmation[\"item_id\"], \"inward\": inward[\"id\"], \"qty\": confirmation[\"accepted_qty\"], \"cost\": confirmation[\"unit_cost\"], \"reason\": f\"Accepted delivery confirmation #{confirmation['id']}\", \"actor\": str(current.actor_id)})\n    session.execute(text(\"UPDATE purchase_orders SET status=:status,updated_by=:actor_id,updated_at=now() WHERE id=:id\"), {\"id\": purchase_id, \"status\": next_status, \"actor_id\": str(current.actor_id)})\n    payload = _purchase_with_lines(session, purchase_id); _audit(session, current, f\"PURCHASE_ORDER_{command.upper()}\", input.reason.strip() or \"Purchase order sent\", _purchase(before), payload); return payload"
        },
        {
          "name": "record_delivery_receipt",
          "line": 362,
          "end": 390,
          "body": "def record_delivery_receipt(purchase_id: int, input: DeliveryReceiptInput, response: Response, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope; _purchase_admin(scope); order = _locked_purchase(session, purchase_id)\n    request_key = input.request_key.strip()\n    existing = session.execute(text(\"SELECT id FROM purchase_order_delivery_receipts WHERE purchase_order_id=:purchase AND request_key=:key\"), {\"purchase\": purchase_id, \"key\": request_key}).scalar_one_or_none()\n    if existing is not None:\n        response.status_code = status.HTTP_200_OK\n        return _delivery_receipt(session, int(existing))\n    if order[\"status\"] not in {\"SENT\", \"PARTIALLY_RECEIVED\"}:\n        raise auth_error(\"PURCHASE_ORDER_NOT_RECEIVABLE\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    requested = {line.line_id: line for line in input.lines}\n    if len(requested) != len(input.lines):\n        raise auth_error(\"DUPLICATE_DELIVERY_LINE\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    lines = [dict(row) for row in session.execute(text(\"SELECT * FROM purchase_order_lines WHERE purchase_order_id=:id\"), {\"id\": purchase_id}).mappings()]\n    available = {int(line[\"id\"]): line for line in lines}\n    if set(requested) - set(available):\n        raise auth_error(\"PURCHASE_ORDER_LINE_MISMATCH\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    delivered = {int(row[\"purchase_order_line_id\"]): float(row[\"qty\"]) for row in session.execute(text(\"\"\"SELECT receipt_line.purchase_order_line_id, SUM(receipt_line.delivered_qty) qty\n        FROM purchase_order_delivery_receipt_lines receipt_line JOIN purchase_order_delivery_receipts receipt ON receipt.id=receipt_line.receipt_id\n        WHERE receipt.purchase_order_id=:id GROUP BY receipt_line.purchase_order_line_id\"\"\"), {\"id\": purchase_id}).mappings()}\n    for line_id, requested_line in requested.items():\n        if delivered.get(line_id, 0) + requested_line.delivered_qty > float(available[line_id][\"ordered_qty\"]):\n            raise auth_error(\"DELIVERY_EXCEEDS_PURCHASE_ORDER\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    receipt = session.execute(text(\"\"\"INSERT INTO purchase_order_delivery_receipts(tenant_id,branch_id,purchase_order_id,request_key,note,received_by)\n        VALUES(:tenant,:branch,:purchase,:key,:note,:actor) RETURNING id\"\"\"), {\"tenant\": str(current.tenant_id), \"branch\": str(order[\"branch_id\"]), \"purchase\": purchase_id, \"key\": request_key, \"note\": input.note.strip(), \"actor\": str(current.actor_id)}).scalar_one()\n    for line_id, requested_line in requested.items():\n        session.execute(text(\"\"\"INSERT INTO purchase_order_delivery_receipt_lines(tenant_id,branch_id,receipt_id,purchase_order_line_id,delivered_qty)\n            VALUES(:tenant,:branch,:receipt,:line,:qty)\"\"\"), {\"tenant\": str(current.tenant_id), \"branch\": str(order[\"branch_id\"]), \"receipt\": receipt, \"line\": line_id, \"qty\": requested_line.delivered_qty})\n    session.execute(text(\"UPDATE purchase_orders SET status='PARTIALLY_RECEIVED',updated_by=:actor,updated_at=now() WHERE id=:id\"), {\"actor\": str(current.actor_id), \"id\": purchase_id})\n    payload = _delivery_receipt(session, int(receipt)); _audit(session, current, \"PURCHASE_DELIVERY_RECEIVED\", input.note.strip() or \"Delivery received\", {}, payload); return payload"
        },
        {
          "name": "confirm_delivery",
          "line": 394,
          "end": 420,
          "body": "def confirm_delivery(purchase_id: int, input: DeliveryConfirmationInput, response: Response, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope; _purchase_admin(scope); order = _locked_purchase(session, purchase_id)\n    request_key = input.request_key.strip()\n    replay = _delivery_confirmations(session, purchase_id, request_key)\n    if replay:\n        response.status_code = status.HTTP_200_OK\n        return {\"purchaseOrderId\": purchase_id, \"requestKey\": request_key, \"confirmations\": replay}\n    if order[\"status\"] != \"PARTIALLY_RECEIVED\":\n        raise auth_error(\"PURCHASE_ORDER_NOT_CONFIRMABLE\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    requested = {line.line_id: line for line in input.lines}\n    if len(requested) != len(input.lines):\n        raise auth_error(\"DUPLICATE_DELIVERY_LINE\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    delivered = {int(row[\"purchase_order_line_id\"]): float(row[\"qty\"]) for row in session.execute(text(\"\"\"SELECT receipt_line.purchase_order_line_id, SUM(receipt_line.delivered_qty) qty\n        FROM purchase_order_delivery_receipt_lines receipt_line JOIN purchase_order_delivery_receipts receipt ON receipt.id=receipt_line.receipt_id\n        WHERE receipt.purchase_order_id=:id GROUP BY receipt_line.purchase_order_line_id\"\"\"), {\"id\": purchase_id}).mappings()}\n    if set(requested) != set(delivered):\n        raise auth_error(\"DELIVERY_CONFIRMATION_INCOMPLETE\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    for line_id, confirmation in requested.items():\n        if Decimal(str(confirmation.accepted_qty)) + Decimal(str(confirmation.rejected_qty)) != Decimal(str(delivered[line_id])):\n            raise auth_error(\"DELIVERY_ACCOUNTING_MISMATCH\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n        if confirmation.rejected_qty > 0 and not confirmation.rejection_reason.strip():\n            raise auth_error(\"DELIVERY_REJECTION_REASON_REQUIRED\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    for line_id, confirmation in requested.items():\n        session.execute(text(\"\"\"INSERT INTO purchase_order_delivery_confirmations(tenant_id,branch_id,purchase_order_id,purchase_order_line_id,request_key,accepted_qty,rejected_qty,rejection_reason,confirmed_by)\n            VALUES(:tenant,:branch,:purchase,:line,:key,:accepted,:rejected,:reason,:actor)\"\"\"), {\"tenant\": str(current.tenant_id), \"branch\": str(order[\"branch_id\"]), \"purchase\": purchase_id, \"line\": line_id, \"key\": request_key, \"accepted\": confirmation.accepted_qty, \"rejected\": confirmation.rejected_qty, \"reason\": confirmation.rejection_reason.strip(), \"actor\": str(current.actor_id)})\n    session.execute(text(\"UPDATE purchase_orders SET status='READY_TO_CLOSE',updated_by=:actor,updated_at=now() WHERE id=:id\"), {\"actor\": str(current.actor_id), \"id\": purchase_id})\n    payload = {\"purchaseOrderId\": purchase_id, \"requestKey\": request_key, \"confirmations\": _delivery_confirmations(session, purchase_id, request_key)}; _audit(session, current, \"PURCHASE_DELIVERY_CONFIRMED\", \"Delivery accepted/rejected quantities confirmed\", {}, payload); return payload"
        },
        {
          "name": "list_stock_inwards",
          "line": 424,
          "end": 428,
          "body": "def list_stock_inwards(scope: ScopedTenant, branch_id: UUID | None = Query(default=None, alias=\"branchId\")) -> list[dict[str, object]]:\n    session, current = scope; _permission(scope, mutation=False)\n    if branch_id is not None: _branch(current, branch_id)\n    rows = session.execute(text(\"SELECT * FROM stock_inwards\" + (\" WHERE branch_id=:branch_id\" if branch_id else \"\") + \" ORDER BY received_at DESC,id DESC\"), {\"branch_id\": str(branch_id)} if branch_id else {}).mappings().all()\n    return [_inward(dict(row)) for row in rows]"
        },
        {
          "name": "record_stock_inward",
          "line": 432,
          "end": 449,
          "body": "def record_stock_inward(input: StockInwardInput, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope; branch_id = _branch(_permission(scope, mutation=True), input.branch_id); _item_available(session, input.item_id, branch_id)\n    order_id = None\n    if input.purchase_order_line_id is not None:\n        line = _row_or_404(session, \"purchase_order_lines\", input.purchase_order_line_id, \"PURCHASE_ORDER_LINE_NOT_FOUND\")\n        if line[\"branch_id\"] != branch_id or line[\"item_id\"] != input.item_id: raise auth_error(\"PURCHASE_ORDER_LINE_MISMATCH\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n        order = _row_or_404(session, \"purchase_orders\", int(line[\"purchase_order_id\"]), \"PURCHASE_ORDER_NOT_FOUND\")\n        if order[\"status\"] not in {\"SENT\", \"PARTIALLY_RECEIVED\", \"READY_TO_CLOSE\"}: raise auth_error(\"PURCHASE_ORDER_NOT_RECEIVABLE\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n        if session.execute(text(\"SELECT 1 FROM purchase_order_delivery_receipts WHERE purchase_order_id=:id LIMIT 1\"), {\"id\": order[\"id\"]}).scalar():\n            raise auth_error(\"PURCHASE_ORDER_DELIVERY_MANAGED\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n        order_id = int(order[\"id\"])\n    note = input.note.strip() or \"Stock inward\"\n    inward = session.execute(text(\"\"\"INSERT INTO stock_inwards (tenant_id,branch_id,item_id,purchase_order_id,purchase_order_line_id,qty,unit_cost,note,received_by)\n        VALUES (:tenant_id,:branch_id,:item_id,:purchase_order_id,:line_id,:qty,:unit_cost,:note,:actor_id) RETURNING *\"\"\"), {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(branch_id), \"item_id\": input.item_id, \"purchase_order_id\": order_id, \"line_id\": input.purchase_order_line_id, \"qty\": input.qty, \"unit_cost\": input.unit_cost, \"note\": note, \"actor_id\": str(current.actor_id)}).mappings().one()\n    ledger = session.execute(text(\"\"\"INSERT INTO stock_ledger (tenant_id,branch_id,item_id,inward_id,entry_type,quantity,unit_cost,reason,actor_id)\n        VALUES (:tenant_id,:branch_id,:item_id,:inward_id,'INWARD',:qty,:unit_cost,:reason,:actor_id) RETURNING id\"\"\"), {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(branch_id), \"item_id\": input.item_id, \"inward_id\": inward[\"id\"], \"qty\": input.qty, \"unit_cost\": input.unit_cost, \"reason\": note, \"actor_id\": str(current.actor_id)}).scalar_one()\n    if order_id is not None: _reconcile_purchase(session, order_id)\n    payload = {**_inward(dict(inward)), \"ledgerId\": ledger}; _audit(session, current, \"STOCK_INWARD_RECORDED\", note, {}, payload); return payload"
        },
        {
          "name": "adjust_stock",
          "line": 453,
          "end": 458,
          "body": "def adjust_stock(input: StockAdjustmentInput, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope; branch_id = _branch(_permission(scope, mutation=True), input.branch_id); _item_available(session, input.item_id, branch_id); reason = _clean(input.reason)\n    quantity = _adjustment_quantity(input.quantity)\n    row = session.execute(text(\"\"\"INSERT INTO stock_ledger (tenant_id,branch_id,item_id,entry_type,quantity,unit_cost,reason,actor_id)\n        VALUES (:tenant_id,:branch_id,:item_id,'ADJUSTMENT',:quantity,0,:reason,:actor_id) RETURNING *\"\"\"), {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(branch_id), \"item_id\": input.item_id, \"quantity\": quantity, \"reason\": reason, \"actor_id\": str(current.actor_id)}).mappings().one()\n    payload = {\"id\": row[\"id\"], \"itemId\": row[\"item_id\"], \"quantity\": float(row[\"quantity\"]), \"reason\": row[\"reason\"], \"entryType\": row[\"entry_type\"], \"createdAt\": row[\"created_at\"]}; _audit(session, current, \"STOCK_ADJUSTED\", reason, {}, payload); return payload"
        },
        {
          "name": "list_stock_ledger",
          "line": 462,
          "end": 472,
          "body": "def list_stock_ledger(scope: ScopedTenant, item_id: int | None = Query(default=None, alias=\"itemId\"), branch_id: UUID | None = Query(default=None, alias=\"branchId\")) -> list[dict[str, object]]:\n    session, current = scope; _permission(scope, mutation=False)\n    if branch_id is not None: _branch(current, branch_id)\n    filters, values = [], {}\n    if branch_id is not None:\n        filters.append(\"branch_id=:branch_id\"); values[\"branch_id\"] = str(branch_id)\n    if item_id is not None:\n        filters.append(\"item_id=:item_id\"); values[\"item_id\"] = item_id\n    where = f\" WHERE {' AND '.join(filters)}\" if filters else \"\"\n    rows = session.execute(text(f\"SELECT * FROM stock_ledger{where} ORDER BY created_at DESC,id DESC\"), values).mappings().all()\n    return [{\"id\": row[\"id\"], \"branchId\": str(row[\"branch_id\"]), \"itemId\": row[\"item_id\"], \"inwardId\": row[\"inward_id\"], \"entryType\": row[\"entry_type\"], \"quantity\": float(row[\"quantity\"]), \"unitCost\": float(row[\"unit_cost\"]), \"reason\": row[\"reason\"], \"actorId\": str(row[\"actor_id\"]), \"createdAt\": row[\"created_at\"]} for row in rows]"
        }
      ]
    },
    {
      "file": "/app/app/jobs.py",
      "functions": [
        {
          "name": "_permission",
          "line": 93,
          "end": 98,
          "body": "def _permission(scope: ScopedTenant, *, mutation: bool) -> TenantScope:\n    return _require_any(\n        scope,\n        (\"page.job-card.write\" if mutation else \"page.job-card.read\", \"page.estimate.write\" if mutation else \"page.estimate.read\", \"page.my-queue.write\" if mutation else \"page.my-queue.read\", \"page.jobs.write\" if mutation else \"page.jobs.read\"),\n        mutation=mutation,\n    )"
        },
        {
          "name": "_row_or_404",
          "line": 101,
          "end": 105,
          "body": "def _row_or_404(session, table: str, record_id: int, code: str) -> dict[str, object]:\n    row = session.execute(text(f\"SELECT * FROM {table} WHERE id = :id\"), {\"id\": record_id}).mappings().one_or_none()\n    if row is None:\n        raise auth_error(code, status.HTTP_404_NOT_FOUND)\n    return dict(row)"
        },
        {
          "name": "_job",
          "line": 108,
          "end": 119,
          "body": "def _job(row: dict[str, object]) -> dict[str, object]:\n    return {\n        \"id\": row[\"id\"], \"jobNo\": row[\"job_no\"], \"visitId\": row[\"visit_id\"],\n        \"branchId\": str(row[\"branch_id\"]), \"advisorId\": str(row[\"advisor_id\"]) if row[\"advisor_id\"] else None,\n        \"departmentId\": str(row[\"department_id\"]) if row.get(\"department_id\") else None,\n        \"responsibleManagerId\": str(row[\"responsible_manager_id\"]) if row.get(\"responsible_manager_id\") else None,\n        \"assignmentState\": row.get(\"assignment_state\") or \"LEGACY\",\n        \"status\": row[\"status\"], \"workList\": row[\"work_list\"], \"promisedAt\": row[\"promised_at\"],\n        \"estimatedDelivery\": row[\"estimated_delivery\"].isoformat() if row[\"estimated_delivery\"] else None,\n        \"archivedAt\": row[\"archived_at\"],\n        \"createdAt\": row[\"created_at\"], \"updatedAt\": row[\"updated_at\"],\n    }"
        },
        {
          "name": "_estimate",
          "line": 122,
          "end": 129,
          "body": "def _estimate(row: dict[str, object], lines: list[dict[str, object]] | None = None) -> dict[str, object]:\n    return {\n        \"id\": row[\"id\"], \"jobId\": row[\"job_card_id\"], \"revision\": row[\"revision\"], \"status\": row[\"status\"],\n        \"discount\": float(row[\"discount\"]), \"gstRate\": float(row[\"gst_rate\"]), \"note\": row[\"note\"],\n        \"supersededAt\": row[\"superseded_at\"], \"approvedSnapshot\": row[\"approved_snapshot\"],\n        \"createdAt\": row[\"created_at\"], \"updatedAt\": row[\"updated_at\"],\n        **({\"lines\": lines} if lines is not None else {}),\n    }"
        },
        {
          "name": "_line",
          "line": 132,
          "end": 133,
          "body": "def _line(row: dict[str, object]) -> dict[str, object]:\n    return {\"id\": row[\"id\"], \"kind\": row[\"kind\"], \"description\": row[\"description\"], \"quantity\": float(row[\"quantity\"]), \"rate\": float(row[\"rate\"]), \"gstRate\": float(row[\"gst_rate\"])}"
        },
        {
          "name": "_estimate_with_lines",
          "line": 136,
          "end": 142,
          "body": "def _estimate_with_lines(session, estimate_id: int) -> dict[str, object]:\n    estimate = _row_or_404(session, \"estimates\", estimate_id, \"ESTIMATE_NOT_FOUND\")\n    lines = [\n        _line(dict(row))\n        for row in session.execute(text(\"SELECT * FROM estimate_lines WHERE estimate_id=:estimate_id ORDER BY line_no, id\"), {\"estimate_id\": estimate_id}).mappings().all()\n    ]\n    return _estimate(estimate, lines)"
        },
        {
          "name": "_job_with_estimates",
          "line": 145,
          "end": 165,
          "body": "def _job_with_estimates(session, job_id: int) -> dict[str, object]:\n    job = _row_or_404(session, \"job_cards\", job_id, \"JOB_NOT_FOUND\")\n    estimates = [_estimate_with_lines(session, int(row[\"id\"])) for row in session.execute(text(\"SELECT id FROM estimates WHERE job_card_id=:job_id ORDER BY revision\"), {\"job_id\": job_id}).mappings().all()]\n    events = [\n        {\"id\": row[\"id\"], \"command\": row[\"command\"], \"fromStatus\": row[\"from_status\"], \"toStatus\": row[\"to_status\"], \"reason\": row[\"reason\"], \"requestKey\": row[\"request_key\"], \"at\": row[\"created_at\"]}\n        for row in session.execute(text(\"SELECT * FROM job_events WHERE job_card_id=:job_id ORDER BY id\"), {\"job_id\": job_id}).mappings().all()\n    ]\n    history = [{\n        \"id\": row[\"id\"], \"action\": row[\"action\"], \"reason\": row[\"reason\"], \"at\": row[\"created_at\"],\n        \"actorId\": str(row[\"actor_id\"]), \"departmentId\": str(row[\"department_id\"]) if row[\"department_id\"] else None,\n        \"departmentName\": row[\"department_name\"], \"managerId\": str(row[\"manager_id\"]) if row[\"manager_id\"] else None,\n        \"managerName\": row[\"manager_name\"], \"advisorId\": str(row[\"advisor_id\"]) if row[\"advisor_id\"] else None,\n        \"advisorName\": row[\"advisor_name\"],\n    } for row in session.execute(text(\"SELECT * FROM job_assignment_history WHERE job_card_id=:job_id ORDER BY id\"), {\"job_id\": job_id}).mappings().all()]\n    department = session.execute(text(\"SELECT name FROM service_departments WHERE id=:id\"), {\"id\": str(job[\"department_id\"])}).scalar() if job.get(\"department_id\") else None\n    manager = session.execute(text(\"SELECT display_name FROM platform_users WHERE id=:id\"), {\"id\": str(job[\"responsible_manager_id\"])}).scalar() if job.get(\"responsible_manager_id\") else None\n    advisor = session.execute(text(\"SELECT display_name FROM platform_users WHERE id=:id\"), {\"id\": str(job[\"advisor_id\"])}).scalar() if job.get(\"advisor_id\") else None\n    return {**_job(job), \"department\": {\"id\": str(job[\"department_id\"]), \"name\": department} if job.get(\"department_id\") else None,\n            \"responsibleManager\": {\"id\": str(job[\"responsible_manager_id\"]), \"name\": manager} if job.get(\"responsible_manager_id\") else None,\n            \"advisor\": {\"id\": str(job[\"advisor_id\"]), \"name\": advisor} if job.get(\"advisor_id\") else None,\n            \"assignmentHistory\": history, \"estimates\": estimates, \"events\": events}"
        },
        {
          "name": "_assert_job_actor",
          "line": 168,
          "end": 176,
          "body": "def _assert_job_actor(current: TenantScope, job: dict[str, object]) -> None:\n    \"\"\"Tenant Admin has all granted page authority; advisors own assigned jobs.\"\"\"\n    if any(name == \"Owner/Admin\" for _, name, _ in current.roles):\n        return\n    if job.get(\"responsible_manager_id\") is not None and str(job[\"responsible_manager_id\"]) == str(current.actor_id):\n        return\n    if job[\"advisor_id\"] is not None and str(job[\"advisor_id\"]) == str(current.actor_id):\n        return\n    raise auth_error(\"JOB_ASSIGNMENT_REQUIRED\", status.HTTP_403_FORBIDDEN)"
        },
        {
          "name": "_assert_active_advisor",
          "line": 179,
          "end": 188,
          "body": "def _assert_active_advisor(session, current: TenantScope, branch_id: UUID, advisor_id: UUID) -> None:\n    \"\"\"An assignment is only valid for an active member of this Tenant/Branch.\"\"\"\n    advisor = session.execute(text(\"\"\"\n        SELECT 1 FROM tenant_memberships AS membership\n        JOIN membership_branches AS assigned ON assigned.membership_id=membership.id\n        WHERE membership.tenant_id=:tenant_id AND membership.user_id=:advisor_id\n          AND membership.status='ACTIVE' AND assigned.branch_id=:branch_id\n    \"\"\"), {\"tenant_id\": str(current.tenant_id), \"advisor_id\": str(advisor_id), \"branch_id\": str(branch_id)}).scalar()\n    if not advisor:\n        raise auth_error(\"ADVISOR_NOT_AVAILABLE\", status.HTTP_422_UNPROCESSABLE_ENTITY)"
        },
        {
          "name": "_routing",
          "line": 191,
          "end": 206,
          "body": "def _routing(session, current: TenantScope, branch_id: UUID, department_id: UUID, manager_id: UUID) -> dict[str, object]:\n    \"\"\"Resolve an active appointed manager; never trust IDs supplied by the browser.\"\"\"\n    row = session.execute(text(\"\"\"\n        SELECT d.id, d.name, manager.id AS manager_membership_id, manager.user_id AS manager_id\n        FROM service_departments d\n        JOIN service_department_managers dm ON dm.department_id=d.id\n        JOIN tenant_memberships manager ON manager.id=dm.manager_membership_id AND manager.status='ACTIVE'\n        JOIN membership_branches mb ON mb.membership_id=manager.id AND mb.branch_id=d.branch_id\n        JOIN membership_roles mr ON mr.membership_id=manager.id AND mr.tenant_id=manager.tenant_id\n        JOIN tenant_roles role ON role.id=mr.role_id AND role.system_key='service_manager' AND role.status='ACTIVE'\n        WHERE d.id=:department_id AND d.tenant_id=:tenant_id AND d.branch_id=:branch_id AND d.status='ACTIVE'\n          AND manager.user_id=:manager_id\n    \"\"\"), {\"department_id\": str(department_id), \"tenant_id\": str(current.tenant_id), \"branch_id\": str(branch_id), \"manager_id\": str(manager_id)}).mappings().one_or_none()\n    if row is None:\n        raise auth_error(\"MANAGER_NOT_ELIGIBLE\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    return dict(row)"
        },
        {
          "name": "_record_assignment",
          "line": 209,
          "end": 216,
          "body": "def _record_assignment(session, current: TenantScope, job_id: int, branch_id: object, department_id: object | None, manager_id: object | None, advisor_id: object | None, action: str, reason: str) -> None:\n    department_name = session.execute(text(\"SELECT name FROM service_departments WHERE id=:id\"), {\"id\": str(department_id)}).scalar() if department_id else None\n    manager_name = session.execute(text(\"SELECT display_name FROM platform_users WHERE id=:id\"), {\"id\": str(manager_id)}).scalar() if manager_id else None\n    advisor_name = session.execute(text(\"SELECT display_name FROM platform_users WHERE id=:id\"), {\"id\": str(advisor_id)}).scalar() if advisor_id else None\n    session.execute(text(\"\"\"\n        INSERT INTO job_assignment_history (tenant_id,branch_id,job_card_id,department_id,department_name,manager_id,manager_name,advisor_id,advisor_name,actor_id,action,reason)\n        VALUES (:tenant_id,:branch_id,:job_id,:department_id,:department_name,:manager_id,:manager_name,:advisor_id,:advisor_name,:actor_id,:action,:reason)\n    \"\"\"), {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(branch_id), \"job_id\": job_id, \"department_id\": str(department_id) if department_id else None, \"department_name\": department_name, \"manager_id\": str(manager_id) if manager_id else None, \"manager_name\": manager_name, \"advisor_id\": str(advisor_id) if advisor_id else None, \"advisor_name\": advisor_name, \"actor_id\": str(current.actor_id), \"action\": action, \"reason\": reason})"
        },
        {
          "name": "_branch_requires_approval",
          "line": 219,
          "end": 222,
          "body": "def _branch_requires_approval(session, branch_id: object) -> bool:\n    row = session.execute(text(\"SELECT settings FROM branch_settings WHERE branch_id=:branch_id\"), {\"branch_id\": str(branch_id)}).mappings().one_or_none()\n    settings = dict(row[\"settings\"]) if row and row[\"settings\"] else {}\n    return bool(settings.get(\"requireEstimateApproval\", False))"
        },
        {
          "name": "list_jobs",
          "line": 226,
          "end": 237,
          "body": "def list_jobs(scope: ScopedTenant, branch_id: UUID | None = Query(default=None, alias=\"branchId\")) -> list[dict[str, object]]:\n    session, current = scope\n    _permission(scope, mutation=False)\n    if branch_id is not None:\n        _branch(current, branch_id)\n    is_owner = any(name == \"Owner/Admin\" for _, name, _ in current.roles)\n    rows = session.execute(text(\"\"\"\n        SELECT * FROM job_cards WHERE (CAST(:branch_id AS uuid) IS NULL OR branch_id=CAST(:branch_id AS uuid))\n          AND (:is_owner OR responsible_manager_id=:actor_id OR advisor_id=:actor_id)\n        ORDER BY created_at DESC, id DESC\n    \"\"\"), {\"branch_id\": str(branch_id) if branch_id else None, \"is_owner\": is_owner, \"actor_id\": str(current.actor_id)}).mappings().all()\n    return [_job_with_estimates(session, int(row[\"id\"])) for row in rows]"
        },
        {
          "name": "get_job",
          "line": 241,
          "end": 246,
          "body": "def get_job(job_id: int, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    _permission(scope, mutation=False)\n    job = _row_or_404(session, \"job_cards\", job_id, \"JOB_NOT_FOUND\")\n    _assert_job_actor(current, job)\n    return _job_with_estimates(session, job_id)"
        },
        {
          "name": "update_estimated_delivery",
          "line": 250,
          "end": 271,
          "body": "def update_estimated_delivery(job_id: int, input: EstimatedDeliveryUpdate, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    _require_any(scope, (\"page.job-card.write\", \"page.jobs.write\"), mutation=True)\n    locked = session.execute(text(\"SELECT * FROM job_cards WHERE id=:job_id FOR UPDATE\"), {\"job_id\": job_id}).mappings().one_or_none()\n    if locked is None:\n        raise auth_error(\"JOB_NOT_FOUND\", status.HTTP_404_NOT_FOUND)\n    job = dict(locked)\n    is_owner = any(name == \"Owner/Admin\" for _, name, _ in current.roles)\n    if not is_owner and str(job[\"advisor_id\"]) != str(current.actor_id):\n        raise auth_error(\"JOB_ASSIGNMENT_REQUIRED\", status.HTTP_403_FORBIDDEN)\n    if not is_owner and not any(name == \"Service Advisor\" for _, name, _ in current.roles):\n        raise auth_error(\"PERMISSION_DENIED\", status.HTTP_403_FORBIDDEN)\n    if job[\"archived_at\"] is not None or job[\"status\"] in (\"CANCELLED\", \"CLOSED\"):\n        raise auth_error(\"JOB_READ_ONLY\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    before = job[\"estimated_delivery\"].isoformat() if job[\"estimated_delivery\"] else None\n    after = input.estimated_delivery.isoformat() if input.estimated_delivery else None\n    session.execute(text(\"\"\"\n        UPDATE job_cards SET estimated_delivery=:estimated_delivery, updated_by=:actor_id, updated_at=now()\n        WHERE id=:job_id\n    \"\"\"), {\"estimated_delivery\": input.estimated_delivery, \"actor_id\": str(current.actor_id), \"job_id\": job_id})\n    _audit(session, current, \"JOB_ESTIMATED_DELIVERY_UPDATED\", \"Estimated delivery date changed\", {\"estimatedDelivery\": before}, {\"estimatedDelivery\": after})\n    return _job_with_estimates(session, job_id)"
        },
        {
          "name": "create_job",
          "line": 275,
          "end": 296,
          "body": "def create_job(input: JobCreate, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    branch_id = _branch(_permission(scope, mutation=True), input.branch_id)\n    visit = _row_or_404(session, \"visits\", input.visit_id, \"VISIT_NOT_FOUND\")\n    if visit[\"branch_id\"] != branch_id or visit[\"archived_at\"] is not None:\n        raise auth_error(\"VISIT_NOT_AVAILABLE\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    existing = session.execute(text(\"SELECT id FROM job_cards WHERE visit_id=:visit_id\"), {\"visit_id\": input.visit_id}).mappings().one_or_none()\n    if existing:\n        raise auth_error(\"VISIT_ALREADY_HAS_JOB\", status.HTTP_409_CONFLICT)\n    _routing(session, current, branch_id, input.department_id, input.responsible_manager_id)\n    row = session.execute(text(\"\"\"\n        INSERT INTO job_cards (tenant_id, branch_id, job_no, visit_id, department_id, responsible_manager_id, assignment_state, status, work_list, promised_at, created_by, updated_by)\n        VALUES (:tenant_id,:branch_id,'PENDING',:visit_id,:department_id,:manager_id,'AWAITING_ADVISOR_ASSIGNMENT','NEW',:work_list,:promised_at,:actor_id,:actor_id)\n        RETURNING *\n    \"\"\"), {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(branch_id), \"visit_id\": input.visit_id,\n             \"department_id\": str(input.department_id), \"manager_id\": str(input.responsible_manager_id), \"work_list\": input.work_list.strip(),\n             \"promised_at\": input.promised_at, \"actor_id\": str(current.actor_id)}).mappings().one()\n    row = session.execute(text(\"UPDATE job_cards SET job_no=:job_no, updated_at=now() WHERE id=:id RETURNING *\"), {\"id\": row[\"id\"], \"job_no\": f\"JC-{int(row['id']):06d}\"}).mappings().one()\n    _record_assignment(session, current, int(row[\"id\"]), branch_id, input.department_id, input.responsible_manager_id, None, \"ROUTED_TO_MANAGER\", \"Awaiting advisor assignment\")\n    payload = _job_with_estimates(session, int(row[\"id\"]))\n    _audit(session, current, \"JOB_CREATED\", \"Job created from visit\", {}, payload)\n    return payload"
        },
        {
          "name": "assign_job_advisor",
          "line": 300,
          "end": 333,
          "body": "def assign_job_advisor(job_id: int, input: AdvisorAssignment, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    _permission(scope, mutation=True)\n    job = _row_or_404(session, \"job_cards\", job_id, \"JOB_NOT_FOUND\")\n    _assert_job_actor(current, job)\n    if job[\"status\"] in (\"CANCELLED\", \"CLOSED\"):\n        raise auth_error(\"JOB_TERMINAL\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    if job.get(\"responsible_manager_id\") is None or job.get(\"department_id\") is None:\n        raise auth_error(\"JOB_ROUTING_REQUIRED\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    # Only the responsible manager may delegate. Owners have transfer power,\n    # but cannot bypass a manager's branch-local advisor team.\n    if str(job[\"responsible_manager_id\"]) != str(current.actor_id):\n        raise auth_error(\"MANAGER_ASSIGNMENT_REQUIRED\", status.HTTP_403_FORBIDDEN)\n    advisor = session.execute(text(\"\"\"\n        SELECT advisor.user_id FROM service_advisor_teams team\n        JOIN tenant_memberships advisor ON advisor.id=team.advisor_membership_id AND advisor.status='ACTIVE'\n        JOIN membership_branches mb ON mb.membership_id=advisor.id AND mb.branch_id=team.branch_id\n        JOIN membership_roles mr ON mr.membership_id=advisor.id AND mr.tenant_id=advisor.tenant_id\n        JOIN tenant_roles role ON role.id=mr.role_id AND role.system_key='service' AND role.status='ACTIVE'\n        WHERE team.tenant_id=:tenant_id AND team.branch_id=:branch_id AND team.department_id=:department_id\n          AND team.manager_membership_id=(SELECT id FROM tenant_memberships WHERE tenant_id=:tenant_id AND user_id=:manager_id)\n          AND advisor.user_id=:advisor_id\n    \"\"\"), {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(job[\"branch_id\"]), \"department_id\": str(job[\"department_id\"]), \"manager_id\": str(current.actor_id), \"advisor_id\": str(input.advisor_id)}).scalar()\n    if not advisor:\n        raise auth_error(\"ADVISOR_NOT_IN_MANAGER_TEAM\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    before = _job(job)\n    row = session.execute(text(\"\"\"\n        UPDATE job_cards SET advisor_id=:advisor_id, assignment_state='ASSIGNED_TO_ADVISOR', updated_by=:actor_id, updated_at=now()\n        WHERE id=:job_id RETURNING *\n    \"\"\"), {\"advisor_id\": str(input.advisor_id), \"actor_id\": str(current.actor_id), \"job_id\": job_id}).mappings().one()\n    _record_assignment(session, current, job_id, job[\"branch_id\"], job[\"department_id\"], job[\"responsible_manager_id\"], input.advisor_id, \"ADVISOR_ASSIGNED\", input.reason.strip() or \"Advisor delegated by manager\")\n    payload = _job_with_estimates(session, job_id)\n    _audit(session, current, \"JOB_ADVISOR_ASSIGNED\", input.reason.strip() or \"Advisor delegated by manager\", before, payload)\n    return payload"
        },
        {
          "name": "transfer_job_manager",
          "line": 337,
          "end": 356,
          "body": "def transfer_job_manager(job_id: int, input: ManagerTransfer, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    _permission(scope, mutation=True)\n    if not any(name == \"Owner/Admin\" for _, name, _ in current.roles):\n        raise auth_error(\"MANAGER_TRANSFER_FORBIDDEN\", status.HTTP_403_FORBIDDEN)\n    job = _row_or_404(session, \"job_cards\", job_id, \"JOB_NOT_FOUND\")\n    if job[\"status\"] in (\"CANCELLED\", \"CLOSED\"):\n        raise auth_error(\"JOB_TERMINAL\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    if str(input.department_id) == str(job.get(\"department_id\")) and str(input.responsible_manager_id) == str(job.get(\"responsible_manager_id\")):\n        raise auth_error(\"MANAGER_TRANSFER_UNCHANGED\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    _routing(session, current, UUID(str(job[\"branch_id\"])), input.department_id, input.responsible_manager_id)\n    before = _job(job)\n    session.execute(text(\"\"\"\n        UPDATE job_cards SET department_id=:department_id, responsible_manager_id=:manager_id, advisor_id=NULL,\n          assignment_state='AWAITING_ADVISOR_ASSIGNMENT', updated_by=:actor_id, updated_at=now() WHERE id=:job_id\n    \"\"\"), {\"department_id\": str(input.department_id), \"manager_id\": str(input.responsible_manager_id), \"actor_id\": str(current.actor_id), \"job_id\": job_id})\n    _record_assignment(session, current, job_id, job[\"branch_id\"], input.department_id, input.responsible_manager_id, None, \"MANAGER_TRANSFERRED\", input.reason.strip() or \"Transferred by administrator\")\n    payload = _job_with_estimates(session, job_id)\n    _audit(session, current, \"JOB_MANAGER_TRANSFERRED\", input.reason.strip() or \"Transferred by administrator\", before, payload)\n    return payload"
        },
        {
          "name": "create_estimate",
          "line": 360,
          "end": 386,
          "body": "def create_estimate(job_id: int, input: EstimateCreate, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    _permission(scope, mutation=True)\n    job = _row_or_404(session, \"job_cards\", job_id, \"JOB_NOT_FOUND\")\n    _assert_job_actor(current, job)\n    if job[\"status\"] in (\"CANCELLED\", \"CLOSED\"):\n        raise auth_error(\"JOB_TERMINAL\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    previous = session.execute(text(\"SELECT * FROM estimates WHERE job_card_id=:job_id AND superseded_at IS NULL ORDER BY revision DESC LIMIT 1\"), {\"job_id\": job_id}).mappings().one_or_none()\n    revision = int(previous[\"revision\"]) + 1 if previous else 1\n    if previous and previous[\"status\"] == \"DRAFT\":\n        raise auth_error(\"ESTIMATE_DRAFT_EXISTS\", status.HTTP_409_CONFLICT)\n    if previous:\n        session.execute(text(\"UPDATE estimates SET superseded_at=now(), superseded_by=:actor_id, updated_at=now() WHERE id=:id\"), {\"id\": previous[\"id\"], \"actor_id\": str(current.actor_id)})\n    estimate = session.execute(text(\"\"\"\n        INSERT INTO estimates (tenant_id,branch_id,job_card_id,revision,status,discount,gst_rate,note,created_by,updated_by)\n        VALUES (:tenant_id,:branch_id,:job_id,:revision,'DRAFT',:discount,:gst_rate,:note,:actor_id,:actor_id) RETURNING *\n    \"\"\"), {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(job[\"branch_id\"]), \"job_id\": job_id, \"revision\": revision,\n             \"discount\": input.discount, \"gst_rate\": input.gst_rate, \"note\": input.note.strip(), \"actor_id\": str(current.actor_id)}).mappings().one()\n    for index, line in enumerate(input.lines, start=1):\n        session.execute(text(\"\"\"\n            INSERT INTO estimate_lines (tenant_id,branch_id,estimate_id,line_no,kind,description,quantity,rate,gst_rate)\n            VALUES (:tenant_id,:branch_id,:estimate_id,:line_no,:kind,:description,:quantity,:rate,:gst_rate)\n        \"\"\"), {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(job[\"branch_id\"]), \"estimate_id\": estimate[\"id\"], \"line_no\": index,\n                 \"kind\": _clean(line.kind), \"description\": _clean(line.description), \"quantity\": line.quantity, \"rate\": line.rate, \"gst_rate\": line.gst_rate})\n    payload = _estimate_with_lines(session, int(estimate[\"id\"]))\n    _audit(session, current, \"ESTIMATE_CREATED\", f\"Estimate revision {revision} drafted\", {}, payload)\n    return payload"
        },
        {
          "name": "record_estimate_decision",
          "line": 390,
          "end": 414,
          "body": "def record_estimate_decision(estimate_id: int, input: EstimateDecision, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    _permission(scope, mutation=True)\n    estimate = _row_or_404(session, \"estimates\", estimate_id, \"ESTIMATE_NOT_FOUND\")\n    job = _row_or_404(session, \"job_cards\", int(estimate[\"job_card_id\"]), \"JOB_NOT_FOUND\")\n    _assert_job_actor(current, job)\n    if job[\"status\"] in (\"CANCELLED\", \"CLOSED\"):\n        raise auth_error(\"JOB_TERMINAL\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    if estimate[\"status\"] != \"DRAFT\" or estimate[\"superseded_at\"] is not None:\n        raise auth_error(\"ESTIMATE_DECISION_NOT_ALLOWED\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    payload_before = _estimate_with_lines(session, estimate_id)\n    snapshot = json.dumps(payload_before, default=str)\n    outcome_status = \"APPROVED\" if input.outcome == \"approved\" else \"DECLINED\"\n    row = session.execute(text(\"\"\"\n        UPDATE estimates SET status=:status, approved_snapshot=CASE WHEN :status='APPROVED' THEN CAST(:snapshot AS jsonb) ELSE NULL END,\n          updated_by=:actor_id, updated_at=now() WHERE id=:id RETURNING *\n    \"\"\"), {\"id\": estimate_id, \"status\": outcome_status, \"snapshot\": snapshot, \"actor_id\": str(current.actor_id)}).mappings().one()\n    decision = session.execute(text(\"\"\"\n        INSERT INTO estimate_decisions (tenant_id,branch_id,estimate_id,job_card_id,outcome,channel,decided_at,actor_id,note)\n        VALUES (:tenant_id,:branch_id,:estimate_id,:job_id,:outcome,:channel,:decided_at,:actor_id,:note) RETURNING *\n    \"\"\"), {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(job[\"branch_id\"]), \"estimate_id\": estimate_id, \"job_id\": job[\"id\"],\n             \"outcome\": input.outcome, \"channel\": input.channel, \"decided_at\": input.decided_at, \"actor_id\": str(current.actor_id), \"note\": input.note.strip()}).mappings().one()\n    payload = _estimate_with_lines(session, int(row[\"id\"]))\n    _audit(session, current, \"ESTIMATE_DECISION_RECORDED\", f\"{input.outcome} via {input.channel}\", payload_before, {\"estimate\": payload, \"decision\": dict(decision)})\n    return {\"estimate\": payload, \"decision\": {\"id\": decision[\"id\"], \"outcome\": decision[\"outcome\"], \"channel\": decision[\"channel\"], \"decidedAt\": decision[\"decided_at\"], \"actorId\": str(decision[\"actor_id\"]), \"note\": decision[\"note\"]}}"
        },
        {
          "name": "_completion_prerequisites",
          "line": 427,
          "end": 478,
          "body": "def _completion_prerequisites(session, job_id: int) -> tuple[str, ...]:\n    \"\"\"Return authoritative blockers for the final operational transition.\n\n    The Estimate slice owns the first assertion now.  Material issuance, work\n    evidence, QC and invoice records are deliberately not browser-provided\n    flags: their command slices (#65--#68) must write those facts before this\n    transition may be enabled.  Until then the command is safely fail-closed.\n    \"\"\"\n    blockers: list[str] = []\n    approved = session.execute(text(\"\"\"\n        SELECT 1 FROM estimates\n        WHERE job_card_id=:job_id AND status='APPROVED' AND superseded_at IS NULL\n    \"\"\"), {\"job_id\": job_id}).scalar()\n    if not approved:\n        blockers.append(\"ESTIMATE_APPROVAL_REQUIRED\")\n    # Work and QC are persisted by the technician execution slice.  Completion\n    # deliberately queries those facts here instead of accepting client flags.\n    work_evidence = session.execute(text(\"SELECT 1 FROM work_updates WHERE job_card_id=:job_id LIMIT 1\"), {\"job_id\": job_id}).scalar()\n    if not work_evidence:\n        blockers.append(\"WORK_EVIDENCE_REQUIRED\")\n    unfinished_tasks = session.execute(text(\"\"\"\n        SELECT 1 FROM technician_tasks\n        WHERE job_card_id=:job_id AND status NOT IN ('COMPLETED','CANCELLED') LIMIT 1\n    \"\"\"), {\"job_id\": job_id}).scalar()\n    if unfinished_tasks:\n        blockers.append(\"TECHNICIAN_TASKS_UNRESOLVED\")\n    required_qc = session.execute(text(\"SELECT 1 FROM qc_checks WHERE job_card_id=:job_id AND required LIMIT 1\"), {\"job_id\": job_id}).scalar()\n    failed_qc = session.execute(text(\"SELECT 1 FROM qc_checks WHERE job_card_id=:job_id AND required AND status='FAILED' LIMIT 1\"), {\"job_id\": job_id}).scalar()\n    pending_qc = session.execute(text(\"SELECT 1 FROM qc_checks WHERE job_card_id=:job_id AND required AND status<>'PASSED' LIMIT 1\"), {\"job_id\": job_id}).scalar()\n    if not required_qc or pending_qc:\n        blockers.append(\"QC_REQUIRED\" if not failed_qc else \"QC_REWORK_REQUIRED\")\n    # Materials are resolved only when each reservation has reached its\n    # database-derived final state. The invoice check intentionally queries\n    # the immutable issued-document path rather than a browser status flag.\n    unresolved_materials = session.execute(text(\"\"\"\n        SELECT 1 FROM material_reservations\n        WHERE job_card_id=:job_id AND status NOT IN ('ISSUED','RELEASED') LIMIT 1\n    \"\"\"), {\"job_id\": job_id}).scalar()\n    if unresolved_materials:\n        blockers.append(\"MATERIALS_UNRESOLVED\")\n    issued_invoice = session.execute(text(\"\"\"\n        SELECT 1 FROM invoices invoice\n        WHERE invoice.job_card_id=:job_id\n          AND NOT EXISTS (\n              SELECT 1 FROM financial_document_events event\n              WHERE event.document_id=invoice.issued_document_id AND event.event_type='VOID'\n          )\n        LIMIT 1\n    \"\"\"), {\"job_id\": job_id}).scalar()\n    if not issued_invoice:\n        blockers.append(\"INVOICE_REQUIRED\")\n    return tuple(blockers)"
        },
        {
          "name": "command_job",
          "line": 482,
          "end": 516,
          "body": "def command_job(\n    job_id: int,\n    command: Literal[\"start-work\", \"hold-job\", \"resume-work\", \"cancel-job\", \"start-rework\", \"complete-work\"],\n    input: JobCommand,\n    scope: ScopedTenant,\n    request_key: Annotated[str | None, Header(alias=\"Idempotency-Key\")] = None,\n) -> dict[str, object]:\n    session, current = scope\n    _permission(scope, mutation=True)\n    job = _row_or_404(session, \"job_cards\", job_id, \"JOB_NOT_FOUND\")\n    _assert_job_actor(current, job)\n    if request_key and session.execute(text(\"SELECT 1 FROM job_events WHERE job_card_id=:job_id AND request_key=:request_key\"), {\"job_id\": job_id, \"request_key\": request_key.strip()}).scalar():\n        return _job(_row_or_404(session, \"job_cards\", job_id, \"JOB_NOT_FOUND\"))\n    allowed, target, reason_required = _COMMANDS[command]\n    reason = input.reason.strip()\n    if reason_required and not reason:\n        raise auth_error(\"COMMAND_REASON_REQUIRED\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    if job[\"status\"] not in allowed:\n        raise auth_error(\"INVALID_JOB_TRANSITION\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    if command == \"start-work\" and _branch_requires_approval(session, job[\"branch_id\"]):\n        approved = session.execute(text(\"SELECT 1 FROM estimates WHERE job_card_id=:job_id AND status='APPROVED' AND superseded_at IS NULL\"), {\"job_id\": job_id}).scalar()\n        if not approved:\n            raise auth_error(\"ESTIMATE_APPROVAL_REQUIRED\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    if command == \"complete-work\" and _completion_prerequisites(session, job_id):\n        raise auth_error(\"COMPLETION_PREREQUISITES_UNMET\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    before = _job(job)\n    row = session.execute(text(\"UPDATE job_cards SET status=:status, updated_by=:actor_id, updated_at=now() WHERE id=:id RETURNING *\"), {\"id\": job_id, \"status\": target, \"actor_id\": str(current.actor_id)}).mappings().one()\n    session.execute(text(\"\"\"\n        INSERT INTO job_events (tenant_id,branch_id,job_card_id,command,from_status,to_status,reason,request_key,actor_id)\n        VALUES (:tenant_id,:branch_id,:job_id,:command,:from_status,:to_status,:reason,:request_key,:actor_id)\n    \"\"\"), {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(job[\"branch_id\"]), \"job_id\": job_id, \"command\": command,\n             \"from_status\": job[\"status\"], \"to_status\": target, \"reason\": reason, \"request_key\": request_key.strip() if request_key else None, \"actor_id\": str(current.actor_id)})\n    payload = _job(dict(row))\n    _audit(session, current, \"JOB_COMMAND\", f\"{command}: {reason or 'No reason required'}\", before, payload)\n    return payload"
        }
      ]
    },
    {
      "file": "/app/app/main.py",
      "functions": [
        {
          "name": "workshop_http_error",
          "line": 51,
          "end": 55,
          "body": "def workshop_http_error(_, error: HTTPException) -> JSONResponse:\n    \"\"\"Keep stable domain error codes at the JSON top level for the React client.\"\"\"\n    if isinstance(error.detail, dict) and \"code\" in error.detail:\n        return JSONResponse(status_code=error.status_code, content=error.detail, headers=error.headers)\n    return JSONResponse(status_code=error.status_code, content={\"detail\": error.detail}, headers=error.headers)"
        },
        {
          "name": "require_permission",
          "line": 67,
          "end": 72,
          "body": "def require_permission(scope: ScopedTenant, permission: str) -> None:\n    _, current = scope\n    if current.actor_type == \"support_emulation\" and permission.endswith(\".read\"):\n        return\n    if permission not in current.permissions:\n        raise auth_error(\"PERMISSION_DENIED\", status.HTTP_403_FORBIDDEN)"
        },
        {
          "name": "require_tenant_mutation",
          "line": 75,
          "end": 80,
          "body": "def require_tenant_mutation(scope: ScopedTenant) -> None:\n    _, current = scope\n    try:\n        require_mutation_allowed(current)\n    except PermissionError as error:\n        raise auth_error(\"TENANT_READ_ONLY\", status.HTTP_403_FORBIDDEN) from error"
        },
        {
          "name": "health",
          "line": 84,
          "end": 93,
          "body": "def health(session: Session = Depends(get_session)) -> dict[str, str]:\n    \"\"\"Report readiness only after PostgreSQL accepts a query.\"\"\"\n    try:\n        session.execute(text(\"SELECT 1\"))\n    except SQLAlchemyError as error:\n        raise HTTPException(\n            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,\n            detail=\"database_unavailable\",\n        ) from error\n    return {\"status\": \"ok\", \"database\": \"postgresql\", \"environment\": get_settings().environment}"
        },
        {
          "name": "api_health",
          "line": 97,
          "end": 99,
          "body": "def api_health(session: Session = Depends(get_session)) -> dict[str, str]:\n    \"\"\"Versioned API health endpoint used by integration clients.\"\"\"\n    return health(session)"
        },
        {
          "name": "auth_config",
          "line": 103,
          "end": 131,
          "body": "def auth_config() -> dict[str, object]:\n    \"\"\"Expose only browser-safe sign-in configuration, never authorization scope.\"\"\"\n    settings = get_settings()\n    if settings.auth_mode == \"database\":\n        return {\"mode\": \"database\", \"allowDemo\": settings.environment == \"local\" and settings.allow_demo_auth}\n    if settings.auth_mode == \"local\":\n        if not settings.demo_auth_enabled:\n            raise auth_error(\"AUTH_CONFIGURATION_INVALID\", status.HTTP_503_SERVICE_UNAVAILABLE)\n        return {\"mode\": \"local\", \"allowDemo\": True}\n    required = (\n        settings.cognito_client_id,\n        settings.cognito_authorization_endpoint,\n        settings.cognito_token_endpoint,\n        settings.cognito_logout_endpoint,\n        settings.cognito_callback_uri,\n        settings.cognito_logout_uri,\n    )\n    if not all(required):\n        raise auth_error(\"AUTH_CONFIGURATION_INVALID\", status.HTTP_503_SERVICE_UNAVAILABLE)\n    return {\n        \"mode\": \"cognito\",\n        \"clientId\": settings.cognito_client_id,\n        \"authorizationEndpoint\": str(settings.cognito_authorization_endpoint),\n        \"tokenEndpoint\": str(settings.cognito_token_endpoint),\n        \"logoutEndpoint\": str(settings.cognito_logout_endpoint),\n        \"callbackUri\": str(settings.cognito_callback_uri),\n        \"logoutUri\": str(settings.cognito_logout_uri),\n        \"scopes\": [\"openid\", \"email\"],\n    }"
        },
        {
          "name": "session",
          "line": 135,
          "end": 138,
          "body": "def session(scope: ScopedTenant) -> dict[str, object]:\n    \"\"\"Return the server-resolved Tenant session used by the existing Cognito UI.\"\"\"\n    _, current = scope\n    return session_payload(current)"
        },
        {
          "name": "read_tenant_settings",
          "line": 142,
          "end": 150,
          "body": "def read_tenant_settings(scope: ScopedTenant) -> dict[str, object]:\n    \"\"\"A first Tenant-owned read proves that RLS is part of the API boundary.\"\"\"\n    session, current = scope\n    require_permission(scope, \"tenant.settings.read\")\n    row = session.execute(\n        text(\"SELECT settings, updated_at FROM tenant_settings WHERE tenant_id = :tenant_id\"),\n        {\"tenant_id\": str(current.tenant_id)},\n    ).mappings().one_or_none()\n    return {\"settings\": dict(row[\"settings\"]) if row else {}, \"updatedAt\": row[\"updated_at\"].isoformat() if row else None}"
        },
        {
          "name": "read_tenant_theme",
          "line": 154,
          "end": 158,
          "body": "def read_tenant_theme(scope: ScopedTenant) -> dict[str, str]:\n    session, current = scope\n    row = session.execute(text(\"SELECT settings->'appTheme' FROM tenant_settings WHERE tenant_id=:tenant\"),\n                          {\"tenant\": str(current.tenant_id)}).scalar_one_or_none()\n    return {\"fontId\": row.get(\"fontId\", \"system\"), \"paletteId\": row.get(\"paletteId\", \"go-lite\")} if isinstance(row, dict) else {\"fontId\": \"system\", \"paletteId\": \"go-lite\"}"
        },
        {
          "name": "write_tenant_theme",
          "line": 162,
          "end": 172,
          "body": "def write_tenant_theme(input: ThemeUpdate, scope: ScopedTenant) -> dict[str, str]:\n    session, current = scope\n    require_tenant_mutation(scope)\n    require_permission(scope, \"tenant.settings.write\")\n    theme = input.model_dump()\n    session.execute(text(\"\"\"INSERT INTO tenant_settings(tenant_id,settings,updated_by)\n        VALUES (:tenant,jsonb_build_object('appTheme',CAST(:theme AS jsonb)),:actor)\n        ON CONFLICT (tenant_id) DO UPDATE SET settings=jsonb_set(tenant_settings.settings,'{appTheme}',\n        CAST(:theme AS jsonb),true),updated_by=:actor,updated_at=now()\"\"\"),\n        {\"tenant\": str(current.tenant_id), \"theme\": __import__(\"json\").dumps(theme), \"actor\": str(current.actor_id)})\n    return theme"
        },
        {
          "name": "write_tenant_settings",
          "line": 176,
          "end": 194,
          "body": "def write_tenant_settings(input: SettingsUpdate, scope: ScopedTenant) -> dict[str, object]:\n    \"\"\"Write through the trusted Tenant context; caller-supplied tenant ids do not exist here.\"\"\"\n    session, current = scope\n    require_tenant_mutation(scope)\n    require_permission(scope, \"tenant.settings.write\")\n    row = session.execute(\n        text(\n            \"\"\"\n            INSERT INTO tenant_settings (tenant_id, settings, updated_by)\n            VALUES (:tenant_id, CAST(:settings AS jsonb), :actor_id)\n            ON CONFLICT (tenant_id) DO UPDATE\n            SET settings = tenant_settings.settings || EXCLUDED.settings,\n                updated_by = EXCLUDED.updated_by, updated_at = now()\n            RETURNING settings, updated_at\n            \"\"\"\n        ),\n        {\"tenant_id\": str(current.tenant_id), \"settings\": __import__(\"json\").dumps(input.settings), \"actor_id\": str(current.actor_id)},\n    ).mappings().one()\n    return {\"settings\": dict(row[\"settings\"]), \"updatedAt\": row[\"updated_at\"].isoformat()}"
        },
        {
          "name": "read_branch_settings",
          "line": 198,
          "end": 210,
          "body": "def read_branch_settings(branch_id: UUID, scope: ScopedTenant) -> dict[str, object]:\n    \"\"\"Branch paths are narrowed against the server membership before querying RLS data.\"\"\"\n    session, current = scope\n    require_permission(scope, \"branch.settings.read\")\n    try:\n        require_branch(current, branch_id)\n    except PermissionError as error:\n        raise auth_error(\"BRANCH_ACCESS_DENIED\", status.HTTP_403_FORBIDDEN) from error\n    row = session.execute(\n        text(\"SELECT settings, updated_at FROM branch_settings WHERE tenant_id = :tenant_id AND branch_id = :branch_id\"),\n        {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(branch_id)},\n    ).mappings().one_or_none()\n    return {\"settings\": dict(row[\"settings\"]) if row else {}, \"updatedAt\": row[\"updated_at\"].isoformat() if row else None}"
        }
      ]
    },
    {
      "file": "/app/app/materials.py",
      "functions": [
        {
          "name": "_request_permission",
          "line": 53,
          "end": 58,
          "body": "def _request_permission(scope: ScopedTenant, *, mutation: bool) -> TenantScope:\n    return _require_any(scope, (\n        \"page.material-requests.write\" if mutation else \"page.material-requests.read\",\n        \"page.job-card.write\" if mutation else \"page.job-card.read\",\n        \"page.my-queue.write\" if mutation else \"page.my-queue.read\",\n    ), mutation=mutation)"
        },
        {
          "name": "_store_permission",
          "line": 61,
          "end": 66,
          "body": "def _store_permission(scope: ScopedTenant, *, mutation: bool) -> TenantScope:\n    return _require_any(scope, (\n        \"page.issue-material.write\" if mutation else \"page.issue-material.read\",\n        \"page.reconcile.write\" if mutation else \"page.reconcile.read\",\n        \"page.stock.write\" if mutation else \"page.stock.read\",\n    ), mutation=mutation)"
        },
        {
          "name": "_reservation",
          "line": 69,
          "end": 82,
          "body": "def _reservation(row: dict[str, object], totals: dict[str, float], available_to_reserve: float) -> dict[str, object]:\n    reserved = float(row[\"reserved_qty\"])\n    issued = totals[\"issued\"]\n    released = totals[\"released\"]\n    return {\n        \"id\": row[\"id\"], \"jobId\": row[\"job_card_id\"], \"itemId\": row[\"item_id\"], \"branchId\": str(row[\"branch_id\"]),\n        \"reservedQty\": reserved, \"status\": row[\"status\"], \"note\": row[\"note\"],\n        \"issuedQty\": issued, \"returnedQty\": totals[\"returned\"], \"wastedQty\": totals[\"wasted\"],\n        \"releasedQty\": released, \"reversedQty\": totals[\"reversed\"],\n        \"availableToIssue\": max(0.0, reserved - issued - released),\n        \"availableToReserve\": max(0.0, available_to_reserve),\n        \"onJobQty\": max(0.0, issued - totals[\"returned\"] - totals[\"wasted\"] - totals[\"reversed\"]),\n        \"createdAt\": row[\"created_at\"], \"updatedAt\": row[\"updated_at\"],\n    }"
        },
        {
          "name": "_totals",
          "line": 85,
          "end": 94,
          "body": "def _totals(session, reservation_id: int) -> dict[str, float]:\n    row = session.execute(text(\"\"\"\n        SELECT COALESCE(SUM(quantity) FILTER (WHERE entry_type='ISSUE'),0) issued,\n               COALESCE(SUM(quantity) FILTER (WHERE entry_type='RETURN'),0) returned,\n               COALESCE(SUM(quantity) FILTER (WHERE entry_type='WASTE'),0) wasted,\n               COALESCE(SUM(quantity) FILTER (WHERE entry_type='RELEASE'),0) released,\n               COALESCE(SUM(quantity) FILTER (WHERE entry_type='ISSUE_REVERSAL'),0) reversed\n        FROM material_ledger WHERE reservation_id=:reservation_id\n    \"\"\"), {\"reservation_id\": reservation_id}).mappings().one()\n    return {name: float(row[name]) for name in (\"issued\", \"returned\", \"wasted\", \"released\", \"reversed\")}"
        },
        {
          "name": "_reservation_with_totals",
          "line": 97,
          "end": 99,
          "body": "def _reservation_with_totals(session, reservation_id: int) -> dict[str, object]:\n    row = _row_or_404(session, \"material_reservations\", reservation_id, \"MATERIAL_RESERVATION_NOT_FOUND\")\n    return _reservation(row, _totals(session, reservation_id), _available_to_reserve(session, int(row[\"item_id\"]), row[\"branch_id\"]))"
        },
        {
          "name": "_event",
          "line": 102,
          "end": 107,
          "body": "def _event(row: dict[str, object]) -> dict[str, object]:\n    return {\n        \"id\": row[\"id\"], \"reservationId\": row[\"reservation_id\"], \"jobId\": row[\"job_card_id\"], \"itemId\": row[\"item_id\"],\n        \"branchId\": str(row[\"branch_id\"]), \"entryType\": row[\"entry_type\"], \"quantity\": float(row[\"quantity\"]),\n        \"reason\": row[\"reason\"], \"actorId\": str(row[\"actor_id\"]), \"createdAt\": row[\"created_at\"],\n    }"
        },
        {
          "name": "_approved_job",
          "line": 110,
          "end": 119,
          "body": "def _approved_job(session, job_id: int) -> dict[str, object]:\n    job = _row_or_404(session, \"job_cards\", job_id, \"JOB_NOT_FOUND\")\n    if job[\"status\"] in (\"CANCELLED\", \"CLOSED\"):\n        raise auth_error(\"JOB_TERMINAL\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    approved = session.execute(text(\"\"\"\n        SELECT 1 FROM estimates WHERE job_card_id=:job_id AND status='APPROVED' AND superseded_at IS NULL\n    \"\"\"), {\"job_id\": job_id}).scalar()\n    if not approved:\n        raise auth_error(\"MATERIAL_RESERVATION_REQUIRES_APPROVED_ESTIMATE\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    return job"
        },
        {
          "name": "_item_for_update",
          "line": 122,
          "end": 128,
          "body": "def _item_for_update(session, item_id: int, branch_id: UUID) -> dict[str, object]:\n    row = session.execute(text(\"\"\"\n        SELECT * FROM catalogue_items WHERE id=:item_id AND branch_id=:branch_id AND archived_at IS NULL FOR UPDATE\n    \"\"\"), {\"item_id\": item_id, \"branch_id\": str(branch_id)}).mappings().one_or_none()\n    if row is None:\n        raise auth_error(\"CATALOGUE_ITEM_NOT_AVAILABLE\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    return dict(row)"
        },
        {
          "name": "_available_to_reserve",
          "line": 131,
          "end": 142,
          "body": "def _available_to_reserve(session, item_id: int, branch_id: UUID) -> float:\n    row = session.execute(text(\"\"\"\n        WITH stock AS (\n            SELECT COALESCE(SUM(quantity),0) AS on_hand FROM stock_ledger WHERE item_id=:item_id AND branch_id=:branch_id\n        ), held AS (\n            SELECT COALESCE(SUM(r.reserved_qty\n              - COALESCE((SELECT SUM(entry.quantity) FROM material_ledger entry WHERE entry.reservation_id=r.id AND entry.entry_type='ISSUE'),0)\n              - COALESCE((SELECT SUM(entry.quantity) FROM material_ledger entry WHERE entry.reservation_id=r.id AND entry.entry_type='RELEASE'),0)\n            ),0) AS held FROM material_reservations r WHERE r.item_id=:item_id AND r.branch_id=:branch_id\n        ) SELECT stock.on_hand-held.held AS available FROM stock, held\n    \"\"\"), {\"item_id\": item_id, \"branch_id\": str(branch_id)}).mappings().one()\n    return float(row[\"available\"])"
        },
        {
          "name": "_reconcile",
          "line": 145,
          "end": 157,
          "body": "def _reconcile(session, reservation_id: int, actor_id: UUID) -> None:\n    row = _row_or_404(session, \"material_reservations\", reservation_id, \"MATERIAL_RESERVATION_NOT_FOUND\")\n    totals = _totals(session, reservation_id)\n    if totals[\"released\"] >= float(row[\"reserved_qty\"]):\n        next_status = \"RELEASED\"\n    elif totals[\"issued\"] >= float(row[\"reserved_qty\"]) - totals[\"released\"]:\n        next_status = \"ISSUED\"\n    elif totals[\"issued\"] > 0:\n        next_status = \"PARTIALLY_ISSUED\"\n    else:\n        next_status = \"RESERVED\"\n    session.execute(text(\"\"\"UPDATE material_reservations SET status=:status,updated_by=:actor_id,updated_at=now()\n        WHERE id=:id\"\"\"), {\"id\": reservation_id, \"status\": next_status, \"actor_id\": str(actor_id)})"
        },
        {
          "name": "list_reservations",
          "line": 161,
          "end": 173,
          "body": "def list_reservations(scope: ScopedTenant, job_id: int | None = Query(default=None, alias=\"jobId\"), branch_id: UUID | None = Query(default=None, alias=\"branchId\")) -> list[dict[str, object]]:\n    session, current = scope\n    _request_permission(scope, mutation=False)\n    if branch_id is not None:\n        _branch(current, branch_id)\n    filters, values = [], {}\n    if job_id is not None:\n        filters.append(\"job_card_id=:job_id\"); values[\"job_id\"] = job_id\n    if branch_id is not None:\n        filters.append(\"branch_id=:branch_id\"); values[\"branch_id\"] = str(branch_id)\n    where = f\" WHERE {' AND '.join(filters)}\" if filters else \"\"\n    rows = session.execute(text(f\"SELECT id FROM material_reservations{where} ORDER BY created_at DESC,id DESC\"), values).mappings().all()\n    return [_reservation_with_totals(session, int(row[\"id\"])) for row in rows]"
        },
        {
          "name": "list_job_reservations",
          "line": 177,
          "end": 178,
          "body": "def list_job_reservations(job_id: int, scope: ScopedTenant) -> list[dict[str, object]]:\n    return list_reservations(scope, job_id=job_id)"
        },
        {
          "name": "list_material_ledger",
          "line": 182,
          "end": 193,
          "body": "def list_material_ledger(scope: ScopedTenant, reservation_id: int | None = Query(default=None, alias=\"reservationId\"), job_id: int | None = Query(default=None, alias=\"jobId\"), branch_id: UUID | None = Query(default=None, alias=\"branchId\")) -> list[dict[str, object]]:\n    session, current = scope\n    _store_permission(scope, mutation=False)\n    if branch_id is not None:\n        _branch(current, branch_id)\n    filters, values = [], {}\n    for column, value in ((\"reservation_id\", reservation_id), (\"job_card_id\", job_id), (\"branch_id\", str(branch_id) if branch_id else None)):\n        if value is not None:\n            filters.append(f\"{column}=:{column}\"); values[column] = value\n    where = f\" WHERE {' AND '.join(filters)}\" if filters else \"\"\n    rows = session.execute(text(f\"SELECT * FROM material_ledger{where} ORDER BY created_at DESC,id DESC\"), values).mappings().all()\n    return [_event(dict(row)) for row in rows]"
        },
        {
          "name": "create_reservation",
          "line": 197,
          "end": 222,
          "body": "def create_reservation(input: MaterialReservationInput, scope: ScopedTenant, request_key: Annotated[str | None, Header(alias=\"Idempotency-Key\")] = None) -> dict[str, object]:\n    session, current = scope\n    branch_id = _branch(_request_permission(scope, mutation=True), input.branch_id)\n    job = _approved_job(session, input.job_id)\n    if job[\"branch_id\"] != branch_id:\n        raise auth_error(\"JOB_BRANCH_MISMATCH\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    _item_for_update(session, input.item_id, branch_id)\n    if request_key and (replay := session.execute(text(\"\"\"SELECT id FROM material_reservations\n        WHERE tenant_id=:tenant_id AND job_card_id=:job_id AND request_key=:request_key\"\"\"),\n        {\"tenant_id\": str(current.tenant_id), \"job_id\": input.job_id, \"request_key\": request_key.strip()}).scalar()):\n        return _reservation_with_totals(session, int(replay))\n    available = _available_to_reserve(session, input.item_id, branch_id)\n    if input.quantity > available:\n        raise auth_error(\"INSUFFICIENT_AVAILABLE_STOCK_TO_RESERVE\", status.HTTP_409_CONFLICT)\n    reservation = session.execute(text(\"\"\"INSERT INTO material_reservations\n        (tenant_id,branch_id,job_card_id,item_id,reserved_qty,status,note,request_key,created_by,updated_by)\n        VALUES (:tenant_id,:branch_id,:job_id,:item_id,:quantity,'RESERVED',:note,:request_key,:actor_id,:actor_id) RETURNING *\"\"\"),\n        {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(branch_id), \"job_id\": input.job_id, \"item_id\": input.item_id,\n         \"quantity\": input.quantity, \"note\": input.note.strip(), \"request_key\": request_key.strip() if request_key else None, \"actor_id\": str(current.actor_id)}).mappings().one()\n    session.execute(text(\"\"\"INSERT INTO material_ledger (tenant_id,branch_id,reservation_id,job_card_id,item_id,entry_type,quantity,reason,actor_id)\n        VALUES (:tenant_id,:branch_id,:reservation_id,:job_id,:item_id,'RESERVE',:quantity,:reason,:actor_id)\"\"\"),\n        {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(branch_id), \"reservation_id\": reservation[\"id\"], \"job_id\": input.job_id,\n         \"item_id\": input.item_id, \"quantity\": input.quantity, \"reason\": input.note.strip() or \"Reserved for approved job\", \"actor_id\": str(current.actor_id)})\n    payload = _reservation_with_totals(session, int(reservation[\"id\"]))\n    _audit(session, current, \"MATERIAL_RESERVED\", input.note.strip() or \"Material reserved\", {}, payload)\n    return payload"
        },
        {
          "name": "create_material_shortage",
          "line": 226,
          "end": 238,
          "body": "def create_material_shortage(input: MaterialShortageInput, scope: ScopedTenant) -> dict[str, object]:\n    \"\"\"Record a procurement demand only when authoritative branch availability is insufficient.\"\"\"\n    session, current = scope\n    branch_id = _branch(_request_permission(scope, mutation=True), input.branch_id)\n    _item_for_update(session, input.item_id, branch_id)\n    available = _available_to_reserve(session, input.item_id, branch_id)\n    if input.requested_qty <= available:\n        raise auth_error(\"MATERIAL_SHORTAGE_NOT_PRESENT\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    row = session.execute(text(\"\"\"INSERT INTO material_shortages(tenant_id,branch_id,item_id,requested_qty,available_qty,shortage_qty,status,created_by)\n        VALUES(:tenant,:branch,:item,:requested,:available,:shortage,'OPEN',:actor) RETURNING *\"\"\"), {\"tenant\": str(current.tenant_id), \"branch\": str(branch_id), \"item\": input.item_id, \"requested\": input.requested_qty, \"available\": available, \"shortage\": input.requested_qty - available, \"actor\": str(current.actor_id)}).mappings().one()\n    payload = {\"id\": row[\"id\"], \"itemId\": row[\"item_id\"], \"requestedQty\": float(row[\"requested_qty\"]), \"availableQty\": float(row[\"available_qty\"]), \"shortageQty\": float(row[\"shortage_qty\"]), \"status\": row[\"status\"]}\n    _audit(session, current, \"MATERIAL_SHORTAGE_RECORDED\", \"Authoritative branch material shortage\", {}, payload)\n    return payload"
        },
        {
          "name": "material_command",
          "line": 242,
          "end": 270,
          "body": "def material_command(reservation_id: int, command: MaterialCommandName, input: MaterialCommand, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    _store_permission(scope, mutation=True)\n    reservation = _row_or_404(session, \"material_reservations\", reservation_id, \"MATERIAL_RESERVATION_NOT_FOUND\")\n    job = _row_or_404(session, \"job_cards\", int(reservation[\"job_card_id\"]), \"JOB_NOT_FOUND\")\n    if job[\"status\"] in (\"CANCELLED\", \"CLOSED\"):\n        raise auth_error(\"JOB_TERMINAL\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    if command == \"issue\" and job[\"status\"] != \"IN_PROGRESS\":\n        raise auth_error(\"MATERIAL_ISSUE_REQUIRES_ACTIVE_JOB\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    _item_for_update(session, int(reservation[\"item_id\"]), reservation[\"branch_id\"])\n    event_type = {\"issue\": \"ISSUE\", \"return\": \"RETURN\", \"waste\": \"WASTE\", \"release\": \"RELEASE\", \"reverse-issue\": \"ISSUE_REVERSAL\"}[command]\n    if command in (\"waste\", \"release\", \"reverse-issue\") and not input.reason.strip():\n        raise auth_error(\"MATERIAL_COMMAND_REASON_REQUIRED\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    before = _reservation_with_totals(session, reservation_id)\n    try:\n        event = session.execute(text(\"\"\"INSERT INTO material_ledger\n            (tenant_id,branch_id,reservation_id,job_card_id,item_id,entry_type,quantity,reason,actor_id)\n            VALUES (:tenant_id,:branch_id,:reservation_id,:job_id,:item_id,:entry_type,:quantity,:reason,:actor_id) RETURNING *\"\"\"),\n            {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(reservation[\"branch_id\"]), \"reservation_id\": reservation_id,\n             \"job_id\": reservation[\"job_card_id\"], \"item_id\": reservation[\"item_id\"], \"entry_type\": event_type,\n             \"quantity\": input.quantity, \"reason\": input.reason.strip() or event_type.replace(\"_\", \" \").title(), \"actor_id\": str(current.actor_id)}).mappings().one()\n    except Exception as error:\n        message = str(error.orig) if getattr(error, \"orig\", None) else str(error)\n        code = \"NEGATIVE_STOCK_NOT_ALLOWED\" if \"negative_stock_not_allowed\" in message else \"MATERIAL_QUANTITY_INVARIANT_VIOLATION\"\n        raise auth_error(code, status.HTTP_409_CONFLICT) from error\n    _reconcile(session, reservation_id, current.actor_id)\n    payload = {\"reservation\": _reservation_with_totals(session, reservation_id), \"event\": _event(dict(event))}\n    _audit(session, current, f\"MATERIAL_{event_type}\", input.reason.strip() or event_type.replace(\"_\", \" \").title(), before, payload)\n    return payload"
        }
      ]
    },
    {
      "file": "/app/app/media.py",
      "functions": [
        {
          "name": "_require",
          "line": 34,
          "end": 44,
          "body": "def _require(scope: ScopedTenant, write: bool = False) -> None:\n    current = scope[1]\n    if write:\n        try:\n            require_mutation_allowed(current)\n        except PermissionError as error:\n            raise auth_error(\"TENANT_READ_ONLY\", status.HTTP_403_FORBIDDEN) from error\n    if current.actor_type == \"support_emulation\" and not write:\n        return\n    if f\"page.media.{'write' if write else 'read'}\" not in current.permissions:\n        raise auth_error(\"PERMISSION_DENIED\", status.HTTP_403_FORBIDDEN)"
        },
        {
          "name": "_row",
          "line": 47,
          "end": 53,
          "body": "def _row(session, media_id: int):\n    return session.execute(text(\"\"\"\n        SELECT m.*, j.job_no, v.number AS vehicle_no\n        FROM job_media m JOIN job_cards j ON j.id=m.job_card_id\n        JOIN visits i ON i.id=j.visit_id JOIN vehicles v ON v.id=i.vehicle_id\n        WHERE m.id=:id\n    \"\"\"), {\"id\": media_id}).mappings().one_or_none()"
        },
        {
          "name": "_payload",
          "line": 56,
          "end": 60,
          "body": "def _payload(row):\n    return {\"id\": row[\"id\"], \"jobId\": row[\"job_card_id\"], \"jobNo\": row[\"job_no\"],\n            \"vehicleNo\": row[\"vehicle_no\"], \"branchId\": str(row[\"branch_id\"]), \"label\": row[\"label\"],\n            \"category\": row[\"category\"], \"src\": row[\"src\"], \"archivedAt\": row[\"archived_at\"],\n            \"createdAt\": row[\"created_at\"], \"updatedAt\": row[\"updated_at\"]}"
        },
        {
          "name": "list_media",
          "line": 64,
          "end": 71,
          "body": "def list_media(scope: ScopedTenant, job_id: int | None = Query(None, alias=\"jobId\")):\n    _require(scope)\n    rows = scope[0].execute(text(\"\"\"\n        SELECT m.id FROM job_media m WHERE m.archived_at IS NULL\n          AND (CAST(:job AS bigint) IS NULL OR m.job_card_id=:job)\n        ORDER BY m.created_at DESC, m.id DESC\n    \"\"\"), {\"job\": job_id}).mappings()\n    return [_payload(_row(scope[0], int(row[\"id\"]))) for row in rows]"
        },
        {
          "name": "create_media",
          "line": 75,
          "end": 89,
          "body": "def create_media(input: MediaInput, scope: ScopedTenant):\n    _require(scope, True)\n    session, current = scope\n    if not SAFE_SOURCE.fullmatch(input.src) and input.src != \"/media-placeholder.svg\":\n        raise auth_error(\"INVALID_MEDIA_SOURCE\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    job = session.execute(text(\"SELECT id,branch_id FROM job_cards WHERE id=:id AND archived_at IS NULL\"),\n                          {\"id\": input.jobId}).mappings().one_or_none()\n    if not job:\n        raise auth_error(\"JOB_NOT_FOUND\", status.HTTP_404_NOT_FOUND)\n    media_id = session.execute(text(\"\"\"INSERT INTO job_media(tenant_id,branch_id,job_card_id,label,category,src,created_by,updated_by)\n        VALUES (:tenant,:branch,:job,:label,:category,:src,:actor,:actor) RETURNING id\"\"\"),\n        {\"tenant\": str(current.tenant_id), \"branch\": str(job[\"branch_id\"]), \"job\": input.jobId,\n         \"label\": input.label.strip(), \"category\": input.category.strip(), \"src\": input.src,\n         \"actor\": str(current.actor_id)}).scalar_one()\n    return _payload(_row(session, media_id))"
        },
        {
          "name": "update_media",
          "line": 93,
          "end": 101,
          "body": "def update_media(media_id: int, input: MediaUpdate, scope: ScopedTenant):\n    _require(scope, True)\n    row = scope[0].execute(text(\"\"\"UPDATE job_media SET label=:label, category=:category, updated_by=:actor, updated_at=now()\n        WHERE id=:id AND archived_at IS NULL RETURNING id\"\"\"),\n        {\"id\": media_id, \"label\": input.label.strip(), \"category\": input.category.strip(),\n         \"actor\": str(scope[1].actor_id)}).scalar_one_or_none()\n    if row is None:\n        raise auth_error(\"MEDIA_NOT_FOUND\", status.HTTP_404_NOT_FOUND)\n    return _payload(_row(scope[0], media_id))"
        },
        {
          "name": "archive_media",
          "line": 105,
          "end": 112,
          "body": "def archive_media(media_id: int, input: ArchiveInput, scope: ScopedTenant):\n    _require(scope, True)\n    row = scope[0].execute(text(\"\"\"UPDATE job_media SET archived_at=now(), archive_reason=:reason, updated_by=:actor, updated_at=now()\n        WHERE id=:id AND archived_at IS NULL RETURNING id\"\"\"),\n        {\"id\": media_id, \"reason\": input.reason.strip(), \"actor\": str(scope[1].actor_id)}).scalar_one_or_none()\n    if row is None:\n        raise auth_error(\"MEDIA_NOT_FOUND\", status.HTTP_404_NOT_FOUND)\n    return _payload(_row(scope[0], media_id))"
        }
      ]
    },
    {
      "file": "/app/app/procurement.py",
      "functions": [
        {
          "name": "_page",
          "line": 57,
          "end": 58,
          "body": "def _page(scope: ScopedTenant, *, mutation: bool) -> TenantScope:\n    return _require_any(scope, (f\"page.inward-purchases.{'write' if mutation else 'read'}\",), mutation=mutation)"
        },
        {
          "name": "_admin",
          "line": 59,
          "end": 62,
          "body": "def _admin(scope: ScopedTenant) -> TenantScope:\n    current = _page(scope, mutation=True)\n    if not any(name == \"Owner/Admin\" for _, name, _ in current.roles): raise auth_error(\"PURCHASE_REQUEST_ADMIN_REQUIRED\", status.HTTP_403_FORBIDDEN)\n    return current"
        },
        {
          "name": "_row",
          "line": 63,
          "end": 66,
          "body": "def _row(session, table: str, ident: int, code: str) -> dict[str, object]:\n    value = session.execute(text(f\"SELECT * FROM {table} WHERE id=:id\"), {\"id\": ident}).mappings().one_or_none()\n    if value is None: raise auth_error(code, status.HTTP_404_NOT_FOUND)\n    return dict(value)"
        },
        {
          "name": "_line",
          "line": 67,
          "end": 67,
          "body": "def _line(row: dict[str, object]) -> dict[str, object]: return {\"id\": row[\"id\"], \"itemId\": row[\"item_id\"], \"newItemName\": row[\"new_item_name\"], \"unit\": row[\"unit\"], \"orderedQty\": float(row[\"ordered_qty\"]), \"lineNo\": row[\"line_no\"], \"materialShortageId\": row.get(\"material_shortage_id\")}"
        },
        {
          "name": "_request",
          "line": 68,
          "end": 73,
          "body": "def _request(session, request_id: int) -> dict[str, object]:\n    row = _row(session, \"purchase_requests\", request_id, \"PURCHASE_REQUEST_NOT_FOUND\")\n    lines = [_line(dict(line)) for line in session.execute(text(\"SELECT * FROM purchase_request_lines WHERE purchase_request_id=:id ORDER BY line_no\"), {\"id\": request_id}).mappings()]\n    orders = [_purchase_with_lines(session, int(value[\"purchase_order_id\"])) for value in session.execute(text(\"SELECT purchase_order_id FROM purchase_request_purchase_orders WHERE purchase_request_id=:id ORDER BY purchase_order_id\"), {\"id\": request_id}).mappings()]\n    events = [{\"command\": value[\"command\"], \"reason\": value[\"reason\"], \"actorId\": str(value[\"actor_id\"]), \"at\": value[\"created_at\"]} for value in session.execute(text(\"SELECT * FROM purchase_request_events WHERE purchase_request_id=:id ORDER BY id\"), {\"id\": request_id}).mappings()]\n    return {\"id\": row[\"id\"], \"branchId\": str(row[\"branch_id\"]), \"requestNumber\": row[\"request_number\"], \"sourceReference\": row[\"source_reference\"], \"notes\": row[\"notes\"], \"status\": row[\"status\"], \"requestedBy\": str(row[\"requested_by\"]), \"lines\": lines, \"purchaseOrders\": orders, \"events\": events, \"createdAt\": row[\"created_at\"], \"updatedAt\": row[\"updated_at\"]}"
        },
        {
          "name": "_event",
          "line": 74,
          "end": 75,
          "body": "def _event(session, current: TenantScope, request_id: int, command: str, reason: str = \"\") -> None:\n    session.execute(text(\"INSERT INTO purchase_request_events(tenant_id,branch_id,purchase_request_id,command,reason,actor_id) SELECT tenant_id,branch_id,id,:command,:reason,:actor FROM purchase_requests WHERE id=:id\"), {\"id\": request_id, \"command\": command, \"reason\": reason, \"actor\": str(current.actor_id)})"
        },
        {
          "name": "list_requests",
          "line": 78,
          "end": 82,
          "body": "def list_requests(scope: ScopedTenant, branch_id: UUID | None = Query(default=None, alias=\"branchId\")) -> list[dict[str, object]]:\n    session, current = scope; _page(scope, mutation=False)\n    if branch_id: _branch(current, branch_id)\n    rows = session.execute(text(\"SELECT id FROM purchase_requests WHERE (CAST(:branch AS uuid) IS NULL OR branch_id=:branch) ORDER BY created_at DESC,id DESC\"), {\"branch\": str(branch_id) if branch_id else None}).mappings()\n    return [_request(session, int(row[\"id\"])) for row in rows]"
        },
        {
          "name": "get_request",
          "line": 84,
          "end": 85,
          "body": "def get_request(request_id: int, scope: ScopedTenant) -> dict[str, object]:\n    session, _ = scope; _page(scope, mutation=False); return _request(session, request_id)"
        },
        {
          "name": "create_request",
          "line": 87,
          "end": 102,
          "body": "def create_request(input: PurchaseRequestInput, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope; branch = _branch(_page(scope, mutation=True), input.branch_id)\n    result = session.execute(text(\"INSERT INTO purchase_requests(tenant_id,branch_id,request_number,source_reference,notes,status,requested_by) VALUES(:tenant,:branch,:number,:source,:notes,'REQUESTED',:actor) RETURNING id\"), {\"tenant\": str(current.tenant_id), \"branch\": str(branch), \"number\": _clean(input.request_number), \"source\": input.source_reference.strip(), \"notes\": input.notes.strip(), \"actor\": str(current.actor_id)}).mappings().one(); request_id = int(result[\"id\"])\n    for number, line in enumerate(input.lines, 1):\n        item = None\n        if line.item_id:\n            item = session.execute(text(\"SELECT name,unit FROM catalogue_items WHERE id=:id AND branch_id=:branch AND archived_at IS NULL\"), {\"id\": line.item_id, \"branch\": str(branch)}).mappings().one_or_none()\n            if item is None: raise auth_error(\"CATALOGUE_ITEM_NOT_AVAILABLE\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n        if line.material_shortage_id:\n            shortage = session.execute(text(\"SELECT * FROM material_shortages WHERE id=:id AND status='OPEN'\"), {\"id\": line.material_shortage_id}).mappings().one_or_none()\n            if shortage is None or int(shortage[\"item_id\"]) != line.item_id or line.ordered_qty > float(shortage[\"shortage_qty\"]): raise auth_error(\"MATERIAL_SHORTAGE_NOT_AUTHORIZED\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n        unit = (line.unit or (str(item[\"unit\"]) if item else \"\")).strip()\n        if not unit: raise auth_error(\"NEW_ITEM_UNIT_REQUIRED\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n        session.execute(text(\"INSERT INTO purchase_request_lines(tenant_id,branch_id,purchase_request_id,line_no,item_id,new_item_name,unit,ordered_qty,material_shortage_id) VALUES(:tenant,:branch,:request,:number,:item,:name,:unit,:qty,:shortage)\"), {\"tenant\": str(current.tenant_id), \"branch\": str(branch), \"request\": request_id, \"number\": number, \"item\": line.item_id, \"name\": line.new_item_name.strip() if line.new_item_name else None, \"unit\": unit, \"qty\": line.ordered_qty, \"shortage\": line.material_shortage_id})\n    _event(session, current, request_id, \"REQUESTED\", input.source_reference.strip() or \"Purchase Request created\")\n    payload = _request(session, request_id); _audit(session, current, \"PURCHASE_REQUEST_CREATED\", \"Purchase Request created\", {}, payload); return payload"
        },
        {
          "name": "add_quote",
          "line": 104,
          "end": 111,
          "body": "def add_quote(request_id: int, input: QuoteInput, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope; _admin(scope); request = _row(session, \"purchase_requests\", request_id, \"PURCHASE_REQUEST_NOT_FOUND\")\n    if request[\"status\"] != \"REQUESTED\": raise auth_error(\"PURCHASE_REQUEST_NOT_REVIEWABLE\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    line = _row(session, \"purchase_request_lines\", input.line_id, \"PURCHASE_REQUEST_LINE_NOT_FOUND\")\n    if line[\"purchase_request_id\"] != request_id: raise auth_error(\"PURCHASE_REQUEST_LINE_MISMATCH\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    _supplier_available(session, input.supplier_id, request[\"branch_id\"])\n    row = session.execute(text(\"INSERT INTO purchase_request_quotes(tenant_id,branch_id,purchase_request_line_id,supplier_id,unit_cost,note,created_by) VALUES(:tenant,:branch,:line,:supplier,:cost,:note,:actor) ON CONFLICT(purchase_request_line_id,supplier_id) DO UPDATE SET unit_cost=EXCLUDED.unit_cost,note=EXCLUDED.note,created_by=EXCLUDED.created_by RETURNING *\"), {\"tenant\": str(current.tenant_id), \"branch\": str(request[\"branch_id\"]), \"line\": input.line_id, \"supplier\": input.supplier_id, \"cost\": input.unit_cost, \"note\": input.note.strip(), \"actor\": str(current.actor_id)}).mappings().one()\n    return {\"id\": row[\"id\"], \"lineId\": row[\"purchase_request_line_id\"], \"supplierId\": row[\"supplier_id\"], \"unitCost\": float(row[\"unit_cost\"]), \"note\": row[\"note\"]}"
        },
        {
          "name": "comparison",
          "line": 113,
          "end": 119,
          "body": "def comparison(request_id: int, scope: ScopedTenant) -> dict[str, object]:\n    session, _ = scope; _admin(scope); _row(session, \"purchase_requests\", request_id, \"PURCHASE_REQUEST_NOT_FOUND\")\n    lines=[]\n    for line in session.execute(text(\"SELECT * FROM purchase_request_lines WHERE purchase_request_id=:id ORDER BY line_no\"), {\"id\": request_id}).mappings():\n        quotes=[{\"supplierId\": value[\"supplier_id\"], \"supplierName\": value[\"name\"], \"unitCost\": float(value[\"unit_cost\"]), \"note\": value[\"note\"]} for value in session.execute(text(\"SELECT quote.*,supplier.name FROM purchase_request_quotes quote JOIN suppliers supplier ON supplier.id=quote.supplier_id WHERE quote.purchase_request_line_id=:id ORDER BY quote.unit_cost,quote.id\"), {\"id\": line[\"id\"]}).mappings()]\n        lines.append({**_line(dict(line)), \"quotes\": quotes})\n    return {\"requestId\": request_id, \"lines\": lines}"
        },
        {
          "name": "approve",
          "line": 121,
          "end": 146,
          "body": "def approve(request_id: int, input: ApprovalInput, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope; _admin(scope); request = _row(session, \"purchase_requests\", request_id, \"PURCHASE_REQUEST_NOT_FOUND\")\n    if request[\"status\"] != \"REQUESTED\": raise auth_error(\"INVALID_PURCHASE_REQUEST_TRANSITION\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    lines=[dict(value) for value in session.execute(text(\"SELECT * FROM purchase_request_lines WHERE purchase_request_id=:id ORDER BY line_no\"), {\"id\": request_id}).mappings()]; choices={value.line_id:value for value in input.lines}\n    if len(choices) != len(lines) or set(choices) != {int(value[\"id\"]) for value in lines}: raise auth_error(\"PURCHASE_REQUEST_APPROVAL_INCOMPLETE\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    groups: dict[int,list[tuple[dict[str,object],ApprovalLine,int]]] = {}\n    for line in lines:\n        choice=choices[int(line[\"id\"])]; _supplier_available(session, choice.supplier_id, request[\"branch_id\"]); item_id=line[\"item_id\"]\n        quote = session.execute(text(\"SELECT 1 FROM purchase_request_quotes WHERE purchase_request_line_id=:line AND supplier_id=:supplier AND unit_cost=:cost\"), {\"line\": line[\"id\"], \"supplier\": choice.supplier_id, \"cost\": choice.unit_cost}).scalar()\n        if not quote: raise auth_error(\"SUPPLIER_QUOTE_SELECTION_REQUIRED\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n        if item_id is None:\n            item=choice.inventory_item\n            if item is None: raise auth_error(\"NEW_ITEM_SKU_REQUIRED\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n            duplicate = session.execute(text(\"SELECT 1 FROM catalogue_items WHERE branch_id=:branch AND upper(sku)=upper(:sku) AND archived_at IS NULL\"), {\"branch\": str(request[\"branch_id\"]), \"sku\": _clean(item.sku)}).scalar()\n            if duplicate: raise auth_error(\"CATALOGUE_SKU_ALREADY_EXISTS\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n            item_id=session.execute(text(\"INSERT INTO catalogue_items(tenant_id,branch_id,sku,category,name,unit,low_stock_qty,selling_price,created_by,updated_by) VALUES(:tenant,:branch,:sku,:category,:name,:unit,:low,:price,:actor,:actor) RETURNING id\"), {\"tenant\": str(current.tenant_id), \"branch\": str(request[\"branch_id\"]), \"sku\": _clean(item.sku).upper(), \"category\": item.category.strip(), \"name\": item.name.strip(), \"unit\": item.unit.strip(), \"low\": item.low_stock_qty, \"price\": item.selling_price, \"actor\": str(current.actor_id)}).scalar_one()\n            session.execute(text(\"UPDATE purchase_request_lines SET item_id=:item,new_item_name=NULL WHERE id=:id\"), {\"item\": item_id, \"id\": line[\"id\"]})\n        groups.setdefault(choice.supplier_id,[]).append((line,choice,int(item_id)))\n    for supplier_id, entries in groups.items():\n        number = f\"{request['request_number']}-{supplier_id}\"\n        po=session.execute(text(\"INSERT INTO purchase_orders(tenant_id,branch_id,supplier_id,po_number,order_date,status,notes,created_by,updated_by) VALUES(:tenant,:branch,:supplier,:number,:date,'DRAFT',:notes,:actor,:actor) RETURNING id\"), {\"tenant\": str(current.tenant_id), \"branch\": str(request[\"branch_id\"]), \"supplier\": supplier_id, \"number\": number, \"date\": date.today(), \"notes\": f\"Approved from Purchase Request {request['request_number']}\", \"actor\": str(current.actor_id)}).scalar_one()\n        for seq,(line,choice,item_id) in enumerate(entries,1): session.execute(text(\"INSERT INTO purchase_order_lines(tenant_id,branch_id,purchase_order_id,item_id,line_no,ordered_qty,unit_cost,discount,gst_rate) VALUES(:tenant,:branch,:po,:item,:seq,:qty,:cost,0,0)\"), {\"tenant\": str(current.tenant_id), \"branch\": str(request[\"branch_id\"]), \"po\": po, \"item\": item_id, \"seq\": seq, \"qty\": line[\"ordered_qty\"], \"cost\": choice.unit_cost})\n        session.execute(text(\"INSERT INTO purchase_request_purchase_orders(tenant_id,branch_id,purchase_request_id,purchase_order_id) VALUES(:tenant,:branch,:request,:po)\"), {\"tenant\": str(current.tenant_id), \"branch\": str(request[\"branch_id\"]), \"request\": request_id, \"po\": po})\n    session.execute(text(\"UPDATE purchase_requests SET status='APPROVED',approved_by=:actor,updated_at=now() WHERE id=:id\"), {\"actor\": str(current.actor_id), \"id\": request_id}); _event(session,current,request_id,\"APPROVED\",\"Supplier selections approved\")\n    session.execute(text(\"UPDATE material_shortages SET status='PROCURED',updated_at=now() WHERE id IN (SELECT material_shortage_id FROM purchase_request_lines WHERE purchase_request_id=:id AND material_shortage_id IS NOT NULL)\"), {\"id\": request_id})\n    payload=_request(session,request_id); _audit(session,current,\"PURCHASE_REQUEST_APPROVED\",\"Purchase Request approved\",{},payload); return payload"
        },
        {
          "name": "command",
          "line": 148,
          "end": 153,
          "body": "def command(request_id: int, command: Literal[\"issue\"], input: EmptyCommand, scope: ScopedTenant) -> dict[str, object]:\n    session,current=scope; _admin(scope); request=_row(session,\"purchase_requests\",request_id,\"PURCHASE_REQUEST_NOT_FOUND\")\n    if request[\"status\"] != \"APPROVED\": raise auth_error(\"INVALID_PURCHASE_REQUEST_TRANSITION\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    session.execute(text(\"UPDATE purchase_orders SET status='SENT',updated_by=:actor,updated_at=now() WHERE id IN (SELECT purchase_order_id FROM purchase_request_purchase_orders WHERE purchase_request_id=:request)\"), {\"actor\": str(current.actor_id), \"request\": request_id})\n    session.execute(text(\"UPDATE purchase_requests SET status='ISSUED',updated_at=now() WHERE id=:id\"), {\"id\": request_id}); _event(session,current,request_id,\"ISSUED\",input.reason.strip() or \"Purchase Orders issued\")\n    payload=_request(session,request_id); _audit(session,current,\"PURCHASE_REQUEST_ISSUED\",\"Approved Purchase Orders issued\",{},payload); return payload"
        }
      ]
    },
    {
      "file": "/app/app/sales_crm.py",
      "functions": [
        {
          "name": "_admin",
          "line": 58,
          "end": 68,
          "body": "def _admin(scope: ScopedTenant, mutation: bool = False):\n    _, current = scope\n    if current.actor_type == \"support_emulation\":\n        if mutation: raise auth_error(\"TENANT_READ_ONLY\", status.HTTP_403_FORBIDDEN)\n        return current\n    if not any(name == \"Owner/Admin\" for _, name, _ in current.roles):\n        raise auth_error(\"SALES_CRM_ADMIN_REQUIRED\", status.HTTP_403_FORBIDDEN)\n    if mutation:\n        try: require_mutation_allowed(current)\n        except PermissionError as error: raise auth_error(\"TENANT_READ_ONLY\", status.HTTP_403_FORBIDDEN) from error\n    return current"
        },
        {
          "name": "_lead",
          "line": 70,
          "end": 71,
          "body": "def _lead(row):\n    return {\"id\": row[\"id\"], \"branchId\": str(row[\"branch_id\"]), \"displayName\": row[\"display_name\"], \"phone\": row[\"phone\"], \"company\": row[\"company\"], \"companyNotEntered\": row[\"company_not_entered\"], \"email\": row[\"email\"], \"emailNotEntered\": row[\"email_not_entered\"], \"address\": row[\"address\"], \"serviceInterest\": row[\"service_interest\"], \"notes\": row[\"notes\"], \"stage\": row[\"stage\"], \"temperature\": row[\"temperature\"], \"followUpDue\": row[\"follow_up_due\"], \"siteVisitCompleted\": row[\"site_visit_completed\"], \"siteVisitDate\": row[\"site_visit_date\"], \"createdAt\": row[\"created_at\"], \"updatedAt\": row[\"updated_at\"]}"
        },
        {
          "name": "_quotation",
          "line": 72,
          "end": 74,
          "body": "def _quotation(session, row):\n    lines = [{\"id\": x[\"id\"], \"kind\": x[\"kind\"], \"description\": x[\"description\"], \"quantity\": float(x[\"quantity\"]), \"rate\": float(x[\"rate\"]), \"gstRate\": float(x[\"gst_rate\"])} for x in session.execute(text(\"SELECT * FROM quotation_lines WHERE quotation_id=:id ORDER BY line_no\"), {\"id\": row[\"id\"]}).mappings()]\n    return {\"id\": row[\"id\"], \"branchId\": str(row[\"branch_id\"]), \"leadId\": row[\"lead_id\"], \"quotationNo\": row[\"quotation_no\"], \"status\": row[\"status\"], \"validUntil\": row[\"valid_until\"], \"customerNotes\": row[\"customer_notes\"], \"discount\": float(row[\"discount\"]), \"subtotal\": float(row[\"subtotal\"]), \"gstAmount\": float(row[\"gst_amount\"]), \"total\": float(row[\"total\"]), \"templateId\": row[\"template_id\"], \"templateHtml\": row[\"template_html\"], \"createdAt\": row[\"created_at\"], \"updatedAt\": row[\"updated_at\"], \"lines\": lines}"
        },
        {
          "name": "_totals",
          "line": 75,
          "end": 78,
          "body": "def _totals(lines, discount):\n    subtotal = sum(line.quantity * line.rate for line in lines); net = max(0, subtotal - discount)\n    gst = sum(max(0, line.quantity * line.rate - (discount * (line.quantity * line.rate / subtotal) if subtotal else 0)) * line.gst_rate / 100 for line in lines)\n    return subtotal, gst, net + gst"
        },
        {
          "name": "_snapshot",
          "line": 79,
          "end": 80,
          "body": "def _snapshot(input, lead, subtotal, gst, total, company):\n    return json.dumps({\"templateId\": input.template_id, \"templateHtml\": input.template_html, \"leadName\": lead[\"display_name\"], \"phone\": lead[\"phone\"], \"validUntil\": str(input.valid_until) if input.valid_until else None, \"customerNotes\": input.customer_notes.strip(), \"discount\": input.discount, \"subtotal\": subtotal, \"gstAmount\": gst, \"total\": total, \"company\": company, \"lines\": [{\"kind\": line.kind, \"description\": line.description, \"quantity\": line.quantity, \"rate\": line.rate, \"gstRate\": line.gst_rate} for line in input.lines]})"
        },
        {
          "name": "_company_snapshot",
          "line": 83,
          "end": 90,
          "body": "def _company_snapshot(session, tenant_id):\n    settings = session.execute(text(\"SELECT settings FROM tenant_settings WHERE tenant_id=:tenant\"),\n                               {\"tenant\": str(tenant_id)}).scalar_one_or_none() or {}\n    fields = (\"businessName\", \"legalName\", \"address\", \"phone\", \"email\", \"gstin\", \"footer\")\n    result = {field: settings.get(field, \"\") for field in fields}\n    assets = settings.get(\"companyAssets\")\n    result[\"assets\"] = {key: assets.get(key) for key in (\"logo\", \"stamp\", \"authorizedSignature\")} if isinstance(assets, dict) else {}\n    return result"
        },
        {
          "name": "list_leads",
          "line": 93,
          "end": 96,
          "body": "def list_leads(scope: ScopedTenant, q: str = \"\", stage: LeadStage | None = None, temperature: Temperature | None = None, exact_date: date | None = Query(None, alias=\"exactDate\"), month: str | None = None, branch_id: UUID | None = Query(None, alias=\"branchId\")):\n    current = _admin(scope); branch = _branch(current, branch_id) if branch_id else None\n    rows = scope[0].execute(text(\"\"\"SELECT * FROM sales_leads WHERE (CAST(:branch AS uuid) IS NULL OR branch_id=:branch) AND (CAST(:stage AS text) IS NULL OR stage=:stage) AND (CAST(:temperature AS text) IS NULL OR temperature=:temperature) AND (CAST(:exact AS date) IS NULL OR created_at::date=:exact) AND (CAST(:exact AS date) IS NOT NULL OR CAST(:month AS text) IS NULL OR to_char(created_at,'YYYY-MM')=:month) AND (:q='' OR display_name ILIKE :like OR company ILIKE :like OR phone ILIKE :like) ORDER BY created_at DESC\"\"\"), {\"branch\":str(branch) if branch else None,\"stage\":stage,\"temperature\":temperature,\"exact\":exact_date,\"month\":month,\"q\":q.strip(),\"like\":f\"%{q.strip()}%\"}).mappings()\n    return [_lead(row) for row in rows]"
        },
        {
          "name": "create_lead",
          "line": 98,
          "end": 101,
          "body": "def create_lead(input: LeadInput, scope: ScopedTenant):\n    session,current=scope; branch=_branch(_admin(scope, True), input.branch_id)\n    row=session.execute(text(\"\"\"INSERT INTO sales_leads(tenant_id,branch_id,display_name,phone,company,company_not_entered,email,email_not_entered,address,service_interest,notes,stage,temperature,follow_up_due,site_visit_completed,site_visit_date,created_by,updated_by) VALUES (:tenant,:branch,:name,:phone,:company,:company_not_entered,:email,:email_not_entered,:address,:interest,:notes,:stage,:temperature,:due,:visited,:visit_date,:actor,:actor) RETURNING *\"\"\"), {\"tenant\":str(current.tenant_id),\"branch\":str(branch),\"name\":input.display_name.strip(),\"phone\":input.phone.strip(),\"company\":input.company.strip(),\"company_not_entered\":input.company_not_entered,\"email\":input.email.strip(),\"email_not_entered\":input.email_not_entered,\"address\":input.address.strip(),\"interest\":input.service_interest.strip(),\"notes\":input.notes.strip(),\"stage\":input.stage,\"temperature\":input.temperature,\"due\":input.follow_up_due,\"visited\":input.site_visit_completed,\"visit_date\":input.site_visit_date,\"actor\":str(current.actor_id)}).mappings().one()\n    payload=_lead(row); _audit(session,current,\"SALES_LEAD_CREATED\",\"Sales lead created\",{},payload); return payload"
        },
        {
          "name": "update_lead",
          "line": 103,
          "end": 106,
          "body": "def update_lead(lead_id:int,input:LeadInput,scope:ScopedTenant):\n    session,current=scope; branch=_branch(_admin(scope, True),input.branch_id); before=session.execute(text(\"SELECT * FROM sales_leads WHERE id=:id\"),{\"id\":lead_id}).mappings().one_or_none()\n    if not before: raise auth_error(\"LEAD_NOT_FOUND\",404)\n    row=session.execute(text(\"\"\"UPDATE sales_leads SET branch_id=:branch,display_name=:name,phone=:phone,company=:company,company_not_entered=:company_not_entered,email=:email,email_not_entered=:email_not_entered,address=:address,service_interest=:interest,notes=:notes,stage=:stage,temperature=:temperature,follow_up_due=:due,site_visit_completed=:visited,site_visit_date=:visit_date,updated_by=:actor,updated_at=now() WHERE id=:id RETURNING *\"\"\"), {\"id\":lead_id,\"branch\":str(branch),\"name\":input.display_name.strip(),\"phone\":input.phone.strip(),\"company\":input.company.strip(),\"company_not_entered\":input.company_not_entered,\"email\":input.email.strip(),\"email_not_entered\":input.email_not_entered,\"address\":input.address.strip(),\"interest\":input.service_interest.strip(),\"notes\":input.notes.strip(),\"stage\":input.stage,\"temperature\":input.temperature,\"due\":input.follow_up_due,\"visited\":input.site_visit_completed,\"visit_date\":input.site_visit_date,\"actor\":str(current.actor_id)}).mappings().one(); payload=_lead(row); _audit(session,current,\"SALES_LEAD_UPDATED\",\"Sales lead updated\",_lead(before),payload); return payload"
        },
        {
          "name": "list_quotations",
          "line": 109,
          "end": 111,
          "body": "def list_quotations(scope:ScopedTenant,q:str=\"\",quotation_status:QuotationStatus|None=Query(None,alias=\"status\"),exact_date:date|None=Query(None,alias=\"exactDate\"),month:str|None=None,branch_id:UUID|None=Query(None,alias=\"branchId\")):\n    current=_admin(scope); branch=_branch(current,branch_id) if branch_id else None\n    rows=scope[0].execute(text(\"\"\"SELECT q.* FROM quotations q JOIN sales_leads l ON l.id=q.lead_id WHERE (CAST(:branch AS uuid) IS NULL OR q.branch_id=:branch) AND (CAST(:status AS text) IS NULL OR q.status=:status) AND (CAST(:exact AS date) IS NULL OR q.created_at::date=:exact) AND (CAST(:exact AS date) IS NOT NULL OR CAST(:month AS text) IS NULL OR to_char(q.created_at,'YYYY-MM')=:month) AND (:q='' OR q.quotation_no ILIKE :like OR l.display_name ILIKE :like OR l.company ILIKE :like) ORDER BY q.created_at DESC\"\"\"),{\"branch\":str(branch) if branch else None,\"status\":quotation_status,\"exact\":exact_date,\"month\":month,\"q\":q.strip(),\"like\":f\"%{q.strip()}%\"}).mappings(); return [_quotation(scope[0],row) for row in rows]"
        },
        {
          "name": "list_service_tasks",
          "line": 114,
          "end": 124,
          "body": "def list_service_tasks(scope: ScopedTenant, q: str = \"\", branch_id: UUID | None = Query(None, alias=\"branchId\")):\n    \"\"\"The quotation picker only exposes active tasks in the selected branch.\"\"\"\n    session, current = scope\n    branch = _branch(_admin(scope), branch_id)\n    rows = session.execute(text(\"\"\"\n        SELECT id, name, description, rate, gst_rate FROM service_task_catalog\n        WHERE branch_id=:branch AND status='ACTIVE'\n          AND (:q='' OR name ILIKE :like OR description ILIKE :like)\n        ORDER BY name, id\n    \"\"\"), {\"branch\": str(branch), \"q\": q.strip(), \"like\": f\"%{q.strip()}%\"}).mappings()\n    return [{\"id\": row[\"id\"], \"name\": row[\"name\"], \"description\": row[\"description\"], \"rate\": float(row[\"rate\"]), \"gstRate\": float(row[\"gst_rate\"])} for row in rows]"
        },
        {
          "name": "create_quotation",
          "line": 126,
          "end": 134,
          "body": "def create_quotation(input:QuotationInput,scope:ScopedTenant):\n    session,current=scope; branch=_branch(_admin(scope,True),input.branch_id); lead=session.execute(text(\"SELECT * FROM sales_leads WHERE id=:id\"),{\"id\":input.lead_id}).mappings().one_or_none()\n    if not lead or str(lead[\"branch_id\"])!=str(branch): raise auth_error(\"LEAD_NOT_AVAILABLE\",422)\n    subtotal,gst,total=_totals(input.lines,input.discount)\n    row=session.execute(text(\"\"\"INSERT INTO quotations(tenant_id,branch_id,lead_id,quotation_no,valid_until,customer_notes,discount,subtotal,gst_amount,total,template_id,template_html,document_snapshot,created_by,updated_by) VALUES (:tenant,:branch,:lead,'PENDING',:valid,:notes,:discount,:subtotal,:gst,:total,:template_id,:template_html,CAST(:snapshot AS jsonb),:actor,:actor) RETURNING *\"\"\"),{\"tenant\":str(current.tenant_id),\"branch\":str(branch),\"lead\":input.lead_id,\"valid\":input.valid_until,\"notes\":input.customer_notes.strip(),\"discount\":input.discount,\"subtotal\":subtotal,\"gst\":gst,\"total\":total,\"template_id\":input.template_id,\"template_html\":input.template_html,\"snapshot\":_snapshot(input,lead,subtotal,gst,total,_company_snapshot(session,current.tenant_id)),\"actor\":str(current.actor_id)}).mappings().one()\n    row=session.execute(text(\"UPDATE quotations SET quotation_no=:number WHERE id=:id RETURNING *\"),{\"id\":row[\"id\"],\"number\":f\"QT-{int(row['id']):06d}\"}).mappings().one()\n    for no,line in enumerate(input.lines,1): session.execute(text(\"INSERT INTO quotation_lines(tenant_id,branch_id,quotation_id,line_no,kind,description,quantity,rate,gst_rate) VALUES (:tenant,:branch,:quotation,:no,:kind,:description,:quantity,:rate,:gst)\"),{\"tenant\":str(current.tenant_id),\"branch\":str(branch),\"quotation\":row[\"id\"],\"no\":no,\"kind\":line.kind.strip(),\"description\":line.description.strip(),\"quantity\":line.quantity,\"rate\":line.rate,\"gst\":line.gst_rate})\n    session.execute(text(\"UPDATE sales_leads SET stage='QUOTATION_SENT',updated_by=:actor,updated_at=now() WHERE id=:id\"),{\"id\":input.lead_id,\"actor\":str(current.actor_id)})\n    payload=_quotation(session,row); _audit(session,current,\"QUOTATION_CREATED\",f\"Quotation {row['quotation_no']} created\",{},payload); return payload"
        },
        {
          "name": "update_quotation",
          "line": 136,
          "end": 148,
          "body": "def update_quotation(quotation_id:int,input:QuotationInput,scope:ScopedTenant):\n    \"\"\"Only a draft may be amended; regenerated values remain a fresh frozen snapshot.\"\"\"\n    session,current=scope; branch=_branch(_admin(scope,True),input.branch_id); before=session.execute(text(\"SELECT * FROM quotations WHERE id=:id\"),{\"id\":quotation_id}).mappings().one_or_none()\n    if not before: raise auth_error(\"QUOTATION_NOT_FOUND\",404)\n    if before[\"status\"] != \"DRAFT\": raise auth_error(\"QUOTATION_NOT_EDITABLE\",422)\n    before_payload = _quotation(session, before)\n    lead=session.execute(text(\"SELECT * FROM sales_leads WHERE id=:id\"),{\"id\":input.lead_id}).mappings().one_or_none()\n    if not lead or str(lead[\"branch_id\"]) != str(branch): raise auth_error(\"LEAD_NOT_AVAILABLE\",422)\n    subtotal,gst,total=_totals(input.lines,input.discount)\n    row=session.execute(text(\"\"\"UPDATE quotations SET branch_id=:branch,lead_id=:lead,valid_until=:valid,customer_notes=:notes,discount=:discount,subtotal=:subtotal,gst_amount=:gst,total=:total,template_id=:template_id,template_html=:template_html,document_snapshot=CAST(:snapshot AS jsonb),updated_by=:actor,updated_at=now() WHERE id=:id RETURNING *\"\"\"),{\"id\":quotation_id,\"branch\":str(branch),\"lead\":input.lead_id,\"valid\":input.valid_until,\"notes\":input.customer_notes.strip(),\"discount\":input.discount,\"subtotal\":subtotal,\"gst\":gst,\"total\":total,\"template_id\":input.template_id,\"template_html\":input.template_html,\"snapshot\":_snapshot(input,lead,subtotal,gst,total,_company_snapshot(session,current.tenant_id)),\"actor\":str(current.actor_id)}).mappings().one()\n    session.execute(text(\"DELETE FROM quotation_lines WHERE quotation_id=:id\"),{\"id\":quotation_id})\n    for no,line in enumerate(input.lines,1): session.execute(text(\"INSERT INTO quotation_lines(tenant_id,branch_id,quotation_id,line_no,kind,description,quantity,rate,gst_rate) VALUES (:tenant,:branch,:quotation,:no,:kind,:description,:quantity,:rate,:gst)\"),{\"tenant\":str(current.tenant_id),\"branch\":str(branch),\"quotation\":quotation_id,\"no\":no,\"kind\":line.kind.strip(),\"description\":line.description.strip(),\"quantity\":line.quantity,\"rate\":line.rate,\"gst\":line.gst_rate})\n    payload=_quotation(session,row); _audit(session,current,\"QUOTATION_UPDATED\",f\"Quotation {row['quotation_no']} updated\",before_payload,payload); return payload"
        },
        {
          "name": "change_status",
          "line": 150,
          "end": 163,
          "body": "def change_status(quotation_id:int,input:StatusInput,scope:ScopedTenant):\n    session,current=scope; _admin(scope,True); row=session.execute(text(\"SELECT * FROM quotations WHERE id=:id\"),{\"id\":quotation_id}).mappings().one_or_none()\n    if not row: raise auth_error(\"QUOTATION_NOT_FOUND\",404)\n    if row[\"status\"] in (\"ACCEPTED\", \"REJECTED\", \"EXPIRED\"):\n        raise auth_error(\"QUOTATION_FINAL\", 422)\n    transitions = {\"DRAFT\": {\"SENT\"}, \"SENT\": {\"ACCEPTED\", \"REJECTED\", \"EXPIRED\"}}\n    if input.status not in transitions[row[\"status\"]]:\n        raise auth_error(\"QUOTATION_TRANSITION_INVALID\", 422)\n    changed=session.execute(text(\"UPDATE quotations SET status=:status,updated_by=:actor,updated_at=now() WHERE id=:id RETURNING *\"),{\"id\":quotation_id,\"status\":input.status,\"actor\":str(current.actor_id)}).mappings().one()\n    if input.status==\"ACCEPTED\": session.execute(text(\"UPDATE sales_leads SET stage='WON',updated_by=:actor,updated_at=now() WHERE id=:id\"),{\"id\":row[\"lead_id\"],\"actor\":str(current.actor_id)})\n    if input.status==\"REJECTED\": session.execute(text(\"UPDATE sales_leads SET stage='LOST',updated_by=:actor,updated_at=now() WHERE id=:id\"),{\"id\":row[\"lead_id\"],\"actor\":str(current.actor_id)})\n    payload = _quotation(session,changed)\n    _audit(session,current,\"QUOTATION_STATUS_CHANGED\",f\"Quotation {row['quotation_no']} marked {input.status}\",_quotation(session,row),payload)\n    return payload"
        },
        {
          "name": "quotation_document",
          "line": 165,
          "end": 169,
          "body": "def quotation_document(quotation_id:int,scope:ScopedTenant):\n    session, _ = scope; _admin(scope); row=session.execute(text(\"SELECT document_snapshot,quotation_no,template_html,created_at FROM quotations WHERE id=:id\"),{\"id\":quotation_id}).mappings().one_or_none()\n    if not row: raise auth_error(\"QUOTATION_NOT_FOUND\",404)\n    # The template is the saved copy, never the mutable template definition.\n    return {\"quotationNo\":row[\"quotation_no\"],\"createdAt\":row[\"created_at\"],\"templateHtml\":row[\"template_html\"],\"snapshot\":dict(row[\"document_snapshot\"])}"
        }
      ]
    },
    {
      "file": "/app/app/service_catalog.py",
      "functions": [
        {
          "name": "_permission",
          "line": 37,
          "end": 50,
          "body": "def _permission(scope: ScopedTenant, *, write: bool = False, job: bool = False) -> None:\n    current = scope[1]\n    if write:\n        try:\n            require_mutation_allowed(current)\n        except PermissionError as error:\n            raise auth_error(\"TENANT_READ_ONLY\", status.HTTP_403_FORBIDDEN) from error\n    if current.actor_type == \"support_emulation\" and not write:\n        return\n    pages = (\"job-card\", \"jobs\", \"my-queue\", \"my-tasks\", \"work-update\") if job else (\n        (\"manage\", \"admin-console\") if write else (\"manage\", \"admin-console\", \"job-card\", \"jobs\", \"my-queue\"))\n    suffix = \"write\" if write else \"read\"\n    if not any(f\"page.{page}.{suffix}\" in current.permissions for page in pages):\n        raise auth_error(\"PERMISSION_DENIED\", status.HTTP_403_FORBIDDEN)"
        },
        {
          "name": "_catalogue",
          "line": 53,
          "end": 57,
          "body": "def _catalogue(row) -> dict[str, object]:\n    return {\"id\": row[\"id\"], \"branchId\": str(row[\"branch_id\"]), \"name\": row[\"name\"],\n            \"baseRate\": float(row[\"rate\"]), \"gstRate\": float(row[\"gst_rate\"]),\n            \"departmentId\": str(row[\"department_id\"]) if row[\"department_id\"] else None,\n            \"archivedAt\": row[\"archived_at\"]}"
        },
        {
          "name": "list_catalogue",
          "line": 61,
          "end": 64,
          "body": "def list_catalogue(scope: ScopedTenant) -> list[dict[str, object]]:\n    _permission(scope)\n    rows = scope[0].execute(text(\"SELECT * FROM service_task_catalog ORDER BY name,id\")).mappings().all()\n    return [_catalogue(row) for row in rows]"
        },
        {
          "name": "create_catalogue",
          "line": 68,
          "end": 86,
          "body": "def create_catalogue(input: CatalogueInput, scope: ScopedTenant) -> dict[str, object]:\n    _permission(scope, write=True)\n    session, current = scope\n    branch = str(input.branchId or current.branch_ids[0])\n    if UUID(branch) not in current.branch_ids:\n        raise auth_error(\"BRANCH_ACCESS_DENIED\", status.HTTP_403_FORBIDDEN)\n    if input.departmentId:\n        department = session.execute(text(\"SELECT branch_id FROM service_departments WHERE id=:id AND status='ACTIVE'\"),\n                                     {\"id\": str(input.departmentId)}).scalar_one_or_none()\n        if department is None:\n            raise auth_error(\"DEPARTMENT_NOT_FOUND\", status.HTTP_404_NOT_FOUND)\n        branch = str(department)\n    row = session.execute(text(\"\"\"INSERT INTO service_task_catalog(tenant_id,branch_id,name,description,rate,gst_rate,\n        department_id,created_by,updated_by) VALUES (:tenant,:branch,:name,'',:rate,:gst,:department,:actor,:actor)\n        RETURNING *\"\"\"), {\"tenant\": str(current.tenant_id), \"branch\": branch, \"name\": input.name.strip(),\n                            \"rate\": input.baseRate, \"gst\": input.gstRate,\n                            \"department\": str(input.departmentId) if input.departmentId else None,\n                            \"actor\": str(current.actor_id)}).mappings().one()\n    return _catalogue(row)"
        },
        {
          "name": "update_catalogue",
          "line": 90,
          "end": 109,
          "body": "def update_catalogue(item_id: int, input: CatalogueInput, scope: ScopedTenant) -> dict[str, object]:\n    _permission(scope, write=True)\n    session, current = scope\n    existing_branch = session.execute(text(\"SELECT branch_id FROM service_task_catalog WHERE id=:id AND status='ACTIVE'\"),\n                                      {\"id\": item_id}).scalar_one_or_none()\n    if existing_branch is None:\n        raise auth_error(\"CATALOGUE_ITEM_NOT_FOUND\", status.HTTP_404_NOT_FOUND)\n    if input.departmentId:\n        department_branch = session.execute(text(\"SELECT branch_id FROM service_departments WHERE id=:id AND status='ACTIVE'\"),\n                                            {\"id\": str(input.departmentId)}).scalar_one_or_none()\n        if department_branch != existing_branch:\n            raise auth_error(\"DEPARTMENT_NOT_FOUND\", status.HTTP_404_NOT_FOUND)\n    row = session.execute(text(\"\"\"UPDATE service_task_catalog SET name=:name,rate=:rate,gst_rate=:gst,\n        department_id=:department,updated_by=:actor,updated_at=now() WHERE id=:id AND status='ACTIVE'\n        RETURNING *\"\"\"), {\"id\": item_id, \"name\": input.name.strip(), \"rate\": input.baseRate,\n                            \"gst\": input.gstRate, \"department\": str(input.departmentId) if input.departmentId else None,\n                            \"actor\": str(current.actor_id)}).mappings().one_or_none()\n    if row is None:\n        raise auth_error(\"CATALOGUE_ITEM_NOT_FOUND\", status.HTTP_404_NOT_FOUND)\n    return _catalogue(row)"
        },
        {
          "name": "_task",
          "line": 112,
          "end": 115,
          "body": "def _task(row) -> dict[str, object]:\n    return {\"id\": row[\"id\"], \"jobId\": row[\"job_card_id\"], \"catalogueItemId\": row[\"catalogue_item_id\"],\n            \"name\": row[\"name\"], \"baseRate\": float(row[\"base_rate\"]), \"gstRate\": float(row[\"gst_rate\"]),\n            \"done\": row[\"done\"], \"archivedAt\": row[\"archived_at\"]}"
        },
        {
          "name": "list_job_tasks",
          "line": 119,
          "end": 123,
          "body": "def list_job_tasks(scope: ScopedTenant, job_id: int = Query(alias=\"jobId\")) -> list[dict[str, object]]:\n    _permission(scope, job=True)\n    rows = scope[0].execute(text(\"SELECT * FROM job_service_tasks WHERE job_card_id=:job ORDER BY id\"),\n                            {\"job\": job_id}).mappings().all()\n    return [_task(row) for row in rows]"
        },
        {
          "name": "create_job_task",
          "line": 127,
          "end": 145,
          "body": "def create_job_task(input: JobTaskInput, scope: ScopedTenant) -> dict[str, object]:\n    _permission(scope, write=True, job=True)\n    session, current = scope\n    job = session.execute(text(\"SELECT branch_id,status FROM job_cards WHERE id=:id\"), {\"id\": input.jobId}).mappings().one_or_none()\n    if job is None:\n        raise auth_error(\"JOB_NOT_FOUND\", status.HTTP_404_NOT_FOUND)\n    if job[\"status\"] in (\"CLOSED\", \"CANCELLED\"):\n        raise auth_error(\"JOB_TASK_LOCKED\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    if input.catalogueItemId:\n        item_branch = session.execute(text(\"SELECT branch_id FROM service_task_catalog WHERE id=:id AND status='ACTIVE'\"),\n                                      {\"id\": input.catalogueItemId}).scalar_one_or_none()\n        if item_branch != job[\"branch_id\"]:\n            raise auth_error(\"CATALOGUE_ITEM_NOT_FOUND\", status.HTTP_404_NOT_FOUND)\n    row = session.execute(text(\"\"\"INSERT INTO job_service_tasks(tenant_id,branch_id,job_card_id,catalogue_item_id,\n        name,base_rate,gst_rate,created_by,updated_by) VALUES (:tenant,:branch,:job,:catalogue,:name,:rate,:gst,:actor,:actor)\n        RETURNING *\"\"\"), {\"tenant\": str(current.tenant_id), \"branch\": str(job[\"branch_id\"]), \"job\": input.jobId,\n                            \"catalogue\": input.catalogueItemId, \"name\": input.name.strip(),\n                            \"rate\": input.baseRate, \"gst\": input.gstRate, \"actor\": str(current.actor_id)}).mappings().one()\n    return _task(row)"
        },
        {
          "name": "set_job_task_done",
          "line": 149,
          "end": 160,
          "body": "def set_job_task_done(task_id: int, input: DoneInput, scope: ScopedTenant) -> dict[str, object]:\n    _permission(scope, write=True, job=True)\n    job_status = scope[0].execute(text(\"\"\"SELECT job.status FROM job_service_tasks task\n        JOIN job_cards job ON job.id=task.job_card_id WHERE task.id=:id\"\"\"), {\"id\": task_id}).scalar_one_or_none()\n    if job_status in (\"CLOSED\", \"CANCELLED\"):\n        raise auth_error(\"JOB_TASK_LOCKED\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    row = scope[0].execute(text(\"\"\"UPDATE job_service_tasks SET done=:done,updated_by=:actor,updated_at=now()\n        WHERE id=:id AND archived_at IS NULL RETURNING *\"\"\"),\n        {\"id\": task_id, \"done\": input.done, \"actor\": str(scope[1].actor_id)}).mappings().one_or_none()\n    if row is None:\n        raise auth_error(\"JOB_TASK_NOT_FOUND\", status.HTTP_404_NOT_FOUND)\n    return _task(row)"
        }
      ]
    },
    {
      "file": "/app/app/superadmin.py",
      "functions": [
        {
          "name": "_clean",
          "line": 96,
          "end": 100,
          "body": "def _clean(value: str) -> str:\n    value = value.strip()\n    if not value:\n        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=\"blank value\")\n    return value"
        },
        {
          "name": "_rows",
          "line": 103,
          "end": 104,
          "body": "def _rows(session: Session, statement: str, parameters: dict[str, object]) -> list[dict[str, object]]:\n    return [dict(row) for row in session.execute(text(statement), parameters).mappings().all()]"
        },
        {
          "name": "resolve_superadmin_scope",
          "line": 107,
          "end": 130,
          "body": "def resolve_superadmin_scope(session: Session, subject: str) -> SuperadminScope:\n    rows = _rows(\n        session,\n        \"\"\"\n        SELECT u.id, u.display_name, u.email\n        FROM platform_users AS u\n        JOIN superadmins AS sa ON sa.user_id = u.id\n        WHERE u.cognito_subject = :subject AND u.status = 'ACTIVE'\n        \"\"\",\n        {\"subject\": subject},\n    )\n    if not rows and subject in get_settings().configured_superadmin_subjects:\n        actor_id = uuid4()\n        email = f\"bootstrap-{actor_id}@platform.invalid\"\n        session.execute(\n            text(\"INSERT INTO platform_users (id, cognito_subject, display_name, email) VALUES (:id, :subject, 'Platform Superadmin', :email)\"),\n            {\"id\": str(actor_id), \"subject\": subject, \"email\": email},\n        )\n        session.execute(text(\"INSERT INTO superadmins (user_id) VALUES (:id)\"), {\"id\": str(actor_id)})\n        return SuperadminScope(actor_id, \"Platform Superadmin\", email)\n    if len(rows) != 1:\n        raise auth_error(\"SUPERADMIN_ACCESS_DENIED\", status.HTTP_403_FORBIDDEN)\n    row = rows[0]\n    return SuperadminScope(UUID(str(row[\"id\"])), str(row[\"display_name\"]), str(row[\"email\"]))"
        },
        {
          "name": "superadmin_scope",
          "line": 133,
          "end": 138,
          "body": "def superadmin_scope(\n    subject: str = Depends(authenticated_subject), session: Session = Depends(get_session)\n):\n    \"\"\"Open a platform transaction only for a server-resolved Superadmin.\"\"\"\n    with session.begin():\n        yield session, resolve_superadmin_scope(session, subject)"
        },
        {
          "name": "can_transition_lifecycle",
          "line": 144,
          "end": 145,
          "body": "def can_transition_lifecycle(current: str, target: str) -> bool:\n    return target in ALLOWED_LIFECYCLE_TRANSITIONS.get(current, frozenset())"
        },
        {
          "name": "_audit",
          "line": 148,
          "end": 174,
          "body": "def _audit(\n    session: Session,\n    *,\n    tenant_id: UUID,\n    actor_id: UUID,\n    action: str,\n    reason: str,\n    before: object,\n    after: object,\n) -> None:\n    session.execute(\n        text(\n            \"\"\"\n            INSERT INTO tenant_audit_events (id, tenant_id, actor_id, action, reason, before_value, after_value)\n            VALUES (:id, :tenant_id, :actor_id, :action, :reason, CAST(:before AS jsonb), CAST(:after AS jsonb))\n            \"\"\"\n        ),\n        {\n            \"id\": str(uuid4()),\n            \"tenant_id\": str(tenant_id),\n            \"actor_id\": str(actor_id),\n            \"action\": action,\n            \"reason\": reason,\n            \"before\": __import__(\"json\").dumps(before, default=str),\n            \"after\": __import__(\"json\").dumps(after, default=str),\n        },\n    )"
        },
        {
          "name": "_tenant_or_404",
          "line": 177,
          "end": 194,
          "body": "def _tenant_or_404(session: Session, tenant_id: UUID) -> dict[str, object]:\n    rows = _rows(\n        session,\n        \"\"\"\n        SELECT t.id, t.name, t.lifecycle_state, t.created_at,\n               b.id AS primary_branch_id, b.name AS primary_branch_name,\n               pb.plan, pb.agreed_price, pb.currency, pb.billing_cycle, pb.renewal_date,\n               pb.due_date, pb.payment_status, pb.internal_notes, pb.updated_at AS billing_updated_at\n        FROM tenants AS t\n        JOIN branches AS b ON b.tenant_id = t.id AND b.is_primary\n        LEFT JOIN platform_billing AS pb ON pb.tenant_id = t.id\n        WHERE t.id = :tenant_id\n        \"\"\",\n        {\"tenant_id\": str(tenant_id)},\n    )\n    if len(rows) != 1:\n        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={\"code\": \"TENANT_NOT_FOUND\"})\n    return rows[0]"
        },
        {
          "name": "_tenant_payload",
          "line": 197,
          "end": 211,
          "body": "def _tenant_payload(row: dict[str, object]) -> dict[str, object]:\n    billing = None\n    if row[\"plan\"] is not None:\n        billing = {\n            \"plan\": row[\"plan\"], \"agreedPrice\": row[\"agreed_price\"], \"currency\": row[\"currency\"],\n            \"billingCycle\": row[\"billing_cycle\"], \"renewalDate\": row[\"renewal_date\"], \"dueDate\": row[\"due_date\"],\n            \"paymentStatus\": row[\"payment_status\"], \"internalNotes\": row[\"internal_notes\"],\n            \"updatedAt\": row[\"billing_updated_at\"],\n        }\n    return {\n        \"id\": str(row[\"id\"]), \"name\": row[\"name\"], \"lifecycleState\": row[\"lifecycle_state\"],\n        \"createdAt\": row[\"created_at\"],\n        \"primaryBranch\": {\"id\": str(row[\"primary_branch_id\"]), \"name\": row[\"primary_branch_name\"]},\n        \"platformBilling\": billing,\n    }"
        },
        {
          "name": "_create_scoped_defaults",
          "line": 214,
          "end": 233,
          "body": "def _create_scoped_defaults(session: Session, tenant_id: UUID, branch_id: UUID, actor_id: UUID) -> None:\n    \"\"\"Insert baseline configuration through the same forced-RLS role as tenant APIs.\"\"\"\n    session.execute(text(\"SET LOCAL ROLE workshopos_runtime\"))\n    session.execute(\n        text(\n            \"SELECT set_config('workshopos.tenant_id', :tenant_id, true), \"\n            \"set_config('workshopos.branch_ids', :branch_ids, true), \"\n            \"set_config('workshopos.read_only', 'false', true)\"\n        ),\n        {\"tenant_id\": str(tenant_id), \"branch_ids\": \"{\" + str(branch_id) + \"}\"},\n    )\n    session.execute(\n        text(\"INSERT INTO tenant_settings (tenant_id, settings, updated_by) VALUES (:tenant_id, CAST(:settings AS jsonb), :actor_id)\"),\n        {\"tenant_id\": str(tenant_id), \"settings\": __import__(\"json\").dumps(DEFAULT_TENANT_SETTINGS), \"actor_id\": str(actor_id)},\n    )\n    session.execute(\n        text(\"INSERT INTO branch_settings (tenant_id, branch_id, settings, updated_by) VALUES (:tenant_id, :branch_id, CAST(:settings AS jsonb), :actor_id)\"),\n        {\"tenant_id\": str(tenant_id), \"branch_id\": str(branch_id), \"settings\": __import__(\"json\").dumps(DEFAULT_BRANCH_SETTINGS), \"actor_id\": str(actor_id)},\n    )\n    session.execute(text(\"RESET ROLE\"))"
        },
        {
          "name": "list_tenants",
          "line": 237,
          "end": 251,
          "body": "def list_tenants(scope: ScopedSuperadmin) -> dict[str, object]:\n    session, _ = scope\n    rows = _rows(\n        session,\n        \"\"\"\n        SELECT t.id, t.name, t.lifecycle_state, t.created_at, b.id AS primary_branch_id, b.name AS primary_branch_name,\n               pb.plan, pb.agreed_price, pb.currency, pb.billing_cycle, pb.renewal_date, pb.due_date,\n               pb.payment_status, pb.internal_notes, pb.updated_at AS billing_updated_at\n        FROM tenants AS t JOIN branches AS b ON b.tenant_id = t.id AND b.is_primary\n        LEFT JOIN platform_billing AS pb ON pb.tenant_id = t.id\n        ORDER BY t.created_at DESC, t.id DESC\n        \"\"\",\n        {},\n    )\n    return {\"tenants\": [_tenant_payload(row) for row in rows]}"
        },
        {
          "name": "provision_tenant",
          "line": 255,
          "end": 281,
          "body": "def provision_tenant(input: ProvisionTenant, scope: ScopedSuperadmin) -> dict[str, object]:\n    session, actor = scope\n    tenant_id, branch_id, admin_id, membership_id, invitation_id = (uuid4() for _ in range(5))\n    role_ids = {name: uuid4() for name in DEFAULT_ROLE_PERMISSIONS}\n    tenant_name, branch_name = _clean(input.tenant_name), _clean(input.primary_branch_name)\n    admin_name, admin_email = _clean(input.tenant_admin_name), _clean(input.tenant_admin_email).lower()\n    session.execute(text(\"INSERT INTO tenants (id, name, lifecycle_state) VALUES (:id, :name, :state)\"), {\"id\": str(tenant_id), \"name\": tenant_name, \"state\": input.lifecycle_state})\n    session.execute(text(\"INSERT INTO branches (id, tenant_id, name, is_primary) VALUES (:id, :tenant_id, :name, true)\"), {\"id\": str(branch_id), \"tenant_id\": str(tenant_id), \"name\": branch_name})\n    session.execute(text(\"INSERT INTO platform_users (id, cognito_subject, display_name, email) VALUES (:id, NULL, :name, :email)\"), {\"id\": str(admin_id), \"name\": admin_name, \"email\": admin_email})\n    session.execute(text(\"INSERT INTO tenant_memberships (id, tenant_id, user_id, status) VALUES (:id, :tenant_id, :user_id, 'INVITED')\"), {\"id\": str(membership_id), \"tenant_id\": str(tenant_id), \"user_id\": str(admin_id)})\n    session.execute(text(\"INSERT INTO membership_branches (membership_id, branch_id, tenant_id) VALUES (:membership_id, :branch_id, :tenant_id)\"), {\"membership_id\": str(membership_id), \"branch_id\": str(branch_id), \"tenant_id\": str(tenant_id)})\n    for role_name, permissions in DEFAULT_ROLE_PERMISSIONS.items():\n        role_id = role_ids[role_name]\n        session.execute(\n            text(\"INSERT INTO tenant_roles (id, tenant_id, name, description, system_key) VALUES (:id, :tenant_id, :name, :description, :system_key)\"),\n            {\"id\": str(role_id), \"tenant_id\": str(tenant_id), \"name\": role_name, \"description\": f\"{role_name} workspace access\", \"system_key\": SYSTEM_ROLE_KEYS[role_name]},\n        )\n        for permission in permissions:\n            session.execute(text(\"INSERT INTO role_permissions (role_id, permission) VALUES (:role_id, :permission)\"), {\"role_id\": str(role_id), \"permission\": permission})\n    session.execute(text(\"INSERT INTO membership_roles (membership_id, role_id, tenant_id) VALUES (:membership_id, :role_id, :tenant_id)\"), {\"membership_id\": str(membership_id), \"role_id\": str(role_ids['Owner/Admin']), \"tenant_id\": str(tenant_id)})\n    session.execute(text(\"INSERT INTO tenant_admin_invitations (id, tenant_id, membership_id, email, status, last_sent_at) VALUES (:id, :tenant_id, :membership_id, :email, 'PENDING', now())\"), {\"id\": str(invitation_id), \"tenant_id\": str(tenant_id), \"membership_id\": str(membership_id), \"email\": admin_email})\n    _create_scoped_defaults(session, tenant_id, branch_id, actor.actor_id)\n    session.execute(text(\"INSERT INTO platform_billing (tenant_id, plan, agreed_price, currency, billing_cycle, renewal_date, due_date, payment_status, internal_notes, updated_by) VALUES (:tenant_id, :plan, :agreed_price, :currency, :billing_cycle, :renewal_date, :due_date, :payment_status, :internal_notes, :actor_id)\"), {\"tenant_id\": str(tenant_id), **input.model_dump(include={\"plan\", \"agreed_price\", \"currency\", \"billing_cycle\", \"renewal_date\", \"due_date\", \"payment_status\", \"internal_notes\"}), \"actor_id\": str(actor.actor_id)})\n    _audit(session, tenant_id=tenant_id, actor_id=actor.actor_id, action=\"TENANT_PROVISIONED\", reason=\"Tenant provisioned\", before={}, after={\"primaryBranchId\": str(branch_id), \"tenantAdminInvitationId\": str(invitation_id), \"defaultsVersion\": 1, \"operationalDataCopied\": False})\n    payload = _tenant_payload(_tenant_or_404(session, tenant_id))\n    payload[\"tenantAdminInvitation\"] = {\"id\": str(invitation_id), \"email\": admin_email, \"status\": \"PENDING\"}\n    return payload"
        },
        {
          "name": "get_tenant",
          "line": 285,
          "end": 287,
          "body": "def get_tenant(tenant_id: UUID, scope: ScopedSuperadmin) -> dict[str, object]:\n    session, _ = scope\n    return _tenant_payload(_tenant_or_404(session, tenant_id))"
        },
        {
          "name": "update_billing",
          "line": 291,
          "end": 297,
          "body": "def update_billing(tenant_id: UUID, input: UpdateBilling, scope: ScopedSuperadmin) -> dict[str, object]:\n    session, actor = scope\n    before = _tenant_or_404(session, tenant_id)\n    session.execute(text(\"UPDATE platform_billing SET plan=:plan, agreed_price=:agreed_price, currency=:currency, billing_cycle=:billing_cycle, renewal_date=:renewal_date, due_date=:due_date, payment_status=:payment_status, internal_notes=:internal_notes, updated_by=:actor_id, updated_at=now() WHERE tenant_id=:tenant_id\"), {\"tenant_id\": str(tenant_id), \"actor_id\": str(actor.actor_id), **input.model_dump(exclude={\"reason\"})})\n    after = _tenant_or_404(session, tenant_id)\n    _audit(session, tenant_id=tenant_id, actor_id=actor.actor_id, action=\"PLATFORM_BILLING_UPDATED\", reason=_clean(input.reason), before=_tenant_payload(before)[\"platformBilling\"], after=_tenant_payload(after)[\"platformBilling\"])\n    return _tenant_payload(after)"
        },
        {
          "name": "update_lifecycle",
          "line": 301,
          "end": 310,
          "body": "def update_lifecycle(tenant_id: UUID, input: UpdateLifecycle, scope: ScopedSuperadmin) -> dict[str, object]:\n    session, actor = scope\n    before = _tenant_or_404(session, tenant_id)\n    current = str(before[\"lifecycle_state\"])\n    if not can_transition_lifecycle(current, input.lifecycle_state):\n        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={\"code\": \"INVALID_LIFECYCLE_TRANSITION\"})\n    session.execute(text(\"UPDATE tenants SET lifecycle_state = :state WHERE id = :tenant_id\"), {\"state\": input.lifecycle_state, \"tenant_id\": str(tenant_id)})\n    after = _tenant_or_404(session, tenant_id)\n    _audit(session, tenant_id=tenant_id, actor_id=actor.actor_id, action=\"TENANT_LIFECYCLE_CHANGED\", reason=_clean(input.reason), before={\"lifecycleState\": current}, after={\"lifecycleState\": input.lifecycle_state})\n    return _tenant_payload(after)"
        },
        {
          "name": "start_emulation",
          "line": 314,
          "end": 326,
          "body": "def start_emulation(tenant_id: UUID, input: StartEmulation, scope: ScopedSuperadmin) -> dict[str, object]:\n    session, actor = scope\n    tenant = _tenant_or_404(session, tenant_id)\n    if tenant[\"lifecycle_state\"] == \"closed\":\n        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={\"code\": \"EMULATION_CLOSED_TENANT\"})\n    existing = _rows(session, \"SELECT id FROM support_emulations WHERE superadmin_id=:actor_id AND tenant_id=:tenant_id AND status='ACTIVE'\", {\"actor_id\": str(actor.actor_id), \"tenant_id\": str(tenant_id)})\n    if existing:\n        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={\"code\": \"EMULATION_ALREADY_ACTIVE\"})\n    emulation_id = uuid4()\n    reason = _clean(input.reason)\n    session.execute(text(\"INSERT INTO support_emulations (id, superadmin_id, tenant_id, status, reason) VALUES (:id, :actor_id, :tenant_id, 'ACTIVE', :reason)\"), {\"id\": str(emulation_id), \"actor_id\": str(actor.actor_id), \"tenant_id\": str(tenant_id), \"reason\": reason})\n    _audit(session, tenant_id=tenant_id, actor_id=actor.actor_id, action=\"SUPPORT_EMULATION_STARTED\", reason=reason, before={}, after={\"emulationId\": str(emulation_id), \"readOnly\": True})\n    return {\"id\": str(emulation_id), \"tenantId\": str(tenant_id), \"status\": \"ACTIVE\", \"readOnly\": True}"
        },
        {
          "name": "end_emulation",
          "line": 330,
          "end": 339,
          "body": "def end_emulation(emulation_id: UUID, input: EndEmulation, scope: ScopedSuperadmin) -> dict[str, object]:\n    session, actor = scope\n    rows = _rows(session, \"SELECT tenant_id FROM support_emulations WHERE id=:id AND superadmin_id=:actor_id AND status='ACTIVE'\", {\"id\": str(emulation_id), \"actor_id\": str(actor.actor_id)})\n    if len(rows) != 1:\n        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={\"code\": \"ACTIVE_EMULATION_NOT_FOUND\"})\n    tenant_id = UUID(str(rows[0][\"tenant_id\"]))\n    reason = _clean(input.reason)\n    session.execute(text(\"UPDATE support_emulations SET status='ENDED', ended_at=now(), ended_reason=:reason WHERE id=:id\"), {\"id\": str(emulation_id), \"reason\": reason})\n    _audit(session, tenant_id=tenant_id, actor_id=actor.actor_id, action=\"SUPPORT_EMULATION_ENDED\", reason=reason, before={\"emulationId\": str(emulation_id), \"status\": \"ACTIVE\"}, after={\"emulationId\": str(emulation_id), \"status\": \"ENDED\"})\n    return {\"id\": str(emulation_id), \"status\": \"ENDED\"}"
        },
        {
          "name": "list_audit_events",
          "line": 343,
          "end": 347,
          "body": "def list_audit_events(tenant_id: UUID, scope: ScopedSuperadmin) -> dict[str, object]:\n    session, _ = scope\n    _tenant_or_404(session, tenant_id)\n    rows = _rows(session, \"SELECT id, action, reason, before_value, after_value, created_at FROM tenant_audit_events WHERE tenant_id=:tenant_id ORDER BY created_at DESC, id DESC\", {\"tenant_id\": str(tenant_id)})\n    return {\"events\": [{\"id\": str(row[\"id\"]), \"action\": row[\"action\"], \"reason\": row[\"reason\"], \"before\": row[\"before_value\"], \"after\": row[\"after_value\"], \"createdAt\": row[\"created_at\"]} for row in rows]}"
        }
      ]
    },
    {
      "file": "/app/app/tenancy.py",
      "functions": [
        {
          "name": "branch_array_literal",
          "line": 40,
          "end": 42,
          "body": "def branch_array_literal(branch_ids: tuple[UUID, ...]) -> str:\n    \"\"\"Return a PostgreSQL UUID array literal composed only from server UUIDs.\"\"\"\n    return \"{\" + \",\".join(str(branch_id) for branch_id in branch_ids) + \"}\""
        },
        {
          "name": "apply_rls_context",
          "line": 45,
          "end": 65,
          "body": "def apply_rls_context(session: Session, scope: TenantScope) -> None:\n    \"\"\"Set transaction-local, trusted RLS settings before any Tenant query runs.\"\"\"\n    # Migrations use the admin role, but request queries must never run as a\n    # table owner or BYPASSRLS role.  The fixed role is created and granted the\n    # minimum Tenant-table privileges by the tenancy migration.\n    session.execute(text(\"SET LOCAL ROLE workshopos_runtime\"))\n    session.execute(\n        text(\n            \"SELECT \"\n            \"set_config('workshopos.actor_id', :actor_id, true), \"\n            \"set_config('workshopos.tenant_id', :tenant_id, true), \"\n            \"set_config('workshopos.branch_ids', :branch_ids, true), \"\n            \"set_config('workshopos.read_only', :read_only, true)\"\n        ),\n        {\n            \"actor_id\": str(scope.actor_id),\n            \"tenant_id\": str(scope.tenant_id),\n            \"branch_ids\": branch_array_literal(scope.branch_ids),\n            \"read_only\": \"true\" if scope.read_only else \"false\",\n        },\n    )"
        },
        {
          "name": "require_branch",
          "line": 68,
          "end": 70,
          "body": "def require_branch(scope: TenantScope, branch_id: UUID) -> None:\n    if branch_id not in scope.branch_ids:\n        raise PermissionError(\"BRANCH_ACCESS_DENIED\")"
        },
        {
          "name": "require_mutation_allowed",
          "line": 73,
          "end": 76,
          "body": "def require_mutation_allowed(scope: TenantScope) -> None:\n    \"\"\"Reject tenant writes for suspended tenants and support emulation.\"\"\"\n    if scope.read_only:\n        raise PermissionError(\"TENANT_READ_ONLY\")"
        }
      ]
    },
    {
      "file": "/app/app/tenant_admin.py",
      "functions": [
        {
          "name": "list_demo_import_rows",
          "line": 26,
          "end": 37,
          "body": "def list_demo_import_rows(scope: ScopedTenant, source_table: str | None = Query(None, alias=\"sourceTable\"),\n                          limit: int = Query(100, ge=1, le=500), offset: int = Query(0, ge=0)) -> dict[str, object]:\n    _require(scope, \"page.admin-console.read\")\n    session, _ = scope\n    parameters = {\"table\": source_table, \"limit\": limit, \"offset\": offset}\n    total = session.execute(text(\"\"\"SELECT count(*) FROM demo_import_rows\n        WHERE (CAST(:table AS text) IS NULL OR source_table=:table)\"\"\"), parameters).scalar_one()\n    rows = session.execute(text(\"\"\"SELECT source_table,source_id,target_id,payload FROM demo_import_rows\n        WHERE (CAST(:table AS text) IS NULL OR source_table=:table)\n        ORDER BY source_table,source_id LIMIT :limit OFFSET :offset\"\"\"), parameters).mappings().all()\n    return {\"total\": total, \"rows\": [{\"sourceTable\": row[\"source_table\"], \"sourceId\": row[\"source_id\"],\n                                      \"targetId\": row[\"target_id\"], \"payload\": row[\"payload\"]} for row in rows]}"
        },
        {
          "name": "_page_permissions",
          "line": 82,
          "end": 86,
          "body": "def _page_permissions(pages: Iterable[PageKey], *, write: bool) -> tuple[str, ...]:\n    permissions = {f\"page.{page}.read\" for page in pages}\n    if write:\n        permissions |= {f\"page.{page}.write\" for page in pages}\n    return tuple(sorted(permissions))"
        },
        {
          "name": "validate_assignment",
          "line": 102,
          "end": 111,
          "body": "def validate_assignment(role_ids: tuple[UUID, ...], branch_ids: tuple[UUID, ...]) -> tuple[tuple[UUID, ...], tuple[UUID, ...]]:\n    if not role_ids:\n        raise AssignmentError(\"ROLE_ASSIGNMENT_REQUIRED\")\n    if not branch_ids:\n        raise AssignmentError(\"BRANCH_ASSIGNMENT_REQUIRED\")\n    if len(set(role_ids)) != len(role_ids):\n        raise AssignmentError(\"DUPLICATE_ROLE_ASSIGNMENT\")\n    if len(set(branch_ids)) != len(branch_ids):\n        raise AssignmentError(\"DUPLICATE_BRANCH_ASSIGNMENT\")\n    return tuple(role_ids), tuple(branch_ids)"
        },
        {
          "name": "validate_permissions",
          "line": 114,
          "end": 118,
          "body": "def validate_permissions(permissions: tuple[str, ...]) -> tuple[str, ...]:\n    cleaned = tuple(sorted({permission.strip() for permission in permissions if permission.strip()}))\n    if any(permission not in OPERATIONAL_PERMISSION_SET for permission in cleaned):\n        raise AssignmentError(\"INVALID_PERMISSION\")\n    return cleaned"
        },
        {
          "name": "require_distinct_membership",
          "line": 121,
          "end": 123,
          "body": "def require_distinct_membership(actor_id: UUID, target_user_id: UUID) -> None:\n    if actor_id == target_user_id:\n        raise AssignmentError(\"CANNOT_ARCHIVE_SELF\")"
        },
        {
          "name": "require_manager_remaining",
          "line": 126,
          "end": 128,
          "body": "def require_manager_remaining(manager_count: int) -> None:\n    if manager_count == 0:\n        raise AssignmentError(\"LAST_TENANT_ADMIN\")"
        },
        {
          "name": "require_owner_permissions",
          "line": 131,
          "end": 133,
          "body": "def require_owner_permissions(permissions: tuple[str, ...]) -> None:\n    if not set(DEFAULT_TENANT_ADMIN_PERMISSIONS) <= set(permissions):\n        raise AssignmentError(\"SYSTEM_ROLE_PERMISSION_REQUIRED\")"
        },
        {
          "name": "require_service_manager_permissions",
          "line": 136,
          "end": 138,
          "body": "def require_service_manager_permissions(permissions: tuple[str, ...]) -> None:\n    if not set(DEFAULT_ROLE_PERMISSIONS[\"Service Department Manager\"]) <= set(permissions):\n        raise AssignmentError(\"SYSTEM_ROLE_PERMISSION_REQUIRED\")"
        },
        {
          "name": "_clean",
          "line": 184,
          "end": 188,
          "body": "def _clean(value: str) -> str:\n    cleaned = value.strip()\n    if not cleaned:\n        raise AssignmentError(\"BLANK_VALUE\")\n    return cleaned"
        },
        {
          "name": "_rows",
          "line": 191,
          "end": 192,
          "body": "def _rows(session, statement: str, parameters: dict[str, object]) -> list[dict[str, object]]:\n    return [dict(row) for row in session.execute(text(statement), parameters).mappings().all()]"
        },
        {
          "name": "_require",
          "line": 195,
          "end": 208,
          "body": "def _require(scope: ScopedTenant, permission: str, *, mutation: bool = False) -> TenantScope:\n    _, current = scope\n    if current.actor_type == \"support_emulation\":\n        if mutation:\n            raise auth_error(\"TENANT_READ_ONLY\", status.HTTP_403_FORBIDDEN)\n        return current\n    if permission not in current.permissions:\n        raise auth_error(\"PERMISSION_DENIED\", status.HTTP_403_FORBIDDEN)\n    if mutation:\n        try:\n            require_mutation_allowed(current)\n        except PermissionError as error:\n            raise auth_error(\"TENANT_READ_ONLY\", status.HTTP_403_FORBIDDEN) from error\n    return current"
        },
        {
          "name": "_audit",
          "line": 211,
          "end": 222,
          "body": "def _audit(session, current: TenantScope, action: str, reason: str, before: object, after: object) -> None:\n    session.execute(\n        text(\"\"\"\n            INSERT INTO tenant_audit_events (id, tenant_id, actor_id, action, reason, before_value, after_value)\n            VALUES (:id, :tenant_id, :actor_id, :action, :reason, CAST(:before AS jsonb), CAST(:after AS jsonb))\n        \"\"\"),\n        {\n            \"id\": str(uuid4()), \"tenant_id\": str(current.tenant_id), \"actor_id\": str(current.actor_id),\n            \"action\": action, \"reason\": reason,\n            \"before\": __import__(\"json\").dumps(before, default=str), \"after\": __import__(\"json\").dumps(after, default=str),\n        },\n    )"
        },
        {
          "name": "_roles",
          "line": 225,
          "end": 236,
          "body": "def _roles(session, tenant_id: UUID) -> list[dict[str, object]]:\n    rows = _rows(session, \"\"\"\n        SELECT r.id, r.name, r.description, r.status, r.version, r.system_key, r.created_at, r.updated_at,\n               COALESCE(array_agg(rp.permission ORDER BY rp.permission) FILTER (WHERE rp.permission IS NOT NULL), '{}') AS permissions\n        FROM tenant_roles AS r LEFT JOIN role_permissions AS rp ON rp.role_id = r.id\n        WHERE r.tenant_id = :tenant_id GROUP BY r.id ORDER BY r.name, r.id\n    \"\"\", {\"tenant_id\": str(tenant_id)})\n    return [{\n        \"id\": str(row[\"id\"]), \"name\": row[\"name\"], \"description\": row[\"description\"], \"status\": row[\"status\"],\n        \"version\": row[\"version\"], \"systemKey\": row[\"system_key\"], \"permissions\": list(row[\"permissions\"] or ()),\n        \"createdAt\": row[\"created_at\"], \"updatedAt\": row[\"updated_at\"],\n    } for row in rows]"
        },
        {
          "name": "_branches",
          "line": 239,
          "end": 242,
          "body": "def _branches(session, tenant_id: UUID) -> list[dict[str, object]]:\n    return [{\"id\": str(row[\"id\"]), \"name\": row[\"name\"]} for row in _rows(\n        session, \"SELECT id, name FROM branches WHERE tenant_id = :tenant_id ORDER BY name, id\", {\"tenant_id\": str(tenant_id)}\n    )]"
        },
        {
          "name": "_membership_or_404",
          "line": 245,
          "end": 255,
          "body": "def _membership_or_404(session, tenant_id: UUID, membership_id: UUID) -> dict[str, object]:\n    rows = _rows(session, \"\"\"\n        SELECT m.id AS membership_id, m.tenant_id, m.user_id, m.status, m.version, m.created_at, m.updated_at,\n               u.display_name, u.email, i.created_at AS invited_at, i.last_sent_at\n        FROM tenant_memberships AS m JOIN platform_users AS u ON u.id = m.user_id\n        LEFT JOIN tenant_admin_invitations AS i ON i.membership_id = m.id\n        WHERE m.id = :membership_id AND m.tenant_id = :tenant_id\n    \"\"\", {\"membership_id\": str(membership_id), \"tenant_id\": str(tenant_id)})\n    if len(rows) != 1:\n        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={\"code\": \"USER_NOT_FOUND\"})\n    return rows[0]"
        },
        {
          "name": "_user_payload",
          "line": 258,
          "end": 279,
          "body": "def _user_payload(session, tenant_id: UUID, row: dict[str, object]) -> dict[str, object]:\n    membership_id = str(row[\"membership_id\"])\n    role_rows = _rows(session, \"\"\"\n        SELECT r.id, r.name, COALESCE(array_agg(rp.permission ORDER BY rp.permission) FILTER (WHERE rp.permission IS NOT NULL), '{}') AS permissions\n        FROM membership_roles AS mr JOIN tenant_roles AS r ON r.id = mr.role_id\n        LEFT JOIN role_permissions AS rp ON rp.role_id = r.id\n        WHERE mr.membership_id = :membership_id AND mr.tenant_id = :tenant_id\n        GROUP BY r.id ORDER BY r.name, r.id\n    \"\"\", {\"membership_id\": membership_id, \"tenant_id\": str(tenant_id)})\n    branch_rows = _rows(session, \"\"\"\n        SELECT b.id, b.name FROM membership_branches AS mb JOIN branches AS b ON b.id = mb.branch_id\n        WHERE mb.membership_id = :membership_id AND mb.tenant_id = :tenant_id ORDER BY b.name, b.id\n    \"\"\", {\"membership_id\": membership_id, \"tenant_id\": str(tenant_id)})\n    roles = [{\"id\": str(item[\"id\"]), \"name\": item[\"name\"], \"permissions\": list(item[\"permissions\"] or ())} for item in role_rows]\n    branches = [{\"id\": str(item[\"id\"]), \"name\": item[\"name\"]} for item in branch_rows]\n    return {\n        \"id\": membership_id, \"name\": row[\"display_name\"], \"email\": row[\"email\"], \"status\": row[\"status\"],\n        \"roleIds\": [item[\"id\"] for item in roles], \"roles\": roles,\n        \"branchIds\": [item[\"id\"] for item in branches], \"branches\": branches,\n        \"version\": row[\"version\"], \"invitedAt\": row[\"invited_at\"], \"lastInvitedAt\": row[\"last_sent_at\"],\n        \"createdAt\": row[\"created_at\"], \"updatedAt\": row[\"updated_at\"],\n    }"
        },
        {
          "name": "_directory",
          "line": 282,
          "end": 294,
          "body": "def _directory(session, tenant_id: UUID) -> dict[str, object]:\n    memberships = _rows(session, \"\"\"\n        SELECT m.id AS membership_id, m.tenant_id, m.user_id, m.status, m.version, m.created_at, m.updated_at,\n               u.display_name, u.email, i.created_at AS invited_at, i.last_sent_at\n        FROM tenant_memberships AS m JOIN platform_users AS u ON u.id = m.user_id\n        LEFT JOIN tenant_admin_invitations AS i ON i.membership_id = m.id\n        WHERE m.tenant_id = :tenant_id ORDER BY u.display_name, m.id\n    \"\"\", {\"tenant_id\": str(tenant_id)})\n    return {\n        \"users\": [_user_payload(session, tenant_id, row) for row in memberships],\n        \"roles\": _roles(session, tenant_id), \"branches\": _branches(session, tenant_id),\n        \"serviceDepartments\": _service_departments(session, tenant_id),\n    }"
        },
        {
          "name": "_service_departments",
          "line": 297,
          "end": 331,
          "body": "def _service_departments(session, tenant_id: UUID) -> list[dict[str, object]]:\n    \"\"\"Return the branch-local routing graph, including human-readable teams.\"\"\"\n    departments = _rows(session, \"\"\"\n        SELECT d.id, d.branch_id, b.name AS branch_name, d.name, d.status, d.created_at, d.updated_at\n        FROM service_departments d JOIN branches b ON b.id=d.branch_id\n        WHERE d.tenant_id=:tenant_id ORDER BY b.name, d.name, d.id\n    \"\"\", {\"tenant_id\": str(tenant_id)})\n    result = []\n    for department in departments:\n        managers = _rows(session, \"\"\"\n            SELECT m.id AS membership_id, u.id AS user_id, u.display_name\n            FROM service_department_managers dm\n            JOIN tenant_memberships m ON m.id=dm.manager_membership_id\n            JOIN platform_users u ON u.id=m.user_id\n            WHERE dm.department_id=:department_id ORDER BY u.display_name, m.id\n        \"\"\", {\"department_id\": str(department[\"id\"])})\n        teams = _rows(session, \"\"\"\n            SELECT t.manager_membership_id, t.advisor_membership_id,\n                   manager_user.id AS manager_user_id, manager_user.display_name AS manager_name,\n                   advisor_user.id AS advisor_user_id, advisor_user.display_name AS advisor_name\n            FROM service_advisor_teams t\n            JOIN tenant_memberships manager ON manager.id=t.manager_membership_id\n            JOIN platform_users manager_user ON manager_user.id=manager.user_id\n            JOIN tenant_memberships advisor ON advisor.id=t.advisor_membership_id\n            JOIN platform_users advisor_user ON advisor_user.id=advisor.user_id\n            WHERE t.department_id=:department_id ORDER BY manager_user.display_name, advisor_user.display_name\n        \"\"\", {\"department_id\": str(department[\"id\"])})\n        result.append({\n            \"id\": str(department[\"id\"]), \"branchId\": str(department[\"branch_id\"]),\n            \"branchName\": department[\"branch_name\"], \"name\": department[\"name\"],\n            \"status\": department[\"status\"], \"createdAt\": department[\"created_at\"], \"updatedAt\": department[\"updated_at\"],\n            \"managers\": [{\"membershipId\": str(row[\"membership_id\"]), \"userId\": str(row[\"user_id\"]), \"name\": row[\"display_name\"]} for row in managers],\n            \"advisorTeams\": [{\"managerMembershipId\": str(row[\"manager_membership_id\"]), \"managerUserId\": str(row[\"manager_user_id\"]), \"managerName\": row[\"manager_name\"], \"advisorMembershipId\": str(row[\"advisor_membership_id\"]), \"advisorUserId\": str(row[\"advisor_user_id\"]), \"advisorName\": row[\"advisor_name\"]} for row in teams],\n        })\n    return result"
        },
        {
          "name": "_active_branch_member",
          "line": 334,
          "end": 343,
          "body": "def _active_branch_member(session, tenant_id: UUID, membership_id: UUID, branch_id: UUID, system_key: str) -> None:\n    valid = session.execute(text(\"\"\"\n        SELECT 1 FROM tenant_memberships m\n        JOIN membership_branches mb ON mb.membership_id=m.id AND mb.branch_id=:branch_id\n        JOIN membership_roles mr ON mr.membership_id=m.id AND mr.tenant_id=m.tenant_id\n        JOIN tenant_roles r ON r.id=mr.role_id AND r.system_key=:system_key AND r.status='ACTIVE'\n        WHERE m.id=:membership_id AND m.tenant_id=:tenant_id AND m.status='ACTIVE'\n    \"\"\"), {\"tenant_id\": str(tenant_id), \"membership_id\": str(membership_id), \"branch_id\": str(branch_id), \"system_key\": system_key}).scalar()\n    if not valid:\n        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail={\"code\": \"MEMBER_NOT_ELIGIBLE\"})"
        },
        {
          "name": "_assert_assignments_belong_to_tenant",
          "line": 346,
          "end": 352,
          "body": "def _assert_assignments_belong_to_tenant(session, tenant_id: UUID, role_ids: tuple[UUID, ...], branch_ids: tuple[UUID, ...]) -> None:\n    known_roles = {UUID(str(row[\"id\"])) for row in _rows(session, \"SELECT id FROM tenant_roles WHERE tenant_id = :tenant_id AND status = 'ACTIVE'\", {\"tenant_id\": str(tenant_id)})}\n    known_branches = {UUID(str(row[\"id\"])) for row in _rows(session, \"SELECT id FROM branches WHERE tenant_id = :tenant_id\", {\"tenant_id\": str(tenant_id)})}\n    if not set(role_ids) <= known_roles:\n        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail={\"code\": \"ROLE_NOT_IN_TENANT\"})\n    if not set(branch_ids) <= known_branches:\n        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail={\"code\": \"BRANCH_NOT_IN_TENANT\"})"
        },
        {
          "name": "_replace_assignments",
          "line": 355,
          "end": 361,
          "body": "def _replace_assignments(session, tenant_id: UUID, membership_id: UUID, role_ids: tuple[UUID, ...], branch_ids: tuple[UUID, ...]) -> None:\n    session.execute(text(\"DELETE FROM membership_roles WHERE membership_id = :membership_id AND tenant_id = :tenant_id\"), {\"membership_id\": str(membership_id), \"tenant_id\": str(tenant_id)})\n    session.execute(text(\"DELETE FROM membership_branches WHERE membership_id = :membership_id AND tenant_id = :tenant_id\"), {\"membership_id\": str(membership_id), \"tenant_id\": str(tenant_id)})\n    for role_id in role_ids:\n        session.execute(text(\"INSERT INTO membership_roles (membership_id, role_id, tenant_id) VALUES (:membership_id, :role_id, :tenant_id)\"), {\"membership_id\": str(membership_id), \"role_id\": str(role_id), \"tenant_id\": str(tenant_id)})\n    for branch_id in branch_ids:\n        session.execute(text(\"INSERT INTO membership_branches (membership_id, branch_id, tenant_id) VALUES (:membership_id, :branch_id, :tenant_id)\"), {\"membership_id\": str(membership_id), \"branch_id\": str(branch_id), \"tenant_id\": str(tenant_id)})"
        },
        {
          "name": "_assert_manager_remains",
          "line": 364,
          "end": 374,
          "body": "def _assert_manager_remains(session, tenant_id: UUID) -> None:\n    count = session.execute(text(\"\"\"\n        SELECT count(DISTINCT m.id) FROM tenant_memberships AS m\n        JOIN membership_roles AS mr ON mr.membership_id = m.id AND mr.tenant_id = m.tenant_id\n        JOIN role_permissions AS rp ON rp.role_id = mr.role_id AND rp.permission = 'tenant.users.manage'\n        WHERE m.tenant_id = :tenant_id AND m.status IN ('ACTIVE', 'INVITED')\n    \"\"\"), {\"tenant_id\": str(tenant_id)}).scalar_one()\n    try:\n        require_manager_remaining(count)\n    except AssignmentError as error:\n        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={\"code\": str(error)}) from error"
        },
        {
          "name": "list_users",
          "line": 378,
          "end": 381,
          "body": "def list_users(scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    _require(scope, \"tenant.users.read\")\n    return _directory(session, current.tenant_id)"
        },
        {
          "name": "list_service_departments",
          "line": 385,
          "end": 388,
          "body": "def list_service_departments(scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    _require(scope, \"tenant.users.read\")\n    return {\"serviceDepartments\": _service_departments(session, current.tenant_id)}"
        },
        {
          "name": "create_service_department",
          "line": 392,
          "end": 408,
          "body": "def create_service_department(input: ServiceDepartmentCreate, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    _require(scope, \"tenant.users.manage\", mutation=True)\n    if not _rows(session, \"SELECT id FROM branches WHERE id=:branch_id AND tenant_id=:tenant_id\", {\"branch_id\": str(input.branch_id), \"tenant_id\": str(current.tenant_id)}):\n        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail={\"code\": \"BRANCH_NOT_IN_TENANT\"})\n    try:\n        name = _clean(input.name)\n    except AssignmentError as error:\n        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail={\"code\": str(error)}) from error\n    exists = session.execute(text(\"SELECT 1 FROM service_departments WHERE tenant_id=:tenant_id AND branch_id=:branch_id AND lower(name)=lower(:name)\"), {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(input.branch_id), \"name\": name}).scalar()\n    if exists:\n        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={\"code\": \"DEPARTMENT_NAME_CONFLICT\"})\n    department_id = uuid4()\n    session.execute(text(\"INSERT INTO service_departments (id,tenant_id,branch_id,name,created_by,updated_by) VALUES (:id,:tenant_id,:branch_id,:name,:actor_id,:actor_id)\"), {\"id\": str(department_id), \"tenant_id\": str(current.tenant_id), \"branch_id\": str(input.branch_id), \"name\": name, \"actor_id\": str(current.actor_id)})\n    payload = next(item for item in _service_departments(session, current.tenant_id) if item[\"id\"] == str(department_id))\n    _audit(session, current, \"SERVICE_DEPARTMENT_CREATED\", name, {}, payload)\n    return {\"serviceDepartment\": payload}"
        },
        {
          "name": "update_service_department",
          "line": 412,
          "end": 433,
          "body": "def update_service_department(department_id: UUID, input: ServiceDepartmentUpdate, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    _require(scope, \"tenant.users.manage\", mutation=True)\n    rows = _rows(session, \"SELECT * FROM service_departments WHERE id=:id AND tenant_id=:tenant_id\", {\"id\": str(department_id), \"tenant_id\": str(current.tenant_id)})\n    if len(rows) != 1:\n        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={\"code\": \"SERVICE_DEPARTMENT_NOT_FOUND\"})\n    try:\n        name = _clean(input.name)\n    except AssignmentError as error:\n        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail={\"code\": str(error)}) from error\n    duplicate = session.execute(text(\"\"\"\n        SELECT 1 FROM service_departments WHERE tenant_id=:tenant_id AND branch_id=:branch_id\n          AND lower(name)=lower(:name) AND id<>:id\n    \"\"\"), {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(rows[0][\"branch_id\"]), \"name\": name, \"id\": str(department_id)}).scalar()\n    if duplicate:\n        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={\"code\": \"DEPARTMENT_NAME_CONFLICT\"})\n    session.execute(text(\"\"\"\n        UPDATE service_departments SET name=:name, status=:status, updated_by=:actor_id, updated_at=now() WHERE id=:id\n    \"\"\"), {\"name\": name, \"status\": input.status, \"actor_id\": str(current.actor_id), \"id\": str(department_id)})\n    payload = next(item for item in _service_departments(session, current.tenant_id) if item[\"id\"] == str(department_id))\n    _audit(session, current, \"SERVICE_DEPARTMENT_UPDATED\", \"Service department updated\", {\"name\": rows[0][\"name\"], \"status\": rows[0][\"status\"]}, payload)\n    return {\"serviceDepartment\": payload}"
        },
        {
          "name": "appoint_service_department_manager",
          "line": 437,
          "end": 450,
          "body": "def appoint_service_department_manager(department_id: UUID, membership_id: UUID, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    _require(scope, \"tenant.users.manage\", mutation=True)\n    department = _rows(session, \"SELECT * FROM service_departments WHERE id=:id AND tenant_id=:tenant_id AND status='ACTIVE'\", {\"id\": str(department_id), \"tenant_id\": str(current.tenant_id)})\n    if len(department) != 1:\n        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={\"code\": \"SERVICE_DEPARTMENT_NOT_FOUND\"})\n    _active_branch_member(session, current.tenant_id, membership_id, UUID(str(department[0][\"branch_id\"])), \"service_manager\")\n    session.execute(text(\"\"\"\n        INSERT INTO service_department_managers (tenant_id,branch_id,department_id,manager_membership_id,appointed_by)\n        VALUES (:tenant_id,:branch_id,:department_id,:membership_id,:actor_id) ON CONFLICT DO NOTHING\n    \"\"\"), {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(department[0][\"branch_id\"]), \"department_id\": str(department_id), \"membership_id\": str(membership_id), \"actor_id\": str(current.actor_id)})\n    payload = next(item for item in _service_departments(session, current.tenant_id) if item[\"id\"] == str(department_id))\n    _audit(session, current, \"SERVICE_MANAGER_APPOINTED\", \"Service department manager appointed\", {}, {\"departmentId\": str(department_id), \"membershipId\": str(membership_id)})\n    return {\"serviceDepartment\": payload}"
        },
        {
          "name": "remove_service_department_manager",
          "line": 454,
          "end": 466,
          "body": "def remove_service_department_manager(department_id: UUID, membership_id: UUID, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    _require(scope, \"tenant.users.manage\", mutation=True)\n    department = _rows(session, \"SELECT * FROM service_departments WHERE id=:id AND tenant_id=:tenant_id\", {\"id\": str(department_id), \"tenant_id\": str(current.tenant_id)})\n    if len(department) != 1:\n        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={\"code\": \"SERVICE_DEPARTMENT_NOT_FOUND\"})\n    removed = session.execute(text(\"DELETE FROM service_department_managers WHERE tenant_id=:tenant_id AND department_id=:department_id AND manager_membership_id=:membership_id\"), {\"tenant_id\": str(current.tenant_id), \"department_id\": str(department_id), \"membership_id\": str(membership_id)}).rowcount\n    if not removed:\n        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={\"code\": \"MANAGER_NOT_APPOINTED\"})\n    session.execute(text(\"DELETE FROM service_advisor_teams WHERE tenant_id=:tenant_id AND department_id=:department_id AND manager_membership_id=:membership_id\"), {\"tenant_id\": str(current.tenant_id), \"department_id\": str(department_id), \"membership_id\": str(membership_id)})\n    payload = next(item for item in _service_departments(session, current.tenant_id) if item[\"id\"] == str(department_id))\n    _audit(session, current, \"SERVICE_MANAGER_REMOVED\", \"Service department manager removed\", {}, {\"departmentId\": str(department_id), \"membershipId\": str(membership_id)})\n    return {\"serviceDepartment\": payload}"
        },
        {
          "name": "assign_service_advisor_team",
          "line": 470,
          "end": 490,
          "body": "def assign_service_advisor_team(department_id: UUID, manager_membership_id: UUID, advisor_membership_id: UUID, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    _require(scope, \"tenant.users.manage\", mutation=True)\n    department = _rows(session, \"SELECT * FROM service_departments WHERE id=:id AND tenant_id=:tenant_id AND status='ACTIVE'\", {\"id\": str(department_id), \"tenant_id\": str(current.tenant_id)})\n    if len(department) != 1:\n        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={\"code\": \"SERVICE_DEPARTMENT_NOT_FOUND\"})\n    branch_id = UUID(str(department[0][\"branch_id\"]))\n    appointed = session.execute(text(\"SELECT 1 FROM service_department_managers WHERE department_id=:department_id AND manager_membership_id=:membership_id\"), {\"department_id\": str(department_id), \"membership_id\": str(manager_membership_id)}).scalar()\n    if not appointed:\n        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail={\"code\": \"MANAGER_NOT_APPOINTED\"})\n    _active_branch_member(session, current.tenant_id, advisor_membership_id, branch_id, \"service\")\n    session.execute(text(\"\"\"\n        INSERT INTO service_advisor_teams (tenant_id,branch_id,department_id,manager_membership_id,advisor_membership_id,assigned_by)\n        VALUES (:tenant_id,:branch_id,:department_id,:manager_membership_id,:advisor_membership_id,:actor_id)\n        ON CONFLICT (tenant_id,branch_id,advisor_membership_id) DO UPDATE\n        SET department_id=EXCLUDED.department_id, manager_membership_id=EXCLUDED.manager_membership_id,\n            assigned_by=EXCLUDED.assigned_by, assigned_at=now()\n    \"\"\"), {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(branch_id), \"department_id\": str(department_id), \"manager_membership_id\": str(manager_membership_id), \"advisor_membership_id\": str(advisor_membership_id), \"actor_id\": str(current.actor_id)})\n    payload = next(item for item in _service_departments(session, current.tenant_id) if item[\"id\"] == str(department_id))\n    _audit(session, current, \"SERVICE_ADVISOR_TEAM_ASSIGNED\", \"Advisor assigned to manager team\", {}, {\"departmentId\": str(department_id), \"managerMembershipId\": str(manager_membership_id), \"advisorMembershipId\": str(advisor_membership_id)})\n    return {\"serviceDepartment\": payload}"
        },
        {
          "name": "remove_service_advisor_team",
          "line": 494,
          "end": 505,
          "body": "def remove_service_advisor_team(department_id: UUID, manager_membership_id: UUID, advisor_membership_id: UUID, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    _require(scope, \"tenant.users.manage\", mutation=True)\n    department = _rows(session, \"SELECT id FROM service_departments WHERE id=:id AND tenant_id=:tenant_id\", {\"id\": str(department_id), \"tenant_id\": str(current.tenant_id)})\n    if len(department) != 1:\n        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={\"code\": \"SERVICE_DEPARTMENT_NOT_FOUND\"})\n    removed = session.execute(text(\"DELETE FROM service_advisor_teams WHERE tenant_id=:tenant_id AND department_id=:department_id AND manager_membership_id=:manager_membership_id AND advisor_membership_id=:advisor_membership_id\"), {\"tenant_id\": str(current.tenant_id), \"department_id\": str(department_id), \"manager_membership_id\": str(manager_membership_id), \"advisor_membership_id\": str(advisor_membership_id)}).rowcount\n    if not removed:\n        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={\"code\": \"ADVISOR_TEAM_NOT_FOUND\"})\n    payload = next(item for item in _service_departments(session, current.tenant_id) if item[\"id\"] == str(department_id))\n    _audit(session, current, \"SERVICE_ADVISOR_TEAM_REMOVED\", \"Advisor removed from manager team\", {}, {\"departmentId\": str(department_id), \"managerMembershipId\": str(manager_membership_id), \"advisorMembershipId\": str(advisor_membership_id)})\n    return {\"serviceDepartment\": payload}"
        },
        {
          "name": "create_user",
          "line": 509,
          "end": 541,
          "body": "def create_user(input: UserCreate, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    _require(scope, \"tenant.users.manage\", mutation=True)\n    try:\n        role_ids, branch_ids = validate_assignment(input.role_ids, input.branch_ids)\n        name, email = _clean(input.name), _clean(input.email).lower()\n    except AssignmentError as error:\n        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail={\"code\": str(error)}) from error\n    _assert_assignments_belong_to_tenant(session, current.tenant_id, role_ids, branch_ids)\n    existing = _rows(session, \"SELECT id FROM platform_users WHERE lower(email) = :email\", {\"email\": email})\n    if existing:\n        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={\"code\": \"EMAIL_ALREADY_REGISTERED\"})\n    user_id, membership_id, invitation_id = uuid4(), uuid4(), uuid4()\n    database_mode = get_settings().auth_mode == \"database\"\n    if database_mode and not input.password:\n        raise auth_error(\"PASSWORD_REQUIRED\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    session.execute(text(\"INSERT INTO platform_users (id, cognito_subject, display_name, email, password_hash) VALUES (:id, NULL, :name, :email, :password_hash)\"),\n                    {\"id\": str(user_id), \"name\": name, \"email\": email, \"password_hash\": hash_password(input.password) if database_mode and input.password else None})\n    session.execute(text(\"INSERT INTO tenant_memberships (id, tenant_id, user_id, status) VALUES (:id, :tenant_id, :user_id, :status)\"),\n                    {\"id\": str(membership_id), \"tenant_id\": str(current.tenant_id), \"user_id\": str(user_id),\n                     \"status\": \"ACTIVE\" if database_mode else \"INVITED\"})\n    _replace_assignments(session, current.tenant_id, membership_id, role_ids, branch_ids)\n    if database_mode:\n        session.execute(text(\"UPDATE platform_users SET active_membership_id=:membership WHERE id=:user\"),\n                        {\"membership\": str(membership_id), \"user\": str(user_id)})\n    else:\n        session.execute(text(\"INSERT INTO tenant_admin_invitations (id, tenant_id, membership_id, email, status, last_sent_at) VALUES (:id, :tenant_id, :membership_id, :email, 'PENDING', now())\"), {\"id\": str(invitation_id), \"tenant_id\": str(current.tenant_id), \"membership_id\": str(membership_id), \"email\": email})\n    row = _membership_or_404(session, current.tenant_id, membership_id)\n    payload = _user_payload(session, current.tenant_id, row)\n    _audit(session, current, \"TENANT_USER_CREATED\" if database_mode else \"TENANT_USER_INVITED\",\n           \"Tenant user created\" if database_mode else \"Tenant user invited\", {},\n           {\"membershipId\": payload[\"id\"], \"roleIds\": payload[\"roleIds\"], \"branchIds\": payload[\"branchIds\"]})\n    return {\"user\": payload}"
        },
        {
          "name": "update_user",
          "line": 545,
          "end": 567,
          "body": "def update_user(membership_id: UUID, input: UserUpdate, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    _require(scope, \"tenant.users.manage\", mutation=True)\n    try:\n        role_ids, branch_ids = validate_assignment(input.role_ids, input.branch_ids)\n        name = _clean(input.name)\n    except AssignmentError as error:\n        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail={\"code\": str(error)}) from error\n    _assert_assignments_belong_to_tenant(session, current.tenant_id, role_ids, branch_ids)\n    before = _membership_or_404(session, current.tenant_id, membership_id)\n    updated = session.execute(text(\"\"\"\n        UPDATE tenant_memberships SET version = version + 1, updated_at = now()\n        WHERE id = :membership_id AND tenant_id = :tenant_id AND version = :version\n    \"\"\"), {\"membership_id\": str(membership_id), \"tenant_id\": str(current.tenant_id), \"version\": input.version})\n    if updated.rowcount != 1:\n        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={\"code\": \"VERSION_CONFLICT\"})\n    session.execute(text(\"UPDATE platform_users SET display_name = :name, updated_at = now() WHERE id = :user_id\"), {\"name\": name, \"user_id\": str(before[\"user_id\"])})\n    _replace_assignments(session, current.tenant_id, membership_id, role_ids, branch_ids)\n    _assert_manager_remains(session, current.tenant_id)\n    row = _membership_or_404(session, current.tenant_id, membership_id)\n    payload = _user_payload(session, current.tenant_id, row)\n    _audit(session, current, \"TENANT_USER_UPDATED\", \"Tenant user assignments updated\", {\"membershipId\": str(membership_id), \"version\": before[\"version\"]}, {\"roleIds\": payload[\"roleIds\"], \"branchIds\": payload[\"branchIds\"], \"version\": payload[\"version\"]})\n    return {\"user\": payload}"
        },
        {
          "name": "archive_user",
          "line": 571,
          "end": 587,
          "body": "def archive_user(membership_id: UUID, input: ArchiveUser, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    _require(scope, \"tenant.users.manage\", mutation=True)\n    before = _membership_or_404(session, current.tenant_id, membership_id)\n    try:\n        require_distinct_membership(current.actor_id, UUID(str(before[\"user_id\"])))\n    except AssignmentError as error:\n        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail={\"code\": str(error)}) from error\n    if before[\"status\"] == \"ARCHIVED\":\n        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={\"code\": \"USER_ALREADY_ARCHIVED\"})\n    session.execute(text(\"UPDATE tenant_memberships SET status = 'ARCHIVED', version = version + 1, updated_at = now() WHERE id = :membership_id AND tenant_id = :tenant_id\"), {\"membership_id\": str(membership_id), \"tenant_id\": str(current.tenant_id)})\n    session.execute(text(\"UPDATE platform_users SET active_membership_id = NULL, updated_at = now() WHERE id = :user_id AND active_membership_id = :membership_id\"), {\"user_id\": str(before[\"user_id\"]), \"membership_id\": str(membership_id)})\n    _assert_manager_remains(session, current.tenant_id)\n    row = _membership_or_404(session, current.tenant_id, membership_id)\n    payload = _user_payload(session, current.tenant_id, row)\n    _audit(session, current, \"TENANT_USER_ARCHIVED\", input.reason.strip(), {\"membershipId\": str(membership_id), \"status\": before[\"status\"]}, {\"status\": \"ARCHIVED\"})\n    return {\"user\": payload}"
        },
        {
          "name": "resend_invite",
          "line": 591,
          "end": 603,
          "body": "def resend_invite(membership_id: UUID, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    _require(scope, \"tenant.users.manage\", mutation=True)\n    before = _membership_or_404(session, current.tenant_id, membership_id)\n    if before[\"status\"] != \"INVITED\":\n        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={\"code\": \"INVITATION_NOT_PENDING\"})\n    result = session.execute(text(\"UPDATE tenant_admin_invitations SET last_sent_at = now() WHERE membership_id = :membership_id AND tenant_id = :tenant_id AND status = 'PENDING'\"), {\"membership_id\": str(membership_id), \"tenant_id\": str(current.tenant_id)})\n    if result.rowcount != 1:\n        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={\"code\": \"INVITATION_NOT_PENDING\"})\n    row = _membership_or_404(session, current.tenant_id, membership_id)\n    payload = _user_payload(session, current.tenant_id, row)\n    _audit(session, current, \"TENANT_USER_INVITATION_RESENT\", \"Tenant user invitation resent\", {\"membershipId\": str(membership_id)}, {\"lastInvitedAt\": payload[\"lastInvitedAt\"]})\n    return {\"user\": payload}"
        },
        {
          "name": "list_roles",
          "line": 607,
          "end": 610,
          "body": "def list_roles(scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    _require(scope, \"tenant.users.read\")\n    return {\"roles\": _roles(session, current.tenant_id)}"
        },
        {
          "name": "create_role",
          "line": 614,
          "end": 629,
          "body": "def create_role(input: RoleCreate, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    _require(scope, \"tenant.users.manage\", mutation=True)\n    try:\n        name, description, permissions = _clean(input.name), input.description.strip(), validate_permissions(input.permissions)\n    except AssignmentError as error:\n        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail={\"code\": str(error)}) from error\n    if _rows(session, \"SELECT id FROM tenant_roles WHERE tenant_id = :tenant_id AND name = :name\", {\"tenant_id\": str(current.tenant_id), \"name\": name}):\n        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={\"code\": \"ROLE_NAME_CONFLICT\"})\n    role_id = uuid4()\n    session.execute(text(\"INSERT INTO tenant_roles (id, tenant_id, name, description) VALUES (:id, :tenant_id, :name, :description)\"), {\"id\": str(role_id), \"tenant_id\": str(current.tenant_id), \"name\": name, \"description\": description})\n    for permission in permissions:\n        session.execute(text(\"INSERT INTO role_permissions (role_id, permission) VALUES (:role_id, :permission)\"), {\"role_id\": str(role_id), \"permission\": permission})\n    role = next(role for role in _roles(session, current.tenant_id) if role[\"id\"] == str(role_id))\n    _audit(session, current, \"TENANT_ROLE_CREATED\", \"Tenant role created\", {}, {\"roleId\": role[\"id\"], \"permissions\": role[\"permissions\"]})\n    return {\"role\": role}"
        },
        {
          "name": "update_role",
          "line": 633,
          "end": 665,
          "body": "def update_role(role_id: UUID, input: RoleUpdate, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    _require(scope, \"tenant.users.manage\", mutation=True)\n    try:\n        name, description, permissions = _clean(input.name), input.description.strip(), validate_permissions(input.permissions)\n    except AssignmentError as error:\n        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail={\"code\": str(error)}) from error\n    rows = _rows(session, \"SELECT id, system_key, version FROM tenant_roles WHERE id = :role_id AND tenant_id = :tenant_id\", {\"role_id\": str(role_id), \"tenant_id\": str(current.tenant_id)})\n    if len(rows) != 1:\n        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={\"code\": \"ROLE_NOT_FOUND\"})\n    if rows[0][\"system_key\"] == \"admin\":\n        try:\n            require_owner_permissions(permissions)\n        except AssignmentError as error:\n            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail={\"code\": str(error)}) from error\n    if rows[0][\"system_key\"] == \"service_manager\":\n        try:\n            require_service_manager_permissions(permissions)\n        except AssignmentError as error:\n            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail={\"code\": str(error)}) from error\n    changed = session.execute(text(\"\"\"\n        UPDATE tenant_roles SET name = :name, description = :description, version = version + 1, updated_at = now()\n        WHERE id = :role_id AND tenant_id = :tenant_id AND version = :version\n    \"\"\"), {\"name\": name, \"description\": description, \"role_id\": str(role_id), \"tenant_id\": str(current.tenant_id), \"version\": input.version})\n    if changed.rowcount != 1:\n        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={\"code\": \"VERSION_CONFLICT\"})\n    session.execute(text(\"DELETE FROM role_permissions WHERE role_id = :role_id\"), {\"role_id\": str(role_id)})\n    for permission in permissions:\n        session.execute(text(\"INSERT INTO role_permissions (role_id, permission) VALUES (:role_id, :permission)\"), {\"role_id\": str(role_id), \"permission\": permission})\n    _assert_manager_remains(session, current.tenant_id)\n    role = next(role for role in _roles(session, current.tenant_id) if role[\"id\"] == str(role_id))\n    _audit(session, current, \"TENANT_ROLE_UPDATED\", \"Tenant role permissions updated\", {\"roleId\": str(role_id)}, {\"permissions\": role[\"permissions\"], \"version\": role[\"version\"]})\n    return {\"role\": role}"
        },
        {
          "name": "archive_role",
          "line": 669,
          "end": 686,
          "body": "def archive_role(role_id: UUID, input: ArchiveUser, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    _require(scope, \"tenant.users.manage\", mutation=True)\n    rows = _rows(session, \"SELECT id, name, system_key, status FROM tenant_roles WHERE id = :role_id AND tenant_id = :tenant_id\", {\"role_id\": str(role_id), \"tenant_id\": str(current.tenant_id)})\n    if len(rows) != 1:\n        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={\"code\": \"ROLE_NOT_FOUND\"})\n    role = rows[0]\n    if role[\"system_key\"] in (\"admin\", \"service_manager\"):\n        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={\"code\": \"SYSTEM_ROLE_PROTECTED\"})\n    if role[\"status\"] == \"ARCHIVED\":\n        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={\"code\": \"ROLE_ALREADY_ARCHIVED\"})\n    assigned = session.execute(text(\"SELECT count(*) FROM membership_roles WHERE role_id = :role_id AND tenant_id = :tenant_id\"), {\"role_id\": str(role_id), \"tenant_id\": str(current.tenant_id)}).scalar_one()\n    if assigned:\n        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={\"code\": \"ROLE_IN_USE\"})\n    session.execute(text(\"UPDATE tenant_roles SET status = 'ARCHIVED', version = version + 1, updated_at = now() WHERE id = :role_id AND tenant_id = :tenant_id\"), {\"role_id\": str(role_id), \"tenant_id\": str(current.tenant_id)})\n    archived = next(item for item in _roles(session, current.tenant_id) if item[\"id\"] == str(role_id))\n    _audit(session, current, \"TENANT_ROLE_ARCHIVED\", input.reason.strip(), {\"roleId\": str(role_id), \"name\": role[\"name\"]}, {\"status\": \"ARCHIVED\"})\n    return {\"role\": archived}"
        }
      ]
    }
  ],
  "endpoints": [
    {
      "method": "GET",
      "path": "/api/v1/checklists",
      "file": "/app/app/checklists.py",
      "name": "list_checklists",
      "line": 70
    },
    {
      "method": "POST",
      "path": "/api/v1/checklists",
      "file": "/app/app/checklists.py",
      "name": "create_cycle",
      "line": 76
    },
    {
      "method": "PUT",
      "path": "/api/v1/checklists/items/{item_id}",
      "file": "/app/app/checklists.py",
      "name": "decide_item",
      "line": 102
    },
    {
      "method": "GET",
      "path": "/api/v1/auth/workshops",
      "file": "/app/app/database_auth.py",
      "name": "list_login_workshops",
      "line": 78
    },
    {
      "method": "GET",
      "path": "/api/v1/auth/tenants/{code}/users",
      "file": "/app/app/database_auth.py",
      "name": "list_login_users",
      "line": 93
    },
    {
      "method": "POST",
      "path": "/api/v1/auth/login",
      "file": "/app/app/database_auth.py",
      "name": "login",
      "line": 108
    },
    {
      "method": "POST",
      "path": "/api/v1/auth/logout",
      "file": "/app/app/database_auth.py",
      "name": "logout",
      "line": 172
    },
    {
      "method": "GET",
      "path": "/api/v1/technician-tasks",
      "file": "/app/app/execution.py",
      "name": "list_my_tasks",
      "line": 111
    },
    {
      "method": "POST",
      "path": "/api/v1/technician-tasks",
      "file": "/app/app/execution.py",
      "name": "assign_task",
      "line": 118
    },
    {
      "method": "POST",
      "path": "/api/v1/technician-tasks/{task_id}/update",
      "file": "/app/app/execution.py",
      "name": "update_task",
      "line": 138
    },
    {
      "method": "POST",
      "path": "/api/v1/work-updates/{update_id}/attachments",
      "file": "/app/app/execution.py",
      "name": "upload_attachment",
      "line": 151
    },
    {
      "method": "GET",
      "path": "/api/v1/attachments/{attachment_id}/content",
      "file": "/app/app/execution.py",
      "name": "read_attachment",
      "line": 166
    },
    {
      "method": "POST",
      "path": "/api/v1/qc-checks",
      "file": "/app/app/execution.py",
      "name": "create_qc_check",
      "line": 178
    },
    {
      "method": "POST",
      "path": "/api/v1/qc-checks/{check_id}/legacy-result",
      "file": "/app/app/execution.py",
      "name": "record_qc_result",
      "line": 188
    },
    {
      "method": "GET",
      "path": "/api/v1/technician-tasks/mine",
      "file": "/app/app/execution.py",
      "name": "list_remote_tasks",
      "line": 216
    },
    {
      "method": "POST",
      "path": "/api/v1/jobs/{job_id}/technician-tasks",
      "file": "/app/app/execution.py",
      "name": "assign_remote_task",
      "line": 224
    },
    {
      "method": "POST",
      "path": "/api/v1/technician-tasks/{task_id}/commands/{command}",
      "file": "/app/app/execution.py",
      "name": "command_remote_task",
      "line": 248
    },
    {
      "method": "POST",
      "path": "/api/v1/jobs/{job_id}/work-updates",
      "file": "/app/app/execution.py",
      "name": "create_remote_work_update",
      "line": 267
    },
    {
      "method": "POST",
      "path": "/api/v1/jobs/{job_id}/attachments",
      "file": "/app/app/execution.py",
      "name": "create_remote_attachment",
      "line": 283
    },
    {
      "method": "GET",
      "path": "/api/v1/jobs/{job_id}/execution",
      "file": "/app/app/execution.py",
      "name": "get_remote_execution",
      "line": 300
    },
    {
      "method": "POST",
      "path": "/api/v1/jobs/{job_id}/qc-checks",
      "file": "/app/app/execution.py",
      "name": "create_remote_qc_check",
      "line": 312
    },
    {
      "method": "POST",
      "path": "/api/v1/qc-checks/{check_id}/result",
      "file": "/app/app/execution.py",
      "name": "record_remote_qc_result",
      "line": 325
    },
    {
      "method": "GET",
      "path": "/api/v1/jobs/{job_id}/invoices",
      "file": "/app/app/finance.py",
      "name": "list_job_invoices",
      "line": 270
    },
    {
      "method": "POST",
      "path": "/api/v1/jobs/{job_id}/invoices",
      "file": "/app/app/finance.py",
      "name": "issue_invoice",
      "line": 279
    },
    {
      "method": "POST",
      "path": "/api/v1/invoices/{invoice_id}/void",
      "file": "/app/app/finance.py",
      "name": "void_invoice",
      "line": 348
    },
    {
      "method": "POST",
      "path": "/api/v1/invoices/{invoice_id}/credit-notes",
      "file": "/app/app/finance.py",
      "name": "issue_credit_note",
      "line": 380
    },
    {
      "method": "POST",
      "path": "/api/v1/credit-notes/{credit_note_id}/refunds",
      "file": "/app/app/finance.py",
      "name": "record_refund",
      "line": 412
    },
    {
      "method": "POST",
      "path": "/api/v1/invoices/{invoice_id}/payments",
      "file": "/app/app/finance.py",
      "name": "record_payment",
      "line": 433
    },
    {
      "method": "GET",
      "path": "/api/v1/invoices/{invoice_id}/payments",
      "file": "/app/app/finance.py",
      "name": "list_payments",
      "line": 476
    },
    {
      "method": "POST",
      "path": "/api/v1/jobs/{job_id}/complete-handover",
      "file": "/app/app/finance.py",
      "name": "complete_handover",
      "line": 484
    },
    {
      "method": "GET",
      "path": "/api/v1/jobs/{job_id}/delivery",
      "file": "/app/app/finance.py",
      "name": "get_delivery",
      "line": 525
    },
    {
      "method": "GET",
      "path": "/api/v1/financial-documents/{document_id}/content",
      "file": "/app/app/finance.py",
      "name": "get_document_content",
      "line": 534
    },
    {
      "method": "GET",
      "path": "/api/v1/payments/{payment_id}/supporting-attachment",
      "file": "/app/app/finance.py",
      "name": "get_supporting_attachment",
      "line": 548
    },
    {
      "method": "GET",
      "path": "/api/v1/follow-ups",
      "file": "/app/app/followups.py",
      "name": "list_followups",
      "line": 90
    },
    {
      "method": "GET",
      "path": "/api/v1/follow-ups/jobs",
      "file": "/app/app/followups.py",
      "name": "followup_jobs",
      "line": 122
    },
    {
      "method": "POST",
      "path": "/api/v1/follow-ups",
      "file": "/app/app/followups.py",
      "name": "create_followup",
      "line": 139
    },
    {
      "method": "PUT",
      "path": "/api/v1/follow-ups/{followup_id}",
      "file": "/app/app/followups.py",
      "name": "update_followup",
      "line": 156
    },
    {
      "method": "POST",
      "path": "/api/v1/follow-ups/{followup_id}/commands/complete",
      "file": "/app/app/followups.py",
      "name": "complete_followup",
      "line": 173
    },
    {
      "method": "POST",
      "path": "/api/v1/follow-ups/{followup_id}/archive",
      "file": "/app/app/followups.py",
      "name": "archive_followup",
      "line": 189
    },
    {
      "method": "GET",
      "path": "/api/v1/search",
      "file": "/app/app/followups.py",
      "name": "search",
      "line": 205
    },
    {
      "method": "GET",
      "path": "/api/v1/bookings",
      "file": "/app/app/intake.py",
      "name": "list_bookings",
      "line": 225
    },
    {
      "method": "POST",
      "path": "/api/v1/bookings",
      "file": "/app/app/intake.py",
      "name": "create_booking",
      "line": 243
    },
    {
      "method": "GET",
      "path": "/api/v1/bookings/{booking_id}",
      "file": "/app/app/intake.py",
      "name": "get_booking",
      "line": 264
    },
    {
      "method": "POST",
      "path": "/api/v1/bookings/{booking_id}/check-in",
      "file": "/app/app/intake.py",
      "name": "check_in_booking",
      "line": 274
    },
    {
      "method": "GET",
      "path": "/api/v1/customers",
      "file": "/app/app/intake.py",
      "name": "list_customers",
      "line": 335
    },
    {
      "method": "POST",
      "path": "/api/v1/customers",
      "file": "/app/app/intake.py",
      "name": "create_customer",
      "line": 351
    },
    {
      "method": "GET",
      "path": "/api/v1/customers/{customer_id}",
      "file": "/app/app/intake.py",
      "name": "get_customer",
      "line": 363
    },
    {
      "method": "PUT",
      "path": "/api/v1/customers/{customer_id}",
      "file": "/app/app/intake.py",
      "name": "update_customer",
      "line": 369
    },
    {
      "method": "POST",
      "path": "/api/v1/customers/{customer_id}/archive",
      "file": "/app/app/intake.py",
      "name": "archive_customer",
      "line": 380
    },
    {
      "method": "GET",
      "path": "/api/v1/vehicles",
      "file": "/app/app/intake.py",
      "name": "list_vehicles",
      "line": 391
    },
    {
      "method": "POST",
      "path": "/api/v1/vehicles",
      "file": "/app/app/intake.py",
      "name": "create_vehicle",
      "line": 399
    },
    {
      "method": "GET",
      "path": "/api/v1/vehicles/{vehicle_id}",
      "file": "/app/app/intake.py",
      "name": "get_vehicle",
      "line": 408
    },
    {
      "method": "PUT",
      "path": "/api/v1/vehicles/{vehicle_id}",
      "file": "/app/app/intake.py",
      "name": "update_vehicle",
      "line": 414
    },
    {
      "method": "POST",
      "path": "/api/v1/vehicles/{vehicle_id}/archive",
      "file": "/app/app/intake.py",
      "name": "archive_vehicle",
      "line": 425
    },
    {
      "method": "GET",
      "path": "/api/v1/visits",
      "file": "/app/app/intake.py",
      "name": "list_visits",
      "line": 434
    },
    {
      "method": "POST",
      "path": "/api/v1/visits",
      "file": "/app/app/intake.py",
      "name": "create_visit",
      "line": 442
    },
    {
      "method": "GET",
      "path": "/api/v1/visits/{visit_id}",
      "file": "/app/app/intake.py",
      "name": "get_visit",
      "line": 451
    },
    {
      "method": "PUT",
      "path": "/api/v1/visits/{visit_id}",
      "file": "/app/app/intake.py",
      "name": "update_visit",
      "line": 457
    },
    {
      "method": "POST",
      "path": "/api/v1/visits/{visit_id}/archive",
      "file": "/app/app/intake.py",
      "name": "archive_visit",
      "line": 466
    },
    {
      "method": "GET",
      "path": "/api/v1/catalogue-items",
      "file": "/app/app/inventory.py",
      "name": "list_catalogue",
      "line": 231
    },
    {
      "method": "POST",
      "path": "/api/v1/catalogue-items",
      "file": "/app/app/inventory.py",
      "name": "create_catalogue",
      "line": 249
    },
    {
      "method": "PUT",
      "path": "/api/v1/catalogue-items/{item_id}",
      "file": "/app/app/inventory.py",
      "name": "update_catalogue",
      "line": 257
    },
    {
      "method": "POST",
      "path": "/api/v1/catalogue-items/{item_id}/archive",
      "file": "/app/app/inventory.py",
      "name": "archive_catalogue",
      "line": 265
    },
    {
      "method": "GET",
      "path": "/api/v1/suppliers",
      "file": "/app/app/inventory.py",
      "name": "list_suppliers",
      "line": 275
    },
    {
      "method": "POST",
      "path": "/api/v1/suppliers",
      "file": "/app/app/inventory.py",
      "name": "create_supplier",
      "line": 283
    },
    {
      "method": "PUT",
      "path": "/api/v1/suppliers/{supplier_id}",
      "file": "/app/app/inventory.py",
      "name": "update_supplier",
      "line": 290
    },
    {
      "method": "POST",
      "path": "/api/v1/suppliers/{supplier_id}/archive",
      "file": "/app/app/inventory.py",
      "name": "archive_supplier",
      "line": 298
    },
    {
      "method": "GET",
      "path": "/api/v1/purchase-orders",
      "file": "/app/app/inventory.py",
      "name": "list_purchase_orders",
      "line": 308
    },
    {
      "method": "POST",
      "path": "/api/v1/purchase-orders",
      "file": "/app/app/inventory.py",
      "name": "create_purchase_order",
      "line": 316
    },
    {
      "method": "PUT",
      "path": "/api/v1/purchase-orders/{purchase_id}",
      "file": "/app/app/inventory.py",
      "name": "update_purchase_order",
      "line": 324
    },
    {
      "method": "POST",
      "path": "/api/v1/purchase-orders/{purchase_id}/commands/{command}",
      "file": "/app/app/inventory.py",
      "name": "purchase_order_command",
      "line": 333
    },
    {
      "method": "POST",
      "path": "/api/v1/purchase-orders/{purchase_id}/delivery-receipts",
      "file": "/app/app/inventory.py",
      "name": "record_delivery_receipt",
      "line": 362
    },
    {
      "method": "POST",
      "path": "/api/v1/purchase-orders/{purchase_id}/delivery-confirmations",
      "file": "/app/app/inventory.py",
      "name": "confirm_delivery",
      "line": 394
    },
    {
      "method": "GET",
      "path": "/api/v1/stock-inwards",
      "file": "/app/app/inventory.py",
      "name": "list_stock_inwards",
      "line": 424
    },
    {
      "method": "POST",
      "path": "/api/v1/stock-inwards",
      "file": "/app/app/inventory.py",
      "name": "record_stock_inward",
      "line": 432
    },
    {
      "method": "POST",
      "path": "/api/v1/stock-adjustments",
      "file": "/app/app/inventory.py",
      "name": "adjust_stock",
      "line": 453
    },
    {
      "method": "GET",
      "path": "/api/v1/stock-ledger",
      "file": "/app/app/inventory.py",
      "name": "list_stock_ledger",
      "line": 462
    },
    {
      "method": "GET",
      "path": "/api/v1/jobs",
      "file": "/app/app/jobs.py",
      "name": "list_jobs",
      "line": 226
    },
    {
      "method": "GET",
      "path": "/api/v1/jobs/{job_id}",
      "file": "/app/app/jobs.py",
      "name": "get_job",
      "line": 241
    },
    {
      "method": "PUT",
      "path": "/api/v1/jobs/{job_id}/estimated-delivery",
      "file": "/app/app/jobs.py",
      "name": "update_estimated_delivery",
      "line": 250
    },
    {
      "method": "POST",
      "path": "/api/v1/jobs",
      "file": "/app/app/jobs.py",
      "name": "create_job",
      "line": 275
    },
    {
      "method": "PUT",
      "path": "/api/v1/jobs/{job_id}/advisor",
      "file": "/app/app/jobs.py",
      "name": "assign_job_advisor",
      "line": 300
    },
    {
      "method": "PUT",
      "path": "/api/v1/jobs/{job_id}/manager",
      "file": "/app/app/jobs.py",
      "name": "transfer_job_manager",
      "line": 337
    },
    {
      "method": "POST",
      "path": "/api/v1/jobs/{job_id}/estimates",
      "file": "/app/app/jobs.py",
      "name": "create_estimate",
      "line": 360
    },
    {
      "method": "POST",
      "path": "/api/v1/estimates/{estimate_id}/decision",
      "file": "/app/app/jobs.py",
      "name": "record_estimate_decision",
      "line": 390
    },
    {
      "method": "POST",
      "path": "/api/v1/jobs/{job_id}/commands/{command}",
      "file": "/app/app/jobs.py",
      "name": "command_job",
      "line": 482
    },
    {
      "method": "GET",
      "path": "/health",
      "file": "/app/app/main.py",
      "name": "health",
      "line": 84
    },
    {
      "method": "GET",
      "path": "/api/v1/health",
      "file": "/app/app/main.py",
      "name": "api_health",
      "line": 97
    },
    {
      "method": "GET",
      "path": "/api/v1/auth/config",
      "file": "/app/app/main.py",
      "name": "auth_config",
      "line": 103
    },
    {
      "method": "GET",
      "path": "/api/v1/session",
      "file": "/app/app/main.py",
      "name": "session",
      "line": 135
    },
    {
      "method": "GET",
      "path": "/api/v1/tenant/settings",
      "file": "/app/app/main.py",
      "name": "read_tenant_settings",
      "line": 142
    },
    {
      "method": "GET",
      "path": "/api/v1/tenant/theme",
      "file": "/app/app/main.py",
      "name": "read_tenant_theme",
      "line": 154
    },
    {
      "method": "PUT",
      "path": "/api/v1/tenant/theme",
      "file": "/app/app/main.py",
      "name": "write_tenant_theme",
      "line": 162
    },
    {
      "method": "PUT",
      "path": "/api/v1/tenant/settings",
      "file": "/app/app/main.py",
      "name": "write_tenant_settings",
      "line": 176
    },
    {
      "method": "GET",
      "path": "/api/v1/branches/{branch_id}/settings",
      "file": "/app/app/main.py",
      "name": "read_branch_settings",
      "line": 198
    },
    {
      "method": "GET",
      "path": "/api/v1/material-reservations",
      "file": "/app/app/materials.py",
      "name": "list_reservations",
      "line": 161
    },
    {
      "method": "GET",
      "path": "/api/v1/jobs/{job_id}/material-reservations",
      "file": "/app/app/materials.py",
      "name": "list_job_reservations",
      "line": 177
    },
    {
      "method": "GET",
      "path": "/api/v1/material-ledger",
      "file": "/app/app/materials.py",
      "name": "list_material_ledger",
      "line": 182
    },
    {
      "method": "POST",
      "path": "/api/v1/material-reservations",
      "file": "/app/app/materials.py",
      "name": "create_reservation",
      "line": 197
    },
    {
      "method": "POST",
      "path": "/api/v1/material-shortages",
      "file": "/app/app/materials.py",
      "name": "create_material_shortage",
      "line": 226
    },
    {
      "method": "POST",
      "path": "/api/v1/material-reservations/{reservation_id}/commands/{command}",
      "file": "/app/app/materials.py",
      "name": "material_command",
      "line": 242
    },
    {
      "method": "GET",
      "path": "/api/v1/media",
      "file": "/app/app/media.py",
      "name": "list_media",
      "line": 64
    },
    {
      "method": "POST",
      "path": "/api/v1/media",
      "file": "/app/app/media.py",
      "name": "create_media",
      "line": 75
    },
    {
      "method": "PUT",
      "path": "/api/v1/media/{media_id}",
      "file": "/app/app/media.py",
      "name": "update_media",
      "line": 93
    },
    {
      "method": "POST",
      "path": "/api/v1/media/{media_id}/archive",
      "file": "/app/app/media.py",
      "name": "archive_media",
      "line": 105
    },
    {
      "method": "GET",
      "path": "/api/v1/purchase-requests",
      "file": "/app/app/procurement.py",
      "name": "list_requests",
      "line": 78
    },
    {
      "method": "GET",
      "path": "/api/v1/purchase-requests/{request_id}",
      "file": "/app/app/procurement.py",
      "name": "get_request",
      "line": 84
    },
    {
      "method": "POST",
      "path": "/api/v1/purchase-requests",
      "file": "/app/app/procurement.py",
      "name": "create_request",
      "line": 87
    },
    {
      "method": "POST",
      "path": "/api/v1/purchase-requests/{request_id}/supplier-quotes",
      "file": "/app/app/procurement.py",
      "name": "add_quote",
      "line": 104
    },
    {
      "method": "GET",
      "path": "/api/v1/purchase-requests/{request_id}/supplier-comparison",
      "file": "/app/app/procurement.py",
      "name": "comparison",
      "line": 113
    },
    {
      "method": "POST",
      "path": "/api/v1/purchase-requests/{request_id}/approve",
      "file": "/app/app/procurement.py",
      "name": "approve",
      "line": 121
    },
    {
      "method": "POST",
      "path": "/api/v1/purchase-requests/{request_id}/commands/{command}",
      "file": "/app/app/procurement.py",
      "name": "command",
      "line": 148
    },
    {
      "method": "GET",
      "path": "/api/v1/sales/leads",
      "file": "/app/app/sales_crm.py",
      "name": "list_leads",
      "line": 93
    },
    {
      "method": "POST",
      "path": "/api/v1/sales/leads",
      "file": "/app/app/sales_crm.py",
      "name": "create_lead",
      "line": 98
    },
    {
      "method": "PUT",
      "path": "/api/v1/sales/leads/{lead_id}",
      "file": "/app/app/sales_crm.py",
      "name": "update_lead",
      "line": 103
    },
    {
      "method": "GET",
      "path": "/api/v1/sales/quotations",
      "file": "/app/app/sales_crm.py",
      "name": "list_quotations",
      "line": 109
    },
    {
      "method": "GET",
      "path": "/api/v1/sales/service-tasks",
      "file": "/app/app/sales_crm.py",
      "name": "list_service_tasks",
      "line": 114
    },
    {
      "method": "POST",
      "path": "/api/v1/sales/quotations",
      "file": "/app/app/sales_crm.py",
      "name": "create_quotation",
      "line": 126
    },
    {
      "method": "PUT",
      "path": "/api/v1/sales/quotations/{quotation_id}",
      "file": "/app/app/sales_crm.py",
      "name": "update_quotation",
      "line": 136
    },
    {
      "method": "POST",
      "path": "/api/v1/sales/quotations/{quotation_id}/status",
      "file": "/app/app/sales_crm.py",
      "name": "change_status",
      "line": 150
    },
    {
      "method": "GET",
      "path": "/api/v1/sales/quotations/{quotation_id}/document",
      "file": "/app/app/sales_crm.py",
      "name": "quotation_document",
      "line": 165
    },
    {
      "method": "GET",
      "path": "/api/v1/service-catalog",
      "file": "/app/app/service_catalog.py",
      "name": "list_catalogue",
      "line": 61
    },
    {
      "method": "POST",
      "path": "/api/v1/service-catalog",
      "file": "/app/app/service_catalog.py",
      "name": "create_catalogue",
      "line": 68
    },
    {
      "method": "PUT",
      "path": "/api/v1/service-catalog/{item_id}",
      "file": "/app/app/service_catalog.py",
      "name": "update_catalogue",
      "line": 90
    },
    {
      "method": "GET",
      "path": "/api/v1/service-catalog/job-tasks",
      "file": "/app/app/service_catalog.py",
      "name": "list_job_tasks",
      "line": 119
    },
    {
      "method": "POST",
      "path": "/api/v1/service-catalog/job-tasks",
      "file": "/app/app/service_catalog.py",
      "name": "create_job_task",
      "line": 127
    },
    {
      "method": "PUT",
      "path": "/api/v1/service-catalog/job-tasks/{task_id}/done",
      "file": "/app/app/service_catalog.py",
      "name": "set_job_task_done",
      "line": 149
    },
    {
      "method": "GET",
      "path": "/api/v1/superadmin/tenants",
      "file": "/app/app/superadmin.py",
      "name": "list_tenants",
      "line": 237
    },
    {
      "method": "POST",
      "path": "/api/v1/superadmin/tenants",
      "file": "/app/app/superadmin.py",
      "name": "provision_tenant",
      "line": 255
    },
    {
      "method": "GET",
      "path": "/api/v1/superadmin/tenants/{tenant_id}",
      "file": "/app/app/superadmin.py",
      "name": "get_tenant",
      "line": 285
    },
    {
      "method": "PUT",
      "path": "/api/v1/superadmin/tenants/{tenant_id}/billing",
      "file": "/app/app/superadmin.py",
      "name": "update_billing",
      "line": 291
    },
    {
      "method": "POST",
      "path": "/api/v1/superadmin/tenants/{tenant_id}/lifecycle",
      "file": "/app/app/superadmin.py",
      "name": "update_lifecycle",
      "line": 301
    },
    {
      "method": "POST",
      "path": "/api/v1/superadmin/tenants/{tenant_id}/emulations",
      "file": "/app/app/superadmin.py",
      "name": "start_emulation",
      "line": 314
    },
    {
      "method": "POST",
      "path": "/api/v1/superadmin/emulations/{emulation_id}/end",
      "file": "/app/app/superadmin.py",
      "name": "end_emulation",
      "line": 330
    },
    {
      "method": "GET",
      "path": "/api/v1/superadmin/tenants/{tenant_id}/audit-events",
      "file": "/app/app/superadmin.py",
      "name": "list_audit_events",
      "line": 343
    },
    {
      "method": "GET",
      "path": "/api/v1/admin/demo-import/rows",
      "file": "/app/app/tenant_admin.py",
      "name": "list_demo_import_rows",
      "line": 26
    },
    {
      "method": "GET",
      "path": "/api/v1/admin/users",
      "file": "/app/app/tenant_admin.py",
      "name": "list_users",
      "line": 378
    },
    {
      "method": "GET",
      "path": "/api/v1/admin/service-departments",
      "file": "/app/app/tenant_admin.py",
      "name": "list_service_departments",
      "line": 385
    },
    {
      "method": "POST",
      "path": "/api/v1/admin/service-departments",
      "file": "/app/app/tenant_admin.py",
      "name": "create_service_department",
      "line": 392
    },
    {
      "method": "PATCH",
      "path": "/api/v1/admin/service-departments/{department_id}",
      "file": "/app/app/tenant_admin.py",
      "name": "update_service_department",
      "line": 412
    },
    {
      "method": "PUT",
      "path": "/api/v1/admin/service-departments/{department_id}/managers/{membership_id}",
      "file": "/app/app/tenant_admin.py",
      "name": "appoint_service_department_manager",
      "line": 437
    },
    {
      "method": "DELETE",
      "path": "/api/v1/admin/service-departments/{department_id}/managers/{membership_id}",
      "file": "/app/app/tenant_admin.py",
      "name": "remove_service_department_manager",
      "line": 454
    },
    {
      "method": "PUT",
      "path": "/api/v1/admin/service-departments/{department_id}/managers/{manager_membership_id}/advisors/{advisor_membership_id}",
      "file": "/app/app/tenant_admin.py",
      "name": "assign_service_advisor_team",
      "line": 470
    },
    {
      "method": "DELETE",
      "path": "/api/v1/admin/service-departments/{department_id}/managers/{manager_membership_id}/advisors/{advisor_membership_id}",
      "file": "/app/app/tenant_admin.py",
      "name": "remove_service_advisor_team",
      "line": 494
    },
    {
      "method": "POST",
      "path": "/api/v1/admin/users",
      "file": "/app/app/tenant_admin.py",
      "name": "create_user",
      "line": 509
    },
    {
      "method": "PATCH",
      "path": "/api/v1/admin/users/{membership_id}",
      "file": "/app/app/tenant_admin.py",
      "name": "update_user",
      "line": 545
    },
    {
      "method": "POST",
      "path": "/api/v1/admin/users/{membership_id}/archive",
      "file": "/app/app/tenant_admin.py",
      "name": "archive_user",
      "line": 571
    },
    {
      "method": "POST",
      "path": "/api/v1/admin/users/{membership_id}/resend-invite",
      "file": "/app/app/tenant_admin.py",
      "name": "resend_invite",
      "line": 591
    },
    {
      "method": "GET",
      "path": "/api/v1/admin/roles",
      "file": "/app/app/tenant_admin.py",
      "name": "list_roles",
      "line": 607
    },
    {
      "method": "POST",
      "path": "/api/v1/admin/roles",
      "file": "/app/app/tenant_admin.py",
      "name": "create_role",
      "line": 614
    },
    {
      "method": "PATCH",
      "path": "/api/v1/admin/roles/{role_id}",
      "file": "/app/app/tenant_admin.py",
      "name": "update_role",
      "line": 633
    },
    {
      "method": "POST",
      "path": "/api/v1/admin/roles/{role_id}/archive",
      "file": "/app/app/tenant_admin.py",
      "name": "archive_role",
      "line": 669
    }
  ],
  "revisions": [
    {
      "file": "/app/alembic/versions/20260929_0001_foundation.py",
      "revision": "20260929_0001",
      "down_revision": null
    },
    {
      "file": "/app/alembic/versions/20260929_0002_tenant_session.py",
      "revision": "20260929_0002",
      "down_revision": "20260929_0001"
    },
    {
      "file": "/app/alembic/versions/20260929_0003_superadmin.py",
      "revision": "20260929_0003",
      "down_revision": "20260929_0002"
    },
    {
      "file": "/app/alembic/versions/20260929_0004_tenant_administration.py",
      "revision": "20260929_0004",
      "down_revision": "20260929_0003"
    },
    {
      "file": "/app/alembic/versions/20260929_0005_intake.py",
      "revision": "20260929_0005",
      "down_revision": "20260929_0004"
    },
    {
      "file": "/app/alembic/versions/20260929_0006_jobs_estimates.py",
      "revision": "20260929_0006",
      "down_revision": "20260929_0005"
    },
    {
      "file": "/app/alembic/versions/20260929_0007_catalogue_stock.py",
      "revision": "20260929_0007",
      "down_revision": "20260929_0006"
    },
    {
      "file": "/app/alembic/versions/20260929_0008_job_material_ledger.py",
      "revision": "20260929_0008",
      "down_revision": "20260929_0007"
    },
    {
      "file": "/app/alembic/versions/20260929_0009_purchase_order_line_delete.py",
      "revision": "20260929_0009",
      "down_revision": "20260929_0008"
    },
    {
      "file": "/app/alembic/versions/20261001_0002_execution_qc.py",
      "revision": "20261001_0002",
      "down_revision": "20260929_0008"
    },
    {
      "file": "/app/alembic/versions/20261001_0003_merge_purchase_order_execution_heads.py",
      "revision": "20261001_0003",
      "down_revision": [
        "20260929_0009",
        "20261001_0002"
      ]
    },
    {
      "file": "/app/alembic/versions/20261001_0004_finance_delivery.py",
      "revision": "20261001_0004",
      "down_revision": "20261001_0003"
    },
    {
      "file": "/app/alembic/versions/20261001_0005_followups_search.py",
      "revision": "20261001_0005",
      "down_revision": "20261001_0004"
    },
    {
      "file": "/app/alembic/versions/20261001_0006_finance_corrections_and_invoice_claims.py",
      "revision": "20261001_0006",
      "down_revision": "20261001_0005"
    },
    {
      "file": "/app/alembic/versions/20261002_0014_service_department_routing.py",
      "revision": "20261002_0014",
      "down_revision": "20261001_0006"
    },
    {
      "file": "/app/alembic/versions/20261002_0015_sales_crm.py",
      "revision": "20261002_0015",
      "down_revision": "20261002_0014"
    },
    {
      "file": "/app/alembic/versions/20261002_0016_service_task_catalog.py",
      "revision": "20261002_0016",
      "down_revision": "20261002_0015"
    },
    {
      "file": "/app/alembic/versions/20261006_0017_lead_not_entered_flags.py",
      "revision": "20261006_0017",
      "down_revision": "20261002_0016"
    },
    {
      "file": "/app/alembic/versions/20261006_0018_booking_checkin.py",
      "revision": "20261006_0018",
      "down_revision": "20261006_0017"
    },
    {
      "file": "/app/alembic/versions/20261006_0019_execution_api_contract.py",
      "revision": "20261006_0019",
      "down_revision": "20261006_0018"
    },
    {
      "file": "/app/alembic/versions/20261006_0020_material_reservation_idempotency.py",
      "revision": "20261006_0020",
      "down_revision": "20261006_0019"
    },
    {
      "file": "/app/alembic/versions/20261006_0021_finance_claim_lock_grant.py",
      "revision": "20261006_0021",
      "down_revision": "20261006_0020"
    },
    {
      "file": "/app/alembic/versions/20261006_0022_purchase_requests.py",
      "revision": "20261006_0022",
      "down_revision": "20261006_0021"
    },
    {
      "file": "/app/alembic/versions/20261006_0023_material_shortages.py",
      "revision": "20261006_0023",
      "down_revision": "20261006_0022"
    },
    {
      "file": "/app/alembic/versions/20261008_0024_purchase_delivery_confirmation.py",
      "revision": "20261008_0024",
      "down_revision": "20261006_0023"
    },
    {
      "file": "/app/alembic/versions/20261008_0025_delivery_confirmation_inward_idempotency.py",
      "revision": "20261008_0025",
      "down_revision": "20261008_0024"
    },
    {
      "file": "/app/alembic/versions/20261011_0026_job_estimated_delivery.py",
      "revision": "20261011_0026",
      "down_revision": "20261008_0025"
    },
    {
      "file": "/app/alembic/versions/20261017_0027_database_auth.py",
      "revision": "20261017_0027",
      "down_revision": "20261011_0026"
    },
    {
      "file": "/app/alembic/versions/20261017_0028_demo_import.py",
      "revision": "20261017_0028",
      "down_revision": "20261017_0027"
    },
    {
      "file": "/app/alembic/versions/20261017_0029_tenant_invitation_runtime_grant.py",
      "revision": "20261017_0029",
      "down_revision": "20261017_0028"
    },
    {
      "file": "/app/alembic/versions/20261018_0030_job_media.py",
      "revision": "20261018_0030",
      "down_revision": "20261017_0029"
    },
    {
      "file": "/app/alembic/versions/20261018_0031_job_checklists.py",
      "revision": "20261018_0031",
      "down_revision": "20261018_0030"
    },
    {
      "file": "/app/alembic/versions/20261018_0032_service_catalog.py",
      "revision": "20261018_0032",
      "down_revision": "20261018_0031"
    },
    {
      "file": "/app/alembic/versions/20261018_0033_import_archive_scope.py",
      "revision": "20261018_0033",
      "down_revision": "20261018_0032"
    }
  ]
}