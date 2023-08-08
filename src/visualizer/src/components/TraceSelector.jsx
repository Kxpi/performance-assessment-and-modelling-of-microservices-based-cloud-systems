import React from 'react';

const TraceSelector = ({ traces, onSelectTrace }) => {
  return (
    <div>
      <select onChange={(event) => onSelectTrace(event.target.value)}>
        <option value="">Select Trace</option>
        {traces.map((trace) => (
          <option key={trace.traceID} value={trace.traceID}>
            {trace.traceID}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TraceSelector;