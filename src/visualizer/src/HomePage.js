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
    <div>
      <h1>Trace Visualizer</h1>

      <div style={{ display: "flex", justifyContent: "flex-start" }}>
        <FileUploader setData={setData} />

        {data && (
          <div>
            <DropdownButton id="dropdown-basic-button" title="View Menu">
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
        <div>
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
