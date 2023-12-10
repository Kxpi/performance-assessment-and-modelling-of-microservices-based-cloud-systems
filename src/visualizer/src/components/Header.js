import React, { useState } from "react";
import './Header.css'
//{ currentView, setCurrentView, selectedGroup, selectedTrace, selectedSpan }
function Header({ currentView, setCurrentView, selectedGroup, selectedTrace, selectedSpan }) {

    const tabs = ['Files', 'CallGraph', 'ScatterPlot', 'Histograms']

    return (
        <div className="header-root">
            <div className="header-variables">
                <div className="selectedGroup">selectedGroup: {selectedGroup ? selectedGroup.groupID : "No group selected"}</div>
                <div className="selectedTrace">selectedTrace: {selectedTrace ? selectedTrace.traceID : "No trace selected"}</div>
                <div className="selectedSpan">selectedSpan: {selectedSpan ? selectedSpan.spanID : currentView}</div>
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
