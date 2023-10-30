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
  HorizontalRectSeries,
  Highlight,
  makeWidthFlexible,
  HorizontalGridLines,
  VerticalGridLines,
  makeHeightFlexible,
} from "react-vis";
import "react-vis/dist/style.css";

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

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <button onClick={onClose}>Close</button>
        {children}
      </div>
    </div>
  );
}

function ScatterPlotImpl(props) {
  const { data, overValue, onValueOver, onValueOut } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clickedDataPoint, setClickedDataPoint] = useState(0);
  const [lastDrawLocation, setLastDrawLocation] = useState(null);

  const isShiftPressed = useShiftPress();

  return (
    <div className="TraceResultsScatterPlot">
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
          title="Median Start Time Counted From The Earliest Span"
          tickTotal={18}
          tickFormat={(t) => formatDuration(t)}
        />
        <YAxis title="Median Duration" tickFormat={(t) => formatDuration(t)} />
        {data.map((d, i) => {
          return [
            <HorizontalRectSeries
              key={`${i}-box`}
              stroke={d.color}
              style={{ strokeWidth: 1 }}
              data={[
                {
                  x: d.startTimeQ4,
                  y: d.durationQ0,
                  x0: d.startTimeQ0,
                  y0: d.durationQ4,
                  color: `rgba(128, 128, 0, 0.15)`,
                },
              ]}
            />,
            <HorizontalRectSeries
              key={`${i}-inner-box`}
              stroke={d.color}
              style={{ strokeWidth: 1 }}
              data={[
                {
                  x: d.startTimeQ3,
                  y: d.durationQ1,
                  x0: d.startTimeQ1,
                  y0: d.durationQ3,
                  color: `rgba(255, 99, 71, 0.15)`,
                },
              ]}
            />,
          ];
        })}
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
                    setClickedDataPoint(overValue);
                    setIsModalOpen(true);
                  }}
                />
              </g>
            );
          }}
          onValueMouseOver={onValueOver}
          onValueMouseOut={onValueOut}
          data={data}
        />
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h4 className="scatter-plot-hint">
            Group ID: {`${clickedDataPoint.groupID}`}
          </h4>
          <h4 className="scatter-plot-hint">
            Operation Name: {`${clickedDataPoint.operationName}`}
          </h4>
          <h4 className="scatter-plot-hint">
            Average Duration: {`${clickedDataPoint.exec_time_average} μs`}
          </h4>
          <h4 className="scatter-plot-hint">
            Min Duration: {`${clickedDataPoint.exec_time_min} μs`}
          </h4>
          <h4 className="scatter-plot-hint">
            First Quartile of Duration: {`${clickedDataPoint.exec_time_q1} μs`}
          </h4>
          <h4 className="scatter-plot-hint">
            Second Quartile of Duration: {`${clickedDataPoint.exec_time_q2} μs`}
          </h4>
          <h4 className="scatter-plot-hint">
            Third Quartile of Duration: {`${clickedDataPoint.exec_time_q3} μs`}
          </h4>
          <h4 className="scatter-plot-hint">
            Max Duration: {`${clickedDataPoint.exec_time_max} μs`}
          </h4>
          <h4 className="scatter-plot-hint">
            95th Percentile of Duration:{" "}
            {`${clickedDataPoint.exec_time_95_percentile} μs`}
          </h4>
          <h4 className="scatter-plot-hint">
            99th Percentile of Duration:{" "}
            {`${clickedDataPoint.exec_time_99_percentile} μs`}
          </h4>
          <h4 className="scatter-plot-hint">
            Average Start Time: {`${clickedDataPoint.start_time_average} μs`}
          </h4>
          <h4 className="scatter-plot-hint">
            Min Start Time: {`${clickedDataPoint.start_time_min} μs`}
          </h4>
          <h4 className="scatter-plot-hint">
            First Quartile of Start Time:{" "}
            {`${clickedDataPoint.start_time_q1} μs`}
          </h4>
          <h4 className="scatter-plot-hint">
            Second Quartile of Start Time:{" "}
            {`${clickedDataPoint.start_time_q2} μs`}
          </h4>
          <h4 className="scatter-plot-hint">
            Third Quartile of Start Time:{" "}
            {`${clickedDataPoint.start_time_q3} μs`}
          </h4>
          <h4 className="scatter-plot-hint">
            Max Start Time: {`${clickedDataPoint.start_time_max} μs`}
          </h4>
          <h4 className="scatter-plot-hint">
            95th Percentile of Start Time:{" "}
            {`${clickedDataPoint.start_time_95_percentile} μs`}
          </h4>
          <h4 className="scatter-plot-hint">
            99th Percentile of Start Time:{" "}
            {`${clickedDataPoint.start_time_99_percentile} μs`}
          </h4>
        </Modal>
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
    </div>
  );
}

const valueShape = PropTypes.shape({
  x: PropTypes.number,
  y: PropTypes.number,
  traceID: PropTypes.string,
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

const ScatterPlotGroupsOperations = compose(
  withState("overValue", "setOverValue", null),
  withProps(({ setOverValue }) => ({
    onValueOver: (value) => setOverValue(value),
    onValueOut: () => setOverValue(null),
  }))
)(ScatterPlotImpl);

export { ScatterPlotImpl as ScatterPlotGroupsOperations };

export default ScatterPlotGroupsOperations;
