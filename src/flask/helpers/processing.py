import requests
import json

def get_data(jaeger_endpoint, trace_id):
    response = requests.get(f'{jaeger_endpoint}/api/traces/{trace_id}')

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

    return log_tmp