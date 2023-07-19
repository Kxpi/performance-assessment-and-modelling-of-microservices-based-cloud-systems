import json
import os

print(os.getcwd())
filename = "./performance-assessment-and-modelling-of-microservices-based-cloud-systems/jaegerTraces.json"

with open(filename) as json_file:
    log = json.load(json_file)

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