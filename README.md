# performance-assessment-and-modelling-of-microservices-based-cloud-systems

## Prerequisites
Follow steps in this [instruction](https://docs.docker.com/desktop/install/windows-install/) to install docker and docker compose

Using your WSL terminal clone this repo. Enter it's root directory and follow instructions below.

## Usage
```
docker compose up
```

## Rebuild images after changes
```
docker compose build --no-cache
```
and re run to start up
```
docker compose up
```