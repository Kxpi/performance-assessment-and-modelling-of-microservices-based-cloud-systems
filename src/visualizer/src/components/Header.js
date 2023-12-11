import React, { useState } from "react";
import './Header.css'
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function Header({ currentView, setCurrentView, selectedGroup, setSelectedGroup, selectedTrace, setSelectedTrace, selectedSpan, setSelectedSpan }) {

    const tabs = ['Files', 'CallGraph', 'ScatterPlot', 'Histograms']

    return (
        <div className="header-root">
            <div className="header-variables">
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
                            {selectedSpan.data.operationName}
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
