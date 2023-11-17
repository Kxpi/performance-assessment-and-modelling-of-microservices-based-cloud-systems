import React, { useEffect, useState } from "react";
import CallGraphPage from "./components/callGraph/CallGraphPage";
import FileUploader from "./components/callGraph/components/FileUploader";
import AppGroups from "./AppGroups";
import { Dropdown, DropdownButton } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function HomePage() {
  const [data, setData] = useState(null);
  const [showCallGraph, setShowCallGraph] = useState(true);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
        }}
      >
        <FileUploader setData={setData} />

        {data && (
          <div>
            <DropdownButton
              id="dropdown-basic-button"
              title="View Menu"
              style={{ zIndex: 9999 }}
            >
              <Dropdown.Item onClick={() => setShowCallGraph(true)}>
                Show CallGraph
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setShowCallGraph(false)}>
                Show ScatterPlot And Histograms
              </Dropdown.Item>
            </DropdownButton>
          </div>
        )}
      </div>

      {data && (
        <div style={{ width: "100%" }}>
          {showCallGraph ? (
            <CallGraphPage data={data} />
          ) : (
            <AppGroups jsonData={data} />
          )}
        </div>
      )}
    </div>
  );
}

export default HomePage;
