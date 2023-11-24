import React, { useState, useEffect } from "react";
import ScatterPlotGroups from "./components/ScatterPlotGroups";
import * as SVGs from "./components/SVGs";
import ScatterPlotGroupsOperations from "./components/ScatterPlotGroupsOperations";
import ScatterPlot from "./components/ScatterPlot";
import DurationHistogramGroups from "./components/DurationHistogramGroups";
import DurationHistogramGroupsOperations from "./components/DurationHistogramGroupsOperations";
import StartTimeHistogramGroups from "./components/StartTimeHistogramGroups";
import StartTimeHistogramGroupsOperations from "./components/StartTimeHistogramGroupsOperations";
import DurationHistogramSingleGroup from "./components/DurationHistogramSingleGroup";
import StartTimeHistogramSingleGroup from "./components/StartTimeHistogramSingleGroup";
import { Dropdown, DropdownButton, Button } from "react-bootstrap";
import PropTypes from "prop-types";

const svgComponents = Object.entries(SVGs)
  .sort(([keyA], [keyB]) => {
    const numA = Number(keyA.replace("Svg", ""));
    const numB = Number(keyB.replace("Svg", ""));
    return numA - numB;
  })
  .map(([, value]) => value);

const myColors = [
  "Aqua",
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

function AppGroups({ jsonData, showMenu }) {
  const [data, setData] = useState([]);
  const [spansData, setSpansData] = useState([]);
  const [view, setView] = useState("Groups");
  const [selectedGroupOperations, setSelectedGroupOperations] = useState(null); // to store the selected group
  const [groupedTraces, setGroupedTraces] = useState(null);
  const [selectedGroupNumber, setSelectedGroupNumber] = useState(null); // to store the selected group number
  const [isDurationHistogramGroupVisible, setDurationHistogramGroupVisibility] =
    useState(false);
  const [
    isStartTimeHistogramGroupVisible,
    setStartTimeHistogramGroupVisibility,
  ] = useState(false);
  const [isScatterPlotGroupVisible, setScatterPlotGroupVisibility] =
    useState(false);
  const [
    isDurationHistogramGroupsOperationsVisible,
    setDurationHistogramGroupsOperationsVisibility,
  ] = useState(false);
  const [
    isStartTimeHistogramGroupsOperationsVisible,
    setStartTimeHistogramGroupsOperationsVisibility,
  ] = useState(false);
  const [
    isScatterPlotGroupsOperationsVisible,
    setScatterPlotGroupsOperationsVisibility,
  ] = useState(false);
  const [
    isDurationHistogramSingleGroupVisible,
    setDurationHistogramSingleGroupVisibility,
  ] = useState(false);
  const [
    isStartTimeHistogramSingleGroupVisible,
    setStartTimeHistogramSingleGroupVisibility,
  ] = useState(false);
  const [histogramSingleGroupData, setHistogramSingleGroupData] = useState([]);
  const [
    isDurationHistogramSingleGroupOperationVisible,
    setIsDurationHistogramSingleGroupOperationVisible,
  ] = useState(null);
  const [
    isStartTimeHistogramSingleGroupOperationVisible,
    setIsStartTimeHistogramSingleGroupOperationVisible,
  ] = useState(null);
  const [
    HistogramSingleGroupOperationData,
    setHistogramSingleGroupOperationData,
  ] = useState([]);

  const handleGroupOperationsClick = (groupID) => {
    setSelectedGroupNumber(groupID);
    const selectedGroup = data.find((group) => group.groupID === groupID);

    const processedHistogramSingleGroupData = selectedGroup.traces.flatMap(
      (trace) =>
        trace.spans.map((span) => ({
          ...span,
          startTime: span.startTime,
        }))
    );
    setHistogramSingleGroupData(processedHistogramSingleGroupData);
    const propsData = Object.entries(selectedGroup.operations).map(
      ([operationName, operationStats], index) => {
        const minStartTime = operationStats.start_time_min;
        const maxStartTime = operationStats.start_time_max;
        const minDuration = operationStats.exec_time_min;
        const maxDuration = operationStats.exec_time_max;
        const startTime95Percentile = operationStats.start_time_95_percentile;
        const startTime99Percentile = operationStats.start_time_99_percentile;
        const duration95Percentile = operationStats.exec_time_95_percentile;
        const duration99Percentile = operationStats.exec_time_99_percentile;
        const startTimeQ0 = operationStats.start_time_min;
        const startTimeQ1 = operationStats.start_time_q1;
        const startTimeQ2 = operationStats.start_time_q2;
        const startTimeQ3 = operationStats.start_time_q3;
        const startTimeQ4 = operationStats.start_time_max;
        const durationQ0 = operationStats.exec_time_min;
        const durationQ1 = operationStats.exec_time_q1;
        const durationQ2 = operationStats.exec_time_q2;
        const durationQ3 = operationStats.exec_time_q3;
        const durationQ4 = operationStats.exec_time_max;

        const dataObj = {
          groupID: groupID,
          operationName: operationName,
          x: operationStats.start_time_q2,
          y: operationStats.exec_time_q2,
          minStartTime: minStartTime,
          maxStartTime: maxStartTime,
          minDuration: minDuration,
          maxDuration: maxDuration,
          startTimeSpread: maxStartTime - minStartTime,
          durationSpread: maxDuration - minDuration,
          startTimeQ0: startTimeQ0,
          startTimeQ1: startTimeQ1,
          startTimeQ2: startTimeQ2,
          startTimeQ3: startTimeQ3,
          startTimeQ4: startTimeQ4,
          durationQ0: durationQ0,
          durationQ1: durationQ1,
          durationQ2: durationQ2,
          durationQ3: durationQ3,
          durationQ4: durationQ4,
          startTime95Percentile: startTime95Percentile,
          startTime99Percentile: startTime99Percentile,
          duration95Percentile: duration95Percentile,
          duration99Percentile: duration99Percentile,
          color: myColors[index % myColors.length],
          svg: svgComponents[groupID % svgComponents.length],
          ...operationStats,
        };
        return dataObj;
      }
    );
    setSelectedGroupOperations(propsData);
    setView("Group's Operations");
  };

  const handleGroupOperationHistogramClick = (
    operationName,
    durationOrStartTime
  ) => {
    if (
      isDurationHistogramSingleGroupOperationVisible === null &&
      isStartTimeHistogramSingleGroupOperationVisible === null
    ) {
      const selectedGroup = data.find(
        (group) => group.groupID === selectedGroupNumber
      );
      const processedHistogramSingleGroupData = selectedGroup.traces.reduce(
        (acc, t) => {
          const spansData = t.spans
            .filter((span) => span.operationName === operationName)
            .map((span) => {
              return {
                startTime: span.startTime,
                duration: span.duration,
                spanID: span.spanID,
              };
            });
          return [...acc, ...spansData];
        },
        []
      );
      if (durationOrStartTime === "duration") {
        setHistogramSingleGroupOperationData(processedHistogramSingleGroupData);
        setIsDurationHistogramSingleGroupOperationVisible(true);
      } else {
        setHistogramSingleGroupOperationData(processedHistogramSingleGroupData);
        setIsStartTimeHistogramSingleGroupOperationVisible(true);
      }
    } else if (durationOrStartTime === "duration") {
      setIsDurationHistogramSingleGroupOperationVisible(
        !isDurationHistogramSingleGroupOperationVisible
      );
    } else {
      setIsStartTimeHistogramSingleGroupOperationVisible(
        !isStartTimeHistogramSingleGroupOperationVisible
      );
    }
  };

  const handleGroupSpansClick = (groupID) => {
    setSelectedGroupNumber(groupID);
    if (Array.isArray(groupedTraces.groups)) {
      const selectedGroup = data.find((group) => group.groupID === groupID);

      const processedData = selectedGroup.traces.reduce((acc, t) => {
        const spansData = t.spans.map((span) => {
          // Get the operation stats for the current operation name
          const operationStats = selectedGroup.operations[span.operationName];

          return {
            x: span.startTime,
            y: span.duration,
            spanID: span.spanID,
            traceID: t.traceID,
            name: span.operationName,
            color:
              Array.isArray(span.tags) && span.tags.some(isErrorTag)
                ? "red"
                : null,
            serviceName: t.processes[span.processID].serviceName,
            groupID: groupID,
            operationStats: operationStats,
          };
        });
        return [...acc, ...spansData];
      }, []);
      setSpansData(processedData);
    }
    setView("Group's Spans");
  };

  const handleBackClick = () => {
    setView("Groups");
  };

  const isErrorTag = ({ key, value }) =>
    key === "error" && (value === true || value === "true");

  useEffect(() => {
    setGroupedTraces(jsonData);
    const groupsData = jsonData.groups;

    const propsData = Object.keys(groupsData).map((key, index) => {
      const group = groupsData[key];
      const statistics = group.span_stats;
      const groupID = group.groupID;
      const numberOfTraces = group.traceNumber;
      const operations = group.operation_stats;
      const traces = group.traces;

      const minStartTime = group.span_stats.start_time_min;
      const maxStartTime = group.span_stats.start_time_max;
      const minDuration = group.span_stats.exec_time_min;
      const maxDuration = group.span_stats.exec_time_max;
      const startTime95Percentile = group.span_stats.start_time_95_percentile;
      const startTime99Percentile = group.span_stats.start_time_99_percentile;
      const duration95Percentile = group.span_stats.exec_time_95_percentile;
      const duration99Percentile = group.span_stats.exec_time_99_percentile;
      const startTimeQ0 = group.span_stats.start_time_min;
      const startTimeQ1 = group.span_stats.start_time_q1;
      const startTimeQ2 = group.span_stats.start_time_q2;
      const startTimeQ3 = group.span_stats.start_time_q3;
      const startTimeQ4 = group.span_stats.start_time_max;
      const durationQ0 = group.span_stats.exec_time_min;
      const durationQ1 = group.span_stats.exec_time_q1;
      const durationQ2 = group.span_stats.exec_time_q2;
      const durationQ3 = group.span_stats.exec_time_q3;
      const durationQ4 = group.span_stats.exec_time_max;

      const dataObj = {
        x: statistics.start_time_q2,
        y: statistics.exec_time_q2,
        groupID: groupID,
        numberOfTraces: numberOfTraces,
        operations: operations,
        traces: traces,

        minStartTime: minStartTime,
        maxStartTime: maxStartTime,
        minDuration: minDuration,
        maxDuration: maxDuration,
        startTimeSpread: maxStartTime - minStartTime,
        durationSpread: maxDuration - minDuration,
        startTime95Percentile: startTime95Percentile,
        startTime99Percentile: startTime99Percentile,
        duration95Percentile: duration95Percentile,
        duration99Percentile: duration99Percentile,
        startTimeQ0: startTimeQ0,
        startTimeQ1: startTimeQ1,
        startTimeQ2: startTimeQ2,
        startTimeQ3: startTimeQ3,
        startTimeQ4: startTimeQ4,
        durationQ0: durationQ0,
        durationQ1: durationQ1,
        durationQ2: durationQ2,
        durationQ3: durationQ3,
        durationQ4: durationQ4,
        color: myColors[index % myColors.length],
        svg: svgComponents[groupID % svgComponents.length],
        ...statistics,
      };

      return dataObj;
    });

    setData(propsData);
  }, [jsonData]);

  return (
    <div>
      <div className="centered-text">Current View: {view}</div>
      {showMenu && (
        <div
          style={{
            position: "fixed",
            top: 40,
            zIndex: 10005,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {(view === "Group's Operations" || view === "Group's Spans") && (
            <Button
              variant="primary"
              onClick={handleBackClick}
              style={{ width: "135px" }}
            >
              Back to Groups
            </Button>
          )}

          {view === "Groups" && (
            <div>
              <DropdownButton id="dropdown-basic-button" title="Histograms">
                <Dropdown.Item
                  style={{
                    backgroundColor: isDurationHistogramGroupVisible
                      ? "chartreuse"
                      : "white",
                  }}
                  onClick={() =>
                    setDurationHistogramGroupVisibility(
                      !isDurationHistogramGroupVisible
                    )
                  }
                >
                  Duration Histogram of Groups
                </Dropdown.Item>
                <Dropdown.Item
                  style={{
                    backgroundColor: isStartTimeHistogramGroupVisible
                      ? "chartreuse"
                      : "white",
                  }}
                  onClick={() =>
                    setStartTimeHistogramGroupVisibility(
                      !isStartTimeHistogramGroupVisible
                    )
                  }
                >
                  Start Time Histogram of Groups
                </Dropdown.Item>
              </DropdownButton>

              <DropdownButton id="dropdown-basic-button" title="Scatter Plots">
                <Dropdown.Item
                  style={{
                    backgroundColor: isScatterPlotGroupVisible
                      ? "chartreuse"
                      : "white",
                  }}
                  onClick={() =>
                    setScatterPlotGroupVisibility(!isScatterPlotGroupVisible)
                  }
                >
                  Scatter Plot of Groups
                </Dropdown.Item>
              </DropdownButton>
            </div>
          )}

          {view === "Group's Operations" && (
            <div>
              <DropdownButton id="dropdown-basic-button" title="Histograms">
                <Dropdown.Item
                  style={{
                    backgroundColor: isDurationHistogramGroupsOperationsVisible
                      ? "chartreuse"
                      : "white",
                  }}
                  onClick={() =>
                    setDurationHistogramGroupsOperationsVisibility(
                      !isDurationHistogramGroupsOperationsVisible
                    )
                  }
                >
                  Duration Histogram of Group {selectedGroupNumber}'s Operations
                </Dropdown.Item>

                <Dropdown.Item
                  style={{
                    backgroundColor: isStartTimeHistogramGroupsOperationsVisible
                      ? "chartreuse"
                      : "white",
                  }}
                  onClick={() =>
                    setStartTimeHistogramGroupsOperationsVisibility(
                      !isStartTimeHistogramGroupsOperationsVisible
                    )
                  }
                >
                  Start Time Histogram of Group {selectedGroupNumber}'s
                  Operations
                </Dropdown.Item>

                <Dropdown.Item
                  style={{
                    backgroundColor: isDurationHistogramSingleGroupVisible
                      ? "chartreuse"
                      : "white",
                  }}
                  onClick={() =>
                    setDurationHistogramSingleGroupVisibility(
                      !isDurationHistogramSingleGroupVisible
                    )
                  }
                >
                  Duration Histogram of a {selectedGroupNumber}'s Group
                </Dropdown.Item>

                <Dropdown.Item
                  style={{
                    backgroundColor: isStartTimeHistogramSingleGroupVisible
                      ? "chartreuse"
                      : "white",
                  }}
                  onClick={() =>
                    setStartTimeHistogramSingleGroupVisibility(
                      !isStartTimeHistogramSingleGroupVisible
                    )
                  }
                >
                  Start Time Histogram of a {selectedGroupNumber}'s Group
                </Dropdown.Item>
              </DropdownButton>

              <DropdownButton
                id="dropdown-basic-button"
                title="Scatter Plots"
                style={{ zIndex: 10000 }}
              >
                <Dropdown.Item
                  style={{
                    backgroundColor: isScatterPlotGroupsOperationsVisible
                      ? "chartreuse"
                      : "white",
                  }}
                  onClick={() =>
                    setScatterPlotGroupsOperationsVisibility(
                      !isScatterPlotGroupsOperationsVisible
                    )
                  }
                >
                  Scatter Plot of Group {selectedGroupNumber}'s Operations
                </Dropdown.Item>
              </DropdownButton>
            </div>
          )}
        </div>
      )}

      {view === "Group's Operations" && (
        <div>
          {isDurationHistogramGroupsOperationsVisible && (
            <div>
              <div className="centered-text">
                Duration Histogram of Group {selectedGroupNumber}'s Operations
              </div>
              <DurationHistogramGroupsOperations
                data={selectedGroupOperations}
              />
            </div>
          )}
          {isStartTimeHistogramGroupsOperationsVisible && (
            <div>
              <div className="centered-text">
                Start Time Histogram of Group {selectedGroupNumber}'s Operations
              </div>
              <StartTimeHistogramGroupsOperations
                data={selectedGroupOperations}
              />
            </div>
          )}
          {isDurationHistogramSingleGroupVisible && data.length > 0 && (
            <div>
              <div className="centered-text">
                Duration Histogram of Group {selectedGroupNumber}
              </div>
              <DurationHistogramSingleGroup data={histogramSingleGroupData} />
            </div>
          )}
          {isStartTimeHistogramSingleGroupVisible && data.length > 0 && (
            <div>
              <div className="centered-text">
                Start Time Histogram of Group {selectedGroupNumber}
              </div>
              <StartTimeHistogramSingleGroup data={histogramSingleGroupData} />
            </div>
          )}

          {isScatterPlotGroupsOperationsVisible && (
            <div>
              <ScatterPlotGroupsOperations
                data={selectedGroupOperations}
                selectedGroupNumber={selectedGroupNumber}
                showMenu={showMenu}
                onGroupOperationHistogramClick={
                  handleGroupOperationHistogramClick
                }
                onGroupOperationCloseClick={() => {
                  setIsDurationHistogramSingleGroupOperationVisible(null);
                  setIsStartTimeHistogramSingleGroupOperationVisible(null);
                }}
              >
                {isDurationHistogramSingleGroupOperationVisible && (
                  <div>
                    <div className="centered-text">
                      Duration Histogram of Group {selectedGroupNumber}'s
                      Operation
                    </div>
                    <DurationHistogramSingleGroup
                      data={HistogramSingleGroupOperationData}
                    />
                  </div>
                )}
                {isStartTimeHistogramSingleGroupOperationVisible && (
                  <div>
                    <div className="centered-text">
                      Start Time Histogram of Group {selectedGroupNumber}'s
                      Operation
                    </div>
                    <StartTimeHistogramSingleGroup
                      data={HistogramSingleGroupOperationData}
                    />
                  </div>
                )}
              </ScatterPlotGroupsOperations>
            </div>
          )}
        </div>
      )}

      {view === "Groups" && (
        <div>
          {isDurationHistogramGroupVisible && (
            <div>
              <div className="centered-text">
                Duration Histogram of Group's Spans
              </div>
              <DurationHistogramGroups data={data} />
            </div>
          )}

          {isStartTimeHistogramGroupVisible && (
            <div>
              <div className="centered-text">
                Start Time Histogram of Group's Spans
              </div>
              <StartTimeHistogramGroups data={data} />
            </div>
          )}

          {isScatterPlotGroupVisible && (
            <div>
              <ScatterPlotGroups
                data={data}
                showMenu={showMenu}
                onGroupOperationsClick={handleGroupOperationsClick}
                onGroupSpansClick={handleGroupSpansClick}
              />
            </div>
          )}
        </div>
      )}

      {view === "Group's Spans" && (
        <div>
          <ScatterPlot
            data={spansData}
            showMenu={showMenu}
            selectedGroupNumber={selectedGroupNumber}
          />
        </div>
      )}
    </div>
  );
}

AppGroups.propTypes = {
  jsonData: PropTypes.object.isRequired,
  showMenu: PropTypes.bool.isRequired,
};

export default AppGroups;
