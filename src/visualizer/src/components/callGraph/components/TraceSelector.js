import { useState, React, useRef, useEffect } from 'react';
import './styles/GroupSelector.css';


const TraceSelector = ({ traces, setSelectedTrace, selectedTrace }) => {
  const [isActive, setIsActive] = useState(false)

  let dropdownRef = useRef();

  useEffect(() => {
    let handler = (e) => {
      if (!dropdownRef.current.contains(e.target)) {
        setIsActive(false)
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    }
  }, []);

  return (
    <div className='dropdown' ref={dropdownRef}>
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
