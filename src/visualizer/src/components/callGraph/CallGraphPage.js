import React, { useState } from 'react';
import './CallGraphPage.css';
import GroupSelector from './components/GroupSelector'
import TraceSelector from './components/TraceSelector';
import TraceGraph from './components/TraceGraph';
import Legend from './components/Legend';
import OperationStatsTable from './components/OperationStatsTable';


function CallGraphPage(data) {



  const [traces, setTraces] = useState([]);
  //const [groups, setGroups] = useState([])
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedTrace, setSelectedTrace] = useState(null);

  const groups = data.data["groups"]


  const microserviceColors = {};

  if ((selectedTrace && selectedTrace.processes)) {


    var trace = traces.find((trace) => trace.traceID === selectedTrace);


    function getRandomColor() {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }

    // Obiekt mapowania kolorów


    // Przypisz kolory do mikroserwisów
    for (let processKey in selectedTrace.processes) {
      microserviceColors[processKey] = { color: getRandomColor(), serviceName: selectedTrace.processes[processKey].serviceName };

      console.log(microserviceColors)
    }
  }



  return (
    <div style={{ marginLeft: "50px" }}>

      <div className='group-selector'>
        <GroupSelector setSelectedGroup={setSelectedGroup} groups={groups} selectedGroup={selectedGroup} />
        {selectedGroup && <TraceSelector traces={selectedGroup["traces"]} setSelectedTrace={setSelectedTrace} selectedTrace={selectedTrace} />}
      </div>

      {selectedTrace && <div style={{ display: "flex", justifyContent: "space-around" }}>
        {microserviceColors && <Legend microserviceColors={microserviceColors} />}
        {selectedTrace && <TraceGraph selectedTrace={selectedTrace} servicesInfo={microserviceColors} operationStats={selectedGroup["operation_stats"]} />}
      </div>}

      <div style={{ marginTop: "50px", marginBottom: "50px" }}>
        {selectedGroup && < OperationStatsTable operationStats={selectedGroup["operation_stats"]} />}
      </div>




    </div>
  );
}

export default CallGraphPage;
