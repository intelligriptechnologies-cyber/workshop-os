# Stage 4B test execution

Command: `docker compose --env-file backend/schema-validation/.local.env -f backend/schema-validation/compose.yaml run --rm migrate-test`

Exit code: 0

```text
...........................                                              [100%]
------------------- generated xml file: /artifacts/junit.xml -------------------
27 passed in 24.89s
 Container workshopos-stage4b-schema-test-1 Running 
 Container workshopos-stage4b-schema-test-1 Waiting 
 Container workshopos-stage4b-schema-test-1 Healthy 
 Container workshopos-stage4b-migrate-test-run-5b053d6d887d Creating 
 Container workshopos-stage4b-migrate-test-run-5b053d6d887d Created 

```
