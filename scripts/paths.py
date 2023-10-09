import json


with open('example.json', 'r') as file:
    data = json.load(file)

traces = data["data"]
spans={}
references={}

def take_right_trace(traceID):
    for i in traces:
        if i["traceID"]==traceID:
            return i

def take_root_span(spans):
    span=[span for span in spans if not any(ref['refType'] == 'CHILD_OF' for ref in span['references'])]
    return span[0]

def do_the_reference_dict():
    for span in spans:
        for ref in span["references"]:
            if ref["spanID"] in references:
                references[ref["spanID"]].append(span["spanID"])
            else:
                references[ref["spanID"]]=[span["spanID"]]


def dfs(graph, node, visited):
    if node not in visited:
        visited.append(node)
        for neighbor in graph.get(node, []):
            dfs(graph, neighbor, visited[:])


def get_the_transfer_time(references, traceID):  #reference is the tree of calls between spans, traceID is the id trace that transfer time of child will be calcule
    childs=references[traceID]
    times_of_childs = {}
    for child in childs:
        for span in spans:
            if span["traceID"] == child:
                time = trace["startTime"]
        times_of_childs[child]=time
    time_of_transfer = []
    times_of_childs=sorted(times_of_childs.items(),key=lambda item: item[1], reverse=True)
    for time in range(len(times_of_childs)):
        if time != len(time_of_transfer):
            time_of_transfer.append(time_of_transfer[time] - time_of_transfer[time+1])
    return time_of_transfer      






if __name__=="__main__":
    right_trace=take_right_trace("2fade568645f89b0")
    spans=right_trace["spans"]
    do_the_reference_dict()

    visited = []

    for node in references:
        if node not in visited:
            dfs(references, node, visited)
    
    #print(visited)
    #root=take_root_span(right_trace["spans"])
    #print(root)
    #path=[]
    #take_path(root,path)
    print(references)
    for ref in references:
        print(ref)
    #print(get_the_transfer_time(references, right_trace))