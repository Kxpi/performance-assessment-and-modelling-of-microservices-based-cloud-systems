import React from 'react';
import ReactFlow, {
    Controls,
} from 'reactflow';
import dagre from 'dagre';
import GraphInfo from './GraphInfo';
import Legend from './Legend';
import CustomNode from './CustomNode';

import './styles/GroupTraceGraph.css';
import 'reactflow/dist/style.css';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));
const proOptions = { hideAttribution: true };
const nodeWidth = 200;
const nodeHeight = 50;
const position = { x: 0, y: 0 };
const nodeTypes = { custom: CustomNode };

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



const GroupTraceGraph = ({ selectedTrace, operationStats, serviceColors, selectedOperation, setSelectedOperation, transfer_edges }) => {

    const initialNodes = [];
    const initialEdges = [];



    var spans = selectedTrace.spans.sort((a, b) => a.startTime - b.startTime);

    spans.forEach((span) => {

        initialNodes.push({
            type: 'custom',
            id: span.operationName,
            position: position,
            data: {
                label: span.operationName.replaceAll("_", "-"),
                basic_handlers: [],
                transfer_handlers: []

            },
            style: {
                background: serviceColors[operationStats[span.operationName]["service_name"]],
                width: 175,
                height: 50,
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: '#1a192b',
                padding: '10px',
                borderRadius: '3px',
                fontSize: '12px',
                color: '#222',
                textAlign: 'center',
                boxShadow: span.operationName === selectedOperation ? '0 0 0 0.5px #1a192b' : 'none',
                filter: span.operationName === selectedOperation ? 'brightness(70%)' : 'none'
            },
        });
    });

    spans.forEach((span) => {

        if (!span.warnings) {
            const parentReference = span.references.find((ref) => ref.refType === 'CHILD_OF');


            if (parentReference) {
                const parent = spans.find((p) => p.spanID === parentReference.spanID)

                const sourceHandle = `${span.operationName}-source-b`
                const targetHandle = `${parent.operationName}-target-b`

                initialEdges.push({
                    id: crypto.randomUUID(),
                    source: parent.operationName,
                    sourceHandle: sourceHandle,
                    target: span.operationName,
                    targetHandle: targetHandle,
                    markerEnd: { type: 'arrowclosed', width: 20, height: 20, color: 'black' },
                    type: 'step',

                });

                initialNodes.forEach(node => {

                    if (node.id === span.operationName) {

                        node['data']["basic_handlers"].push({ handleID: targetHandle, type: 'target' });
                    }
                });

                initialNodes.forEach(node => {

                    if (node.id === parent.operationName) {

                        node['data']["basic_handlers"].push({ handleID: sourceHandle, type: 'source' });
                    }
                });
            }
        }


    });


    if (transfer_edges) {
        console.log(transfer_edges)

        transfer_edges.forEach((transfer_edge, index) => {



            const sourceHandle = `${transfer_edge[1]}-target-t`
            const targetHandle = `${transfer_edge[0]}-source-t`


            initialEdges.push({
                id: crypto.randomUUID(),
                source: transfer_edge[0],
                sourceHandle: sourceHandle,
                target: transfer_edge[1],
                targetHandle: targetHandle,
                label: transfer_edge[2] + ' ms',
                markerEnd: { type: 'arrowclosed', width: 20, height: 20, color: 'black' },
                type: 'smoothstep',
                animated: true,
                data: { 'bot': index % 2 === 0 ? 'bottom' : 'top' },
                pathOptions: {}


            });


            initialNodes.forEach(node => {

                if (node.id === transfer_edge[0]) {

                    node['data']["transfer_handlers"].push({ handleID: sourceHandle, type: 'source', position: index % 2 === 0 ? 'bottom' : 'top' });
                }
            });

            initialNodes.forEach(node => {

                if (node.id === transfer_edge[1]) {

                    node['data']["transfer_handlers"].push({ handleID: targetHandle, type: 'target', position: index % 2 === 0 ? 'bottom' : 'top' });
                }
            });

            console.log(initialEdges)
        });

    }

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
                    nodeTypes={nodeTypes}
                    onNodeClick={(event, node) => {
                        if (node) {
                            setSelectedOperation(node.id);

                        }

                    }}
                >
                    <Controls position={'top-left'} showInteractive={false} >
                    </Controls>
                </ReactFlow>
                {selectedOperation && <GraphInfo selectedOperation={selectedOperation} operationStats={operationStats[selectedOperation]} />}
            </div>
        </div >
    );
};

export default GroupTraceGraph;