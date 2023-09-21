import json


with open('example.json', 'r') as file:
    data = json.load(file)

traces = data["data"]
spans={}
references={}
paths=[]

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


# def dfs(graph, node, visited):
#     if node not in visited:
#         visited.append(node)
#         for neighbor in graph.get(node, []):
#             dfs(graph, neighbor, visited[:])
#     paths.append(visited)

# def find_branches(graph):
def find_all_branches(graph):
    def dfs(node, branch):
        branch.append(node)
        if node not in graph:
            branches.append(branch)
            return
        for neighbor in graph[node]:
            dfs(neighbor, branch.copy())

    branches = []
    for node in graph:
        dfs(node, [])

    return branches

    

if __name__=="__main__":
    right_trace=take_right_trace("2fade568645f89b0")
    spans=right_trace["spans"]
    do_the_reference_dict()

    visited = []

    print(find_all_branches(references))
    
    # root=take_root_span(right_trace["spans"])
    # print(root)
    # path=[]
    # take_path(root,path)
    # print(path)
