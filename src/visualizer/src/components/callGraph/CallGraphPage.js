import React, { useState, useEffect } from 'react';
import './CallGraphPage.css';

import TraceSelector from './components/TraceSelector';
import TraceGraph from './components/TraceGraph';
import OperationStatsTable from './components/OperationStatsTable';


function CallGraphPage({ selectedGroup, setSelectedGroup, data, serviceColors, selectedOperation, setSelectedOperation,
  selectedTrace, setSelectedTrace }) {




  //
  return (
    <div className='callpage-root' style={{ padding: '20px 50px 50px 50px' }}>


      {/* <GroupSelector setSelectedGroup={setSelectedGroup} groups={groups} selectedGroup={selectedGroup} /> */}

      {selectedGroup ? (

        selectedGroup.groupID !== 'Negative start times'
          ? (
            <div style={{ width: '100%', height: '100%', alignItems: 'center' }}>
              <TraceGraph selectedTrace={selectedGroup["traces"][0]} serviceColors={serviceColors}
                operationStats={selectedGroup["operation_stats"]} selectedOperation={selectedOperation} setSelectedOperation={setSelectedOperation} />

              <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: '10px' }}>
                <TraceSelector traces={selectedGroup["traces"]} setSelectedTrace={setSelectedTrace}
                  selectedTrace={selectedTrace} style={{ display: 'block', margin: 'auto' }} />

                {selectedTrace && <TraceGraph selectedTrace={selectedTrace} serviceColors={serviceColors} selectedOperation={selectedOperation} setSelectedOperation={setSelectedOperation} />}
              </div>
            </div>
          )
          : (
            <div className="neg-start-times" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <TraceSelector traces={selectedGroup["traces"]} setSelectedTrace={setSelectedTrace} selectedTrace={selectedTrace} />
              {selectedTrace && <TraceGraph selectedTrace={selectedTrace} serviceColors={serviceColors} selectedOperation={selectedOperation} setSelectedOperation={setSelectedOperation} />}
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
