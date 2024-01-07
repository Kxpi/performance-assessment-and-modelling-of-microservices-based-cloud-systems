import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { compose, withState, withProps } from "recompose";
import {
  XYPlot,
  XAxis,
  YAxis,
  CustomSVGSeries,
  Highlight,
  makeWidthFlexible,
  HorizontalGridLines,
  VerticalGridLines,
  makeHeightFlexible,
} from "react-vis";
import "react-vis/dist/style.css";
import * as SVGs from "./SVGs";
import { Dropdown } from "react-bootstrap";

const svgComponents = Object.entries(SVGs)
  .sort(([keyA], [keyB]) => {
    const numA = Number(keyA.replace("Svg", ""));
    const numB = Number(keyB.replace("Svg", ""));
    return numA - numB;
  })
  .map(([, value]) => value);

const myColors = [
  "Aqua",
  "Aquamarine",
  "Black",
  "Blue",
  "BlueViolet",
  "Brown",
  "BurlyWood",
  "CadetBlue",
  "Chartreuse",
  "Chocolate",
  "Coral",
  "CornflowerBlue",
  "Crimson",
  "Cyan",
  "DarkBlue",
  "DarkCyan",
  "DarkGoldenRod",
  "DarkGray",
  "DarkGrey",
  "DarkGreen",
  "DarkKhaki",
  "DarkMagenta",
  "DarkOliveGreen",
  "DarkOrange",
  "DarkOrchid",
  "DarkRed",
  "DarkSalmon",
  "DarkSeaGreen",
  "DarkSlateBlue",
  "DarkSlateGray",
  "DarkSlateGrey",
  "DarkTurquoise",
  "DarkViolet",
  "DeepPink",
  "DeepSkyBlue",
  "DimGray",
  "DimGrey",
  "DodgerBlue",
  "FireBrick",
  "ForestGreen",
  "Fuchsia",
  "Gainsboro",
  "Gold",
  "GoldenRod",
  "Gray",
  "Grey",
  "Green",
  "GreenYellow",
  "HotPink",
  "IndianRed",
  "Indigo",
  "Khaki",
  "Lavender",
  "LawnGreen",
  "LemonChiffon",
  "LightBlue",
  "LightCoral",
  "LightCyan",
  "LightGray",
  "LightGrey",
  "LightGreen",
  "LightPink",
  "LightSalmon",
  "LightSeaGreen",
  "LightSkyBlue",
  "LightSlateGray",
  "LightSlateGrey",
  "LightSteelBlue",
  "Lime",
  "LimeGreen",
  "Linen",
  "Magenta",
  "Maroon",
  "MediumAquaMarine",
  "MediumBlue",
  "MediumOrchid",
  "MediumPurple",
  "MediumSeaGreen",
  "MediumSlateBlue",
  "MediumSpringGreen",
  "MediumTurquoise",
  "MediumVioletRed",
  "MidnightBlue",
  "MistyRose",
  "Moccasin",
  "NavajoWhite",
  "Navy",
  "OldLace",
  "Olive",
  "OliveDrab",
  "Orange",
  "OrangeRed",
  "Orchid",
  "PaleGoldenRod",
  "PaleGreen",
  "PaleTurquoise",
  "PaleVioletRed",
  "PapayaWhip",
  "PeachPuff",
  "Peru",
  "Pink",
  "Plum",
  "PowderBlue",
  "Purple",
  "RebeccaPurple",
  "RosyBrown",
  "RoyalBlue",
  "SaddleBrown",
  "Salmon",
  "SandyBrown",
  "SeaGreen",
  "Sienna",
  "Silver",
  "SkyBlue",
  "SlateBlue",
  "SlateGray",
  "SlateGrey",
  "SpringGreen",
  "SteelBlue",
  "Tan",
  "Teal",
  "Thistle",
  "Tomato",
  "Turquoise",
  "Violet",
  "Wheat",
  "WhiteSmoke",
  "YellowGreen",
];

const FlexibleXYPlot = makeHeightFlexible(makeWidthFlexible(XYPlot));

function formatDuration(duration) {
  // Convert microseconds to milliseconds
  const durationInMilliseconds = duration / 1000;
  return `${durationInMilliseconds} ms`;
}

function useShiftPress() {
  const [isShiftPressed, setIsShiftPressed] = useState(false);

  function onKeyDown({ key }) {
    if (key === "Shift") {
      setIsShiftPressed(true);
    }
  }

  function onKeyUp({ key }) {
    if (key === "Shift") {
      setIsShiftPressed(false);
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  return isShiftPressed;
}

const getRandomSubset = (data, percentage) => {
  if (!data || data.length === 0 || percentage === 0) {
    return [];
  }

  // Calculate count
  const count = Math.max(1, Math.ceil((data.length * percentage) / 100));

  // Create a copy of the data array
  const dataCopy = [...data];

  // Select random spans
  const randomSpans = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * dataCopy.length);
    randomSpans.push(...dataCopy.splice(randomIndex, 1));
  }

  // Assign SVG and color to spans
  let svgIndex = 0;
  let colorIndex = 0;

  const traceColorMap = new Map();

  randomSpans.forEach((span) => {
    const traceID = span.traceID;
    let svg;

    svg = svgComponents[svgIndex];

    svgIndex = (svgIndex + 1) % svgComponents.length;

    span.svg = svg;
    if (traceColorMap.has(traceID) && span.color === null) {
      span.color = traceColorMap.get(traceID);
    } else if (span.color === null) {
      span.color = myColors[colorIndex];
      traceColorMap.set(traceID, myColors[colorIndex]);
      colorIndex = (colorIndex + 1) % myColors.length;
    }
  });

  return randomSpans;
};

function ScatterPlotImpl(props) {
  const {
    data,
    overValue,
    onValueOver,
    onValueOut,
    changedSpanElsewhere,
    selectedSpanScatterPlotChange,
  } = props;

  const [clickedDataPoint, setClickedDataPoint] = useState(null);
  const [percentage, setPercentage] = useState(1);

  const [filteredData, setFilteredData] = useState(null);
  const [lastDrawLocation, setLastDrawLocation] = useState(null);

  const isShiftPressed = useShiftPress();

  // Update filteredData whenever data or percentage changes
  useEffect(() => {
    setClickedDataPoint(null);
    const visibleData = getRandomSubset(data, percentage);
    setFilteredData(visibleData);
    setLastDrawLocation(null);
  }, [data, percentage]);

  return (
    <div>
      <div className="App">
        <div className="TraceResultsScatterPlot">
          <div>Percentage of Spans to Display: {percentage}%</div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Dropdown>
              <Dropdown.Toggle variant="primary" id="dropdown-basic">
                Select Percentage
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setPercentage(1)}>
                  1%
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setPercentage(5)}>
                  5%
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setPercentage(10)}>
                  10%
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setPercentage(25)}>
                  25%
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setPercentage(50)}>
                  50%
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setPercentage(75)}>
                  75%
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setPercentage(100)}>
                  100%
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          {clickedDataPoint && (
            <div className="centered-text">
              Selected Span: {clickedDataPoint.spanID}
            </div>
          )}

          <FlexibleXYPlot
            xType="time"
            xDomain={
              lastDrawLocation && [
                lastDrawLocation.left,
                lastDrawLocation.right,
              ]
            }
            yDomain={
              lastDrawLocation && [
                lastDrawLocation.bottom,
                lastDrawLocation.top,
              ]
            }
            margin={{
              top: 25,
              left: 80,
              right: 60,
            }}
            colorType="literal"
          >
            <HorizontalGridLines />
            <VerticalGridLines />
            <XAxis
              title="Start Time"
              tickTotal={18}
              tickFormat={(t) => formatDuration(t)}
            />
            <YAxis title="Duration" tickFormat={(t) => formatDuration(t)} />
            {filteredData && (
              <CustomSVGSeries
                className="mark-series-fill"
                opacity={0.5}
                customComponent={({ color, svg }) => {
                  const Svg = svg;
                  return (
                    <g transform="translate(-10, -15)">
                      <Svg
                        width={30}
                        height={30}
                        fill={color}
                        onClick={() => {
                          if (overValue) {
                            setClickedDataPoint(overValue);
                            selectedSpanScatterPlotChange(
                              overValue.spanID,
                              overValue.traceID
                            );
                          }
                        }}
                        style={{ cursor: "pointer" }}
                      />
                    </g>
                  );
                }}
                onValueMouseOver={onValueOver}
                onValueMouseOut={onValueOut}
                data={filteredData}
              />
            )}
            {isShiftPressed && ( // render the Highlight component only when the shift key is pressed
              <Highlight
                onBrushEnd={(area) => {
                  setLastDrawLocation(area);
                }}
                onDrag={(area) => {
                  setLastDrawLocation({
                    bottom: lastDrawLocation.bottom + (area.top - area.bottom),
                    left: lastDrawLocation.left - (area.right - area.left),
                    right: lastDrawLocation.right - (area.right - area.left),
                    top: lastDrawLocation.top + (area.top - area.bottom),
                  });
                }}
              />
            )}
          </FlexibleXYPlot>
          {clickedDataPoint && (
            <div>
              <h4 className="scatter-plot-hint">
                Span ID: {clickedDataPoint.spanID}
              </h4>
              <h4 className="scatter-plot-hint">
                Time: {`${clickedDataPoint.x / 1000} ms`}
              </h4>
              <h4 className="scatter-plot-hint">
                Duration: {`${clickedDataPoint.y / 1000} ms`}
              </h4>
              <h4 className="scatter-plot-hint">
                Trace ID: {clickedDataPoint.traceID}
              </h4>
              <h4 className="scatter-plot-hint">
                Service Name: {clickedDataPoint.serviceName}
              </h4>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const valueShape = PropTypes.shape({
  x: PropTypes.number,
  y: PropTypes.number,
  traceID: PropTypes.string,
  //size: PropTypes.number,
  name: PropTypes.string,
});

ScatterPlotImpl.propTypes = {
  data: PropTypes.arrayOf(valueShape).isRequired,
  overValue: valueShape,
  onValueOut: PropTypes.func.isRequired,
  onValueOver: PropTypes.func.isRequired,
};

ScatterPlotImpl.defaultProps = {
  overValue: null,
  // JSDOM does not, as of 2023, have a layout engine, so allow tests to supply a mock width as a workaround.
};

const ScatterPlotOperationsSpans = compose(
  withState("overValue", "setOverValue", null),
  withProps(({ setOverValue }) => ({
    onValueOver: (value) => setOverValue(value),
    onValueOut: () => setOverValue(null),
  }))
)(ScatterPlotImpl);

export { ScatterPlotImpl };

export default ScatterPlotOperationsSpans;
