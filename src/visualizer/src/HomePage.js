import React, { useEffect, useState } from "react";
import CallGraphPage from "./components/callGraph/CallGraphPage";
import FileUploader from "./components/callGraph/components/FileUploader";
import AppGroups from "./AppGroups";

function HomePage() {
  const [data, setData] = useState(null);
  const [showCallGraph, setShowCallGraph] = useState(true);

  return (
    <div>
      <h1>Trace Visualizer</h1>

      <FileUploader setData={setData} />

      {data && (
        <div>
          <div>
            <button onClick={() => setShowCallGraph(true)}>
              Show CallGraph
            </button>
            <button onClick={() => setShowCallGraph(false)}>
              Show ScatterPlot
            </button>
          </div>
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
