import React, { useState } from "react";
import CallGraphPage from "./components/callGraph/CallGraphPage";
import FileUploader from "./components/callGraph/components/FileUploader";
import PercendanceGraph from "./components/PercendanceGraph";
import AppGroups from "./AppGroups";
import { Dropdown, DropdownButton, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function HomePage() {
  const [data, setData] = useState(null);
  const [showCallGraph, setShowCallGraph] = useState(true);
  const [showMenu, setShowMenu] = useState(true);
  const [fileName, setFileName] = useState("Null");
  const [showPercendanceGraph, setShowPercendanceGraph] = useState(false);
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
                  onClick={() => setShowCallGraph(true)}
                >
                  Show CallGraph
                </Dropdown.Item>
                <Dropdown.Item
                  style={{ zIndex: 10010, position: "relative" }}
                  onClick={() => setShowCallGraph(false)}
                >
                  Show ScatterPlot And Histograms
                </Dropdown.Item>
                <Dropdown.Item
                  style={{ zIndex: 10010, position: "relative" }}
                  onClick={() => setShowPercendanceGraph(false)}
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
        {showCallGraph ? (
          <CallGraphPage data={data} />
        ) : showPercendanceGraph ? (
          <PercendanceGraph data={data} />
        ) : (
          <AppGroups jsonData={data} showMenu={showMenu} />
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
