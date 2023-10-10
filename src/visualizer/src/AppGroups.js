import React, { useState, useEffect } from "react";
import ScatterPlotGroups from "..src/components/ScatterPlotGroups";
import * as SVGs from "..src/components/SVGs";
import ScatterPlotGroupsOperations from "..src/components/ScatterPlotGroupsOperations";
import ScatterPlot from "..src/components/ScatterPlot";

const svgComponents = Object.values(SVGs);

const myColors = [
  "Aqua",
  "Aquamarine",
  "Black",
  "Blue",
  "BlueViolet",
  "Brown",
  "Red",
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
  "Ivory",
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
  "White",
  "WhiteSmoke",
  "YellowGreen",
];

function AppGroups() {
  const [data, setData] = useState([]);
  const [spansData, setSpansData] = useState([]);
  const [view, setView] = useState("groups"); // 'groups' or 'operation_stats'
  const [selectedGroupOperations, setSelectedGroupOperations] = useState(null); // to store the selected group
  const [jaegerTraces, setJaegerTraces] = useState(null);
  const handleGroupOperationsClick = (groupID) => {
    const group = data.find((group) => group.groupID === groupID);
    const propsData = Object.entries(group.operations).map(
      ([operationName, operationStats], index) => {
        const dataObj = {
          groupID: groupID,
          operationName: operationName,
          x: operationStats.start_time_average,
          y: operationStats.exec_time_average,
          color: myColors[index % myColors.length],
          svg: svgComponents[index % svgComponents.length],
          ...operationStats,
        };
        return dataObj;
      }
    );
    setSelectedGroupOperations(propsData);
    setView("operation_stats");
  };

  const handleGroupSpansClick = (groupID) => {
    if (Array.isArray(jaegerTraces.data)) {
      const selectedGroup = data.find((group) => group.groupID === groupID);

      const processedData = jaegerTraces.data.reduce((acc, t) => {
        if (selectedGroup.traces.includes(t.traceID)) {
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
        } else {
          return acc;
        }
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
    fetch("/grouped_tracesV2.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((jsonData) => {
        const groupsData = jsonData.groups;

        const propsData = Object.keys(groupsData).map((key, index) => {
          const group = groupsData[key];
          const statistics = group.span_stats;
          const groupID = group.groupID;
          const numberOfTraces = group.traceNumber;
          const operations = group.operation_stats;
          const traces = group.traces;
          const minStartTime = group.global_min_start_time;

          const dataObj = {
            x: statistics.start_time_average,
            y: statistics.exec_time_average,
            groupID: groupID,
            numberOfTraces: numberOfTraces,
            operations: operations,
            traces: traces,
            minStartTime: minStartTime,
            color: myColors[index % myColors.length],
            svg: svgComponents[index % svgComponents.length],
            ...statistics,
          };

          return dataObj;
        });

        setData(propsData);
      })
      .catch((error) => {
        console.log("Error in fetching data: ", error);
      });
    fetch("/jaeger-traces.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((jsonData) => {
        setJaegerTraces(jsonData);
      })
      .catch((error) => {
        console.log("Error in fetching jaeger-traces.json: ", error);
      });
  }, []);

  return (
    <div className="App">
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
      {(view === "operation_stats" || view === "spans") && (
        <button onClick={handleBackClick}>Back to groups</button>
      )}
    </div>
  );
}

export default AppGroups;
