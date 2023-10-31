import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { compose, withState, withProps } from "recompose";
import _dropWhile from "lodash/dropWhile";
import _round from "lodash/round";
import {
  XYPlot,
  XAxis,
  YAxis,
  CustomSVGSeries,
  Highlight,
  Hint,
  makeWidthFlexible,
  HorizontalGridLines,
  VerticalGridLines,
  makeHeightFlexible,
} from "react-vis";
import "react-vis/dist/style.css";
import * as SVGs from "./SVGs";

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

const ONE_DAY = 25 * 60 * 60 * 1000000; // microseconds in a day
const ONE_HOUR = 60 * 60 * 1000000; // microseconds in an hour
const ONE_MINUTE = 60 * 1000000; // microseconds in a minute
const ONE_SECOND = 1000000; // microseconds in a second
const ONE_MILLISECOND = 1000; // microseconds in a millisecond

const UNIT_STEPS = [
  { unit: "d", microseconds: ONE_DAY, ofPrevious: 24 },
  { unit: "h", microseconds: ONE_HOUR, ofPrevious: 60 },
  { unit: "m", microseconds: ONE_MINUTE, ofPrevious: 60 },
  { unit: "s", microseconds: ONE_SECOND, ofPrevious: 1000 },
  { unit: "ms", microseconds: ONE_MILLISECOND, ofPrevious: 1000 },
  { unit: "μs", microseconds: 1, ofPrevious: 1000 },
];

const FlexibleXYPlot = makeHeightFlexible(makeWidthFlexible(XYPlot));

function formatDuration(duration) {
  // Drop all units that are too large except the last one
  const [primaryUnit, secondaryUnit] = _dropWhile(
    UNIT_STEPS,
    ({ microseconds }, index) =>
      index < UNIT_STEPS.length - 1 && microseconds > duration
  );

  if (primaryUnit.ofPrevious === 1000) {
    // If the unit is decimal based, display as a decimal
    return `${_round(duration / primaryUnit.microseconds, 2)}${
      primaryUnit.unit
    }`;
  }

  const primaryValue = Math.floor(duration / primaryUnit.microseconds);
  const primaryUnitString = `${primaryValue}${primaryUnit.unit}`;
  const secondaryValue = Math.round(
    (duration / secondaryUnit.microseconds) % primaryUnit.ofPrevious
  );
  const secondaryUnitString = `${secondaryValue}${secondaryUnit.unit}`;
  return secondaryValue === 0
    ? primaryUnitString
    : `${primaryUnitString} ${secondaryUnitString}`;
}

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        {children}
        <div>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
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
  const { data, overValue, onValueOver, onValueOut } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clickedDataPoint, setClickedDataPoint] = useState(0);
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
    <div className="TraceResultsScatterPlot">
      <div>Percentage of spans to display:</div>
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
      <button
        onClick={() => {
          const visibleData = getRandomSubset(data, percentage);
          setFilteredData(visibleData);
          setCurrentSpans(visibleData);
          setLastDrawLocation(null);
        }}
      >
        Randomize displayed spans
      </button>
      <button
        onClick={() => {
          setFilteredData(currentSpans);
          setLastDrawLocation(null);
        }}
      >
        Show all current spans
      </button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <button
          onClick={() => {
            setLastDrawLocation(null);
            handleOptionClick("trace");
            setIsModalOpen(false);
          }}
        >
          Show all spans from trace with ID: {clickedDataPoint.traceID}
        </button>
        <button
          onClick={() => {
            setLastDrawLocation(null);
            handleOptionClick("service");
            setIsModalOpen(false);
          }}
        >
          Show all spans from microservice named: {clickedDataPoint.serviceName}
        </button>
      </Modal>
      <FlexibleXYPlot
        xType="time"
        xDomain={
          lastDrawLocation && [lastDrawLocation.left, lastDrawLocation.right]
        }
        yDomain={
          lastDrawLocation && [lastDrawLocation.bottom, lastDrawLocation.top]
        }
        margin={{
          top: 15,
          left: 80,
          right: 60,
        }}
        colorType="literal"
      >
        <HorizontalGridLines />
        <VerticalGridLines />
        <XAxis
          title="Time Counted From The Earliest Span"
          tickTotal={18}
          tickFormat={(t) => formatDuration(t)}
        />
        <YAxis title="Duration" tickFormat={(t) => formatDuration(t)} />
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
                      setIsModalOpen(true);
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
        {overValue && (
          <Hint className="Hints" value={overValue}>
            <h4 className="scatter-plot-hint">Span ID: {overValue.spanID}</h4>
            <h4 className="scatter-plot-hint">
              Operation name: {overValue.name || "<trace-without-root-span>"}
            </h4>
            <h4 className="scatter-plot-hint">
              Time: {`${clickedDataPoint.x} μs`}
            </h4>
            <h4 className="scatter-plot-hint">
              Duration: {formatDuration(overValue.y)}
              {` (${clickedDataPoint.y} μs)`}
            </h4>
            <h4 className="scatter-plot-hint">Trace ID: {overValue.traceID}</h4>
            <h4 className="scatter-plot-hint">
              Service Name: {overValue.serviceName}
            </h4>
          </Hint>
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
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {clickedDataPoint.groupID !== undefined ? (
          <h4 className="scatter-plot-hint">
            Group ID: {clickedDataPoint.groupID}
          </h4>
        ) : null}
        <h4 className="scatter-plot-hint">
          Span ID: {clickedDataPoint.spanID}
        </h4>
        <h4 className="scatter-plot-hint">
          Operation name: {clickedDataPoint.name || "<trace-without-root-span>"}
        </h4>
        <h4 className="scatter-plot-hint">
          Time: {`${clickedDataPoint.x} μs`}
        </h4>
        <h4 className="scatter-plot-hint">
          Duration: {formatDuration(clickedDataPoint.y)}
          {` (${clickedDataPoint.y} μs)`}
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
            {`${clickedDataPoint.operationStats.exec_time_average} μs`}
          </h4>
        ) : null}
        {clickedDataPoint.operationStats !== undefined ? (
          <h4 className="scatter-plot-hint">
            Min Duration For {clickedDataPoint.name}:{" "}
            {`${clickedDataPoint.operationStats.exec_time_min} μs`}
          </h4>
        ) : null}
        {clickedDataPoint.operationStats !== undefined ? (
          <h4 className="scatter-plot-hint">
            First Quartile of Duration For {clickedDataPoint.name}:{" "}
            {`${clickedDataPoint.operationStats.exec_time_q1} μs`}
          </h4>
        ) : null}
        {clickedDataPoint.operationStats !== undefined ? (
          <h4 className="scatter-plot-hint">
            Second Quartile of Duration For {clickedDataPoint.name}:{" "}
            {`${clickedDataPoint.operationStats.exec_time_q2} μs`}
          </h4>
        ) : null}
        {clickedDataPoint.operationStats !== undefined ? (
          <h4 className="scatter-plot-hint">
            Third Quartile of Duration For {clickedDataPoint.name}:{" "}
            {`${clickedDataPoint.operationStats.exec_time_q3} μs`}
          </h4>
        ) : null}
        {clickedDataPoint.operationStats !== undefined ? (
          <h4 className="scatter-plot-hint">
            Max Duration For {clickedDataPoint.name}:{" "}
            {`${clickedDataPoint.operationStats.exec_time_max} μs`}
          </h4>
        ) : null}
        {clickedDataPoint.operationStats !== undefined ? (
          <h4 className="scatter-plot-hint">
            95th Percentile of Duration For {clickedDataPoint.name}:{" "}
            {`${clickedDataPoint.operationStats.exec_time_95_percentile} μs`}
          </h4>
        ) : null}
        {clickedDataPoint.operationStats !== undefined ? (
          <h4 className="scatter-plot-hint">
            99th Percentile of Duration For {clickedDataPoint.name}:{" "}
            {`${clickedDataPoint.operationStats.exec_time_99_percentile} μs`}
          </h4>
        ) : null}
        {clickedDataPoint.operationStats !== undefined ? (
          <h4 className="scatter-plot-hint">
            Standard Deviation of Duration For {clickedDataPoint.name}:{" "}
            {`${clickedDataPoint.operationStats.exec_time_stddev} μs`}
          </h4>
        ) : null}
        {clickedDataPoint.operationStats !== undefined ? (
          <h4 className="scatter-plot-hint">
            Interquartile Range of Duration For {clickedDataPoint.name}:{" "}
            {`${clickedDataPoint.operationStats.exec_time_IQR} μs`}
          </h4>
        ) : null}
        {clickedDataPoint.operationStats !== undefined ? (
          <h4 className="scatter-plot-hint">
            Average Start Time For {clickedDataPoint.name}:{" "}
            {`${clickedDataPoint.operationStats.start_time_average} μs`}
          </h4>
        ) : null}
        {clickedDataPoint.operationStats !== undefined ? (
          <h4 className="scatter-plot-hint">
            Min Start Time For {clickedDataPoint.name}:{" "}
            {`${clickedDataPoint.operationStats.start_time_min} μs`}
          </h4>
        ) : null}
        {clickedDataPoint.operationStats !== undefined ? (
          <h4 className="scatter-plot-hint">
            First Quartile of Start Time For {clickedDataPoint.name}:{" "}
            {`${clickedDataPoint.operationStats.start_time_q1} μs`}
          </h4>
        ) : null}
        {clickedDataPoint.operationStats !== undefined ? (
          <h4 className="scatter-plot-hint">
            Second Quartile of Start Time For {clickedDataPoint.name}:{" "}
            {`${clickedDataPoint.operationStats.start_time_q2} μs`}
          </h4>
        ) : null}
        {clickedDataPoint.operationStats !== undefined ? (
          <h4 className="scatter-plot-hint">
            Third Quartile of Start Time For {clickedDataPoint.name}:{" "}
            {`${clickedDataPoint.operationStats.start_time_q3} μs`}
          </h4>
        ) : null}
        {clickedDataPoint.operationStats !== undefined ? (
          <h4 className="scatter-plot-hint">
            Max Start Time For {clickedDataPoint.name}:{" "}
            {`${clickedDataPoint.operationStats.start_time_max} μs`}
          </h4>
        ) : null}
        {clickedDataPoint.operationStats !== undefined ? (
          <h4 className="scatter-plot-hint">
            95th Percentile of Start Time For {clickedDataPoint.name}:{" "}
            {`${clickedDataPoint.operationStats.start_time_95_percentile} μs`}
          </h4>
        ) : null}
        {clickedDataPoint.operationStats !== undefined ? (
          <h4 className="scatter-plot-hint">
            99th Percentile of Start Time For {clickedDataPoint.name}:{" "}
            {`${clickedDataPoint.operationStats.start_time_99_percentile} μs`}
          </h4>
        ) : null}
        {clickedDataPoint.operationStats !== undefined ? (
          <h4 className="scatter-plot-hint">
            Standard Deviation of Start Time For {clickedDataPoint.name}:{" "}
            {`${clickedDataPoint.operationStats.start_time_stddev} μs`}
          </h4>
        ) : null}
        {clickedDataPoint.operationStats !== undefined ? (
          <h4 className="scatter-plot-hint">
            Interquartile Range of Start Time For {clickedDataPoint.name}:{" "}
            {`${clickedDataPoint.operationStats.start_time_IQR} μs`}
          </h4>
        ) : null}
      </Modal>
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

const ScatterPlot = compose(
  withState("overValue", "setOverValue", null),
  withProps(({ setOverValue }) => ({
    onValueOver: (value) => setOverValue(value),
    onValueOut: () => setOverValue(null),
  }))
)(ScatterPlotImpl);

export { ScatterPlotImpl };

export default ScatterPlot;
