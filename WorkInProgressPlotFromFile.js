import React, { useState, useEffect } from 'react';
import ScatterPlot from './ScatterPlot'; // assuming ScatterPlot is in the same directory

function PlotFromFile() {
    const [data, setData] = useState([]);

    // Function to check if a tag represents an error
    const isErrorTag = ({ key, value }) => key === 'error' && (value === true || value === 'true');

    useEffect(() => {
        fetch('/traces2.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(jsonData => {
                // Make sure jsonData.data is an array
                if (Array.isArray(jsonData.data)) {
                    // Process the fetched data into the correct format
                    const processedData = jsonData.data.map(t => ({
                        x: t.spans[0].startTime,
                        y: t.spans[0].duration,
                        traceID: t.traceID,
                        size: t.spans.length,
                        name: t.spans[0].operationName,
                        color: (Array.isArray(t.spans) && t.spans.some(sp => Array.isArray(sp.tags) && sp.tags.some(isErrorTag))) ? 'red' : '#12939A',
                    }));
                    setData(processedData); // Save processed data to state
                }
            })
            .catch(error => {
                console.log('Error in fetching data: ', error);
            });
    }, []); // Empty dependency array means this effect runs once on mount






    return (
        <div className="PlotFromFile">
            <ScatterPlot data={data} />
        </div>
    );
}

export default PlotFromFile;
