import React, { useState, useEffect } from "react";
import * as d3 from "d3";
import PropTypes from "prop-types";

function StartTimeHistogramGroupsOperations({ data, setSelectedOperation }) {
  // Define dimensions
  const margin = { top: 30, right: 30, bottom: 80, left: 100 };
  const [width, setWidth] = useState(
    window.innerWidth - margin.left - margin.right
  );
  const [height, setHeight] = useState(
    window.innerHeight - margin.top - margin.bottom
  );

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth - margin.left - margin.right);
      setHeight(window.innerHeight - margin.top - margin.bottom);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [margin.left, margin.right, margin.top, margin.bottom]);

  // sort data from highest to lowest
  data.sort((a, b) => b.startTime99Percentile - a.startTime99Percentile);

  // Create scales
  const x = d3
    .scaleBand()
    .domain(data.map((_, i) => i)) // use index as domain
    .range([0, width])
    .padding(0.1);
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.startTime99Percentile)]) // Use d.startTime99Percentile for y scale
    .range([height, 0]);

  // Create axes
  const xAxis = d3.axisBottom(x).tickFormat((i) => data[i].operationName);
  const yAxis = d3.axisLeft(y);

  // Function to update the y-axis units
  function updateUnits(data) {
    // Always use milliseconds as the unit
    const units = "ms"; // milliseconds

    // Update the y-axis with the appropriate tick format
    yAxis.scale(y).tickFormat((d) => `${d / 1000} ${units}`);
  }

  // Call updateUnits with your data
  updateUnits(data);

  // Render the histogram
  return (
    <div className="App">
      <svg
        viewBox={`0 0 ${width + margin.left + margin.right} ${
          height + margin.top + margin.bottom
        }`}
        style={{ width: "auto", height: "auto" }}
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          {data.map((d, i) => (
            <rect
              onClick={() => setSelectedOperation(d.operationName)}
              key={d.operationName}
              x={x(i)}
              y={y(d.startTime99Percentile)} // Use d.startTime99Percentile for y value
              width={x.bandwidth()}
              height={height - y(d.startTime99Percentile)} // Use d.startTime99Percentile for height
              fill={d.color}
              style={{ cursor: "pointer" }}
            />
          ))}
          <g
            ref={(node) => d3.select(node).call(xAxis)}
            style={{ transform: `translateY(${height}px)` }}
            className="axis"
          />
          <g ref={(node) => d3.select(node).call(yAxis)} className="axis" />
          <text
            transform="rotate(-90)"
            y={0 - margin.left}
            x={0 - height / 2}
            dy="1em"
            style={{ textAnchor: "middle" }}
          >
            99th percentile of start time
          </text>
          <text
            x={width / 2}
            y={height + margin.bottom / 2}
            style={{ textAnchor: "middle" }}
          >
            Operation name
          </text>
        </g>
      </svg>
    </div>
  );
}

StartTimeHistogramGroupsOperations.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      startTime99Percentile: PropTypes.number.isRequired,
      operationName: PropTypes.string.isRequired, // Add this line
    })
  ).isRequired,
};

export default StartTimeHistogramGroupsOperations;
