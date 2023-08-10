import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import "./App.css";
import ScatterPlot from './components/ScatterPlot';
import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';

// Create a color scale without red (red is used for errors)
const colorsWithoutRed = schemeCategory10.slice(1);
const colorScale = scaleOrdinal(colorsWithoutRed);
const borderColorScale = scaleOrdinal(schemeCategory10);

function DevApp() {
    const [jaegerEndpoint, setJaegerEndpoint] = useState("");
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [traceID, setTraceID] = useState("");
    const [data, setData] = useState([]);
    const isErrorTag = ({ key, value }) => key === 'error' && (value === true || value === 'true');

    useEffect(() => {
        fetch('/example.json')
            .then(jsonData => {
                // Check if jsonData.data is an array
                if (Array.isArray(jsonData.data)) {
                    // Process the fetched data into the correct format
                    const processedData = jsonData.data.reduce((acc, t) => {
                        const spansData = t.spans.map(span => ({
                            x: span.startTime,
                            y: span.duration,
                            traceID: t.traceID,
                            size: t.spans.length,
                            name: span.operationName,
                            color: Array.isArray(span.tags) && span.tags.some(isErrorTag) ? 'red' : colorScale(t.traceID),
                            borderColor: borderColorScale(t.processes[span.processID].serviceName),
                            serviceName: t.processes[span.processID].serviceName,
                        }));
                        return [...acc, ...spansData]
                    }, []);
                    setData(processedData);
                    console.log('length of processedData: ', processedData.length);
                }
            })
            .catch((error) => {
                console.log(error.response);
            });
    });

    return (
        <div className="App">
            <ScatterPlot data={data} />
        </div>
    );
}

export default DevApp;
