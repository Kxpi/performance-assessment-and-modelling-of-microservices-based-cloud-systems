import React, { useState } from 'react';
import './OperationStatsTable.css';
function TraceTable({ selectedTrace, operationStats, selectedSpan, setSelectedSpan }) {



  const ColumnHeaders = ["spanID", "operationName", "startTime", "duration", "serviceName"]


  const sortedSpans = [...selectedTrace.spans];

  sortedSpans.sort((a, b) => a.startTime - b.startTime);

  return (
    <div className="table-container" style={{ width: '95%' }}>

      <div className="exec-table" style={{ overflow: 'auto', marginBottom: '10px', width: '100%' }}>
        <table>
          <thead>
            <tr>
              {ColumnHeaders.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedSpans.map((span, operationIndex) => (
              <tr
                key={operationIndex}
                style={{ cursor: 'pointer', background: selectedSpan === span["spanID"] ? '#FFFFCC' : 'transparent' }}
                onClick={() => {
                  setSelectedSpan(span["spanID"]);
                }}
              >
                <td>{span["spanID"]}</td>
                <td>{span["operationName"]}</td>
                <td>{span["startTime"] / 1000 + ' ms'}</td>
                <td>{span["duration"] / 1000 + ' ms'}</td>
                <td>{operationStats[span.operationName]["service_name"]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


    </div>
  );
}


export default TraceTable;
