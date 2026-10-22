import subprocess,json
from pathlib import Path
results=[]
for script in ['test_sales_browser.mjs','test_tasklist_browser.mjs','test_booking_browser.mjs','test_administration_browser.mjs','test_configuration_browser.mjs','test_catalog_browser.mjs','test_customer_regression.mjs','test_vehicle_browser.mjs','test_financial_browser.mjs','test_financial_edges_browser.mjs','test_stock_storage.mjs','test_financial_storage.mjs','test_roles.mjs']:
 p=subprocess.run(['node','backend/customer-slice/'+script],capture_output=True,text=True);results.append(dict(suite=script,exit=p.returncode));Path('backend/customer-slice/artifacts/browser-'+script+'.txt').write_text(p.stdout+p.stderr,encoding='utf8');print(script,p.returncode,flush=True);Path('backend/customer-slice/artifacts/remaining-browser-regressions.json').write_text(json.dumps(results,indent=2))
