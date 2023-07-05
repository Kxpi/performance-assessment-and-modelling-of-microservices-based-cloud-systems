import requests
import json

traceID = '0bfbdf94ab024bc6'

response = requests.get('http://localhost:16686/api/traces/' + traceID)

jaegerJson = json.loads(response.content)
print(json.dumps(jaegerJson, indent=4))