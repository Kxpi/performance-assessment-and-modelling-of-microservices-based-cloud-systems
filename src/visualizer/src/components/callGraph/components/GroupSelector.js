import { useState, React, useEffect, useRef } from 'react';
import './styles/GroupSelector.css';


const GroupSelector = ({ groups, setSelectedGroup, selectedGroup }) => {
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
        {selectedGroup ? "Group " + selectedGroup["groupID"] : "--Choose group--v"}

      </div>
      {isActive && (
        <div className='dropdown-content' >

          {groups.map((group) => (

            <div onClick={(e) => {
              setSelectedGroup(group);
              setIsActive(false);
            }}
              className='dropdown-item'>
              {"GroupID:" + group["groupID"] + " TraceNumber: " + group["traceNumber"]}
            </div>
          ))}


        </div>
      )
      }
    </div >
  );
};

export default GroupSelector;
