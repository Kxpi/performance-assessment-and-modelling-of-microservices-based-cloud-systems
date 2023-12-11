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

  // Group spans by trace ID
  const traces = data.reduce((acc, span) => {
    if (!acc[span.traceID]) {
      acc[span.traceID] = [];
    }
    acc[span.traceID].push(span);
    return acc;
  }, {});

  // Convert traces object to array and calculate count
  const tracesArray = Object.values(traces);
  const count = Math.max(1, Math.ceil((tracesArray.length * percentage) / 100));

  // Select random traces
  const randomTraces = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * tracesArray.length);
    randomTraces.push(...tracesArray.splice(randomIndex, 1));
  }

  // Flatten array of traces to array of spans
  const randomSpans = randomTraces.flat();

  // Assign SVG and color to spans
  let svgIndex = 0;
  let colorIndex = 0;
  const serviceSvgMap = new Map();
  const traceColorMap = new Map();

  randomSpans.forEach((span) => {
    const serviceName = span.serviceName;
    const traceID = span.traceID;
    let svg;

    if (serviceSvgMap.has(serviceName)) {
      svg = serviceSvgMap.get(serviceName);
    } else {
      svg = svgComponents[svgIndex];
      serviceSvgMap.set(serviceName, svg);
      svgIndex = (svgIndex + 1) % svgComponents.length;
    }

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
    selectedGroupNumber,
    showMenu,
  } = props;

  const [clickedDataPoint, setClickedDataPoint] = useState(null);
  const [percentage, setPercentage] = useState(0.001);

  const [filteredData, setFilteredData] = useState(null);
  const [lastDrawLocation, setLastDrawLocation] = useState(null);
  const [currentSpans, setCurrentSpans] = useState(filteredData);

  const isShiftPressed = useShiftPress();

  const handlePercentageChange = (event) => {
    const newPercentage = Number(event.target.value);
    if (newPercentage >= 0.001 && newPercentage <= 100) {
      setPercentage(newPercentage);
    }
  };

  const handleOptionClick = (filterBy) => {
    let newData;
    if (filterBy === "trace") {
      newData = currentSpans.filter(
        (d) => d.traceID === clickedDataPoint.traceID
      );
    } else if (filterBy === "service") {
      newData = currentSpans.filter(
        (d) => d.serviceName === clickedDataPoint.serviceName
      );
    }
    setCurrentSpans(filteredData);
    setFilteredData(newData);
  };

  return (
    <div>
      {showMenu && (
        <div
          style={{
            position: "fixed",
            top: 115,
            zIndex: 9998,
          }}
        >
          <Dropdown>
            <Dropdown.Toggle variant="primary" id="dropdown-basic">
              Scatter Plot Options
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() => {
                  setClickedDataPoint(null);
                  const visibleData = getRandomSubset(data, percentage);
                  setFilteredData(visibleData);
                  setCurrentSpans(visibleData);
                  setLastDrawLocation(null);
                }}
              >
                Draw Other Spans to Be Displayed
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  setFilteredData(currentSpans);
                  setLastDrawLocation(null);
                }}
              >
                Show All Currently Drawn Spans
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          {clickedDataPoint && (
            <div>
              <Dropdown>
                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                  Selection Options
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setClickedDataPoint(null)}>
                    Cancel Selection
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      setLastDrawLocation(null);
                      handleOptionClick("trace");
                      setClickedDataPoint(null);
                    }}
                  >
                    Show All Spans from Trace With ID:{" "}
                    {clickedDataPoint.traceID}
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      setLastDrawLocation(null);
                      handleOptionClick("service");
                      setClickedDataPoint(null);
                    }}
                  >
                    Show All Spans from Microservice Named:{" "}
                    {clickedDataPoint.serviceName}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          )}
        </div>
      )}
      <div className="App">
        <div className="TraceResultsScatterPlot">
          <div className="centered-text">
            Scatter Plot of Group {selectedGroupNumber}'s Spans
          </div>
          <div>Percentage of Spans to Display:</div>
          <div>{percentage}%</div>
          <div>
            <input
              type="number"
              min="0.001"
              max="100"
              value={percentage}
              onChange={handlePercentageChange}
            />
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
                          if (filteredData === currentSpans) {
                            setClickedDataPoint(overValue);
                          }
                        }}
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
              {clickedDataPoint.groupID !== undefined ? (
                <h4 className="scatter-plot-hint">
                  Group ID: {clickedDataPoint.groupID}
                </h4>
              ) : null}
              <h4 className="scatter-plot-hint">
                Span ID: {clickedDataPoint.spanID}
              </h4>
              <h4 className="scatter-plot-hint">
                Operation name:{" "}
                {clickedDataPoint.name || "<trace-without-root-span>"}
              </h4>
              <h4 className="scatter-plot-hint">
                Time: {`${clickedDataPoint.x / 1000} ms`}
              </h4>
              <h4 className="scatter-plot-hint">
                Duration:
                {`${clickedDataPoint.y / 1000} ms`}
              </h4>
              <h4 className="scatter-plot-hint">
                Trace ID: {clickedDataPoint.traceID}
              </h4>
              <h4 className="scatter-plot-hint">
                Service Name: {clickedDataPoint.serviceName}
              </h4>
              {clickedDataPoint.operationStats !== undefined ? (
                <h4 className="scatter-plot-hint">
                  Average Duration For {clickedDataPoint.name}:{" "}
                  {`${
                    clickedDataPoint.operationStats.exec_time_average / 1000
                  } ms`}
                </h4>
              ) : null}
              {clickedDataPoint.operationStats !== undefined ? (
                <h4 className="scatter-plot-hint">
                  Min Duration For {clickedDataPoint.name}:{" "}
                  {`${clickedDataPoint.operationStats.exec_time_min / 1000} ms`}
                </h4>
              ) : null}
              {clickedDataPoint.operationStats !== undefined ? (
                <h4 className="scatter-plot-hint">
                  First Quartile of Duration For {clickedDataPoint.name}:{" "}
                  {`${clickedDataPoint.operationStats.exec_time_q1 / 1000} ms`}
                </h4>
              ) : null}
              {clickedDataPoint.operationStats !== undefined ? (
                <h4 className="scatter-plot-hint">
                  Second Quartile of Duration For {clickedDataPoint.name}:{" "}
                  {`${clickedDataPoint.operationStats.exec_time_q2 / 1000} ms`}
                </h4>
              ) : null}
              {clickedDataPoint.operationStats !== undefined ? (
                <h4 className="scatter-plot-hint">
                  Third Quartile of Duration For {clickedDataPoint.name}:{" "}
                  {`${clickedDataPoint.operationStats.exec_time_q3 / 1000} ms`}
                </h4>
              ) : null}
              {clickedDataPoint.operationStats !== undefined ? (
                <h4 className="scatter-plot-hint">
                  Max Duration For {clickedDataPoint.name}:{" "}
                  {`${clickedDataPoint.operationStats.exec_time_max / 1000} ms`}
                </h4>
              ) : null}
              {clickedDataPoint.operationStats !== undefined ? (
                <h4 className="scatter-plot-hint">
                  95th Percentile of Duration For {clickedDataPoint.name}:{" "}
                  {`${
                    clickedDataPoint.operationStats.exec_time_95_percentile /
                    1000
                  } ms`}
                </h4>
              ) : null}
              {clickedDataPoint.operationStats !== undefined ? (
                <h4 className="scatter-plot-hint">
                  99th Percentile of Duration For {clickedDataPoint.name}:{" "}
                  {`${
                    clickedDataPoint.operationStats.exec_time_99_percentile /
                    1000
                  } ms`}
                </h4>
              ) : null}
              {clickedDataPoint.operationStats !== undefined ? (
                <h4 className="scatter-plot-hint">
                  Standard Deviation of Duration For {clickedDataPoint.name}:{" "}
                  {`${
                    clickedDataPoint.operationStats.exec_time_stddev / 1000
                  } ms`}
                </h4>
              ) : null}
              {clickedDataPoint.operationStats !== undefined ? (
                <h4 className="scatter-plot-hint">
                  Interquartile Range of Duration For {clickedDataPoint.name}:{" "}
                  {`${clickedDataPoint.operationStats.exec_time_IQR / 1000} ms`}
                </h4>
              ) : null}
              {clickedDataPoint.operationStats !== undefined ? (
                <h4 className="scatter-plot-hint">
                  Average Start Time For {clickedDataPoint.name}:{" "}
                  {`${
                    clickedDataPoint.operationStats.start_time_average / 1000
                  } ms`}
                </h4>
              ) : null}
              {clickedDataPoint.operationStats !== undefined ? (
                <h4 className="scatter-plot-hint">
                  Min Start Time For {clickedDataPoint.name}:{" "}
                  {`${
                    clickedDataPoint.operationStats.start_time_min / 1000
                  } ms`}
                </h4>
              ) : null}
              {clickedDataPoint.operationStats !== undefined ? (
                <h4 className="scatter-plot-hint">
                  First Quartile of Start Time For {clickedDataPoint.name}:{" "}
                  {`${clickedDataPoint.operationStats.start_time_q1 / 1000} ms`}
                </h4>
              ) : null}
              {clickedDataPoint.operationStats !== undefined ? (
                <h4 className="scatter-plot-hint">
                  Second Quartile of Start Time For {clickedDataPoint.name}:{" "}
                  {`${clickedDataPoint.operationStats.start_time_q2 / 1000} ms`}
                </h4>
              ) : null}
              {clickedDataPoint.operationStats !== undefined ? (
                <h4 className="scatter-plot-hint">
                  Third Quartile of Start Time For {clickedDataPoint.name}:{" "}
                  {`${clickedDataPoint.operationStats.start_time_q3 / 1000} ms`}
                </h4>
              ) : null}
              {clickedDataPoint.operationStats !== undefined ? (
                <h4 className="scatter-plot-hint">
                  Max Start Time For {clickedDataPoint.name}:{" "}
                  {`${
                    clickedDataPoint.operationStats.start_time_max / 1000
                  } ms`}
                </h4>
              ) : null}
              {clickedDataPoint.operationStats !== undefined ? (
                <h4 className="scatter-plot-hint">
                  95th Percentile of Start Time For {clickedDataPoint.name}:{" "}
                  {`${
                    clickedDataPoint.operationStats.start_time_95_percentile /
                    1000
                  } ms`}
                </h4>
              ) : null}
              {clickedDataPoint.operationStats !== undefined ? (
                <h4 className="scatter-plot-hint">
                  99th Percentile of Start Time For {clickedDataPoint.name}:{" "}
                  {`${
                    clickedDataPoint.operationStats.start_time_99_percentile /
                    1000
                  } ms`}
                </h4>
              ) : null}
              {clickedDataPoint.operationStats !== undefined ? (
                <h4 className="scatter-plot-hint">
                  Standard Deviation of Start Time For {clickedDataPoint.name}:{" "}
                  {`${
                    clickedDataPoint.operationStats.start_time_stddev / 1000
                  } ms`}
                </h4>
              ) : null}
              {clickedDataPoint.operationStats !== undefined ? (
                <h4 className="scatter-plot-hint">
                  Interquartile Range of Start Time For {clickedDataPoint.name}:{" "}
                  {`${
                    clickedDataPoint.operationStats.start_time_IQR / 1000
                  } ms`}
                </h4>
              ) : null}
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
  selectedGroupNumber: PropTypes.number.isRequired,
  showMenu: PropTypes.bool.isRequired, // Add this line
};

ScatterPlotImpl.defaultProps = {
  overValue: null,
  // JSDOM does not, as of 2023, have a layout engine, so allow tests to supply a mock width as a workaround.
};

const ScatterPlot = compose(
  withState("overValue", "setOverValue", null),
  withProps(({ setOverValue }) => ({
    onValueOver: (value) => setOverValue(value),
    onValueOut: () => setOverValue(null),
  }))
)(ScatterPlotImpl);

export { ScatterPlotImpl };

export default ScatterPlot;
