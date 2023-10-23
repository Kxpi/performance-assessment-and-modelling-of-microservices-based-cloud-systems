# performance-assessment-and-modelling-of-microservices-based-cloud-systems

## Prerequisites

Follow the steps in these [instructions](https://docs.docker.com/desktop/install/windows-install/) to install docker and docker compose.

Using your WSL terminal clone this repo. Enter it's root directory and follow instructions below.

## Download Repository

In the chosen directory, use the command below to clone the git repository.
<!-- markdownlint-disable-next-line MD034 -->
```shell
git clone https://github.com/Kxpi/performance-assessment-and-modelling-of-microservices-based-cloud-systems.git
```

## Switch the branch to init_webapp

```shell
git checkout init_webapp
```

## Rebuild images after changes

```shell
docker compose build --no-cache
```

and re run to start up

```shell
docker compose up
```

## Usage

```shell
docker compose up
```

## Open

Open this link in your web browser.

```url
http://localhost:3000/
```

## Scatter Plot

You can zoom in on the plot by holding down the Shift key and the left mouse button while marking the area. To zoom out, simply hold down the Shift key and click the left or right mouse button.

To view the statistics of the object, right-click its center. The statistics will appear below the plot.

To display group spans, enter the desired percentage and then click the 'Randomize displayed spans' button.
