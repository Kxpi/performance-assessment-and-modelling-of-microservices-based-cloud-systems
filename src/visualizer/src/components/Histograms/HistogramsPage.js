import { React, useEffect } from "react";
import {
  setDataForScatterPlotGroups,
  processHistogramSingleGroupData,
  processSelectedGroupData,
  processGroupOperationHistogramData,
  myColors,
} from "../../helpers.js";
import DurationHistogramGroups from "./components/DurationHistogramGroups.jsx";
import StartTimeHistogramGroups from "./components/StartTimeHistogramGroups.jsx";
import DurationHistogramSingleGroup from "../DurationHistogramSingleGroup.jsx";
import StartTimeHistogramSingleGroup from "../StartTimeHistogramSingleGroup.jsx";
import DurationHistogramGroupsOperations from "../DurationHistogramGroupsOperations.jsx";
import StartTimeHistogramGroupsOperations from "../StartTimeHistogramGroupsOperations.jsx";

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
              <h3>
                Duration Histogram of Operation {selectedOperation}'s Spans
              </h3>
              <DurationHistogramSingleGroup
                data={processGroupOperationHistogramData(
                  selectedGroup,
                  selectedOperation
                )}
              />
              <h3>
                Start Time Histogram of Operation {selectedOperation}'s Spans
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
            style={{
              width: "100%",
              height: "100%",
              display: "felx",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <h3>Duration Histogram of Group {selectedGroup.groupID}'s Spans</h3>
            <DurationHistogramSingleGroup
              data={processHistogramSingleGroupData(selectedGroup)}
            />
            <h3>
              Start Time Histogram of Group {selectedGroup.groupID}'s Spans
            </h3>
            <StartTimeHistogramSingleGroup
              data={processHistogramSingleGroupData(selectedGroup)}
            />
            <h3>
              Duration Histogram of Group {selectedGroup.groupID}'s Operations
            </h3>
            <DurationHistogramGroupsOperations
              data={processSelectedGroupData(selectedGroup, myColors)}
              setSelectedOperation={setSelectedOperation}
            />
            <h3>
              Start Time Histogram of Group {selectedGroup.groupID}'s Operations
            </h3>
            <StartTimeHistogramGroupsOperations
              data={processSelectedGroupData(selectedGroup, myColors)}
              setSelectedOperation={setSelectedOperation}
            />
          </div>
        )
      ) : (
        <div
          className="no-selected-group"
          style={{
            width: "100%",
            height: "100%",
            // display: "flex",
            // flexDirection: "column",
            // justifyContent: 'space-between'
          }}
        >
          {/* <h2>Nie wybrano grupy, pokazuje graf dla wszystkich grup</h2> */}
          <h3>Duration Histogram of Groups</h3>

          <DurationHistogramGroups
            data={setDataForScatterPlotGroups(jsonData)}
            setGroupHistogramOnClick={setGroupHistogramOnClick}
          />
          <h3>Start Time Histogram of Groups</h3>

          <StartTimeHistogramGroups
            data={setDataForScatterPlotGroups(jsonData)}
            setGroupHistogramOnClick={setGroupHistogramOnClick}
          />
        </div>
      )}
    </div>
  );
}

export default HistogramsPage;
