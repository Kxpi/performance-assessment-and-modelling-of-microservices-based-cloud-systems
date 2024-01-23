import React, { useState, useEffect } from "react";
import * as d3 from "d3";
import PropTypes from "prop-types";

function DurationHistogramSingleGroup({ data }) {
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

  // Create bins
  const bins = d3
    .bin()
    .value((d) => d.duration)
    .domain(d3.extent(data, (d) => d.duration))
    .thresholds(Math.ceil(Math.log2(data.length) + 1))(data);

  // Create scales
  // Define a scale for the x-axis
  const x = d3.scaleLinear().range([0, width]);

  const y = d3
    .scaleLog()
    .domain([1, d3.max(bins, (d) => d.length)])
    .range([height, 0]);

  // Create axes
  const xAxis = d3.axisBottom(x);
  const yAxis = d3.axisLeft(y);

  // Function to update the x-axis units
  function updateUnits(data) {
    // Always use milliseconds as the unit for the x-axis
    const units = "ms"; // milliseconds

    x.domain(d3.extent(data, (d) => d.duration));

    // Update the x-axis with the appropriate tick format
    xAxis.scale(x).tickFormat((d) => `${d / 1000} ${units}`);
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
          {bins.map((bin, i) => (
            <g key={`${bin.x0}-${bin.x1}`}>
              <rect
                x={x(bin.x0)}
                y={y(bin.length + 0.1)}
                width={x(bin.x1) - x(bin.x0) - 1}
                height={Math.max(0, height - y(bin.length + 0.1))}
                fill="steelblue"
                stroke="white"
                strokeWidth="1"
              />
            </g>
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
            style={{ textAnchor: "middle", fontSize: "1rem" }}
          >
            Count (logarithmic scale)
          </text>
          <text
            x={width / 2}
            y={height + margin.bottom / 2}
            style={{ textAnchor: "middle", fontSize: "1rem" }}
          >
            Duration
          </text>
        </g>
      </svg>
    </div>
  );
}

DurationHistogramSingleGroup.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      duration: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default DurationHistogramSingleGroup;
