import { useState, React } from 'react';
import './styles/GroupSelector.css';


const TraceSelector = ({ traces, setSelectedTrace, selectedTrace }) => {
  const [isActive, setIsActive] = useState(false)
  return (
    <div className='dropdown' >
      <div className='dropdown-btn' onClick={e =>
        setIsActive(!isActive)}>
        {selectedTrace ? "TraceID: " + selectedTrace.traceID : "--Choose Trace--v"}

      </div>
      {isActive && (
        <div className='dropdown-content'>

          {traces.map((trace) => (

            <div onClick={(e) => {
              setSelectedTrace(trace);
              setIsActive(false);
            }}
              className='dropdown-item'>
              {trace.traceID + " Duration: " + trace["spans"][0]["duration"]}
            </div>
          ))}


        </div>
      )
      }
    </div >
  );
};

export default TraceSelector;
