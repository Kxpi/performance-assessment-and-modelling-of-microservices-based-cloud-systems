import React, {useState } from 'react';
//import './App.css';
import FileUploader from './components/FileUploader';
import TraceSelector from './components/TraceSelector';
import TraceGraph from './components/TraceGraph';

function NewApp(){

  const [traces, setTraces] = useState([]);
  const [selectedTrace, setSelectedTrace] = useState(null);

  return (
    <div style={{marginLeft: "50px"}}>

      <h1>Trace Visualizer</h1>
      <FileUploader setSelectedTrace={setSelectedTrace} setTraces={setTraces}/>
      <TraceSelector traces={traces} onSelectTrace={setSelectedTrace} />
      {selectedTrace && <TraceGraph traceID={selectedTrace} traces={traces} />}
    
    </div>
  );
}

export default NewApp;