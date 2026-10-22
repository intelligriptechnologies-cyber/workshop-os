# Stage 4A foundation execution

Post-restart verification; isolated test database only.

Command: `docker compose --env-file backend/foundation/.local.env -f backend/foundation/compose.yaml --profile test run --rm tests`

Exit: 0

```text
..........................                                               [100%]
=============================== warnings summary ===============================
../usr/local/lib/python3.13/site-packages/starlette/testclient.py:37
  /usr/local/lib/python3.13/site-packages/starlette/testclient.py:37: DeprecationWarning: The anyio.abc.BlockingPortal alias is deprecated, use anyio.from_thread.BlockingPortal instead.
    _PortalFactoryType = typing.Callable[[], typing.ContextManager[anyio.abc.BlockingPortal]]

foundation_tests/test_foundation.py::test_login_validation_does_not_echo_credentials
  /usr/local/lib/python3.13/site-packages/pydantic/_internal/_generate_schema.py:2346: UnsupportedFieldAttributeWarning: The 'alias' attribute with value 'tenantCode' was provided to the `Field()` function, which has no effect in the context it was used. 'alias' is field-specific metadata, and can only be attached to a model field using `Annotated` metadata or by assignment. This may have happened because an `Annotated` type alias using the `type` statement was used, or if the `Field()` function was attached to a single member of a union type.
    warnings.warn(

foundation_tests/test_foundation.py::test_login_validation_does_not_echo_credentials
  /usr/local/lib/python3.13/site-packages/pydantic/_internal/_generate_schema.py:2346: UnsupportedFieldAttributeWarning: The 'alias' attribute with value 'userId' was provided to the `Field()` function, which has no effect in the context it was used. 'alias' is field-specific metadata, and can only be attached to a model field using `Annotated` metadata or by assignment. This may have happened because an `Annotated` type alias using the `type` statement was used, or if the `Field()` function was attached to a single member of a union type.
    warnings.warn(

-- Docs: https://docs.pytest.org/en/stable/how-to/capture-warnings.html
26 passed, 3 warnings in 5.54s
 Container workshopos-stage4a-db-test-1 Running 
 Container workshopos-stage4a-db-test-1 Waiting 
 Container workshopos-stage4a-db-test-1 Healthy 
 Container workshopos-stage4a-tests-run-eaffb1d4319a Creating 
 Container workshopos-stage4a-tests-run-eaffb1d4319a Created 

```

Initial attempt: test collection failed because the pytest executable did not place /workspace on sys.path. Corrected only the new Compose test command to python -m pytest. First corrected run: 26 passed, 3 warnings.
