import React, { useState, useEffect } from "react";
import ScatterPlot from '../ScatterPlot';
import ScatterPlotGroupsOperationsCg from '../ScatterPlotGroupsOperationsCg';
import ScatterPlotGroups from "./components/ScatterPlotGroups";
import * as SVGs from "../SVGs";
import {
    processScatterPlotData,
    processScatterPlotGroupsOperationsData,
    myColors
} from "../../helpers.js";

// #toDo Add operation selection ( onSpanClickMethod)

function ScatterPlotPage({ jsonData, selectedGroup, setSelectedGroup, selectedOperation, setSelectedOperation,
    selectedTrace, setSelectedTrace }) {



    const svgComponents = Object.entries(SVGs)
        .sort(([keyA], [keyB]) => {
            const numA = Number(keyA.replace("Svg", ""));
            const numB = Number(keyB.replace("Svg", ""));
            return numA - numB;
        })
        .map(([, value]) => value);

    function setDataForScatterPlotGroups(jsonData) {
        // 'Negative start times' group is only to represent traces which have at least one span with negative starTime that's why we need to delete it
        if (!selectedGroup) {
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
                console.log("propsData jest puste")
            }
            return propsData
        }
    }
    function setSelectedGroupFromScatterPlotGroups(groupID) {
        setSelectedGroup(jsonData.groups.find((group) => group.groupID === groupID))
    }

    return (
        <div style={{ width: '100%', height: '100%' }} >
            {selectedGroup ? (


                selectedGroup["groupID"] === "Negative start times" ?
                    (<div style={{
                        width: '100%', height: '100%', display: 'flex', justifyContent: 'center',
                        textAlign: 'center', flexDirection: 'column'
                    }}>Negative start times group selected</div>
                    ) :
                    (
                        <div>


                            <ScatterPlotGroupsOperationsCg
                                data={processScatterPlotGroupsOperationsData(
                                    selectedGroup,
                                    svgComponents
                                )}
                            />

                            {/* <ScatterPlot
                        data={processScatterPlotData(selectedGroup)}
                        showMenu={true}
                        selectedGroupNumber={selectedGroup.groupID}

                    /> */}
                        </div>)
            ) :
                <div>
                    <ScatterPlotGroups
                        data={setDataForScatterPlotGroups(jsonData)}
                        showMenu={true}
                        // onGroupOperationsClick={handleGroupOperationsClick}
                        // onGroupSpansClick={handleGroupSpansClick}
                        setSelectedGroup={setSelectedGroupFromScatterPlotGroups}
                    />
                </div>



            }

        </div >
    )
}

export default ScatterPlotPage;
