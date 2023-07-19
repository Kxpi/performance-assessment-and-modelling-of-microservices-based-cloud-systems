import requests
import json

traceID = '4ea225cec7ba4c14'

response = requests.get('http://localhost:16686/api/traces/' + traceID)

log = json.loads(response.content)

log_tmp=log.copy()

tmp={}

for data in log_tmp['data']:
    for span in data['spans']:
        del span['warnings']
        del span['logs']
        del span['processID']
        del span['tags']
    del data['processes']


log2 = json.dumps(log_tmp, indent=4)

with open("traces2.json", "w") as json2:
    json2.write(log2)