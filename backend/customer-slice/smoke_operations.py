from test_api import login,write
from uuid import uuid4
c=login('reception');r=c.get('/api/v1/operations/projection');print('projection',r.status_code,{k:len(v) for k,v in r.json().items()} if r.status_code==200 else r.text)
r=write(c,'/reception/intake',{'customerId':1,'vehicleId':1,'customerName':'Demo Customer 001','mobile':'8100000001','vehicleNo':'OD02DM1001','make':'Hyundai','model':'Creta','color':'White','km':12345,'fuel':'4 bars','fuelLevelValue':'4','fuelLevelUnit':'bars','requestedWork':'Isolated intake '+uuid4().hex[:8],'advisorId':7});print('intake',r.status_code,r.text)
