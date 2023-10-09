import json
from deepdiff import DeepDiff
from collections import defaultdict
import numpy as np


'''
result:
    {
        groups: [
            {
                groupId: 1,
                traceNumber: 997,
                traces: [
                    traceID,
                    ...
                
                ]
                             
                  
            
            }
        ]
    }
'''

file_path = "visualization\public\jaeger-traces.json"


def read_file(file_path):

    with open(file_path, 'r') as f:
        data = json.load(f)

    for trace in data['data']:
        trace['spans'].sort(key=lambda span: span['startTime'])
    return data


def isParent(parent, span):

    for reference in span["references"]:
        if reference["refType"] == "CHILD_OF":
            if reference["spanID"] == parent["spanID"]:
                return True
        return False


def get_callGraphRep(spans, root):
    # callGraph represented by nested dictionaries
    callGraph = {}
    i = 0

    while spans and i < len(spans):

        if isParent(root, spans[i]):
            span = spans.pop(i)
            cName = span["operationName"]
            callGraph[cName] = get_callGraphRep(spans, span)
        else:
            i += 1

    if callGraph:
        return callGraph
    else:
        return None


def get_groups(traces):

    groupID = 0

    # {traceid: callGraph}
    traces_callGraph_rep = {}
    groups = []
    microservice_exec_times = defaultdict(list)
    microservice_start_times = defaultdict(list)

    # Collect all start times to find the global minimum
    all_start_times = []

    for trace in traces:
        trace_root = trace["spans"][0]
        traces_callGraph_rep[trace["traceID"]] = get_callGraphRep(
            trace["spans"][1:], trace_root)

        # Collect start times
        for span in trace["spans"]:
            # Add start time to the list
            all_start_times.append(span['startTime'])
            # Get the serviceName using the processId of the span
            service_name = trace['processes'][span['processID']]['serviceName']
            microservice_exec_times[service_name].append(span['duration'])
            microservice_start_times[service_name].append(span['startTime'])

    # Find the minimal startTime value across all spans
    min_start_time = min(all_start_times)

    # Subtract the minimal startTime value from all other startTime values
    for service_name in microservice_start_times:
        microservice_start_times[service_name] = [
            start_time - min_start_time for start_time in microservice_start_times[service_name]]

    # Calculate statistics for each microservice
    microservice_stats = {}
    for service_name in microservice_exec_times.keys():
        exec_times = np.array(microservice_exec_times[service_name])
        start_times = np.array(microservice_start_times[service_name])

        microservice_stats[service_name] = {
            'exec_time_min': int(np.min(exec_times)),
            'exec_time_max': int(np.max(exec_times)),
            'exec_time_q1': int(np.percentile(exec_times, 25)),
            'exec_time_q2': int(np.percentile(exec_times, 50)),
            'exec_time_q3': int(np.percentile(exec_times, 75)),
            'exec_time_95_percentile': int(np.percentile(exec_times, 95)),
            'exec_time_99_percentile': int(np.percentile(exec_times, 99)),
            'exec_time_average': int(np.average(exec_times)),
            'start_time_min': int(np.min(start_times)),
            'start_time_max': int(np.max(start_times)),
            'start_time_q1': int(np.percentile(start_times, 25)),
            'start_time_q2': int(np.percentile(start_times, 50)),
            'start_time_q3': int(np.percentile(start_times, 75)),
            'start_time_95_percentile': int(np.percentile(start_times, 95)),
            'start_time_99_percentile': int(np.percentile(start_times, 99)),
            'start_time_average': int(np.average(start_times)),
        }

    initial_trace = traces.pop(0)

    groups.append({"groupID": groupID, "traceNumber": 0, "span_stats": None, "operation_stats": None, "traces": [
                  initial_trace]})
    groupID += 1

    for trace in traces:

        for group in groups:

            diff = DeepDiff(
                traces_callGraph_rep[trace["traceID"]], traces_callGraph_rep[group["traces"][0]["traceID"]])

            if not diff:
                group["traces"].append(trace)
                break
        else:
            groups.append({"groupID": groupID, "traceNumber": 0, "span_stats": None, "operation_stats": None, "traces": [
                          trace]})
            groupID += 1

    for group in groups:
        group["traceNumber"] = len(group["traces"])

        # New dictionary to collect span stats within the group
        span_stats = defaultdict(list)

        # New dictionary to collect operation stats within the group
        operation_stats = defaultdict(lambda: defaultdict(list))

        # Collect operation stats for the group
        for trace in group["traces"]:
            for span in trace["spans"]:
                operation_name = span["operationName"]
                operation_stats[operation_name]['exec_times'].append(
                    span['duration'])
                operation_stats[operation_name]['start_times'].append(
                    span['startTime'] - min_start_time)
                span_stats['exec_times'].append(span['duration'])
                span_stats['start_times'].append(
                    span['startTime'] - min_start_time)

        # Calculate statistics for all spans within the group
        exec_times = np.array(span_stats['exec_times'])
        start_times = np.array(span_stats['start_times'])

        group["span_stats"] = {
            'exec_time_min': int(np.min(exec_times)),
            'exec_time_max': int(np.max(exec_times)),
            'exec_time_q1': int(np.percentile(exec_times, 25)),
            'exec_time_q2': int(np.percentile(exec_times, 50)),
            'exec_time_q3': int(np.percentile(exec_times, 75)),
            'exec_time_95_percentile': int(np.percentile(exec_times, 95)),
            'exec_time_99_percentile': int(np.percentile(exec_times, 99)),
            'exec_time_average': int(np.average(exec_times)),
            'start_time_min': int(np.min(start_times)),
            'start_time_max': int(np.max(start_times)),
            'start_time_q1': int(np.percentile(start_times, 25)),
            'start_time_q2': int(np.percentile(start_times, 50)),
            'start_time_q3': int(np.percentile(start_times, 75)),
            'start_time_95_percentile': int(np.percentile(start_times, 95)),
            'start_time_99_percentile': int(np.percentile(start_times, 99)),
            'start_time_average': int(np.average(start_times)),
        }

        # Calculate statistics for each operation within the group
        for operation_name, stats in operation_stats.items():
            exec_times = np.array(stats['exec_times'])
            start_times = np.array(stats['start_times'])

            operation_stats[operation_name] = {
                'exec_time_min': int(np.min(exec_times)),
                'exec_time_max': int(np.max(exec_times)),
                'exec_time_q1': int(np.percentile(exec_times, 25)),
                'exec_time_q2': int(np.percentile(exec_times, 50)),
                'exec_time_q3': int(np.percentile(exec_times, 75)),
                'exec_time_95_percentile': int(np.percentile(exec_times, 95)),
                'exec_time_99_percentile': int(np.percentile(exec_times, 99)),
                'exec_time_average': int(np.average(exec_times)),
                'start_time_min': int(np.min(start_times)),
                'start_time_max': int(np.max(start_times)),
                'start_time_q1': int(np.percentile(start_times, 25)),
                'start_time_q2': int(np.percentile(start_times, 50)),
                'start_time_q3': int(np.percentile(start_times, 75)),
                'start_time_95_percentile': int(np.percentile(start_times, 95)),
                'start_time_99_percentile': int(np.percentile(start_times, 99)),
                'start_time_average': int(np.average(start_times)),
            }

        # Add operation stats to the group
        group["operation_stats"] = operation_stats

        # Replace traces with traceIDs
        group["traces"] = [trace["traceID"] for trace in group["traces"]]

    with open('grouped_tracesV2', 'w') as f:
        json.dump({"microservice_stats": microservice_stats,
                  "groups": groups}, f, indent=4)

    return groups


data = read_file(file_path)

get_groups(data['data'])
