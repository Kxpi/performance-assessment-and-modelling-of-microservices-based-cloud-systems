import json
import random
import time
import argparse
from datetime import datetime


def cli_parser() -> dict:
    """
    Parses CLI input args, returns as dict.
    """
    parser = argparse.ArgumentParser(description=argparse.SUPPRESS)
    parser.add_argument("-t", "--traces", type=int, default=10, help="Number of traces")
    parser.add_argument("-s", "--spans", type=int, default=25, help="Max number of spans per trace")
    parser.add_argument("-c", "--comm-time", type=int, default=0, help="Fixed time of communication")
    parser.add_argument("-p", "--processes", type=int, default=12, help="Number of processes - esentially microservices")

    return vars(parser.parse_args())


def save_dict_to_json(output_dict: dict, output_path: str = '') -> None:
    """
    Save python dict to JSON file.
    """
    # set default path with random filename
    if not output_path:
        timestamp = datetime.now().strftime("%H-%M-%S_%d-%m-%Y")
        output_path = f'./outputs/{timestamp}.json'

    with open(output_path, 'w') as json_file:
        json.dump(output_dict, json_file, indent = 4)


def generate_processes(num_processes_arg: int):
    processes_dict = {}
    for index in range(1, num_processes_arg+1):
        process_id = f'p{index}'
        service_name = f"service_{random.randint(1, 1000)}"
        processes_dict[process_id] = {
            'serviceName': service_name
        }
    return processes_dict

def generate_span(traceID: str, operation: str, start_time: int, duration: int, communication_time: int, process_id: str, child_of: str = None):
    spanID = format(random.randint(1, 999999999), 'x')
    references = []
    if child_of:
        references = [{
            'type': 'CHILD_OF',
            'traceID': traceID,
            'spanID': child_of
        }]
    span = {
        "traceID": traceID,
        "spanID": spanID,
        "operationName": operation,
        "references": references,
        "startTime": start_time,
        "duration": duration,
        'communication_time_to_next': communication_time,
        'processID': process_id,
        'warnings': None
    }
    return span, spanID

def generate_trace(num_spans_per_service, comm_time_arg, processes_arg, processes_dict):
    traceID = format(random.randint(1, 999999999999999999), 'x')
    trace = {
        'traceID': traceID,
        'spans': []
    }
    current_parent = ''
    curr_start_time = int(time.time() * 1000000)
    
    for _ in range(num_spans_per_service):
        operation = f"operation_{random.randint(1, 1000)}"
        duration = random.randint(1, 100000)
        communication_time = comm_time_arg if comm_time_arg else random.randint(1, 10000)
        process_id = f'p{random.randint(1, processes_arg)}'
        span, spanID = generate_span(traceID, operation, curr_start_time, duration, communication_time, process_id, child_of=current_parent)
        trace['spans'].append(span)
        current_parent = spanID
        curr_start_time = curr_start_time + duration + communication_time

    trace['processes'] = processes_dict

    return trace

def main():
    args = cli_parser()
    test_data = {'data': []}

    processes = generate_processes(args['processes'])

    for _ in range(args['traces']):
        num_spans_per_service = random.randint(args['spans']//2, args['spans'])
        test_data['data'].append(generate_trace(num_spans_per_service, args['comm_time'], args['processes'], processes))

    save_dict_to_json(test_data)

if __name__ == "__main__":
    main()
