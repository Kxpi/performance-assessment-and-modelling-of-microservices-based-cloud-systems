import json
from deepdiff import DeepDiff


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

file_path = "modelowanie\jaeger-traces.json"


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

    for trace in traces:
        trace_root = trace["spans"][0]
        traces_callGraph_rep[trace["traceID"]] = get_callGraphRep(
            trace["spans"][1:], trace_root)

    initial_trace = traces.pop(0)

    groups.append({"groupID": groupID, "traceNumber": 0, "traces": [
                  initial_trace["traceID"]]})
    groupID += 1

    for trace in traces:

        for group in groups:

            diff = DeepDiff(
                traces_callGraph_rep[trace["traceID"]], traces_callGraph_rep[group["traces"][0]])

            if not diff:
                group["traces"].append(trace["traceID"])
                break
        else:
            groups.append({"groupID": groupID, "traceNumber": 0, "traces": [
                          trace["traceID"]]})
            groupID += 1

    for group in groups:
        group["traceNumber"] = len(group["traces"])

    with open('mateusz_groups', 'w') as f:
        json.dump({"groups": groups}, f, indent=4)

    return groups


data = read_file(file_path)

get_groups(data['data'])
