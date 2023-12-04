import React from 'react';
import './styles/OperationStatsTable.css'; // Import the CSS styles file

function OperationStatsTable({ operationStats }) {

  if (!operationStats) {
    return null;
  }

  const operationNames = Object.keys(operationStats); // Get operation names
  const execColumnHeaders = columnHeadersStartingWith(operationStats[operationNames[0]], 'exec');
  const startColumnHeaders = columnHeadersStartingWith(operationStats[operationNames[0]], 'start');

  return (
    <div className="table-container">
      <h1>Operation Stats</h1>

      {/* Exec Table */}
      <div className="exec-table" style={{ overflow: 'auto', marginBottom: '10px', width: '100%' }}>
        <table >
          <thead>
            <tr>
              <th></th> {/* Empty cell in the top-left corner */}
              {execColumnHeaders.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {operationNames.map((operationName, operationIndex) => (
              <tr key={operationIndex}>
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
        <table >
          <thead>
            <tr>
              <th></th> {/* Empty cell in the top-left corner */}
              {startColumnHeaders.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {operationNames.map((operationName, operationIndex) => (
              <tr key={operationIndex}>
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
