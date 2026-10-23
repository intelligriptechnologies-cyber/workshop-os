import json
from pathlib import Path
from financial_test_support import new_job,get
j=new_job()
Path('/slice/artifacts/retirement-execution-fixture.json').write_text(json.dumps(get('job_cards',j)))
print('Fresh PostgreSQL execution fixture created through API')
