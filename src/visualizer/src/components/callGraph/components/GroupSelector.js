import { useState, React } from 'react';
import './styles/GroupSelector.css';


const GroupSelector = ({ groups, setSelectedGroup, selectedGroup }) => {
  const [isActive, setIsActive] = useState(false)
  return (
    <div className='dropdown' >
      <div className='dropdown-btn' onClick={e =>
        setIsActive(!isActive)}>
        {selectedGroup ? "Group " + selectedGroup["groupID"] : "--Choose group--v"}

      </div>
      {isActive && (
        <div className='dropdown-content'>

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
