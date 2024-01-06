import os
import json
import time
import argparse
import binascii
from pprint import pprint
from datetime import datetime
from itertools import combinations
import numpy as np
from flask import Flask, render_template, jsonify
app = Flask(__name__)

def cli_parser() -> dict:
    """
    Parses CLI input args, returns as dict.
    """
    parser = argparse.ArgumentParser(description=argparse.SUPPRESS)
    
    parser.add_argument("-f", "--file", type=str, required=True, help="Path to the file")

    return vars(parser.parse_args())


def random_hex() -> str:
    """
    Generates random 32-digit hex string.
    """
    return binascii.b2a_hex(os.urandom(16)).decode()


def read_traces(path: str) -> dict:
    """"
    Reads JSON file contents, returns as dict.
    """
    with open(path, 'r') as traces:
        data = json.loads(traces.read())

    return data


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




def timeit(func):
    """
    Decorator used to measure function time execution.
    """
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        elapsed_time = end_time - start_time
        print(f"{func.__name__} took {elapsed_time} seconds.")
        return result
    return wrapper


def find_non_child(traces: dict) -> dict:
    """
    Indentifies and returns dict with non-child spanIDs for each traceID.

    ```
    {
        traceID: [
            {
                spanID: xxx,
                operationName: xxx
            },
            ...
        ],
        ...
    }
    ```
    """
    non_child = {}
    for trace in traces['data']:
        current_traceID = trace['traceID']
        non_child[current_traceID] = []

    # TODO: find more parents
        for span in trace['spans']:
            if not span['references']:
                non_child[current_traceID].append(
                    {
                        'spanID': span['spanID'],
                        'operationName': span['operationName']
                    })
                
    return non_child



def calculate_endTime(span: dict) -> int:
    """
    Return endTime of span.
    """
    return span.get('startTime', 0) + span.get('duration', 0)


def communication_time(pair_dict: dict) -> dict:
    """
    Calculates time between two spans in a pair.

    Returns dict with results in given format:

    ```
    {
        time: xxx,
        initSpanID: xxx,
        initOperationName: xxx,
        targetSpanID: xxx,
        targetOperationName: xxx
    }
    ```
    """
    pair_result = {}

    spanIDS = list(pair_dict.keys())
    initSpan = spanIDS[0]
    targetSpan = spanIDS[1]

    pair_result['time'] = pair_dict[targetSpan]['startTime'] - pair_dict[initSpan]['endTime']
    pair_result['initSpanID'] = initSpan
    pair_result['initOperationName'] = pair_dict[initSpan]['operationName']
    pair_result['targetSpanID'] = targetSpan
    pair_result['targetOperationName'] = pair_dict[targetSpan]['operationName']


    return pair_result


@timeit
def reformat_dict(traces: dict, groups_traces) -> list:
    """
    Returns new dict with traces in given format:

    ```
    {
        traceID: {
            spanID: {
                startTime: xxx,
                endTime: xxx,
                operationName: xxx
            }
        }
    }
    ```
    """

    new_dict = {}

    for trace in traces['data']:
        if trace['traceID'] not in groups_traces:
            continue
        current_traceID = trace['traceID']
        new_dict[current_traceID] = {}

        for span in trace['spans']:
            current_spanID = span['spanID']
            new_dict[current_traceID][current_spanID] = {}
            new_dict[current_traceID][current_spanID]['startTime'] = span.get('startTime', 0)
            new_dict[current_traceID][current_spanID]['endTime'] = calculate_endTime(span)
            new_dict[current_traceID][current_spanID]['operationName'] = span.get('operationName')

    return new_dict


@timeit
def calculate_comm_times(traces_reformatted: dict, INCLUDE_NEGATIVE = True) -> list:
    """
    Calculates communication times for each pair of spans.
    If `INCLUDE_NEGATIVE` is set to True (default) negative times will be included.

    Returns dict in given format:

    ```
    {
        traceID: [
            {
                time: xxx,
                initSpanID: xxx,
                initOperationName: xxx,
                targetSpanID: xxx,
                targetOperationName: xxx
            },
            ...
        ],
        ...
    },
    ```
    """
    
    comm_times = {}

    for traceID, spans in traces_reformatted.items():
        comm_times[traceID] = []
        spanIDs = list(spans.keys())
        for pair in combinations(spanIDs, 2):
            pair_dict = {key: spans[key] for key in pair}
            result_dict = communication_time(pair_dict)
            if result_dict['time'] < 0 and not INCLUDE_NEGATIVE:
                continue
            comm_times[traceID].append(result_dict)

    return comm_times


def count_negative_times(pair_list: list) -> int:
    """
    Returns count of how many records in result are negative.
    """
    return sum(1 for pair in pair_list if pair['time'] < 0)


def debug_result(communication_times: dict) -> None:
    """
    Prints simple analysis of calculated communication times.
    """
    for traceID, data in communication_times.items():
        num_of_pairs = len(data)
        negatives = count_negative_times(data)
        print(f'''
        TraceID: {traceID}
        Number of pairs: {num_of_pairs}
        Number of negative times: {negatives}
        Percentage of negegatives: {(negatives / num_of_pairs) * 100} %
        ''')
        

def get_number_of_percendance(output_of_commo_times):
    '''
    Here count if percendance is in every trace or if it is  
    '''
    count_of_percendence = {}
    number_of_traces=0
    for trace in output_of_commo_times:
        number_of_traces+=1
        for single_percendence in output_of_commo_times[trace]:
            key = (single_percendence["initOperationName"], single_percendence["targetOperationName"])
            
            if key not in count_of_percendence:
                count_of_percendence[key] = [1, [single_percendence['time']]]
            else:
                count_of_percendence[key][0] += 1
                count_of_percendence[key][1].append(single_percendence['time'])

    return count_of_percendence, number_of_traces


def get_statistic_of_traces(comm_time):
    count_of_percendence, number_of_traces = get_number_of_percendance(comm_time)
    statistic_to_graph = {}

    for pair_of_spans in count_of_percendence:

        if count_of_percendence[pair_of_spans][0] > 3:
            times = count_of_percendence[pair_of_spans][1]
            np_array = np.array(times)
            
            if not any(pair_of_spans[0]==value[0] for value in statistic_to_graph.keys()):
                statistic_to_graph[pair_of_spans] = [round(np.mean(np_array),4), round(np.median(np_array),4), round(np.percentile(np_array, 75),4), round(np.percentile(np_array, 95),4)]
            else:
                for i in list(statistic_to_graph.keys()):
                    if i[0] == pair_of_spans[0]:
                        if statistic_to_graph[i][3] > np.percentile(np_array, 95):
                            del statistic_to_graph[i]
                            statistic_to_graph[pair_of_spans] = [round(np.mean(np_array),4), round(np.median(np_array),4), round(np.percentile(np_array, 75),4), round(np.percentile(np_array, 95),4)]
    
    return statistic_to_graph

def find_traces(groups, groupID):
    traces=[]
    for group in groups:
        if str(group['groupID']) == str(groupID):
            #print(group['traces'])
            for trace in group['traces']:
                traces.append(trace['traceID'])
    return traces


def get_edges(data, groups, groupID):
    edges={}
    groups_traces = find_traces(groups, groupID)
    #non_child = find_non_child(traces)
    traces_reformatted = reformat_dict(data, groups_traces)
        
    communication_times = calculate_comm_times(traces_reformatted, False)
        
    graph = get_statistic_of_traces(communication_times)

    graph_list = [(str(pair), stats) for pair, stats in graph.items()]
    links = []
    for item in graph_list:
        source, target = item[0][1:-1].replace("'", "").split(",")
        target = target[1:]
        links.append([source, target, item[1][-1]])
    edges[groupID] = links
    
    return edges