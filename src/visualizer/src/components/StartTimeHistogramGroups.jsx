import React, { useState, useEffect } from "react";
import * as d3 from "d3";
import PropTypes from "prop-types";

function StartTimeHistogramGroups({ data }) {
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
  data.sort((a, b) => b.y - a.y);

  // Create scales
  const x = d3
    .scaleBand()
    .domain(data.map((_, i) => i)) // use index as domain
    .range([0, width])
    .padding(0.1);
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.x)]) // Use d.x for y scale
    .range([height, 0]);

  // Create axes
  const xAxis = d3.axisBottom(x).tickFormat((i) => data[i].groupID);
  const yAxis = d3.axisLeft(y);

  // Function to update the y-axis units
  function updateUnits(data) {
    // Determine the maximum value in the data
    const maxValue = d3.max(data, (d) => d.x);

    // Determine the appropriate units based on the maximum value
    let units;
    if (maxValue < 1000) {
      units = "μs"; // microseconds
    } else if (maxValue < 1000000) {
      units = "ms"; // milliseconds
    } else {
      units = "s"; // seconds
    }

    // Update the y-axis with the appropriate tick format
    yAxis
      .scale(y)
      .tickFormat(
        (d) =>
          `${
            d / (units === "s" ? 1000000 : units === "ms" ? 1000 : 1)
          } ${units}`
      );
  }

  // Call updateUnits with your data
  updateUnits(data);

  // Render the histogram
  return (
    <svg
      viewBox={`0 0 ${width + margin.left + margin.right} ${
        height + margin.top + margin.bottom
      }`}
      style={{ width: "100%", height: "auto" }}
    >
      <g transform={`translate(${margin.left},${margin.top})`}>
        {data.map((d, i) => (
          <rect
            key={i}
            x={x(i)}
            y={y(d.x)} // Use d.x for y value
            width={x.bandwidth()}
            height={height - y(d.x)} // Use d.x for height
            fill={d.color}
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
          Median Start Time
        </text>
        <text
          x={width / 2}
          y={height + margin.bottom / 2}
          style={{ textAnchor: "middle" }}
        >
          Group ID
        </text>
      </g>
    </svg>
  );
}

StartTimeHistogramGroups.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default StartTimeHistogramGroups;
