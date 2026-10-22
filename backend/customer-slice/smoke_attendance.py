from test_api import login,write
c=login('reception');r=write(c,'/reception/attendance',{'user_id':2,'date':'2099-01-01','present':False});print('attendance',r.status_code,r.text)
