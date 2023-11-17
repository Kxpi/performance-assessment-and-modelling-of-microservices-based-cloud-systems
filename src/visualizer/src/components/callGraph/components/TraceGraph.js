
//this is TraceGraph without timeline

import React, { useState } from 'react';
import ReactFlow from 'reactflow';
import dagre from 'dagre';

import 'reactflow/dist/style.css';
import './styles/TraceGraph.css'
import SpanInfo from './SpanInfo';

const TraceGraph = ({ selectedTrace, servicesInfo, operationStats }) => {


    const [selectedNode, setSelectedNode] = useState(null);


    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    const nodeWidth = 172;
    const nodeHeight = 36;

    const nodes = [];
    const edges = [];
    var x = 0;
    // nodes.sort((a, b) => a.data.startTime - b.data.startTime);
    console.log(selectedTrace)

    var spans = selectedTrace.spans.sort((a, b) => a.startTime - b.startTime);

    spans.forEach((span) => {
        nodes.push({
            id: span.spanID,
            position: { x: 0, y: 0 },
            data: {
                label: span.operationName.replaceAll("_", "-"), operationName: span.operationName, startTime: span.startTime, duration: span.duration, serviceName: servicesInfo[span.processID].serviceName
            },
            style: {
                background: servicesInfo[span.processID].color,
            },


        });

        const parentReference = span.references.find((ref) => ref.refType === 'CHILD_OF');
        if (parentReference) {
            edges.push({
                id: crypto.randomUUID(),
                source: parentReference.spanID,
                target: span.spanID,
                markerEnd: { type: 'arrowclosed', width: 20, height: 20, color: 'black' },
                type: 'step',

            });
        }
    });

    nodes.sort((a, b) => a.data.startTime - b.data.startTime);





    const getLayoutedElements = (nodes, edges, direction = 'LR') => {
        const isHorizontal = direction === 'LR';
        dagreGraph.setGraph({ rankdir: direction });

        nodes.forEach((node) => {
            dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });

        });

        edges.forEach((edge) => {
            dagreGraph.setEdge(edge.source, edge.target);
        });

        dagre.layout(dagreGraph);

        nodes.forEach((node) => {
            const nodeWithPosition = dagreGraph.node(node.id);
            node.targetPosition = isHorizontal ? 'left' : 'top';
            node.sourcePosition = isHorizontal ? 'right' : 'bottom';

            // We are shifting the dagre node position (anchor=center center) to the top left
            // so it matches the React Flow node anchor point (top left).
            node.position = {
                x: nodeWithPosition.x - nodeWidth / 2,
                y: nodeWithPosition.y - nodeHeight / 2,
            };


            return node;
        });


        return { nodes, edges };
    };

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        nodes,
        edges
    );



    const onNodeClick = (event, node) => {
        console.log("Node selected:", node)

        setSelectedNode(node);
        //if(node.selected) node.style.border='5px solid red';
        console.log(selectedNode)
    };


    return (
        <div style={{ width: '100vw', height: '100vh', display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
            <ReactFlow style={{ border: "solid", padding: "10px" }} nodes={nodes} edges={edges} onNodeClick={onNodeClick} />
            {selectedNode && <SpanInfo selectedSpan={selectedNode.data} operationStats={operationStats[selectedNode.data.operationName]} />}
        </div>
    );
}

export default TraceGraph;