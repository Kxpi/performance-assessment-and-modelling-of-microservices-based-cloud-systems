import random
import time
import jaeger_client
import json

from jaeger_client import Config
from opentracing import Tracer

SERVICE_NAME = "your-service-name"
TRACE_COUNT = 100
MAX_SPANS_PER_TRACE = 20
MAX_DEPTH = 5
TRACE_PREFIX = "trace_"

# Initialize Jaeger tracer
config = Config(
    config={
        "sampler": {"type": "const", "param": 1},
        "logging": True,
        "reporter_batch_size": 1,
    },
    service_name=SERVICE_NAME,
)
tracer = config.initialize_tracer()

# Sample span names and operation names
SPAN_NAMES = ["http_request", "db_query", "cache_lookup", "custom_operation"]
OPERATION_NAMES = ["GET", "POST", "DELETE", "UPDATE"]


def generate_span(trace_id, parent_span_id, span_depth):
    span_id = random.getrandbits(64)
    span_name = random.choice(SPAN_NAMES)
    operation_name = random.choice(OPERATION_NAMES)
    start_time = time.time()
    # Span duration in seconds
    end_time = start_time + random.uniform(0.001, 0.5)

    span = {
        "traceId": trace_id,
        "spanId": span_id,
        "parentSpanId": parent_span_id,
        "operationName": operation_name,
        "references": [],
        "startTime": int(start_time * 1000000),
        "duration": int((end_time - start_time) * 1000000),
        "tags": [],
        "warnings": None,
        "logs": None,
        "processID": SERVICE_NAME
    }

    if span_depth < MAX_DEPTH:
        child_span_count = random.randint(0, MAX_SPANS_PER_TRACE)
        for _ in range(child_span_count):
            child_span = generate_span(trace_id, span_id, span_depth + 1)
            span["references"].append({
                "traceId": trace_id,
                "spanId": child_span["spanId"],
                "refType": "CHILD_OF"
            })

    return span


def generate_trace(trace_count):
    traces = []
    for i in range(trace_count):
        trace_id = f"{TRACE_PREFIX}{i}"
        span_count = random.randint(1, MAX_SPANS_PER_TRACE)
        root_span = generate_span(trace_id, 0, 0)

        # Add processes and spans under one dictionary.
        trace = {
            "processes": {
                "serviceName": SERVICE_NAME,
                "tags": [
                    {"key": "example_key", "type": "string",
                        "value": "example_value"}
                ]
            },
            "spans": [root_span]
        }

        traces.append(trace)
    return traces


def generate_jaeger_json():
    traces = generate_trace(TRACE_COUNT)
    data = {"data": traces}
    return data


def save_json_to_file(json_data, filename):
    with open(filename, 'w') as file:
        json.dump(json_data, file)


# Generate and save the Jaeger JSON
jaeger_json = generate_jaeger_json()
output_filename = "jaegerTraces.json"
save_json_to_file(jaeger_json, output_filename)
print(jaeger_json)


# Close the tracer when done
tracer.close()
