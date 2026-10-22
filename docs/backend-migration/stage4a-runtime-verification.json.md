{
  "containers": [
    {
      "name": "/workshopos-stage4a-api-1",
      "state": "running",
      "health": "healthy",
      "ports": {
        "8000/tcp": [
          {
            "HostIp": "127.0.0.1",
            "HostPort": "18184"
          }
        ]
      },
      "networks": [
        "workshopos-stage4a_api-host",
        "workshopos-stage4a_dev"
      ],
      "volumes": []
    },
    {
      "name": "/workshopos-stage4a-db-dev-1",
      "state": "running",
      "health": "healthy",
      "ports": {
        "5432/tcp": null
      },
      "networks": [
        "workshopos-stage4a_dev"
      ],
      "volumes": [
        "workshopos-stage4a_dev-data"
      ]
    },
    {
      "name": "/workshopos-stage4a-db-test-1",
      "state": "running",
      "health": "healthy",
      "ports": {
        "5432/tcp": null
      },
      "networks": [
        "workshopos-stage4a_test"
      ],
      "volumes": [
        "workshopos-stage4a_test-data"
      ]
    },
    {
      "name": "/workshopos-api-1",
      "state": "running",
      "health": "healthy",
      "ports": {
        "8000/tcp": [
          {
            "HostIp": "127.0.0.1",
            "HostPort": "8000"
          }
        ]
      },
      "networks": [
        "workshopos_default"
      ],
      "volumes": []
    },
    {
      "name": "/workshopos-db-1",
      "state": "running",
      "health": "healthy",
      "ports": {
        "5432/tcp": [
          {
            "HostIp": "127.0.0.1",
            "HostPort": "5432"
          }
        ]
      },
      "networks": [
        "workshopos_default"
      ],
      "volumes": [
        "workshopos_workshopos_postgres"
      ]
    }
  ],
  "networks": [
    {
      "name": "workshopos-stage4a_dev",
      "internal": true
    },
    {
      "name": "workshopos-stage4a_test",
      "internal": true
    },
    {
      "name": "workshopos-stage4a_api-host",
      "internal": false
    }
  ],
  "four_distinct_credentials": true,
  "health": {
    "/health": {
      "status": "ok",
      "database": "postgresql",
      "environment": "stage4a"
    },
    "/api/v1/health": {
      "status": "ok",
      "database": "postgresql",
      "environment": "stage4a"
    },
    "/livez": {
      "status": "ok",
      "scope": "dev"
    },
    "/readyz": {
      "status": "ready",
      "database": "postgresql",
      "scope": "dev",
      "schema": "not_applied"
    }
  },
  "stop_restart": "PASS: compose stop, then up -d --wait api db-test; no volumes deleted",
  "host_binding_correction": "Internal-only API network did not expose host port on Docker Desktop. Added api-host network for API only; subsequent host HTTP probes pass."
}