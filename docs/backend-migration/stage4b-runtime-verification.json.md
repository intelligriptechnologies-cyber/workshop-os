{
  "dev_test_schema_equal": true,
  "tables": 106,
  "columns": 1259,
  "constraints": {
    "f": 460,
    "u": 110,
    "p": 106,
    "c": 227
  },
  "indexes": 443,
  "containers": [
    {
      "name": "/workshopos-stage4b-schema-dev-1",
      "health": "healthy",
      "ports": {
        "5432/tcp": null
      },
      "networks": [
        "workshopos-stage4b_dev"
      ],
      "volumes": [
        "workshopos-stage4b_dev-data"
      ]
    },
    {
      "name": "/workshopos-stage4b-schema-test-1",
      "health": "healthy",
      "ports": {
        "5432/tcp": null
      },
      "networks": [
        "workshopos-stage4b_test"
      ],
      "volumes": [
        "workshopos-stage4b_test-data"
      ]
    }
  ],
  "networks": [
    {
      "name": "workshopos-stage4b_dev",
      "internal": true
    },
    {
      "name": "workshopos-stage4b_test",
      "internal": true
    }
  ],
  "distinct_credentials": true,
  "head": "20261021_0035",
  "revisions": 36
}