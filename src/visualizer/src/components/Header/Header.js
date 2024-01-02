import React, { useState } from "react";
import './Header.css'
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function Header({
    setData,
    currentView, setCurrentView,
    fileName, setFileName,
    selectedGroup, setSelectedGroup,
    selectedOperation, setSelectedOperation,
    selectedTrace, setSelectedTrace,
    selectedSpan, setSelectedSpan
}) {

    const tabs = ['Input', 'CallGraph', 'Table', 'ScatterPlot', 'Transfer times', 'Histograms']

    return (
        <div className="header-root">
            <div className="header-variables">

                <div className="file-name">
                    File Name: <br /> {fileName ? (
                        <span>
                            {fileName}
                            <Button variant="danger" onClick={() => { setFileName(null); setData(null); }}>
                                &#x2717;
                            </Button>
                        </span>
                    ) : <span>No file uploaded</span>}
                </div>
                <div className="selectedGroup">
                    selectedGroup: <br /> {selectedGroup ? (
                        <span>
                            {selectedGroup.groupID}
                            <Button variant="danger" onClick={() => setSelectedGroup(null)}>
                                &#x2717;
                            </Button>
                        </span>
                    ) : <span>No group selected</span>}
                </div>

                <div className="selectedOperation">
                    selectedOperation: <br /> {selectedOperation ? (
                        <span>
                            {selectedOperation}
                            <Button variant="danger" onClick={() => setSelectedOperation(null)}>
                                &#x2717;
                            </Button>
                        </span>
                    ) : <span>No operation selected</span>}
                </div>

                <div className="selectedTrace">
                    selectedTrace: <br />{selectedTrace ? (
                        <span>
                            {selectedTrace.traceID}
                            <Button variant="danger" onClick={() => setSelectedTrace(null)}>
                                &#x2717;
                            </Button>
                        </span>
                    ) : <span>No trace selected</span>}
                </div>

                <div className="selectedSpan">
                    selectedSpan: <br /> {selectedSpan ? (
                        <span>
                            {selectedSpan}
                            <Button variant="danger" onClick={() => setSelectedSpan(null)}>
                                &#x2717;
                            </Button>
                        </span>
                    ) : <span>No span selected</span>}
                </div>


            </div>
            <div className="header-nav">

                {tabs.map((tab, index) => (

                    <div style={{ borderBottom: currentView === index && 'none', backgroundColor: currentView === index && 'white' }}
                        onClick={(e) => {
                            setCurrentView(index);
                        }}
                        className='header-nav-item'>
                        {tab}
                    </div>
                ))}
            </div>

        </div>
    )
}
export default Header;
