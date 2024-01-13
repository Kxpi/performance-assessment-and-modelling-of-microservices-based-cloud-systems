from flask import Flask, render_template, request, jsonify, Response
import requests
import json
from helpers.processing import get_data
from flask_cors import CORS

from helpers.backend_simulator import get_groups, get_callGraphRep, findRoot
from helpers.comm_times import *
import sys
from urllib.parse import unquote

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
data = None
groups = None
edges = {}

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
        global groups
        microservice_stats, groups = get_groups(data)
        global edges 
        edges = {}
        
        return jsonify({"microservice_stats": microservice_stats, "groups": groups})

    except Exception as e:
        print("TO na backendzie error")
        return jsonify({"Error": "File processing error: " + str(e)}), 500


@app.route("/data/<groupID>")
def send_data(groupID):
    global data
    global groups
    global edges
    
    if unquote(groupID) == "Negative start times":
        return jsonify("no data")
    
    if groupID not in edges: 
        groups_traces = find_traces(groups,groupID)
        for i in data["data"]:
            if i["traceID"] in groups_traces:
                ancestors, _ = get_callGraphRep(i["spans"], findRoot(i["spans"]))
                break

        
        traces_reformatted = reformat_dict(data, groups_traces)

        communication_times = calculate_comm_times(traces_reformatted, False)
        graph = get_statistic_of_traces(communication_times, ancestors)
        graph_list = [(str(pair), stats) for pair, stats in graph.items()]

        nodes = set()
        links = []
        edge = []
        edge_to_send = {}
        for item in graph_list:
            source, target = item[0][1:-1].replace("'", "").split(",")
            target = target[1:]
            nodes.add(source)
            nodes.add(target)
            links.append({"source": source, "target": target, "Statistic": item[1]})
            edge.append([source, target, item[1][-1]])
        edge_to_send[groupID] = edge
        nodes = list(nodes)

        nodes = [{"id": node} for node in nodes]
        edges[groupID] = [nodes, links , edge_to_send]
    
    if edges[groupID] == []:
        return jsonify("no data")
    else:
        return jsonify(
            {
            "graph":{
                "nodes": edges[groupID][0],
                "links": edges[groupID][1],
            },
            "edge": {
                "edges": edges[groupID][2]
            }
        })

# @app.route("/edges/<groupID>")
# def send_edges(groupID):
#     global data
#     global groups
#     global edges
#     if groupID in edges: 
#         print(edges)
#         return jsonify({"edges": edges[groupID]})
#     else:
#         edges[groupID] = get_edges(data, groups, groupID)
#         print(edges[groupID])
#         return jsonify({"edges": edges[groupID]})
    

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
