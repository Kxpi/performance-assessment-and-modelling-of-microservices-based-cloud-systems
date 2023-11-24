import json
from deepdiff import DeepDiff
from collections import defaultdict
import numpy as np


# ToDO: Remove startTimes
"""
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
"""

file_path = ".\modelowanie\jaeger-traces.json"


def read_file(file_path):
    with open(file_path, "r") as f:
        data = json.load(f)

    for trace in data["data"]:
        trace["spans"].sort(key=lambda span: span["startTime"])
        earliest_span = trace["spans"][0]
        for span in trace["spans"]:
            span["startTime"] = span["startTime"] - earliest_span["startTime"]

    return data


def isParent(parent, span):
    for reference in span["references"]:
        if reference["refType"] == "CHILD_OF":
            if reference["spanID"] == parent["spanID"]:
                return True
        return False


def findRoot(spans):
    if len(spans) == 1:
        return spans.pop(0)

    for index, span in enumerate(spans):
        if len(span["references"]) == 0:
            spans.pop(index)
            return span
    else:
        # span with invalid parent id become root

        for index, span in enumerate(spans):
            if span["warnings"]:
                for w in span["warnings"]:
                    if "invalid parent" in w:
                        spans.pop(index)
                        return span
        else:
            print("Error: Couldn't find root! Spans: ")
            for s in spans:
                x = json.dumps(s, indent=4)
                print("-" * 100)
                print(x)
                print("=" * 100)

            return -1
            # exit(1)


def get_callGraphRep(spans, root):
    # callGraph represented by nested dictionaries

    callGraph = {}
    c = 0

    for i, span in enumerate(spans[:]):
        if isParent(root, span):
            c += 1
            cName = span["operationName"]
            result = get_callGraphRep(spans[:i] + spans[i + 1 :], span)
            callGraph[cName] = result[0]
            c += result[1]

    if callGraph:
        return callGraph, c
    else:
        return None, 0


def get_groups(data):
    traces = data["data"]

    groupID = 0

    # CallGraph_rep: {traceid: callGraph}
    traces_callGraph_rep = {}
    groups = []

    # Create callGraph representation  for each trace
    for trace in traces:
        trace_spans = trace["spans"][:]

        # Find the earliest startTime in the trace
        earliest_start_time = min(span["startTime"] for span in trace_spans)

        # Update the startTime for each span in the trace
        for span in trace_spans:
            span["startTime"] -= earliest_start_time

        trace_root = findRoot(trace_spans)

        callG, used_spans = get_callGraphRep(trace_spans, trace_root)

        traces_callGraph_rep[trace["traceID"]] = {trace_root["operationName"]: callG}

        # if any span left, trace have more than one root
        while (len(trace_spans) - used_spans) != 0:
            trace_root = findRoot(trace_spans)
            if trace_root == -1:
                for s in trace_spans:
                    traces_callGraph_rep[trace["traceID"]][s["operationName"]] = None
                break

            traces_callGraph_rep[trace["traceID"]][
                trace_root["operationName"]
            ] = get_callGraphRep(trace_spans, trace_root)

    # Group traces by callGraph representation
    initial_trace = traces.pop(0)

    # Create first group which contains the first trace
    groups.append(
        {
            "groupID": groupID,
            "traceNumber": 0,
            "span_stats": None,
            "operation_stats": None,
            "traces": [initial_trace],
        }
    )
    groupID += 1

    # print("End of first Phase")

    for trace in traces:
        # Check if group for this trace already exists
        for group in groups:
            diff = DeepDiff(
                traces_callGraph_rep[trace["traceID"]],
                traces_callGraph_rep[group["traces"][0]["traceID"]],
            )

            if not diff:
                group["traces"].append(trace)
                break
        else:
            # If not exists create new group
            groups.append(
                {
                    "groupID": groupID,
                    "traceNumber": 0,
                    "span_stats": None,
                    "operation_stats": None,
                    "traces": [trace],
                }
            )
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
                operation_stats[operation_name]["exec_times"].append(span["duration"])
                operation_stats[operation_name]["start_times"].append(span["startTime"])
                span_stats["exec_times"].append(span["duration"])
                span_stats["start_times"].append(span["startTime"])

        # Calculate statistics for all spans within the group
        exec_times = np.array(span_stats["exec_times"])
        start_times = np.array(span_stats["start_times"])

        group["span_stats"] = {
            "exec_time_min": int(np.min(exec_times)),
            "exec_time_max": int(np.max(exec_times)),
            "exec_time_q1": int(np.percentile(exec_times, 25)),
            "exec_time_q2": int(np.percentile(exec_times, 50)),
            "exec_time_q3": int(np.percentile(exec_times, 75)),
            "exec_time_95_percentile": int(np.percentile(exec_times, 95)),
            "exec_time_99_percentile": int(np.percentile(exec_times, 99)),
            "exec_time_average": int(np.average(exec_times)),
            "exec_time_stddev": int(np.std(exec_times)),
            "exec_time_IQR": int(np.subtract(*np.percentile(exec_times, [75, 25]))),
            "start_time_min": int(np.min(start_times)),
            "start_time_max": int(np.max(start_times)),
            "start_time_q1": int(np.percentile(start_times, 25)),
            "start_time_q2": int(np.percentile(start_times, 50)),
            "start_time_q3": int(np.percentile(start_times, 75)),
            "start_time_95_percentile": int(np.percentile(start_times, 95)),
            "start_time_99_percentile": int(np.percentile(start_times, 99)),
            "start_time_average": int(np.average(start_times)),
            "start_time_stddev": int(np.std(start_times)),
            "start_time_IQR": int(np.subtract(*np.percentile(start_times, [75, 25]))),
        }

        # Calculate statistics for each operation within the group
        for operation_name, stats in operation_stats.items():
            exec_times = np.array(stats["exec_times"])
            start_times = np.array(stats["start_times"])

            operation_stats[operation_name] = {
                "exec_time_min": int(np.min(exec_times)),
                "exec_time_max": int(np.max(exec_times)),
                "exec_time_q1": int(np.percentile(exec_times, 25)),
                "exec_time_q2": int(np.percentile(exec_times, 50)),
                "exec_time_q3": int(np.percentile(exec_times, 75)),
                "exec_time_95_percentile": int(np.percentile(exec_times, 95)),
                "exec_time_99_percentile": int(np.percentile(exec_times, 99)),
                "exec_time_average": int(np.average(exec_times)),
                "exec_time_stddev": int(np.std(exec_times)),
                "exec_time_IQR": int(np.subtract(*np.percentile(exec_times, [75, 25]))),
                "start_time_min": int(np.min(start_times)),
                "start_time_max": int(np.max(start_times)),
                "start_time_q1": int(np.percentile(start_times, 25)),
                "start_time_q2": int(np.percentile(start_times, 50)),
                "start_time_q3": int(np.percentile(start_times, 75)),
                "start_time_95_percentile": int(np.percentile(start_times, 95)),
                "start_time_99_percentile": int(np.percentile(start_times, 99)),
                "start_time_average": int(np.average(start_times)),
                "start_time_stddev": int(np.std(start_times)),
                "start_time_IQR": int(
                    np.subtract(*np.percentile(start_times, [75, 25]))
                ),
            }

        # Add operation stats to the group
        group["operation_stats"] = operation_stats

        # Replace traces with traceIDs
        # group["traces"] = [trace["traceID"] for trace in group["traces"]]

    # print("End of the second phase now just write the result to the file")
    # with open('mateusz_groups.json', 'w') as f:
    #     json.dump({"groups": groups}, f, indent=4)

    return groups


# get_groups(file_path)


def get_microservice_stats(data):
    microservice_exec_times = defaultdict(list)
    microservice_start_times = defaultdict(list)

    traces = data["data"]
    for trace in traces:
        trace_spans = trace["spans"][:]
        # Find the earliest startTime in the trace
        earliest_start_time = min(span["startTime"] for span in trace_spans)

        # Update the startTime for each span in the trace
        for span in trace_spans:
            span["startTime"] -= earliest_start_time
        for span in trace["spans"]:
            # Get the serviceName using the processId of the span
            service_name = trace["processes"][span["processID"]]["serviceName"]
            microservice_exec_times[service_name].append(span["duration"])
            microservice_start_times[service_name].append(span["startTime"])

    # Calculate statistics for each microservice
    microservice_stats = {}
    for service_name in microservice_exec_times.keys():
        exec_times = np.array(microservice_exec_times[service_name])
        start_times = np.array(microservice_start_times[service_name])

        microservice_stats[service_name] = {
            "exec_time_min": int(np.min(exec_times)),
            "exec_time_max": int(np.max(exec_times)),
            "exec_time_q1": int(np.percentile(exec_times, 25)),
            "exec_time_q2": int(np.percentile(exec_times, 50)),
            "exec_time_q3": int(np.percentile(exec_times, 75)),
            "exec_time_95_percentile": int(np.percentile(exec_times, 95)),
            "exec_time_99_percentile": int(np.percentile(exec_times, 99)),
            "exec_time_average": int(np.average(exec_times)),
            "exec_time_stddev": int(np.std(exec_times)),
            "exec_time_IQR": int(np.subtract(*np.percentile(exec_times, [75, 25]))),
            "start_time_min": int(np.min(start_times)),
            "start_time_max": int(np.max(start_times)),
            "start_time_q1": int(np.percentile(start_times, 25)),
            "start_time_q2": int(np.percentile(start_times, 50)),
            "start_time_q3": int(np.percentile(start_times, 75)),
            "start_time_95_percentile": int(np.percentile(start_times, 95)),
            "start_time_99_percentile": int(np.percentile(start_times, 99)),
            "start_time_average": int(np.average(start_times)),
            "start_time_stddev": int(np.std(start_times)),
            "start_time_IQR": int(np.subtract(*np.percentile(start_times, [75, 25]))),
        }

    return microservice_stats
