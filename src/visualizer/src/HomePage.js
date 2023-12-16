import React, { useState } from "react";
import CallGraphPage from "./components/callGraph/CallGraphPage";
import FileUploader from "./components/callGraph/components/OldFileUploader";
import PercendenceGraph from "./components/PercendenceGraph";
import AppGroups from "./AppGroups";
import { Dropdown, DropdownButton, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  randomColors,
  processSelectedGroupData,
  processHistogramSingleGroupData,
  processScatterPlotGroupsOperationsData,
  processScatterPlotData,
  myColors,
} from "./helpers.js";
import DurationHistogramGroupsOperations from "./components/DurationHistogramGroupsOperations.jsx";
import DurationHistogramSingleGroup from "./components/DurationHistogramSingleGroup.jsx";
import StartTimeHistogramGroupsOperations from "./components/StartTimeHistogramGroupsOperations.jsx";
import StartTimeHistogramSingleGroup from "./components/StartTimeHistogramSingleGroup.jsx";
import ScatterPlotGroupsOperationsCg from "./components/ScatterPlotGroupsOperationsCg.jsx";
import ScatterPlot from "./components/ScatterPlot";
import * as SVGs from "./components/SVGs";
import { set } from "lodash";

const svgComponents = Object.entries(SVGs)
  .sort(([keyA], [keyB]) => {
    const numA = Number(keyA.replace("Svg", ""));
    const numB = Number(keyB.replace("Svg", ""));
    return numA - numB;
  })
  .map(([, value]) => value);

function HomePage() {
  const [data, setData] = useState(null);
  const [showMenu, setShowMenu] = useState(true);
  const [fileName, setFileName] = useState("Null");
  const [currentView, setCurrentView] = useState(0);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedGroupOperationsToParent, setSelectedGroupOperationsToParent] =
    useState(null);
  const [histogramSingleGroupData, setHistogramSingleGroupData] = useState([]);
  const [scatterPlotGroupsOperationsData, setScatterPlotGroupsOperationsData] =
    useState([]);
  const [scatterPlotData, setScatterPlotData] = useState([]);

  const [
    isDurationHistogramGroupsOperationsVisible,
    setDurationHistogramGroupsOperationsVisibility,
  ] = useState(false);
  const [
    isStartTimeHistogramGroupsOperationsVisible,
    setStartTimeHistogramGroupsOperationsVisibility,
  ] = useState(false);
  const [
    isDurationHistogramSingleGroupVisible,
    setDurationHistogramSingleGroupVisibility,
  ] = useState(false);
  const [
    isStartTimeHistogramSingleGroupVisible,
    setStartTimeHistogramSingleGroupVisibility,
  ] = useState(false);
  const [
    isScatterPlotGroupsOperationsVisible,
    setScatterPlotGroupsOperationsVisibility,
  ] = useState(false);
  const [isScatterPlotVisible, setScatterPlotVisibility] = useState(false);

  // 0 -CallGraph 1 - ScatterPlot 2 - PercendanceGraph

  if (data) {
    var serviceColors = randomColors(data["microservice_stats"]);
  }

  return (
    <div>
      <div
        style={{
          position: "fixed",
          top: 0,
          zIndex: 10011,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          margin: 0,
          padding: 0,
        }}
      >
        <div
          style={{
            zIndex: 10010,
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <FileUploader
            setData={setData}
            setFileName={setFileName}
            showMenu={showMenu}
            style={{ margin: 0, padding: 0 }}
          />

          {data && showMenu && (
            <div style={{ zIndex: 10011, position: "relative" }}>
              <DropdownButton
                id="dropdown-basic-button"
                title="View Menu"
                style={{
                  zIndex: 10010,
                  position: "relative",
                  margin: 0,
                  padding: 0,
                }}
              >
                <Dropdown.Item
                  style={{ zIndex: 10011, position: "relative" }}
                  onClick={() => {
                    setCurrentView(0);
                  }}
                >
                  Show CallGraph
                </Dropdown.Item>
                <Dropdown.Item
                  style={{ zIndex: 10011, position: "relative" }}
                  onClick={() => {
                    setCurrentView(1);

                    console.log("Current view set to 1:", currentView);
                  }}
                >
                  Show ScatterPlot And Histograms
                </Dropdown.Item>
                <Dropdown.Item
                  style={{ zIndex: 10011, position: "relative" }}
                  onClick={() => {
                    setCurrentView(2);
                    console.log("Current view set to 2:", currentView); // Add this line for debugging
                  }}
                >
                  Show PercendanceGraph
                </Dropdown.Item>
              </DropdownButton>
            </div>
          )}
        </div>

        <Button
          variant="primary"
          onClick={() => setShowMenu(!showMenu)}
          style={{ buttonStyle }}
        >
          {showMenu ? "Hide Menu" : "Show Menu"}
        </Button>
      </div>
      <div className="centered-text">Uploaded JSON: {fileName}</div>

      <div
        style={{
          position: "fixed",
          top: 20,
          zIndex: 10010,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          margin: 0,
          padding: 0,
        }}
      >
        {data && showMenu && selectedGroup && currentView === 0 && (
          <div style={{ zIndex: 10010, position: "relative" }}>
            <DropdownButton
              id="dropdown-basic-button"
              title="View Histograms"
              style={{
                zIndex: 10010,
                margin: 0,
                top: 20,
                padding: 0,
              }}
              onClick={() => {
                setSelectedGroupOperationsToParent(
                  processSelectedGroupData(selectedGroup, myColors)
                );
                setHistogramSingleGroupData(
                  processHistogramSingleGroupData(selectedGroup)
                );
              }}
            >
              <Dropdown.Item
                style={{
                  zIndex: 10010,
                  position: "relative",
                  backgroundColor: isDurationHistogramGroupsOperationsVisible
                    ? "chartreuse"
                    : "white",
                }}
                onClick={() => {
                  setDurationHistogramGroupsOperationsVisibility(
                    !isDurationHistogramGroupsOperationsVisible
                  );
                }}
              >
                Duration Histogram of Group {selectedGroup.groupID}'s Operations
              </Dropdown.Item>
              <Dropdown.Item
                style={{
                  zIndex: 10010,
                  position: "relative",
                  backgroundColor: isStartTimeHistogramGroupsOperationsVisible
                    ? "chartreuse"
                    : "white",
                }}
                onClick={() => {
                  setStartTimeHistogramGroupsOperationsVisibility(
                    !isStartTimeHistogramGroupsOperationsVisible
                  );
                }}
              >
                Start Time Histogram of Group {selectedGroup.groupID}'s
                Operations
              </Dropdown.Item>
              <Dropdown.Item
                style={{
                  zIndex: 10010,
                  position: "relative",
                  backgroundColor: isDurationHistogramSingleGroupVisible
                    ? "chartreuse"
                    : "white",
                }}
                onClick={() => {
                  setDurationHistogramSingleGroupVisibility(
                    !isDurationHistogramSingleGroupVisible
                  );
                }}
              >
                Duration Histogram of Group {selectedGroup.groupID}
              </Dropdown.Item>
              <Dropdown.Item
                style={{
                  zIndex: 10010,
                  position: "relative",
                  backgroundColor: isStartTimeHistogramSingleGroupVisible
                    ? "chartreuse"
                    : "white",
                }}
                onClick={() => {
                  setStartTimeHistogramSingleGroupVisibility(
                    !isStartTimeHistogramSingleGroupVisible
                  );
                }}
              >
                Start Time Histogram of Group {selectedGroup.groupID}
              </Dropdown.Item>
            </DropdownButton>
            <DropdownButton
              id="dropdown-basic-button"
              title="View Scatter Plots"
              style={{
                zIndex: 10010,
                margin: 0,
                top: 25,
                padding: 0,
              }}
              onClick={() => {
                setScatterPlotGroupsOperationsData(
                  processScatterPlotGroupsOperationsData(
                    selectedGroup,
                    svgComponents
                  )
                );
                setScatterPlotData(processScatterPlotData(selectedGroup));
              }}
            >
              <Dropdown.Item
                style={{
                  zIndex: 10010,
                  position: "relative",
                  backgroundColor: isScatterPlotGroupsOperationsVisible
                    ? "chartreuse"
                    : "white",
                }}
                onClick={() => {
                  setScatterPlotGroupsOperationsVisibility(
                    !isScatterPlotGroupsOperationsVisible
                  );
                }}
              >
                Scatter Plot of Group's {selectedGroup.groupID} Operations
              </Dropdown.Item>
              <Dropdown.Item
                style={{
                  zIndex: 10010,
                  position: "relative",
                  backgroundColor: isScatterPlotVisible
                    ? "chartreuse"
                    : "white",
                }}
                onClick={() => {
                  setScatterPlotVisibility(!isScatterPlotVisible);
                }}
              >
                Scatter Plot of Group's {selectedGroup.groupID} Spans
              </Dropdown.Item>
            </DropdownButton>
          </div>
        )}
      </div>

      {data && (
        <div>
          {currentView === 0 ? (
            <div>
              <CallGraphPage
                selectedGroup={selectedGroup}
                setSelectedGroup={setSelectedGroup}
                data={data}
                serviceColors={serviceColors}
              />
              {isDurationHistogramGroupsOperationsVisible && (
                <div>
                  <div className="centered-text">
                    Duration Histogram of Group {selectedGroup.groupID}'s
                    Operations
                  </div>
                  <DurationHistogramGroupsOperations
                    data={selectedGroupOperationsToParent}
                  />
                </div>
              )}
              {isStartTimeHistogramGroupsOperationsVisible && (
                <div>
                  <div className="centered-text">
                    Start Time Histogram of Group {selectedGroup.groupID}'s
                    Operations
                  </div>
                  <StartTimeHistogramGroupsOperations
                    data={selectedGroupOperationsToParent}
                  />
                </div>
              )}
              {isDurationHistogramSingleGroupVisible && (
                <div>
                  <div className="centered-text">
                    Duration Histogram of Group {selectedGroup.groupID}
                  </div>
                  <DurationHistogramSingleGroup
                    data={histogramSingleGroupData}
                  />
                </div>
              )}
              {isStartTimeHistogramSingleGroupVisible && (
                <div>
                  <div className="centered-text">
                    Start Time Histogram of Group {selectedGroup.groupID}
                  </div>
                  <StartTimeHistogramSingleGroup
                    data={histogramSingleGroupData}
                  />
                </div>
              )}
              {isScatterPlotGroupsOperationsVisible && (
                <div>
                  <div className="centered-text">
                    Scatter Plot of Group's {selectedGroup.groupID} Operations
                  </div>
                  <ScatterPlotGroupsOperationsCg
                    data={scatterPlotGroupsOperationsData}
                  />
                </div>
              )}
              {isScatterPlotVisible && (
                <div>
                  <ScatterPlot
                    data={scatterPlotData}
                    showMenu={showMenu}
                    selectedGroupNumber={selectedGroup.groupID}
                  />
                </div>
              )}
            </div>
          ) : currentView === 1 ? (
            <AppGroups jsonData={data} showMenu={showMenu} />
          ) : currentView === 2 ? (
            <PercendenceGraph groupID={selectedGroup.groupID} />
          ) : (
            <h1>Error</h1>
          )}
        </div>
      )}
    </div>
  );
}

const buttonStyle = {
  position: "fixed",
  top: 0,
  right: 0,
  zIndex: 9999,
  fontSize: "0.9rem",
  padding: "0.375rem 1rem",
  height: "38px",
};

export default HomePage;
