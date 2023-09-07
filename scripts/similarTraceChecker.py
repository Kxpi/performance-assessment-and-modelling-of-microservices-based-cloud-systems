import json
from collections import defaultdict

file_path = 'jaeger-examples\example.json'


def get_trace_representation(trace):
    # Extract service names from processes
    service_names = sorted(
        list(set([process['serviceName'] for process in trace['processes'].values()])))

    # Create a list of operation names, sorted to consider permutations as similar
    operation_names = sorted([span['operationName'] for span in trace['spans']])

    # Return a tuple that represents this trace
    # Convert service_names to tuple
    return (tuple(service_names), tuple(operation_names))


def group_similar_traces(file_path):
    with open(file_path, 'r') as f:
        data = json.load(f)

    # A dictionary that defaults to a list helps in creating groups
    groups = defaultdict(list)

    for trace in data['data']:  # Changed from 'traces' to 'data'
        # Group traces by their representations
        representation = get_trace_representation(trace)
        groups[representation].append(trace['traceID'])

    # Convert groups to list for JSON serialization
    groups = {str(key): value for key, value in groups.items()}

    # Save the grouped traces to a new file
    with open('grouped_traces.json', 'w') as f:
        json.dump(groups, f, indent=4, sort_keys=True, separators=(',', ': '))


# Run the function on your example file
group_similar_traces(file_path)
