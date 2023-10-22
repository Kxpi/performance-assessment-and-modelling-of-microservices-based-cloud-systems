from flask import Flask, render_template, jsonify
import json
from collections import defaultdict
from itertools import permutations

app = Flask(__name__)

# Load Jaeger JSON data
with open('example.json', 'r') as file:
    data = json.load(file)

# Extract spans from the traces
traces = data['data']
#spans_data = [trace['spans'] for trace in traces]

def take_right_trace(traceID):
    for i in traces:
        if i["traceID"]==traceID:
            return i

spans_data=[take_right_trace("2fade568645f89b0")["spans"]]

#print(spans_data)

# Initialize a defaultdict to store precedence counts
precedence_counts = defaultdict(int)

# Iterate through spans data and count precedences between spans
for spans in spans_data:
    for i, j in permutations(range(len(spans)), 2):
        # Check if span i precedes span j in this trace
        if spans[i]['startTime']+spans[i]['duration'] < spans[j]['startTime']:
            precedence_counts[(i, j)] += 1

# Create a directed graph based on precedence counts
precedence_graph = defaultdict(list)
for (i, j), count in precedence_counts.items():
    # Add directed edge from span i to span j with the count as weight
    precedence_graph[i].append((j))

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/graph_data')
def graph_data():
    return jsonify(precedence_graph)

if __name__ == '__main__':
    app.run(debug=True)