import { React, useEffect } from "react";
import {
  setDataForScatterPlotGroups,
  processHistogramSingleGroupData,
  processHistogramAllGroupsData,
  processSelectedGroupData,
  processGroupOperationHistogramData,
  myColors,
} from "../../helpers.js";
import DurationHistogramGroups from "./components/DurationHistogramGroups.jsx";
import StartTimeHistogramGroups from "./components/StartTimeHistogramGroups.jsx";
import DurationHistogramSingleGroup from "./components/DurationHistogramSingleGroup.jsx";
import StartTimeHistogramSingleGroup from "./components/StartTimeHistogramSingleGroup.jsx";
import DurationHistogramGroupsOperations from "./components/DurationHistogramGroupsOperations.jsx";
import StartTimeHistogramGroupsOperations from "./components/StartTimeHistogramGroupsOperations.jsx";

// #toDo Add group selection from Histogram of all groups (click on bar method?)
// #toDo Add operation selection (click on bar method?)

function HistogramsPage({
  jsonData,
  selectedGroup,
  setSelectedGroup,
  selectedOperation,
  setSelectedOperation,
}) {
  //            const groupsData = jsonData.groups.filter(
  //(item) => item["groupID"] !== "Negative start times"
  //);

  function setGroupHistogramOnClick(groupID) {
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
        ) : selectedOperation ? (
          <div>
            <h1>
              <h3>Duration histogram of operation {selectedOperation} spans</h3>
              <DurationHistogramSingleGroup
                data={processGroupOperationHistogramData(
                  selectedGroup,
                  selectedOperation
                )}
              />
              <h3>
                Start time histogram of operation {selectedOperation} spans
              </h3>
              <StartTimeHistogramSingleGroup
                data={processGroupOperationHistogramData(
                  selectedGroup,
                  selectedOperation
                )}
              />
            </h1>
          </div>
        ) : (
          <div
            // style={{
            //   width: "100%",
            //   height: "100%",
            //   display: "flex",
            //   flexDirection: "column",
            //   justifyContent: "space-between",
            // }}
          >
            <h3>
              Duration histogram of group {selectedGroup.groupID} operations
            </h3>
            <DurationHistogramGroupsOperations
              data={processSelectedGroupData(selectedGroup, myColors)}
              setSelectedOperation={setSelectedOperation}
            />
            <h3>
              Start time histogram of group {selectedGroup.groupID} operations
            </h3>
            <StartTimeHistogramGroupsOperations
              data={processSelectedGroupData(selectedGroup, myColors)}
              setSelectedOperation={setSelectedOperation}
            />
            <h3>Duration histogram of group {selectedGroup.groupID} spans</h3>
            <DurationHistogramSingleGroup
              data={processHistogramSingleGroupData(selectedGroup)}
            />
            <h3>Start time histogram of group {selectedGroup.groupID} spans</h3>
            <StartTimeHistogramSingleGroup
              data={processHistogramSingleGroupData(selectedGroup)}
            />
          </div>
        )
      ) : (
        <div
          //className="no-selected-group"
          // style={{
          //   width: "100%",
          //   height: "100%",
          //   display: "flex",
          //   flexDirection: "column",
          //   justifyContent: "space-between",
          // }}
        >
          {/* <h2>Nie wybrano grupy, pokazuje graf dla wszystkich grup</h2> */}
          <h3>Duration histogram of groups</h3>

          <DurationHistogramGroups
            data={setDataForScatterPlotGroups(jsonData)}
            setGroupHistogramOnClick={setGroupHistogramOnClick}
          />
          <h3>Start time histogram of groups</h3>

          <StartTimeHistogramGroups
            data={setDataForScatterPlotGroups(jsonData)}
            setGroupHistogramOnClick={setGroupHistogramOnClick}
          />
          <h3>Duration histogram of spans</h3>
          <DurationHistogramSingleGroup
            data={processHistogramAllGroupsData(jsonData)}
          />
          <h3>Start time histogram of spans</h3>
          <StartTimeHistogramSingleGroup
            data={processHistogramAllGroupsData(jsonData)}
          />
        </div>
      )}
    </div>
  );
}

export default HistogramsPage;
