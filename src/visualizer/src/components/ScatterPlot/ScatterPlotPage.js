import React, { useState, useEffect, useMemo } from "react";
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
  selectedSpan,
  setSelectedSpan,
}) {
  const [changedSpanElsewhere, setChangedSpanElsewhere] = useState(null);
  const [selectedSpanScatterPlot, setSelectedSpanScatterPlot] = useState(null);

  const processedData = useMemo(() => {
    if (selectedGroup && selectedOperation) {
      return processScatterPlotData(selectedGroup, selectedOperation);
    }
    return null;
  }, [selectedGroup, selectedOperation]);

  const handleSelectedSpanScatterPlotChange = (span, trace) => {
    setSelectedTrace(trace);
    setSelectedSpan(span);
    setSelectedSpanScatterPlot(span);
  };

  useEffect(() => {
    if (selectedSpan !== selectedSpanScatterPlot) {
      setChangedSpanElsewhere(selectedSpan);
    }
  }, [selectedSpan]);

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
                  data={processedData}
                  changedSpanElsewhere={changedSpanElsewhere}
                  selectedSpanScatterPlotChange={
                    handleSelectedSpanScatterPlotChange
                  }
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
