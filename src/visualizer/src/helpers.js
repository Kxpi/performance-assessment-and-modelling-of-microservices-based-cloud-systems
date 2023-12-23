import { select } from "d3";
import * as SVGs from "./components/SVGs";

var hsvToRgb = function (h, s, v) {
  var r, g, b;
  var i;
  var f, p, q, t;

  // Make sure our arguments stay in-range
  h = Math.max(0, Math.min(360, h));
  s = Math.max(0, Math.min(100, s));
  v = Math.max(0, Math.min(100, v));

  // We accept saturation and value arguments from 0 to 100 because that's
  // how Photoshop represents those values. Internally, however, the
  // saturation and value are calculated from a range of 0 to 1. We make
  // That conversion here.
  s /= 100;
  v /= 100;

  if (s === 0) {
    // Achromatic (grey)
    r = g = b = v;
    return `rgb(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(
      b * 255
    )})`;
  }

  h /= 60; // sector 0 to 5
  i = Math.floor(h);
  f = h - i; // factorial part of h
  p = v * (1 - s);
  q = v * (1 - s * f);
  t = v * (1 - s * (1 - f));

  switch (i) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;

    case 1:
      r = q;
      g = v;
      b = p;
      break;

    case 2:
      r = p;
      g = v;
      b = t;
      break;

    case 3:
      r = p;
      g = q;
      b = v;
      break;

    case 4:
      r = t;
      g = p;
      b = v;
      break;

    default: // case 5:
      r = v;
      g = p;
      b = q;
  }

  return `rgb(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(
    b * 255
  )})`;
};

export function randomColors(services) {
  const serviceKeys = Object.keys(services);

  var total = serviceKeys.length;
  var serviceColors = {};
  var i = 360 / (total - 1);

  serviceKeys.forEach((serviceName, x) => {
    const color = hsvToRgb(i * x, 70, 100);
    serviceColors[serviceName] = color;
  });

  return serviceColors;
}

const svgComponents = Object.entries(SVGs)
  .sort(([keyA], [keyB]) => {
    const numA = Number(keyA.replace("Svg", ""));
    const numB = Number(keyB.replace("Svg", ""));
    return numA - numB;
  })
  .map(([, value]) => value);

export function processSelectedGroupData(selectedGroup, myColors) {
  const propsData = Object.entries(selectedGroup.operation_stats).map(
    ([operationName, operationStats], index) => {
      const dataObj = {
        operationName: operationName,
        duration99Percentile: operationStats.exec_time_99_percentile,
        startTime99Percentile: operationStats.start_time_99_percentile,
        color: myColors[index % myColors.length],
      };
      return dataObj;
    }
  );

  return propsData;
}

export function processHistogramSingleGroupData(selectedGroup) {
  const processedHistogramSingleGroupData = selectedGroup.traces.flatMap(
    (trace) =>
      trace.spans.map((span) => ({
        ...span,
      }))
  );
  return processedHistogramSingleGroupData;
}

export const myColors = [
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

//Selected Group, Spans from selected group, Scatter Plot
export function processScatterPlotGroupsOperationsData(
  selectedGroup
  //svgComponents
) {
  const processedScatterPlotGroupsOperationsData = Object.entries(
    selectedGroup.operation_stats
  ).map(([operationName, operationStats], index) => {
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
      groupID: selectedGroup.groupID,
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
      svg: svgComponents[selectedGroup.groupID % svgComponents.length],
      ...operationStats,
    };
    return dataObj;
  });
  return processedScatterPlotGroupsOperationsData;
}

const isErrorTag = ({ key, value }) =>
  key === "error" && (value === true || value === "true");

export function processScatterPlotData(selectedGroup) {
  const processedScatterPlotData = selectedGroup.traces.reduce((acc, t) => {
    const spansData = t.spans.map((span) => {
      // Get the operation stats for the current operation name
      const operationStats = selectedGroup.operation_stats[span.operationName];

      return {
        x: span.startTime,
        y: span.duration,
        spanID: span.spanID,
        traceID: t.traceID,
        name: span.operationName,
        color:
          Array.isArray(span.tags) && span.tags.some(isErrorTag) ? "red" : null,
        serviceName: t.processes[span.processID].serviceName,
        groupID: selectedGroup.groupID,
        operationStats: operationStats,
      };
    });
    return [...acc, ...spansData];
  }, []);
  return processedScatterPlotData;
}

//No selected Group,All groups, Scatter Plot, Histogram,
export function setDataForScatterPlotGroups(jsonData) {
  // 'Negative start times' group is only to represent traces which have at least one span with negative starTime that's why we need to delete it
  const groupsData = jsonData.groups.filter(
    (item) => item["groupID"] !== "Negative start times"
  );

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
  if (!propsData) {
    console.log("propsData jest puste");
  }
  return propsData;
}

export function processGroupOperationHistogramData(
  selectedGroup,
  operationName
) {
  const processedGroupOperationHistogramData = selectedGroup.traces.reduce(
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
  return processedGroupOperationHistogramData;
}
