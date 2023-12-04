import React from 'react';
import './styles/OperationStatsTable.css'; // Zaimportuj plik stylów CSS

function OperationStatsTable({ operationStats }) {

  if (!operationStats) {
    return null;
  }

  const operationNames = Object.keys(operationStats); // Pobierz nazwy operacji
  const columnHeaders = Object.keys(operationStats[operationNames[0]]); // Pobierz nagłówki kolumn

  return (
    <div className="table-container">
      <h1>Operation Stats</h1>
      <table>
        <thead>
          <tr>
            <th></th> {/* Pusta komórka w lewym górnym rogu */}
            {operationNames.map((operationName, index) => (
              <th key={index}>{operationName}</th>
            ))}
          </tr>
        </thead>
        <tbody>


          {columnHeaders.map((header, headerIndex) => (
            <tr key={headerIndex}>
              <td>{header}</td>
              {operationNames.map((operationName, operationIndex) => (
                <td key={operationIndex}>{operationStats[operationName][header] / 1000 + ' ms'}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OperationStatsTable;



