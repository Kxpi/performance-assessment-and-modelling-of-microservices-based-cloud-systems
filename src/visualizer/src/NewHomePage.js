import React, { useState } from "react";
import CallGraphPage from "./components/callGraph/CallGraphPage";
import FilesPage from "./components/FilesPage.js"
import PercendenceGraph from "./components/PercendenceGraph";
import AppGroups from "./AppGroups";
import { randomColors } from './helpers.js'
import Header from "./components/Header.js";

function NewHomePage() {
    const [data, setData] = useState(null);
    const [currentView, setCurrentView] = useState(0);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedTrace, setSelectedTrace] = useState(null);
    const [selectedSpan, setSelectedSpan] = useState(null);

    // 0 -CallGraph 1 - ScatterPlot 2 - PercendanceGraph


    if (data) {
        var serviceColors = randomColors(data["microservice_stats"]);
    }

    return (
        <div className="homepage-root">
            <Header currentView={currentView} setCurrentView={setCurrentView}
                selectedGroup={selectedGroup} selectedTrace={selectedTrace} selectedSpan={selectedSpan} />


            <div className="homepage-content">
                {currentView === 0 ?
                    <FilesPage setData={setData}></FilesPage>
                    :
                    data && (
                        <div>
                            {currentView === 1 ? (
                                <CallGraphPage
                                    selectedGroup={selectedGroup}
                                    setSelectedGroup={setSelectedGroup}
                                    data={data}
                                    serviceColors={serviceColors}
                                />

                            ) : currentView === 2 ? ( //ScatterPlot
                                <AppGroups jsonData={data} showMenu={true} />

                            )  //Put here histograms instead of PercendenceGraph
                                : currentView === 3 && <PercendenceGraph />
                            }
                        </div>
                    )}
            </div>
        </div>
    );
}

export default NewHomePage;