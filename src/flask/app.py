from flask import Flask, render_template, request, jsonify, Response
import requests
import json
from helpers.processing import get_data
from flask_cors import CORS

from helpers.backend_simulator import  get_groups

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        res = Response()
        res.headers['X-Content-Type-Options'] = '*'
        return res

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/visualize', methods=['POST'])
def visualize():
    # Get the data from the POST request
    jaeger_endpoint = request.form['jaeger_endpoint'].strip('/')
    # start_date = request.form['start_date']
    # end_date = request.form['end_date']
    trace_id = request.form['trace_id'] 

    # data = get_data(jaeger_endpoint, trace_id)

    # data = {
    #     'jaeger_endpoint': jaeger_endpoint,
    #     'start_date': start_date,
    #     'end_date': end_date,
    #     'trace_id': trace_id,
    # }
    data = {}
    with open('example.json') as json_file:
        data = json.load(json_file)

    return jsonify(data)

@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        data = request.get_json()

        groups=get_groups(data)
        
        return jsonify({"groups": groups})


    except Exception as e:
        print("TO na backendzie error")
        return jsonify({"Error": "File processing error: " + str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
