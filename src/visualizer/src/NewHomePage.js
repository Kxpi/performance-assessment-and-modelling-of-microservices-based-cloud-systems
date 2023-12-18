import React, { useState, useEffect } from "react";
import CallGraphPage from "./components/callGraph/CallGraphPage";
import FilesPage from "./components/InputPage/FilesPage.js"
import PercendenceGraph from "./components/PercendenceGraph";

import { randomColors } from './helpers.js'
import Header from "./components/Header/Header.js";
import HistogramsPage from "./components/Histograms/HistogramsPage.js";
import ScatterPlotPage from "./components/ScatterPlot/ScatterPlotPage.js";


function NewHomePage() {
    const [data, setData] = useState(null);
    const [currentView, setCurrentView] = useState(0);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedTrace, setSelectedTrace] = useState(null);
    const [selectedOperation, setSelectedOperation] = useState(null)
    const [fileName, setFileName] = useState("No file uploaded");
    // 0 -CallGraph 1 - ScatterPlot 2 - PercendanceGraph


    useEffect(() => {

        setSelectedTrace(null);
        setSelectedOperation(null);
    }, [selectedGroup]);

    if (data) {
        var serviceColors = randomColors(data["microservice_stats"]);
    }

    return (
        <div className="homepage-root">
            <Header currentView={currentView} setCurrentView={setCurrentView}
                selectedGroup={selectedGroup} selectedTrace={selectedTrace} selectedSpan={selectedOperation}
                setSelectedGroup={setSelectedGroup} setSelectedTrace={setSelectedTrace}
                setSelectedSpan={setSelectedOperation} />


            <div className="homepage-content" style={{ height: '85vh' }}>
                {currentView === 0 ?
                    <FilesPage
                        data={data} setData={setData} fileName={fileName} setFileName={setFileName}
                        setSelectedGroup={setSelectedGroup} selectedGroup={selectedGroup} />
                    :
                    data ? (

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
                            />

                        ) : currentView === 2 ? ( //ScatterPlot
                            // <AppGroups jsonData={data} showMenu={true} setSelectedGroup={setSelectedGroup} propselectedGroup={selectedGroup} />
                            <ScatterPlotPage jsonData={data} selectedGroup={selectedGroup} setSelectedGroup={setSelectedGroup} selectedOperation={selectedOperation}
                                setSelectedOperation={setSelectedOperation} selectedTrace={selectedTrace} setSelectedTrace={setSelectedTrace}
                            />

                        ) : currentView === 3 ? (
                            <PercendenceGraph />
                        ) : currentView === 4 &&
                        <HistogramsPage jsonData={data} selectedGroup={selectedGroup} setSelectedGroup={setSelectedGroup} />

                    ) :
                        <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', textAlign: 'center', flexDirection: 'column' }}>No File Provided</div>


                }
            </div>
        </div>
    );
}

export default NewHomePage;