{
  "containers": [
    {
      "name": "/workshopos-api-1",
      "image": "workshopos-api",
      "imageId": "sha256:7ade676243e2681bbb1ba53f463362520f20d0bc6e0e54a4d877031c79ca4cca",
      "status": "running",
      "health": "healthy",
      "ports": {
        "8000/tcp": [
          {
            "HostIp": "127.0.0.1",
            "HostPort": "8000"
          }
        ]
      },
      "mounts": [],
      "database": {
        "scheme": "postgresql+psycopg",
        "host": "db",
        "port": 5432,
        "database": "workshopos",
        "username": "workshopos_admin",
        "password": "REDACTED"
      },
      "mode": {
        "WORKSHOPOS_ENVIRONMENT": "local",
        "WORKSHOPOS_AUTH_MODE": "database"
      }
    },
    {
      "name": "/workshopos-db-1",
      "image": "postgres:17-alpine",
      "imageId": "sha256:6f30057d31f5861b66f3545d4821f987aacf1dd920765f0acadea0c58ff975b1",
      "status": "running",
      "health": "healthy",
      "ports": {
        "5432/tcp": [
          {
            "HostIp": "127.0.0.1",
            "HostPort": "5432"
          }
        ]
      },
      "mounts": [
        {
          "type": "volume",
          "destination": "/var/lib/postgresql/data",
          "rw": true
        }
      ],
      "mode": {}
    }
  ],
  "runtime_code_comparison": [
    {
      "file": "/app/app/service_catalog.py",
      "container_sha256": "7dee3ad843389c43ed12cb850d702e49e7f66b4c991c0fe4ddf6a9559d431712",
      "workspace_sha256": null,
      "equal": false
    },
    {
      "file": "/app/app/config.py",
      "container_sha256": "524c12762879ce19628bc346800f80268d4a8682460898aba7f3c46d099e252d",
      "workspace_sha256": "2e61729e8bb86162b255c1a2e613d6123ee442095e515f117db0d0cf12dfb8ea",
      "equal": false
    },
    {
      "file": "/app/app/superadmin.py",
      "container_sha256": "d4a5dedc5087d476c2d7ce411cb796e3f28084fefa679c319737339cc57b3596",
      "workspace_sha256": "d4a5dedc5087d476c2d7ce411cb796e3f28084fefa679c319737339cc57b3596",
      "equal": true
    },
    {
      "file": "/app/app/materials.py",
      "container_sha256": "cc8e65b6598a50f25f144a9e79a78217c40f8518fbfafde2c27a29fb92feb3cd",
      "workspace_sha256": "fdfd4303ee0ad206845b804e3a65e5dc58fb7cbd354a06e31d4287e6a9d4f8d0",
      "equal": false
    },
    {
      "file": "/app/app/inventory.py",
      "container_sha256": "37b93269d8bd42ef55e2ed9a08627b95c5ed6103ed7ee0ca1a0554b1be050411",
      "workspace_sha256": "d6e3644f9499b141da9c342f2a632a347349021888b8059280a7a508fb099583",
      "equal": false
    },
    {
      "file": "/app/app/procurement.py",
      "container_sha256": "ec6841745c2c1c0f5f143372f774b644558c6545f51d726933b7659b9f76f078",
      "workspace_sha256": null,
      "equal": false
    },
    {
      "file": "/app/app/auth.py",
      "container_sha256": "84178336a04ade37eaa9a37b3f4db9c116d6be9ae6a9914e82e7f90b32c8171d",
      "workspace_sha256": "b9f7f3e3cd07110589b40e18afdab98ea5da45d7bdbbdc3303d2aa63f12fe301",
      "equal": false
    },
    {
      "file": "/app/app/database.py",
      "container_sha256": "8168c0c3cc50119e8c58d46f2cd7ff9273bf45a283e1a2e47be44f623c92e1ee",
      "workspace_sha256": "8168c0c3cc50119e8c58d46f2cd7ff9273bf45a283e1a2e47be44f623c92e1ee",
      "equal": true
    },
    {
      "file": "/app/app/followups.py",
      "container_sha256": "0894522c7b95bca88ee76b2149136a048f5f07ff9fcb76ce7de88df0478c873e",
      "workspace_sha256": "f7c851db847a351ebfe1724938a44d834c2bef2e98654b0e3aec1d8e8f6542cc",
      "equal": false
    },
    {
      "file": "/app/app/checklists.py",
      "container_sha256": "d23cb3ec9acaa611b05de644225834d0e45d670e9ea425821a014e2718b93ec6",
      "workspace_sha256": null,
      "equal": false
    },
    {
      "file": "/app/app/tenant_admin.py",
      "container_sha256": "f59f10343315291138f7ec9774441dae6cd4ae878cf2c3fc359a06b284fe82f8",
      "workspace_sha256": "d6a36b0d707c40439620d31808af886421ab98b936c627f196df579c6b9af314",
      "equal": false
    },
    {
      "file": "/app/app/sales_crm.py",
      "container_sha256": "bc5aa81383a5c5b592f26fef4f7fcc8f81119bd4a0885068f95f998fc169e9e5",
      "workspace_sha256": "6ce0cae59656098f79ad3935ef3d1c4f1bb7af267362bb3a18564aeebd7c0614",
      "equal": false
    },
    {
      "file": "/app/app/finance.py",
      "container_sha256": "7141bd92e75027fd7a20edc7b5983ec70ba04702e4ec106b3eaa8981bcb828ad",
      "workspace_sha256": "7141bd92e75027fd7a20edc7b5983ec70ba04702e4ec106b3eaa8981bcb828ad",
      "equal": true
    },
    {
      "file": "/app/app/tenancy.py",
      "container_sha256": "0a45f7343712a9c9d93adf54c5f8f76b1ef9310784ab760b29bcb11ef52d084f",
      "workspace_sha256": "0a45f7343712a9c9d93adf54c5f8f76b1ef9310784ab760b29bcb11ef52d084f",
      "equal": true
    },
    {
      "file": "/app/app/__init__.py",
      "container_sha256": "8a2601bbafbb06f55d7bd86dd47d10862a8acff611639101776a7db0f760275a",
      "workspace_sha256": "8a2601bbafbb06f55d7bd86dd47d10862a8acff611639101776a7db0f760275a",
      "equal": true
    },
    {
      "file": "/app/app/jobs.py",
      "container_sha256": "8fd102a43c89c5c70c3127d9b0d80939da7c6b7088896e9d6d8fbf60315eaacf",
      "workspace_sha256": "d0cd54c07f182ee994f7a275ea1cd9265c1634d4e57650fc38b49e9b93ce1a36",
      "equal": false
    },
    {
      "file": "/app/app/media.py",
      "container_sha256": "a2cf2c3490731d3bce25ab2c6f16afab0d2bfd3a56aed0be733929c68aa30361",
      "workspace_sha256": null,
      "equal": false
    },
    {
      "file": "/app/app/database_auth.py",
      "container_sha256": "ae17290e61420f738e3a4aaea73b57b9bb0d227cd6ec66486d0901a09d598354",
      "workspace_sha256": null,
      "equal": false
    },
    {
      "file": "/app/app/main.py",
      "container_sha256": "243d014bf9901ebc943cdfa2b37ceb365d2a0c51f26159fd1cd2d3c261963199",
      "workspace_sha256": "ab8978cf055d522904ee7d06209db57d2381bb306823fb373b605e9b91f642fe",
      "equal": false
    },
    {
      "file": "/app/app/execution.py",
      "container_sha256": "1eeb30cf35ec3d0bfedd66e39be0a4e5008345860a3fc0adb6f357be93d0123c",
      "workspace_sha256": "3d7eb8add6998fb890d40c97c1aa11ae564dd8783ae02f2a302e7eaa54de6827",
      "equal": false
    },
    {
      "file": "/app/app/intake.py",
      "container_sha256": "c7aa394d6c7411a277bf5db6a54b728328e24542d77493118baf7002628aeaa2",
      "workspace_sha256": "1e85c3d10976a3d1d19a7007a9253f25e9e684ddee79f9611221bfb6e9bfc412",
      "equal": false
    }
  ],
  "read_only_metadata": {
    "sql": "BEGIN READ ONLY; SELECT current_database(),current_user,current_setting('server_version'); SELECT version_num FROM alembic_version ORDER BY version_num; SELECT count(*) FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE'; SELECT rolname,rolsuper,rolbypassrls FROM pg_roles WHERE rolname IN ('workshopos_runtime','workshopos_admin'); ROLLBACK;",
    "exit": 0,
    "stdout": "BEGIN\nworkshopos|workshopos_admin|17.9\n20261018_0033\n74\nworkshopos_admin|t|t\nworkshopos_runtime|f|f\nROLLBACK\n",
    "stderr": ""
  }
}