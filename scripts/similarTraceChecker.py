import json
from collections import defaultdict

file_path = 'visualization\public\jaeger-traces.json'

def get_trace_representation(trace):
    # Create a list of operation names, sorted to consider permutations as similar
    operation_names = sorted([span['operationName'] for span in trace['spans']])

    # Get the processes section, sorted by keys and converted to JSON for string comparison
    processes = json.dumps(trace['processes'], sort_keys=True)

    # Return a tuple that represents this trace
    return (tuple(operation_names), processes)


def group_similar_traces(file_path):
    with open(file_path, 'r') as f:
        data = json.load(f)

    # A dictionary that defaults to a list helps in creating groups
    groups = defaultdict(list)

    for trace in data['data']:  # Changed from 'traces' to 'data'
        # Group traces by their representations
        groups[get_trace_representation(trace)].append(trace['traceID'])  # Changed to append only traceID

    # Convert grouped traces back to JSON format
    grouped_data = {'groups': [group for group in groups.values()]}

    # Save grouped traces to a new file
    with open('grouped_traces.json', 'w') as f:
        json.dump(grouped_data, f)


# Run the function on your example file
group_similar_traces(file_path)