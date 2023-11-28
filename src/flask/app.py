from flask import Flask, render_template, request, jsonify, Response
import requests
import json
from helpers.processing import get_data
from flask_cors import CORS

from helpers.backend_simulator import get_groups
from helpers.backend_simulator import get_microservice_stats
from helpers.comm_times import *

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
data = None

@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        res = Response()
        res.headers["X-Content-Type-Options"] = "*"
        return res


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/visualize", methods=["POST"])
def visualize():
    # Get the data from the POST request
    jaeger_endpoint = request.form["jaeger_endpoint"].strip("/")
    # start_date = request.form['start_date']
    # end_date = request.form['end_date']
    trace_id = request.form["trace_id"]

    # data = get_data(jaeger_endpoint, trace_id)

    # data = {
    #     'jaeger_endpoint': jaeger_endpoint,
    #     'start_date': start_date,
    #     'end_date': end_date,
    #     'trace_id': trace_id,
    # }
    data = {}
    with open("example.json") as json_file:
        data = json.load(json_file)

    return jsonify(data)


@app.route("/upload", methods=["POST"])
def upload_file():
    try:
        global data
        data = request.get_json()

        microservice_stats = get_microservice_stats(data)
        groups = get_groups(data)

        return jsonify({"microservice_stats": microservice_stats, "groups": groups})

    except Exception as e:
        print("TO na backendzie error")
        return jsonify({"Error": "File processing error: " + str(e)}), 500


@app.route("/data")
def send_data():
    global data
    traces =  data.copy()

    non_child = find_non_child(traces)
    traces_reformatted = reformat_dict(traces)
    communication_times = calculate_comm_times(traces_reformatted, False)

    graph = get_statistic_of_traces(communication_times)
    graph_list = [(str(pair), stats) for pair, stats in graph.items()]
    
    nodes = set()
    links = []

    for item in graph_list:
       
        source, target = item[0][1:-1].replace("'", "").split(',')
        target=target[1:]
        nodes.add(source)
        nodes.add(target)
        links.append({"source": source, "target": target, "Statistic": item[1]})
        
    nodes = list(nodes)

    # Transform nodes to node objects
    nodes = [{"id": node} for node in nodes]

    # Return a JSON response
    return jsonify({"nodes": nodes, "links": links,})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)