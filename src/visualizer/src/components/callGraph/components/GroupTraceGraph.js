import React, { useCallback } from 'react';
import ReactFlow, {
    Controls,
} from 'reactflow';
import dagre from 'dagre';
import SpanInfo from './SpanInfo';
import Legend from './Legend';

import './styles/GroupTraceGraph.css';
import 'reactflow/dist/style.css';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));
const proOptions = { hideAttribution: true };
const nodeWidth = 200;
const nodeHeight = 50;
const position = { x: 0, y: 0 };

const getLayoutedElements = (nodes, edges, direction = 'LR') => {
    const isHorizontal = direction === 'LR'
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



const GroupTraceGraph = ({ selectedTrace, operationStats, serviceColors, selectedOperation, setSelectedOperation }) => {


    console.log("renderuje się")
    console.log(selectedOperation)
    const initialNodes = [];
    const initialEdges = [];


    var spans = selectedTrace.spans.sort((a, b) => a.startTime - b.startTime);

    spans.forEach((span) => {
        initialNodes.push({
            id: span.operationName,
            position: position,
            data: {
                label: span.operationName.replaceAll("_", "-"),

            },
            style: {
                background: serviceColors[operationStats[span.operationName]["service_name"]]

            },
            selected: true ? span.operationName === selectedOperation : false


        });

        const parentReference = span.references.find((ref) => ref.refType === 'CHILD_OF');


        if (parentReference) {
            const parent = spans.find((p) => p.spanID === parentReference.spanID)
            initialEdges.push({
                id: crypto.randomUUID(),
                source: parent.operationName,
                target: span.operationName,
                markerEnd: { type: 'arrowclosed', width: 20, height: 20, color: 'black' },
                type: 'step',

            });
        }

    });



    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        initialNodes,
        initialEdges
    );




    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Legend microserviceColors={serviceColors} />
            <div style={{ height: '100%', width: '100%', display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
                <ReactFlow
                    nodes={layoutedNodes}
                    edges={layoutedEdges}
                    style={{ border: "solid", padding: "10px" }}
                    fitView
                    elevateEdgesOnSelect={true}
                    proOptions={proOptions}
                    nodesDraggable={false}
                    nodesConnectable={false}
                    selectionOnDrag={false}
                    onNodeClick={(event, node) => {
                        if (node) {
                            setSelectedOperation(node.id);

                        }

                    }}
                >
                    <Controls position={'bottom-right'} showInteractive={false} >
                    </Controls>
                </ReactFlow>
                {selectedOperation && <SpanInfo selectedSpan={selectedOperation} operationStats={operationStats[selectedOperation]} />}
            </div>
        </div >
    );
};

export default GroupTraceGraph;