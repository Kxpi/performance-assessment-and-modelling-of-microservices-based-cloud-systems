import React, { useState, useEffect } from 'react';
import './CallGraphPage.css';

import TraceSelector from './components/TraceSelector';
import TraceGraph from './components/TraceGraph';
import GroupTraceGraph from './components/GroupTraceGraph';


function CallGraphPage({ data, selectedGroup, setSelectedGroup, serviceColors, selectedOperation, setSelectedOperation,
  selectedTrace, setSelectedTrace, selectedSpan, setSelectedSpan, transfer_edges }) {




  //
  return (
    <div className='callpage-root' style={{ padding: '20px 50px 50px 50px' }}>


      {/* <GroupSelector setSelectedGroup={setSelectedGroup} groups={groups} selectedGroup={selectedGroup} /> */}

      {selectedGroup ? (

        selectedGroup.groupID !== 'Negative start times'
          ? (
            <div style={{ width: '100%', height: '100%', alignItems: 'center' }}>

              <GroupTraceGraph selectedTrace={selectedGroup["traces"][0]} operationStats={selectedGroup["operation_stats"]}
                serviceColors={serviceColors} selectedOperation={selectedOperation} setSelectedOperation={setSelectedOperation} transfer_edges={transfer_edges} />

              <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: '10px' }}>
                <TraceSelector traces={selectedGroup["traces"]} setSelectedTrace={setSelectedTrace}
                  selectedTrace={selectedTrace} style={{ display: 'block', margin: 'auto' }} />

                {selectedTrace && <TraceGraph selectedTrace={selectedGroup["traces"].find((trace) => trace["traceID"] === selectedTrace)}
                  serviceColors={serviceColors} operationStats={selectedGroup["operation_stats"]}
                  selectedSpan={selectedSpan} setSelectedSpan={setSelectedSpan} />}
              </div>
            </div>
          )
          : (
            <div className="neg-start-times" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <TraceSelector traces={selectedGroup["traces"]} setSelectedTrace={setSelectedTrace} selectedTrace={selectedTrace} />
              {selectedTrace && <TraceGraph selectedTrace={selectedGroup["traces"].find((trace) => trace["traceID"] === selectedTrace)} serviceColors={serviceColors} operationStats={selectedGroup["operation_stats"]}
                selectedSpan={selectedSpan} setSelectedSpan={setSelectedSpan} />}
            </div>
          )


      ) :
        <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', textAlign: 'center', flexDirection: 'column' }}>No Group Selected</div>
      }


      {/* {selectedGroup && selectedGroup?.operation_stats?.length !== 0 && < OperationStatsTable operationStats={selectedGroup["operation_stats"]} />} */}






    </div>
  );
}

export default CallGraphPage;
