# performance-assessment-and-modelling-of-microservices-based-cloud-systems

## Prerequisites

Follow the steps in these [instructions](https://docs.docker.com/desktop/install/windows-install/) to install docker and docker compose.

## Download Repository

In the chosen directory, use the command below to clone the git repository.
<!-- markdownlint-disable-next-line MD034 -->
```shell
git clone https://github.com/Kxpi/performance-assessment-and-modelling-of-microservices-based-cloud-systems.git
```

## Switch the branch to init_webapp

In the repository's directory, use the command below to change the branch to the init_webapp.

```shell
git checkout init_webapp
```

## Running the app

Start the Docker Engine by running Docker Desktop application.

If you've made changes or are running the app for the first time, you'll need to rebuild the images. Use the following command to do this:

```shell
docker compose build --no-cache
```

Run to start up:

```shell
docker compose up
```

## Open

Open this link in your web browser.

```url
http://localhost:3000/
```

## Scatter Plot

There are 3 types of views: the main one is the Groups View, the second one is the Group's Operation View and the third one is the Group's Spans View.

In Group's Spans View the spans with the same colour are from the same trace and the spans with the same number are from the same microservice.

You can zoom in on the plot by holding down the Shift key and the left mouse button while marking the area. To zoom out, simply hold down the Shift key and click the left or right mouse button.

To view the statistics of the object, right-click its center. The statistics will appear below the plot.

To display group spans, enter the desired percentage and then click the 'Randomize displayed spans' button.

There are 3 types of boxes:
![Yellow](image-4.png) The one with that color indicates dispersion of the data from the average value.
![Green](image-1.png) The one with that color indicates 99th percentile of the data.
![Brown](image-2.png) The one with that color indicates 95th percentile of the data.

## Exiting the program

To stop the program, send the SIGINT (Signal Interrupt) command, which is [ctrl+c], to the process running 'docker compose up'.
