import React, { useState, useEffect } from "react";
import * as d3 from "d3";
import PropTypes from "prop-types";

function StartTimeHistogramSingleGroup({ data }) {
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
    .value((d) => d.startTime)
    .domain(d3.extent(data, (d) => d.startTime))
    .thresholds(Math.ceil(Math.log2(data.length) + 1))(data);

  // Check max bin length
  const maxBinLength = d3.max(bins, (d) => d.length);
  if (maxBinLength <= 0) {
    console.error("Invalid max bin length:", maxBinLength);
    return null;
  }

  // Create scales
  // Define a scale for the x-axis
  const x = d3.scaleLinear().range([0, width]);

  const y = d3.scaleLog().domain([1, maxBinLength]).range([height, 0]);

  // Create axes
  const xAxis = d3.axisBottom(x);
  const yAxis = d3.axisLeft(y);

  // Function to update the x-axis units
  function updateUnits(data) {
    // Determine the maximum value in the data
    const maxValue = d3.max(data, (d) => d.startTime);

    // Determine the appropriate units based on the maximum value
    let units;
    if (maxValue < 1000) {
      units = "μs"; // microseconds
    } else {
      units = "ms"; // milliseconds
    }

    // Update the scale's domain
    x.domain(d3.extent(data, (d) => d.startTime));

    // Update the x-axis with the appropriate tick format
    xAxis
      .scale(x)
      .tickFormat((d) => `${d / (units === "ms" ? 1000 : 1)} ${units}`);
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
          {bins
            .filter((bin) => bin.length > 0)
            .map((bin, i) => (
              <g key={`${bin.x0}-${bin.x1}`}>
                <rect
                  x={x(bin.x0)}
                  y={y(bin.length)}
                  width={Math.max(0, x(bin.x1) - x(bin.x0) - 1)} // Ensure width is never less than 0
                  height={height - y(bin.length)}
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
            Start time
          </text>
        </g>
      </svg>
    </div>
  );
}

StartTimeHistogramSingleGroup.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      startTime: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default StartTimeHistogramSingleGroup;
