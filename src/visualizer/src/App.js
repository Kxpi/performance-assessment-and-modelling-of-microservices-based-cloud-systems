import React, { useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import "./App.css";
import ScatterPlot from "./components/ScatterPlot";
import { scaleOrdinal } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";
import * as SVGs from "./components/SVGs";

const svgComponents = Object.values(SVGs);

// Create a color scale without red (red is used for errors)
const colorsWithoutRed = schemeCategory10.slice(1);
const colorScale = scaleOrdinal(colorsWithoutRed);

function App() {
  const [jaegerEndpoint, setJaegerEndpoint] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [traceID, setTraceID] = useState("");
  const [data, setData] = useState([]);
  const isErrorTag = ({ key, value }) =>
    key === "error" && (value === true || value === "true");

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios
      .post(
        "http://localhost:5000/visualize",
        {
          jaeger_endpoint: jaegerEndpoint,
          // start_date: startDate.toISOString(),
          // end_date: endDate.toISOString(),
          trace_id: traceID,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        return response.data;
      })
      .then((jsonData) => {
        // Check if jsonData.data is an array
        if (Array.isArray(jsonData.data)) {
          // Process the fetched data into the correct format
          const processedData = jsonData.data.reduce((acc, t) => {
            let svgIndex = 0;
            const serviceSvgMap = new Map();

            const spansData = t.spans.map((span) => {
              const serviceName = t.processes[span.processID].serviceName;
              let svg;

              if (serviceSvgMap.has(serviceName)) {
                svg = serviceSvgMap.get(serviceName);
              } else {
                svg = svgComponents[svgIndex];
                serviceSvgMap.set(serviceName, svg);
                svgIndex = (svgIndex + 1) % svgComponents.length;
              }

              return {
                x: span.startTime,
                y: span.duration,
                spanID: span.spanID,
                traceID: t.traceID,
                size: t.spans.length,
                name: span.operationName,
                color:
                  Array.isArray(span.tags) && span.tags.some(isErrorTag)
                    ? "red"
                    : colorScale(t.traceID),
                serviceName: serviceName,
                svg: svg,
              };
            });
            return [...acc, ...spansData];
          }, []);
          setData(processedData);
        }
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="App">
          <h1>Jaeger Visualizer</h1>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="jaegerEndpoint">Jaeger Endpoint</Label>
              <Input
                type="text"
                id="jaegerEndpoint"
                value={jaegerEndpoint}
                onChange={(e) => setJaegerEndpoint(e.target.value)}
                required
              />
            </FormGroup>
            {/* <FormGroup>
          <Label for="startDate">Start Date</Label>
          <br />
          <DatePicker selected={startDate} onChange={setStartDate} />
        </FormGroup>
        <FormGroup>
          <Label for="endDate">End Date</Label>
          <br />
          <DatePicker selected={endDate} onChange={setEndDate} />
        </FormGroup> */}
            <FormGroup>
              <Label for="traceID">Trace ID</Label>
              <Input
                type="text"
                id="traceID"
                value={traceID}
                onChange={(e) => setTraceID(e.target.value)}
              />
            </FormGroup>
            <Button color="primary" type="submit">
              Visualize
            </Button>
          </Form>
        </div>
      </header>
      <ScatterPlot data={data} />
    </div>
  );
}

export default App;
