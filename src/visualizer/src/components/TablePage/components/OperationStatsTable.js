import React, { useState } from 'react';
import './OperationStatsTable.css';
function OperationStatsTable({ operationStats, selectedOperation, setSelectedOperation }) {

  if (!operationStats) {
    return null;
  }

  const operationNames = Object.keys(operationStats); // Get operation names
  const execColumnHeaders = columnHeadersStartingWith(operationStats[operationNames[0]], 'exec');
  const startColumnHeaders = columnHeadersStartingWith(operationStats[operationNames[0]], 'start');

  return (
    <div className="table-container">
      {/* Exec Table */}
      <div className="exec-table" style={{ overflow: 'auto', marginTop: '10px', marginBottom: '10px', width: '100%' }}>
        <table>
          <thead>
            <tr>
              <th>Operation Name</th>
              {execColumnHeaders.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {operationNames.map((operationName, operationIndex) => (
              <tr
                key={operationIndex}
                style={{ cursor: 'pointer', background: selectedOperation === operationName ? '#FFFFCC' : 'transparent' }}
                onClick={() => {
                  setSelectedOperation(operationName);
                }}
              >
                <td>{operationName}</td>
                {execColumnHeaders.map((header, headerIndex) => (
                  <td key={headerIndex}>{operationStats[operationName][header] / 1000 + ' ms'}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Start Table */}
      <div className="start-table" style={{ overflow: 'auto', width: '100%' }}>
        <table>
          <thead>
            <tr>
              <th>Operation Name</th>
              {startColumnHeaders.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {operationNames.map((operationName, operationIndex) => (
              <tr
                key={operationIndex}
                style={{ cursor: 'pointer', background: selectedOperation === operationName ? '#FFFFCC' : 'transparent' }}
                onClick={() => {
                  setSelectedOperation(operationName); // Dodatkowo ustawiamy wybraną operację
                }}
              >
                <td>{operationName}</td>
                {startColumnHeaders.map((header, headerIndex) => (
                  <td key={headerIndex}>{operationStats[operationName][header] / 1000 + ' ms'}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Helper function to filter column headers based on the prefix
const columnHeadersStartingWith = (object, prefix) => {
  return Object.keys(object).filter(header => header.startsWith(prefix));
};

export default OperationStatsTable;
