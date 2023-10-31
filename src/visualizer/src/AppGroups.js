import React, { useState, useEffect } from "react";
import ScatterPlotGroups from "./components/ScatterPlotGroups";
import * as SVGs from "./components/SVGs";
import ScatterPlotGroupsOperations from "./components/ScatterPlotGroupsOperations";
import ScatterPlot from "./components/ScatterPlot";

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

function AppGroups({ jsonData }) {
  const [data, setData] = useState([]);
  const [spansData, setSpansData] = useState([]);
  const [view, setView] = useState("groups"); // 'groups' or 'operation_stats'
  const [selectedGroupOperations, setSelectedGroupOperations] = useState(null); // to store the selected group
  const [groupedTraces, setGroupedTraces] = useState(null);

  const handleGroupOperationsClick = (groupID) => {
    const group = data.find((group) => group.groupID === groupID);
    const propsData = Object.entries(group.operations).map(
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
    setView("operation_stats");
  };

  const handleGroupSpansClick = (groupID) => {
    if (Array.isArray(groupedTraces.groups)) {
      const selectedGroup = data.find((group) => group.groupID === groupID);

      const processedData = selectedGroup.traces.reduce((acc, t) => {
        const spansData = t.spans.map((span) => {
          // Get the operation stats for the current operation name
          const operationStats = selectedGroup.operations[span.operationName];
          const minStartTime = selectedGroup.minStartTime;

          return {
            x: span.startTime - minStartTime,
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
    setView("spans");
  };

  const handleBackClick = () => {
    setView("groups");
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
      const globalMinStartTime = group.global_min_start_time;
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
        globalMinStartTime: globalMinStartTime,
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
    <div className="App">
      {(view === "operation_stats" || view === "spans") && (
        <button className="BTG" onClick={handleBackClick}>
          Back to groups
        </button>
      )}
      {view === "groups" && (
        <ScatterPlotGroups
          data={data}
          onGroupOperationsClick={handleGroupOperationsClick}
          onGroupSpansClick={handleGroupSpansClick}
        />
      )}
      {view === "operation_stats" && (
        <ScatterPlotGroupsOperations data={selectedGroupOperations} />
      )}
      {view === "spans" && <ScatterPlot data={spansData} />}
    </div>
  );
}

export default AppGroups;
