import { useState, React, useRef, useEffect } from 'react';
import './styles/GroupSelector.css';


const TraceSelector = ({ traces, setSelectedTrace, selectedTrace }) => {
  const [isActive, setIsActive] = useState(false)

  let dropdownRef = useRef();
  traces = traces.sort((a, b) => b["spans"][0]["duration"] - a["spans"][0]["duration"]);


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

  const handleButtonClick = () => {
    setIsActive(!isActive);

    // Scroll into view when the button is clicked
    if (dropdownRef.current) {
      dropdownRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleItemClick = (trace) => {
    setSelectedTrace(trace);
    setIsActive(false);
  };

  return (
    <div className='dropdown' ref={dropdownRef}>
      <div className='dropdown-btn' onClick={handleButtonClick}>
        {selectedTrace ? "TraceID: " + selectedTrace.traceID : "--Choose Trace--v"}

      </div>
      {isActive && (
        <div className='dropdown-content'>

          {traces.map((trace) => (

            <div key={trace.traceID}
              onClick={() => handleItemClick(trace)}
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
