import React, { useEffect, useState } from 'react';
import CallGraphPage from './components/callGraph/CallGraphPage';
import FileUploader from './components/callGraph/components/FileUploader';



function HomePage() {

  const [data, setData] = useState(null)


  return (
    <div >

      <h1>Trace Visualizer</h1>
      <FileUploader setData={setData} />
      {data && <CallGraphPage data={data} />}
      

    </div>
  )
}

export default HomePage;
