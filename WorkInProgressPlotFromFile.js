import React, { useState, useEffect } from 'react';
import ScatterPlot from './ScatterPlot';

function App() {
    const [data, setData] = useState([]);

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
                            color: Array.isArray(span.tags) && span.tags.some(isErrorTag) ? 'red' : '#12939A',
                        }));
                        return [...acc, ...spansData]
                    }, []);
                    setData(processedData);
                    console.log('length of processedData: ', processedData.length);
                }
            })
            .catch(error => console.log('Error in fetching data: ', error));
    }, []); 

    return (
        <div className="App">
            <ScatterPlot data={data} />
        </div>
    );
}

export default App;
