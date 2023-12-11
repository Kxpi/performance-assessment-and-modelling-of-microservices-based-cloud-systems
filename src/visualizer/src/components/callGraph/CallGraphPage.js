import React, { useState, useEffect } from 'react';
import './CallGraphPage.css';
import GroupSelector from './components/GroupSelector'
import TraceSelector from './components/TraceSelector';
import TraceGraph from './components/TraceGraph';
import OperationStatsTable from './components/OperationStatsTable';


function CallGraphPage({ selectedGroup, setSelectedGroup, data, serviceColors, selectedOperation, setSelectedOperation,
  selectedTrace, setSelectedTrace }) {

  useEffect(() => {

    setSelectedTrace(null);
    setSelectedOperation(null);
  }, [selectedGroup]);

  const groups = data["groups"]
  groups.sort((a, b) => b.traceNumber - a.traceNumber);

  //
  return (
    <div className='callpage-root'>


      <GroupSelector setSelectedGroup={setSelectedGroup} groups={groups} selectedGroup={selectedGroup} />
      {selectedGroup && selectedGroup.groupID !== 'Negative start times' && <TraceGraph selectedTrace={selectedGroup["traces"][0]} serviceColors={serviceColors}
        operationStats={selectedGroup["operation_stats"]} selectedOperation={selectedOperation} setSelectedOperation={setSelectedOperation} />}


      {selectedGroup && selectedGroup?.operation_stats?.length !== 0 && < OperationStatsTable operationStats={selectedGroup["operation_stats"]} />}



      {selectedGroup && <TraceSelector traces={selectedGroup["traces"]} setSelectedTrace={setSelectedTrace} selectedTrace={selectedTrace} />}
      {selectedTrace && <TraceGraph selectedTrace={selectedTrace} serviceColors={serviceColors} selectedOperation={selectedOperation} setSelectedOperation={setSelectedOperation} />}


    </div>
  );
}

export default CallGraphPage;
