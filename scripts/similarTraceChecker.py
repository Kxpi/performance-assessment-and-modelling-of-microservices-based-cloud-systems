import json
from collections import defaultdict
import numpy as np

file_path = 'visualization\public\jaeger-traces.json'


def get_trace_representation(trace):
    # Create a dictionary that maps process IDs to service names
    process_id_to_service_name = {
        process_id: process['serviceName'] for process_id, process in trace['processes'].items()}

    # Extract service names from spans using the process ID to service name mapping
    service_names = sorted(list(
        set([process_id_to_service_name[span['processID']] for span in trace['spans']])))

    # Create a list of operation names, sorted to consider permutations as similar
    operation_names = sorted([span['operationName']
                             for span in trace['spans']])

    # Return a tuple that represents this trace
    return (tuple(service_names), tuple(operation_names))


def group_similar_traces(file_path):
    with open(file_path, 'r') as f:
        data = json.load(f)

    groups = defaultdict(list)
    traceIDs = defaultdict(list)
    microservices = defaultdict(list)
    microservice_exec_times = defaultdict(list)
    microservice_start_times = defaultdict(list)

    for trace in data['data']:
        # Group traces by their representations
        # Convert tuple to string
        representation = str(get_trace_representation(trace))
        groups[representation].append(trace)
        # Append traceID to the new dictionary
        traceIDs[representation].append(trace['traceID'])

        # Group traces by microservice
        for service_name in get_trace_representation(trace)[0]:
            microservices[service_name].append(trace)

        # For each span in each trace
        for span in trace['spans']:
            # Get the serviceName using the processId of the span
            serviceName = trace['processes'][span['processID']]['serviceName']
            microservice_exec_times[serviceName].append(span['duration'])
            microservice_start_times[serviceName].append(span['startTime'])

    # dictionary to hold statistics for each group
    stats = {}

    for rep, traces in groups.items():
        # Execute times list for the group
        exec_times = [span['duration']
                      for trace in traces for span in trace['spans']]

        # Calculate statistics
        exec_time_min = int(np.min(exec_times))
        exec_time_max = int(np.max(exec_times))
        exec_time_q1 = int(np.percentile(exec_times, 25))
        exec_time_q2 = int(np.percentile(exec_times, 50))
        exec_time_q3 = int(np.percentile(exec_times, 75))
        exec_time_95_percentile = int(np.percentile(exec_times, 95))
        exec_time_99_percentile = int(np.percentile(exec_times, 99))

        # Start times list for the group
        start_times = [span['startTime']
                       for trace in traces for span in trace['spans']]

        # Calculate statistics
        start_time_min = int(np.min(start_times))
        start_time_max = int(np.max(start_times))
        start_time_q1 = int(np.percentile(start_times, 25))
        start_time_q2 = int(np.percentile(start_times, 50))
        start_time_q3 = int(np.percentile(start_times, 75))
        start_time_percent_95 = int(np.percentile(start_times, 95))
        start_time_percent_99 = int(np.percentile(start_times, 99))

        # Save the stats in the dictionary
        stats[rep] = {
            'exec_time_min': exec_time_min,
            'exec_time_max': exec_time_max,
            'exec_time_q1': exec_time_q1,
            'exec_time_q2': exec_time_q2,
            'exec_time_q3': exec_time_q3,
            'exec_time_95_percentile': exec_time_95_percentile,
            'exec_time_99_percentile': exec_time_99_percentile,
            'start_time_min': start_time_min,
            'start_time_max': start_time_max,
            'start_time_q1': start_time_q1,
            'start_time_q2': start_time_q2,
            'start_time_q3': start_time_q3,
            'start_time_95_percentile': start_time_percent_95,
            'start_time_99_percentile': start_time_percent_99,
        }

    # dictionaries to hold statistics for each microservice
    microservice_stats = {}

    # collect start times and exec times for each microservice
    # collect start times and exec times for each microservice
    serviceNames = set(microservice_exec_times.keys()) & set(
        microservice_start_times.keys())

    for serviceName in serviceNames:

        exec_times = np.array(microservice_exec_times[serviceName])
        start_times = np.array(microservice_start_times[serviceName])

        exec_time_min = int(np.min(exec_times))
        exec_time_max = int(np.max(exec_times))
        exec_time_q1 = int(np.percentile(exec_times, 25))
        exec_time_q2 = int(np.percentile(exec_times, 50))
        exec_time_q3 = int(np.percentile(exec_times, 75))
        exec_time_95_percentile = int(np.percentile(exec_times, 95))
        exec_time_99_percentile = int(np.percentile(exec_times, 99))
        start_time_min = int(np.min(start_times))
        start_time_max = int(np.max(start_times))
        start_time_q1 = int(np.percentile(start_times, 25))
        start_time_q2 = int(np.percentile(start_times, 50))
        start_time_q3 = int(np.percentile(start_times, 75))
        start_time_percent_95 = int(np.percentile(start_times, 95))
        start_time_percent_99 = int(np.percentile(start_times, 99))

        microservice_stats[serviceName] = {
            'exec_time_min': exec_time_min,
            'exec_time_max': exec_time_max,
            'exec_time_q1': exec_time_q1,
            'exec_time_q2': exec_time_q2,
            'exec_time_q3': exec_time_q3,
            'exec_time_95_percentile': exec_time_95_percentile,
            'exec_time_99_percentile': exec_time_99_percentile,
            'start_time_min': start_time_min,
            'start_time_max': start_time_max,
            'start_time_q1': start_time_q1,
            'start_time_q2': start_time_q2,
            'start_time_q3': start_time_q3,
            'start_time_95_percentile': start_time_percent_95,
            'start_time_99_percentile': start_time_percent_99,
        }

    # Adding group statistics and traceIDs to the final JSON
    for rep in groups.keys():
        groups[rep] = {
            'statistics': stats[rep],
            'traceIDs': traceIDs[rep]
        }

    # Save the groups and microservice statistics to a new JSON file
    with open('grouped_traces.json', 'w') as f:
        json.dump({'microservice_stats': microservice_stats,
                  'groups': groups}, f, indent=4)


group_similar_traces(file_path)
