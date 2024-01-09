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

const FlexibleXYPlot = makeHeightFlexible(makeWidthFlexible(XYPlot));

function Legend({ data }) {
  return (
    <div className="legend">
      {data.map((d, index) => (
        <div key={index} className="legend-item">
          <span
            className="legend-color"
            style={{ backgroundColor: d.color }}
          ></span>
          <span className="legend-text">{d.groupID}</span>
        </div>
      ))}
    </div>
  );
}

Legend.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      color: PropTypes.string.isRequired,
      operationName: PropTypes.string.isRequired,
    })
  ).isRequired,
};

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

function ScatterPlotGroupsImpl(props) {
  const { data, overValue, onValueOver, onValueOut, setSelectedGroup } = props;

  const [lastDrawLocation, setLastDrawLocation] = useState(null);

  const isShiftPressed = useShiftPress();

  return (
    <div>
      <div className="App">
        <div className="TraceResultsScatterPlot">
          <Legend data={data} />
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

            {data.map((d, i) => {
              return [
                <HorizontalRectSeries
                  key={`${d.groupID}-box`}
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
                  key={`${d.groupID}-inner-box`}
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
                      style={{ pointerEvents: "all", cursor: "pointer" }}
                      onClick={() => {
                        if (overValue) {
                          setSelectedGroup(overValue.groupID);
                        }
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

ScatterPlotGroupsImpl.propTypes = {
  data: PropTypes.arrayOf(valueShape).isRequired,
  overValue: valueShape,
  onValueOver: PropTypes.func.isRequired,
  onValueOut: PropTypes.func.isRequired,
  showMenu: PropTypes.bool,
  onGroupOperationsClick: PropTypes.func,
  onGroupSpansClick: PropTypes.func,
};

ScatterPlotGroupsImpl.defaultProps = {
  overValue: null,
  // JSDOM does not, as of 2023, have a layout engine, so allow tests to supply a mock width as a workaround.
};

const ScatterPlotGroups = compose(
  withState("overValue", "setOverValue", null),
  withProps(({ setOverValue }) => ({
    onValueOver: (value) => setOverValue(value),
    onValueOut: () => setOverValue(null),
  }))
)(ScatterPlotGroupsImpl);

export { ScatterPlotGroupsImpl };

export default ScatterPlotGroups;
