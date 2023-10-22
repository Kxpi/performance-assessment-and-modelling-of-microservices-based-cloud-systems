import json
import numpy as np
import subprocess
import requests
import json
import os

FILE_NAME = "jaeger_output.json"
FILE_PATH = f"/{FILE_NAME}"
NUM_THREADS = "4"
NUM_CONNS = "100"
DURATION = "10s"
REQS_PER_SEC = "1000"
JAEGER_JSON_URL = "http://localhost:16686/api/traces?service=frontend-client"

subprocess.run(["docker-compose", "up", "-d"])
# Compile the wrk2 tool
os.chdir("../wrk2")
subprocess.run(["make"])

# Change back to the socialNetwork directory
os.chdir("../socialNetwork")
subprocess.run(["python3", "scripts/init_social_graph.py", "--graph=socfb-Reed98"])
subprocess.run(
    [
        "../wrk2/wrk",
        "-D",
        "exp",
        "-t",
        NUM_THREADS,
        "-c",
        NUM_CONNS,
        "-d",
        DURATION,
        "-L",
        "-s",
        "./wrk2/scripts/social-network/compose-post.lua",
        "http://localhost:8080/wrk2-api/post/compose",
        "-R",
        REQS_PER_SEC,
    ]
)
subprocess.run(
    [
        "../wrk2/wrk",
        "-D",
        "exp",
        "-t",
        NUM_THREADS,
        "-c",
        NUM_CONNS,
        "-d",
        DURATION,
        "-L",
        "-s",
        "./wrk2/scripts/social-network/read-home-timeline.lua",
        "http://localhost:8080/wrk2-api/home-timeline/read",
        "-R",
        REQS_PER_SEC,
    ]
)
subprocess.run(
    [
        "../wrk2/wrk",
        "-D",
        "exp",
        "-t",
        NUM_THREADS,
        "-c",
        NUM_CONNS,
        "-d",
        DURATION,
        "-L",
        "-s",
        "./wrk2/scripts/social-network/read-user-timeline.lua",
        "http://localhost:8080/wrk2-api/user-timeline/read",
        "-R",
        REQS_PER_SEC,
    ]
)

# Download the Jaeger JSON output
response = requests.get(JAEGER_JSON_URL)
data = response.json()

# Save the JSON data to a file
with open(FILE_NAME, "w") as f:
    json.dump(data, f)


def mi_count(file_list, lambda_val):
    operations_data = {}

    for file_path in file_list:
        with open(file_path, "r") as f:
            data = json.load(f)

        for trace in data["data"]:
            for span in trace["spans"]:
                if span["operationName"] not in operations_data:
                    operations_data[span["operationName"]] = [0, 0]

                operations_data[span["operationName"]][0] += span["duration"]
                operations_data[span["operationName"]][1] += 1

    for operation in operations_data.keys():
        z = operations_data[operation][0] / operations_data[operation][1]
        mu = 1 / (z / 1e6)  # convert duration from microseconds to seconds

        T = 1 / (mu - (1 / lambda_val))
        operations_data[operation] = {"exec_time_average": int(z), "theoretical_T": T}

    with open("MM1QueueAlgorithmResults.json", "w") as f:
        json.dump(operations_data, f, indent=4)


mi_count([FILE_PATH], int(REQS_PER_SEC))
