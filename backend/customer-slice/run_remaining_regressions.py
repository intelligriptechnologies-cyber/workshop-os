import subprocess,json
from pathlib import Path
base=['docker','compose','--env-file','backend/customer-slice/.local.env','-f','backend/customer-slice/compose.yaml','exec','-T','api-test','python']
suites=['test_vehicles.py','test_operations.py','test_estimate_documents.py','financial_test_support.py','test_material_approvals.py','test_purchase_stock.py','test_purchase_stock_edges.py','test_financial_workflows.py','test_financial_materials.py','test_financial_database.py','test_bookings.py','test_execution_workflows.py','test_administration.py','test_configuration.py','test_catalog_workflows.py','test_sales_workflows.py']
results=[]
for name in suites:
 p=subprocess.run(base+['/slice/'+name],capture_output=True,text=True)
 Path('backend/customer-slice/artifacts/regression-'+name+'.txt').write_text(p.stdout+p.stderr,encoding='utf8')
 results.append(dict(suite=name,exit=p.returncode));print(name,p.returncode,flush=True)
 Path('backend/customer-slice/artifacts/remaining-api-regressions.json').write_text(json.dumps(results,indent=2))
