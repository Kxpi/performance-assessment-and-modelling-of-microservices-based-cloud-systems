import json
import numpy as np
import subprocess
import requests
import json
import os

FILE_NAME = "jaeger_output.json"
NUM_THREADS = "4"
NUM_CONNS = "5"
DURATION = "3s"
REQS_PER_SEC = "1"
REQS_PER_SEC_TEST_ARRAY = ["1000", "2000", "3000", "4000", "5000", "6000"]
DURATION_LIMIT = 0.3
JAEGER_JSON_URL = (
    "http://localhost:16686/api/traces?service=social-graph-service&prettyPrint=true"
)

"""
def ensure_docker_running():
    try:
        subprocess.check_output(["docker", "info"])
        return True
    except subprocess.CalledProcessError:
        print("Docker is not running. Starting Docker...")
        subprocess.run(["sudo", "systemctl", "start", "docker"])
        return False
"""

user_input = ""
while user_input not in ["y", "n"] or user_input == "":
    user_input = input(
        "Have you already meet the requirements (by installing additional libraries, initializing the social graph and registering the users? (y/n): "
    )
    if user_input == "n":
        subprocess.run(["sudo", "apt-get", "update"])
        subprocess.run(["sudo", "apt-get", "upgrade", "-y"])
        subprocess.run(["pip3", "install", "asyncio", "aiohttp"])
        subprocess.run(["sudo", "apt-get", "install", "libssl-dev", "-y"])
        subprocess.run(["sudo", "apt-get", "install", "libz-dev", "-y"])
        subprocess.run(["sudo", "apt-get", "install", "luarocks", "-y"])
        subprocess.run(["sudo", "luarocks", "install", "luasocket"])
        subprocess.run(["docker-compose", "up", "-d"])
        subprocess.run(
            ["python3", "scripts/init_social_graph.py", "--graph=socfb-Reed98"]
        )
        # Compile the wrk2 tool
        os.chdir("../wrk2")
        subprocess.run(["make"])

        # Change back to the socialNetwork directory
        os.chdir("../socialNetwork")
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
with open(REQS_PER_SEC + FILE_NAME, "w") as f:
    json.dump(data, f)


def mi_count(file_list, reqs_per_sec, reqs_per_sec_test_array):
    operations_data = {}
    operations_data["model"] = {}

    for file_path in file_list:
        with open(file_path, "r") as f:
            data = json.load(f)

        for trace in data["data"]:
            for span in trace["spans"]:
                if span["operationName"] not in operations_data["model"]:
                    operations_data["model"][span["operationName"]] = [0, 0]

                operations_data["model"][span["operationName"]][0] += span["duration"]
                operations_data["model"][span["operationName"]][1] += 1

    for operation in operations_data["model"].keys():
        z = (
            operations_data["model"][operation][0]
            / operations_data["model"][operation][1]
        )
        mu = 1 / (z / 1e6)  # convert duration from microseconds to seconds

        T = 1 / (mu - (1 / reqs_per_sec))
        operations_data["model"][operation] = {
            "exec_time_average": int(z),
            "theoretical_T": T,
        }

    for reqs_per_sec_test in reqs_per_sec_test_array:
        operations_data[reqs_per_sec_test] = {}
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
                reqs_per_sec_test,
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
                reqs_per_sec_test,
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
                reqs_per_sec_test,
            ]
        )

        # Download the Jaeger JSON output
        response = requests.get(JAEGER_JSON_URL)
        data = response.json()

        # Save the JSON data to a file
        with open(reqs_per_sec_test + FILE_NAME, "w") as f:
            json.dump(data, f)

        with open(reqs_per_sec_test + FILE_NAME, "r") as f:
            data = json.load(f)

        for trace in data["data"]:
            for span in trace["spans"]:
                if span["operationName"] not in operations_data[reqs_per_sec_test]:
                    operations_data[reqs_per_sec_test][span["operationName"]] = [0, 0]

                operations_data[reqs_per_sec_test][span["operationName"]][0] += span[
                    "duration"
                ]
                operations_data[reqs_per_sec_test][span["operationName"]][1] += 1

        for operation in operations_data[reqs_per_sec_test].keys():
            if operation != "model" or operation != reqs_per_sec_test:
                z = (
                    operations_data[reqs_per_sec_test][operation][0]
                    / operations_data[reqs_per_sec_test][operation][1]
                )
                mu = 1 / (z / 1e6)  # convert duration from microseconds to seconds

                t = 1 / (mu - (1 / reqs_per_sec))
                operations_data[reqs_per_sec_test][operation] = {
                    "exec_time_average": int(z),
                    "theoretical_T": T,
                    "Duration warning": True
                    if abs(T - t) > T * DURATION_LIMIT
                    else False,
                }

    with open("MM1QueueAlgorithmResults.json", "w") as f:
        json.dump(operations_data, f, indent=4)


# was_docker_running = ensure_docker_running()
mi_count([REQS_PER_SEC + FILE_NAME], int(REQS_PER_SEC), REQS_PER_SEC_TEST_ARRAY)
"""if not ensure_docker_running:
    print("Docker was not initially running. Stopping Docker...")
    subprocess.run(["sudo", "systemctl", "stop", "docker"])
"""
