import React from 'react';

const TraceGraph = ({ traceID, traces }) => {
  // Znajduje odpowiedni trace na podstawie traceID
  const selectedTrace = traces.find((trace) => trace.traceID === traceID);

  if (!selectedTrace) {
    return <p>Empty trace</p>;
  }

  const renderTraceGraph = () => {
    if (!selectedTrace || !selectedTrace.spans) {
      return null;
    }

    //puste listy na wierzchołki i krawędzie grafu
    const nodes = [];
    const edges = [];

    // Dodajemy każdy span jako wierzchołek
    selectedTrace.spans.forEach((span) => {
      nodes.push({
        id: span.spanID,
        label: span.operationName,
        startTime: span.startTime,
      });

      // szuka rodzica po referencji child_of i ustawia krawędzie
      const parentReference = span.references.find((ref) => ref.refType === 'CHILD_OF');
      if (parentReference) {
        edges.push({
          from: parentReference.spanID,
          to: span.spanID,
        });
      }
      //sortowanie wierchołków po czasie aby zachować chronologie
      nodes.sort((a, b) => a.startTime - b.startTime);
    });

    
    const Graph = require('react-graph-vis').default;

    // opcje grafu
    const options = {
      layout: {
        hierarchical: {
          direction: 'LR', 
        },
      },
      edges: {
        color: '#000000',
        length: 300,
      },
      nodes: {
        shape: 'box', 
        size: 20,
        font: {
          size: 14,
        },
      },
      
      width: '1920px',
      height: '600px'
    };

    // Renderujemy graf
    return <Graph graph={{ nodes, edges }} options={options} />;
  };


  return (
    <div>
      <h2>Wizualizacja Trace: {traceID}</h2>
      <p>Pierwszy spanID: {selectedTrace.spans[0].spanID}</p>
      <div style={{display: "block",width: "100%"}}>
      {renderTraceGraph()}
      </div>
    </div>
  );
};

export default TraceGraph;





