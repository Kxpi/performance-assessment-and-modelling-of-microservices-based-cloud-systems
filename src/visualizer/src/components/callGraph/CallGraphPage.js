import React, { useState, useEffect } from 'react';
import './CallGraphPage.css';
import GroupSelector from './components/GroupSelector'
import TraceSelector from './components/TraceSelector';
import TraceGraph from './components/TraceGraph';
import OperationStatsTable from './components/OperationStatsTable';


function CallGraphPage({ data, serviceColors }) {



  const [traces, setTraces] = useState([]);
  //const [groups, setGroups] = useState([])
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedTrace, setSelectedTrace] = useState(null);


  useEffect(() => {

    setSelectedTrace(null);
  }, [selectedGroup]);

  const groups = data["groups"]
  groups.sort((a, b) => b.traceNumber - a.traceNumber);

  //
  return (
    <div style={{ width: '100%', margin: "5px" }}>

      <div className='group-selector' style={{ width: '100%' }}>
        <GroupSelector setSelectedGroup={setSelectedGroup} groups={groups} selectedGroup={selectedGroup} />
        {selectedGroup && selectedGroup.groupID !== 'Negative start times' && <TraceGraph selectedTrace={selectedGroup["traces"][0]} serviceColors={serviceColors} operationStats={selectedGroup["operation_stats"]} />}

      </div>

      <div style={{ marginTop: "50px", marginBottom: "50px" }}>
        {selectedGroup && selectedGroup?.operation_stats?.length !== 0 && < OperationStatsTable operationStats={selectedGroup["operation_stats"]} />}
      </div>

      < div className='group-selector'>
        {selectedGroup && <TraceSelector traces={selectedGroup["traces"]} setSelectedTrace={setSelectedTrace} selectedTrace={selectedTrace} />}
        {selectedTrace && <div style={{ width: '100%', display: "flex", justifyContent: "space-around" }}>
          {selectedTrace && <TraceGraph selectedTrace={selectedTrace} serviceColors={serviceColors} />}
        </div>}
      </div>






    </div>
  );
}

export default CallGraphPage;
