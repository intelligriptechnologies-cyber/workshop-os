import json
from pathlib import Path
from api import app
from estimate_documents import totals
cases=json.loads(Path('/slice/artifacts/calculation-reference.json').read_text())
for index,case in enumerate(cases):
    actual=totals(case['lines'],case['discount'])
    assert actual==case['expected'],(index,actual,case['expected'])
Path('/slice/artifacts/calculation-parity.json').write_text(json.dumps({'passed':len(cases),'failed':0,'reference':'src/invoice-math.ts invoiceTotals, unchanged from a315448'}))
print(len(cases),'exact TypeScript/Python calculation parity cases passed')
