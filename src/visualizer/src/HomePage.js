import React, { useEffect, useState } from 'react';
import CallGraphPage from './components/callGraph/CallGraphPage';
import FileUploader from './components/callGraph/components/FileUploader';


function HomePage() {
  const [data, setData] = useState(null);
  const [showCallGraph, setShowCallGraph] = useState(true);

  return (
    <div>
      <h1>Trace Visualizer</h1>


      <FileUploader setData={setData} />

      {data
        &&
        <div>
          <div>
            <button onClick={() => setShowCallGraph(true)}>Show CallGraph</button>
            <button onClick={() => setShowCallGraph(false)}>Show FelaGraph</button>
          </div>
          {showCallGraph ? <CallGraphPage data={data} /> : <h2>Put your graph here</h2>}
        </div>
      }
    </div>
  )
};

export default HomePage;
