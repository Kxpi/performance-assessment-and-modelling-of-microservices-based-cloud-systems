import json


with open('one_trace.json', 'r') as file:
    data = json.load(file)

traces = data["data"]

span_durations = {}

for trace in traces:
    for span in trace["spans"]:
        span_id = span["spanID"]
        duration = span["duration"]
        span_durations[span_id] = duration

def calculate_trace_duration(trace):
    total_duration = 0
    for span in trace["spans"]:
        total_duration += span_durations[span["spanID"]]
    return total_duration

critical_trace = max(traces, key=calculate_trace_duration)

critical_path_spans = critical_trace["spans"]
max_duration=0
start_time=0

for span in critical_path_spans:
    if start_time==0:
        start_time=span['startTime']
    span_id = span["spanID"]
    operation_name = span["operationName"]
    duration = span_durations[span_id]
    end_time=span['startTime']+duration
    max_duration+=duration
    print(f"Span ID: {span_id}, Operation: {operation_name}, Duration: {duration} ms")
print("max duration:", max_duration, "time of communication",end_time-start_time)