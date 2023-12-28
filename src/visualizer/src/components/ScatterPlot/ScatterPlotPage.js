import React, { useState, useEffect } from "react";
import ScatterPlotOperationsSpans from "../ScatterPlotOperationsSpans.jsx";
import ScatterPlotGroupsOperationsCg from "../ScatterPlotGroupsOperationsCg";
import ScatterPlotGroups from "./components/ScatterPlotGroups";
import {
  processScatterPlotData,
  processScatterPlotGroupsOperationsData,
  setDataForScatterPlotGroups,
} from "../../helpers.js";

// #toDo Add operation selection ( onSpanClickMethod)

function ScatterPlotPage({
  jsonData,
  selectedGroup,
  setSelectedGroup,
  selectedOperation,
  setSelectedOperation,
  selectedTrace,
  setSelectedTrace,
}) {
  function setSelectedGroupFromScatterPlotGroups(groupID) {
    setSelectedGroup(
      jsonData.groups.find((group) => group.groupID === groupID)
    );
  }

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {selectedGroup ? (
        selectedGroup["groupID"] === "Negative start times" ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              textAlign: "center",
              flexDirection: "column",
            }}
          >
            Negative start times group selected
          </div>
        ) : (
          <div>
            <h3>Scatter Plot of Group {selectedGroup.groupID}'s Operations</h3>
            <ScatterPlotGroupsOperationsCg
              data={processScatterPlotGroupsOperationsData(selectedGroup)}
              selectedOperation={selectedOperation}
              setSelectedOperation={setSelectedOperation}
            />

            {selectedOperation && (
              <div>
                <h3>Scatter Plot of Operation {selectedOperation}'s Spans</h3>
                <ScatterPlotOperationsSpans
                  data={processScatterPlotData(
                    selectedGroup,
                    selectedOperation
                  )}
                />
              </div>
            )}
          </div>
        )
      ) : (
        <div>
          <h3>Scatter Plot of Groups</h3>
          <ScatterPlotGroups
            data={setDataForScatterPlotGroups(jsonData)}
            showMenu={false}
            // onGroupOperationsClick={handleGroupOperationsClick}
            // onGroupSpansClick={handleGroupSpansClick}
            setSelectedGroup={setSelectedGroupFromScatterPlotGroups}
          />
        </div>
      )}
    </div>
  );
}

export default ScatterPlotPage;
