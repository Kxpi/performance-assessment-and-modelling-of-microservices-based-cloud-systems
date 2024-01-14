import { useState, React, useEffect, useRef } from 'react';
import './styles/GroupSelector.css';


const GroupSelector = ({ groups, setSelectedGroup, selectedGroup, serviceColors }) => {
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
    <div className='c-dropdown' ref={dropdownRef}>
      <div className='c-dropdown-btn' onClick={e =>
        setIsActive(!isActive)}>
        {selectedGroup ? "Group " + selectedGroup["groupID"] : "--Choose group--v"}

      </div>
      {isActive && (
        <div className='c-dropdown-content' >

          {groups.map((group) => {
            const traceServiceNames = Object.values(group['traces'][0]['processes']).map(process => process.serviceName).sort((a, b) => a.length - b.length);;

            return (
              <div onClick={(e) => {
                setSelectedGroup(group);
                setIsActive(false);
              }} className='c-dropdown-item'>
                {"GroupID:" + group["groupID"] + " TraceNumber: " + group["traceNumber"]}
                <div className='services-container'>
                  { group["groupID"] !=='Negative start times' && traceServiceNames.map((serviceName, index) => (
                    <span className='service-badge' key={index} style={{ backgroundColor: serviceColors[serviceName]}}>{serviceName}</span>
                  ))}
                </div>
              </div>
            );
          })}


        </div>
      )
      }
    </div >
  );
};

export default GroupSelector;
