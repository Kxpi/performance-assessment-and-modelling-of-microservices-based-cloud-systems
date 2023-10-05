import json
import numpy as np


file_path = 'jaeger-traces.json'


def mi_count(file_list):

    for file_path in file_list:
        with open(file_path, 'r') as f:
            data = json.load(f)

        operations_data = {}

        for trace in data['data']:

            for span in trace['spans']:

                if span["operationName"] not in operations_data:
                    operations_data[span["operationName"]] = [0, 0]

                operations_data[span["operationName"]][0] += span["duration"]
                operations_data[span["operationName"]][1] += 1

    for operation in operations_data.keys():
        operations_data[operation] = {'exec_time_average': int(
            operations_data[operation][0]/operations_data[operation][1])}

    with open('operation_name_avg_dur', 'w') as f:
        json.dump(operations_data, f, indent=4)


mi_count([file_path])
