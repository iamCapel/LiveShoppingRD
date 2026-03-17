import json
from urllib.request import Request, urlopen

url = 'http://localhost:8000/api/login'
data = json.dumps({'email':'test@local.com','password':'123456'}).encode('utf-8')
req = Request(url, data=data, headers={'Content-Type': 'application/json'})
resp = urlopen(req)
print(resp.status)
print(resp.read().decode())
