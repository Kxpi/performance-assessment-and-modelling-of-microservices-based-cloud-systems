import React, { useState } from "react";
import CallGraphPage from "./components/callGraph/CallGraphPage";
import FileUploader from "./components/callGraph/components/FileUploader";
import PercendenceGraph from "./components/PercendenceGraph";
import AppGroups from "./AppGroups";
import { Dropdown, DropdownButton, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { randomColors } from './helpers.js'

function HomePage() {
  const [data, setData] = useState(null);
  const [showCallGraph, setShowCallGraph] = useState(true);
  const [showMenu, setShowMenu] = useState(true);
  const [fileName, setFileName] = useState("Null");
  const [showPercendanceGraph, setShowPercendanceGraph] = useState(false);
  const [currentView, setCurrentView] = useState(0);
  // 0 -CallGraph 1 - ScatterPlot 2 - PercendanceGraph

  if (data) {
    var serviceColors = randomColors(data["microservice_stats"])
  }

  return (
    <div>
      <div
        style={{
          position: "fixed",
          top: 0,
          zIndex: 10010,
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
            <div style={{ zIndex: 10010, position: "relative" }}>
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
                  style={{ zIndex: 10010, position: "relative" }}
                  onClick={() => setCurrentView(0)}
                >
                  Show CallGraph
                </Dropdown.Item>
                <Dropdown.Item
                  style={{ zIndex: 10010, position: "relative" }}
                  onClick={() => setCurrentView(1)}
                >
                  Show ScatterPlot And Histograms
                </Dropdown.Item>
                <Dropdown.Item
                  style={{ zIndex: 10010, position: "relative" }}
                  onClick={() => setCurrentView(2)}
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

      {data && (
        <div>
          {currentView === 0 ? (
            <CallGraphPage data={data} serviceColors={serviceColors} />
          ) : currentView === 1 ? (
            <AppGroups jsonData={data} showMenu={showMenu} />
          ) : currentView === 2 ? (
            <PercendenceGraph data={data} />
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
