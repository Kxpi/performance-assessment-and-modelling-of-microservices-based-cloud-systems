import React, { useState, useEffect } from "react";
import ScatterPlot from '../ScatterPlot';
import ScatterPlotGroupsOperationsCg from '../ScatterPlotGroupsOperationsCg';
import ScatterPlotGroups from "./components/ScatterPlotGroups";
import {
    processScatterPlotData,
    processScatterPlotGroupsOperationsData,
    setDataForScatterPlotGroups
} from "../../helpers.js";

// #toDo Add operation selection ( onSpanClickMethod)

function ScatterPlotPage({ jsonData, selectedGroup, setSelectedGroup, selectedOperation, setSelectedOperation,
    selectedTrace, setSelectedTrace }) {


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
                                    selectedGroup
                                )}
                            />
                            
                            {/* % Spans view
                             <ScatterPlot
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
