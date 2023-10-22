import json

with open('example.json', 'r') as file:
    data = json.load(file)

references={}

class Span:
    self.traceID
    self.spanID
    self.flags
    self.operationName
    self.parent_spanID
    self.parent_traceID

    def __init__(self,traceID,spanID,flags,operationName,parent_spanID,parent_traceID):
            self.traceID=traceID
            self.spanID=spanID
            self.flags=flags
            self.operationName=operationName
            self.parent_spanID=parent_spanID
            self.parent_traceID=parent_traceID
    

def do_the_reference_dict():
    for spans in data['data']:
        for span in spans['spans']:
            for ref in span["references"]:
                if  in references:
                    #references[ref["spanID"]].append(span["spanID"])
                    references(Span(span['traceID'],span['spanID'],span['flags'],span['operationName'],ref['spanID'],ref['traceID'])).
                else:
                    references[ref["spanID"]]=[span["spanID"]]
