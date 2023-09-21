# Dictionary

Here are the terms and definitions we agreed to use to be more precise and specific. 

## Traces & spans

- ```Trace``` - complete record of the activities and interactions that occur across various components or services in a distributed system when processing a specific request or transaction.
- ```Span``` -  a smaller unit of measurement within a trace. It represents a single operation or activity within a larger transaction. Spans capture information such as the start and end times of an operation, its duration, and any relevant metadata.
- ```Process``` - when looking through raw data in JSON files from Jaeger, sometimes a field named **processID** can be found - it contains an identifier of a process that emits set of spans within a trace.

![](https://www.aspecto.io/wp-content/uploads/2022/01/Spans-Diagram-edited-1024x682.jpg)

## Infrastructure

- ```Distributed system``` - network of interconnected computers/servers that work together as a single, cohesive system.
- ```Node``` - one single machine in a distributed system.
- ```Microservices architecture``` - an approach to designing and building software applications as a collection of small, independently deployable, and loosely coupled services. In this architecture, a complex application is divided into a set of smaller services, each responsible for a specific piece of functionality. These services communicate with each other over a network, typically using lightweight protocols like HTTP or messaging systems.
- ```Microservice``` - one unit in architecture, responsible usually for a limited set of features like login, processing data, caching. There can be multiple instances of a single microservice (scalability), they are typically spread across different nodes in a distributed system for a better availability.

#### This is an example of a store application in a microservice architecture:
![](https://miro.medium.com/v2/resize:fit:1400/1*2t5rpV2n8n20l2PInhs6ZA.png)

# DeathStarBenchmark

- ```DeathStarBenchmark``` - a tool designed to benchmark efficiency of distributed systems (cloud or on-premise). It's able to deploy an application in a microservice architecture along with some other side-tools like Jeager to collect trace data. We use SocialNetwork app which mimics a Social Media app.
- ```Operations``` - After deploying the application, it's possible to run a benchmark - a set of operations to generate traffic using HTTP requests, to stress the system. Those operations will generate traces and spans which Jaeger will collect. An example of operation performed by benchmark may be login, fetching feed page, viewing/reacting to post etc. In JSON files they are **operationName** fields. These are usually simple HTTP GET/POST/PUT/... requests that call to a microservice responsible for given operation. However, it rarely ends there - usually there are further steps in communication with other microservices - one main operation may cause an insert to DB, save to cache, fetch specific data from other sources, all as a result of one request. In the end it creates a chain of requests/suboperation just because of the one main request. The elements of these chain are spans. The whole chain of events aggregates to one trace.
- ```What operations are performed?``` - there is a whole range of operations that are repeatedly performed accordingly to benchmark input parameters, like number of threads, duration, etc. It's safe to say that same operations, with most likely the same sub-operations will be performed multiple times, which can be useful to calculate statistical data.
- ```What is the result?``` - One operation usually results in a chain of requests to achieve given goal. This creates a **trace** in Jeager, a chain of **spans** which are suboperations/side operations caused by the main request.

# Why is this useful?

In a large multi-node distributed environment, it's very easy to overlook bottlenecks in terms of performance. It would also be extremely hard to catch unexpected chains of events. By utilizing collected data on traces, spans, their duration, order, and a bunch of other data we can visualize the behaviour of different operations, as well as compare them in terms of performance. After all, one trace could be described and presented as a graph, which means, that there are many applications for grapth theory here. We aim to provide additional insight into data collected by Jaeger which hopefully will bring some analytical value.
