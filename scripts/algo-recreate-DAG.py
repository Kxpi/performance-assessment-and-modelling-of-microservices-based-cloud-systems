import json
from collections import defaultdict
from itertools import permutations

# Load Jaeger JSON data
with open('example.json', 'r') as file:
    data = json.load(file)

traces=data['data']
# Initialize a defaultdict to store precedence counts
precedence_counts = defaultdict(int)

# Iterate through traces and count precedences between spans
for trace in traces:
    spans = trace['spans']
    for i, j in permutations(range(len(spans)), 2):
        # Check if span i precedes span j in this trace
        if spans[i]['startTime']+spans[i]['duration'] < spans[j]['startTime']:
            precedence_counts[(i, j)] += 1

# Create a directed graph based on precedence counts
#print(precedence_counts)
precedence_graph = defaultdict(list)
for (i, j), count in precedence_counts.items():
    # Add directed edge from span i to span j with the count as weight
    precedence_graph[spans[i]['spanID']].append((spans[j]['spanID'], count))

#Print the precedence graph (optional)
for span, edges in precedence_graph.items():
    print(f"Span {span} precedes:")
    for target, weight in edges:
        print(f"  Span {target} - Count: {weight}")