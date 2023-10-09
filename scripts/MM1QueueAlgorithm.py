import json
import numpy as np

file_path = 'visualization\public\\fourtyK.json'
lambda_val = 40000


def mi_count(file_list, lambda_val):
    operations_data = {}

    for file_path in file_list:
        with open(file_path, 'r') as f:
            data = json.load(f)

        for trace in data['data']:
            for span in trace['spans']:
                if span["operationName"] not in operations_data:
                    operations_data[span["operationName"]] = [0, 0]

                operations_data[span["operationName"]][0] += span["duration"]
                operations_data[span["operationName"]][1] += 1

    for operation in operations_data.keys():
        z = operations_data[operation][0]/operations_data[operation][1]
        mu = 1/(z/1e6)  # convert duration from microseconds to seconds
        if mu > lambda_val:
            T = 1/(mu - (1/lambda_val))
        else:
            T = 'System is not stable.'
        operations_data[operation] = {
            'exec_time_average': int(z), 'theoretical_T': T}

    with open('MM1QueueAlgorithmResults.json', 'w') as f:
        json.dump(operations_data, f, indent=4)


mi_count([file_path], lambda_val)
