import React, { useState, useEffect } from "react";
import CallGraphPage from "./components/callGraph/CallGraphPage";
import FilesPage from "./components/InputPage/FilesPage.js";
import PercendenceGraph from "./components/percendenceGraph/PercendenceGraph.jsx";

import { randomColors } from "./helpers.js";
import Header from "./components/Header/Header.js";
import HistogramsPage from "./components/Histograms/HistogramsPage.js";
import ScatterPlotPage from "./components/ScatterPlot/ScatterPlotPage.js";
import TablePage from "./components/TablePage/TablePage.js";

function NewHomePage() {
  const [data, setData] = useState(null);
  const [currentView, setCurrentView] = useState(0);

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [selectedTrace, setSelectedTrace] = useState(null);
  const [selectedSpan, setSelectedSpan] = useState(null);
  const [commTimes, setCommTimes] = useState(null);
  const [edges, setEdges] = useState(null); //edges dla grafu mateusza
  const [fileName, setFileName] = useState(null);
  // 0 -CallGraph 1 - ScatterPlot 2 - PercendanceGraph

  useEffect(() => {
    setSelectedGroup(null);
  }, [data]);

  useEffect(() => {
    setSelectedTrace(null);
    setSelectedOperation(null);
  }, [selectedGroup]);

  useEffect(() => {
    if (!selectedTrace) {
      setSelectedSpan(null);
    }
  }, [selectedTrace]);

  if (data) {
    var serviceColors = randomColors(data["microservice_stats"]);
  }

  useEffect(() => {
    if (selectedGroup) {
      fetch(`http://localhost:5000/data/${selectedGroup.groupID}`)
        .then((response) => response.json())
        .then((data) => setCommTimes(data))
        .catch((error) => console.error("Error:", error));

      setEdges(null);
      fetch(`http://localhost:5000/edges/${selectedGroup.groupID}`)
        .then((response) => response.json())
        .then((data) => setEdges(data["edges"][selectedGroup.groupID]))
        .catch((error) => console.error("Error:", error));
    }
  }, [selectedGroup]);

  // useEffect(() => {
  //     if (selectedGroup) {
  // fetch(`http://localhost:5000/edges/${selectedGroup.groupID}`)
  //     .then(response => response.json())
  //     .then(data => setEdges(data["edges"][selectedGroup.groupID]))
  //     .catch(error => console.error('Error:', error));
  //     }

  // }, [selectedGroup]);

  // useEffect(() => {
  //     if (!selectedGroup) {
  //         console.log(edges);
  //         console.log(commTimes);
  //     }
  // }, [selectedGroup]);

  return (
    <div className="homepage-root">
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        setData={setData}
        fileName={fileName}
        setFileName={setFileName}
        selectedGroup={selectedGroup}
        selectedTrace={selectedTrace}
        selectedOperation={selectedOperation}
        setSelectedOperation={setSelectedOperation}
        setSelectedGroup={setSelectedGroup}
        setSelectedTrace={setSelectedTrace}
        selectedSpan={selectedSpan}
        setSelectedSpan={setSelectedSpan}
      />

      <div className="homepage-content" style={{ height: "85vh" }}>
        {currentView === 0 ? (
          <FilesPage
            data={data}
            setData={setData}
            fileName={fileName}
            setFileName={setFileName}
            setSelectedGroup={setSelectedGroup}
            selectedGroup={selectedGroup}
          />
        ) : data ? (
          currentView === 1 ? (
            <CallGraphPage
              selectedGroup={selectedGroup}
              setSelectedGroup={setSelectedGroup}
              data={data}
              serviceColors={serviceColors}
              selectedOperation={selectedOperation}
              setSelectedOperation={setSelectedOperation}
              selectedTrace={selectedTrace}
              setSelectedTrace={setSelectedTrace}
              selectedSpan={selectedSpan}
              setSelectedSpan={setSelectedSpan}
              transfer_edges={edges}
            />
          ) : currentView === 2 ? (
            <TablePage
              selectedGroup={selectedGroup}
              selectedOperation={selectedOperation}
              setSelectedOperation={setSelectedOperation}
            />
          ) : currentView === 3 ? ( //ScatterPlot
            // <AppGroups jsonData={data} showMenu={true} setSelectedGroup={setSelectedGroup} propselectedGroup={selectedGroup} />
            <ScatterPlotPage
              jsonData={data}
              selectedGroup={selectedGroup}
              setSelectedGroup={setSelectedGroup}
              selectedOperation={selectedOperation}
              setSelectedOperation={setSelectedOperation}
              selectedTrace={selectedTrace}
              setSelectedTrace={setSelectedTrace}
              setSelectedSpan={setSelectedSpan}
            />
          ) : currentView === 4 ? (
            <PercendenceGraph
              data={commTimes}
              selectedGroup={selectedGroup}
              setSelectedOperation={setSelectedOperation}
              serviceColors={serviceColors}
            />
          ) : (
            currentView === 5 && (
              <HistogramsPage
                jsonData={data}
                selectedGroup={selectedGroup}
                setSelectedGroup={setSelectedGroup}
                selectedOperation={selectedOperation}
                setSelectedOperation={setSelectedOperation}
              />
            )
          )
        ) : (
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
            No File Provided
          </div>
        )}
      </div>
    </div>
  );
}

export default NewHomePage;
