import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { compose, withState, withProps } from "recompose";

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
import { Dropdown } from "react-bootstrap";

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

function ScatterPlotImpl(props) {
  const {
    data,
    overValue,
    onValueOver,
    onValueOut,
    children,
    selectedGroupNumber,
    showMenu,
  } = props;

  const [clickedDataPoint, setClickedDataPoint] = useState(null);
  const [lastDrawLocation, setLastDrawLocation] = useState(null);
  const [
    isDurationHistogramSingleGroupOperationVisible,
    setIsDurationHistogramSingleGroupOperationVisible,
  ] = useState(false);
  const [
    isStartTimeHistogramSingleGroupOperationVisible,
    setIsStartTimeHistogramSingleGroupOperationVisible,
  ] = useState(false);

  const isShiftPressed = useShiftPress();

  return (
    <div>
      {clickedDataPoint && showMenu && (
        <div
          style={{
            position: "fixed",
            top: 170,
            zIndex: 9998,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Dropdown>
            <Dropdown.Toggle variant="primary" id="dropdown-basic">
              Selection Options
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() => {
                  setClickedDataPoint(null);
                  setIsDurationHistogramSingleGroupOperationVisible(false);
                  setIsStartTimeHistogramSingleGroupOperationVisible(false);
                  props.onGroupOperationCloseClick();
                }}
              >
                Cancel Selection
              </Dropdown.Item>
              <Dropdown.Item
                style={{
                  backgroundColor:
                    isDurationHistogramSingleGroupOperationVisible
                      ? "chartreuse"
                      : "white",
                }}
                onClick={() => {
                  props.onGroupOperationHistogramClick(
                    clickedDataPoint.operationName,
                    "duration"
                  );
                  setIsDurationHistogramSingleGroupOperationVisible(
                    !isDurationHistogramSingleGroupOperationVisible
                  );
                }}
              >
                View {clickedDataPoint.operationName} Operation's Duration
                Histogram
              </Dropdown.Item>
              <Dropdown.Item
                style={{
                  backgroundColor:
                    isStartTimeHistogramSingleGroupOperationVisible
                      ? "chartreuse"
                      : "white",
                }}
                onClick={() => {
                  props.onGroupOperationHistogramClick(
                    clickedDataPoint.operationName,
                    "startTime"
                  );
                  setIsStartTimeHistogramSingleGroupOperationVisible(
                    !isStartTimeHistogramSingleGroupOperationVisible
                  );
                }}
              >
                View {clickedDataPoint.operationName} Operation's Start Time
                Histogram
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      )}

      <div className="App">
        <div className="TraceResultsScatterPlot">
          <div className="centered-text">
            Scatter Plot of Group {selectedGroupNumber}'s Operations
          </div>
          {clickedDataPoint && (
            <div className="centered-text">
              Selected Operation: {clickedDataPoint.operationName}
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
              title="Median Start Time Counted From The Earliest Span"
              tickTotal={18}
              tickFormat={(t) => formatDuration(t)}
            />
            <YAxis
              title="Median Duration"
              tickFormat={(t) => formatDuration(t)}
            />
            {data.map((d, i) => {
              return [
                <HorizontalRectSeries
                  key={`${d.operationName}-box`}
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
                  key={`${d.operationName}-inner-box`}
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
                        setIsDurationHistogramSingleGroupOperationVisible(
                          false
                        );
                        setIsStartTimeHistogramSingleGroupOperationVisible(
                          false
                        );
                        props.onGroupOperationCloseClick();
                      }}
                    />
                  </g>
                );
              }}
              onValueMouseOver={onValueOver}
              onValueMouseOut={onValueOut}
              data={data}
            />
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
          <div style={{ position: "relative" }}>
            {clickedDataPoint && (
              <div>
                <h4 className="scatter-plot-hint">
                  Group ID: {`${clickedDataPoint.groupID}`}
                </h4>
                <h4 className="scatter-plot-hint">
                  Operation Name: {`${clickedDataPoint.operationName}`}
                </h4>
                <h4 className="scatter-plot-hint">
                  Average Duration:{" "}
                  {`${clickedDataPoint.exec_time_average / 1000} ms`}
                </h4>
                <h4 className="scatter-plot-hint">
                  Min Duration: {`${clickedDataPoint.exec_time_min / 1000} ms`}
                </h4>
                <h4 className="scatter-plot-hint">
                  First Quartile of Duration:{" "}
                  {`${clickedDataPoint.exec_time_q1 / 1000} ms`}
                </h4>
                <h4 className="scatter-plot-hint">
                  Second Quartile of Duration:{" "}
                  {`${clickedDataPoint.exec_time_q2 / 1000} ms`}
                </h4>
                <h4 className="scatter-plot-hint">
                  Third Quartile of Duration:{" "}
                  {`${clickedDataPoint.exec_time_q3 / 1000} ms`}
                </h4>
                <h4 className="scatter-plot-hint">
                  Max Duration: {`${clickedDataPoint.exec_time_max / 1000} ms`}
                </h4>
                <h4 className="scatter-plot-hint">
                  95th Percentile of Duration:{" "}
                  {`${clickedDataPoint.exec_time_95_percentile / 1000} ms`}
                </h4>
                <h4 className="scatter-plot-hint">
                  99th Percentile of Duration:{" "}
                  {`${clickedDataPoint.exec_time_99_percentile / 1000} ms`}
                </h4>
                <h4 className="scatter-plot-hint">
                  Standard Deviation of Duration:{" "}
                  {`${clickedDataPoint.exec_time_stddev / 1000} ms`}
                </h4>
                <h4 className="scatter-plot-hint">
                  Interquartile Range of Duration:{" "}
                  {`${clickedDataPoint.exec_time_IQR / 1000} ms`}
                </h4>
                <h4 className="scatter-plot-hint">
                  Average Start Time:{" "}
                  {`${clickedDataPoint.start_time_average / 1000} ms`}
                </h4>
                <h4 className="scatter-plot-hint">
                  Min Start Time:{" "}
                  {`${clickedDataPoint.start_time_min / 1000} ms`}
                </h4>
                <h4 className="scatter-plot-hint">
                  First Quartile of Start Time:{" "}
                  {`${clickedDataPoint.start_time_q1 / 1000} ms`}
                </h4>
                <h4 className="scatter-plot-hint">
                  Second Quartile of Start Time:{" "}
                  {`${clickedDataPoint.start_time_q2 / 1000} ms`}
                </h4>
                <h4 className="scatter-plot-hint">
                  Third Quartile of Start Time:{" "}
                  {`${clickedDataPoint.start_time_q3 / 1000} ms`}
                </h4>
                <h4 className="scatter-plot-hint">
                  Max Start Time:{" "}
                  {`${clickedDataPoint.start_time_max / 1000} ms`}
                </h4>
                <h4 className="scatter-plot-hint">
                  95th Percentile of Start Time:{" "}
                  {`${clickedDataPoint.start_time_95_percentile / 1000} ms`}
                </h4>
                <h4 className="scatter-plot-hint">
                  99th Percentile of Start Time:{" "}
                  {`${clickedDataPoint.start_time_99_percentile / 1000} ms`}
                </h4>
                <h4 className="scatter-plot-hint">
                  Standard Deviation of Start Time:{" "}
                  {`${clickedDataPoint.start_time_stddev / 1000} ms`}
                </h4>
                <h4 className="scatter-plot-hint">
                  Interquartile Range of Start Time:{" "}
                  {`${clickedDataPoint.start_time_IQR / 1000} ms`}
                </h4>
              </div>
            )}
            {children}
          </div>
        </div>
      </div>
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
  children: PropTypes.node,
  selectedGroupNumber: PropTypes.number,
  showMenu: PropTypes.bool,
  onGroupOperationCloseClick: PropTypes.func,
  onGroupOperationHistogramClick: PropTypes.func,
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
