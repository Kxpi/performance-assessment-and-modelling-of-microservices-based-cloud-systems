import { React, useEffect } from "react";
import OperationStatsTable from './components/OperationStatsTable'
import TraceSelector from '../callGraph/components/TraceSelector';
import TraceTable from "./components/TraceTable";
function TablePage({ selectedGroup, selectedOperation, setSelectedOperation, selectedTrace, setSelectedTrace, selectedSpan, setSelectedSpan }) {


    return (
        <div style={{ width: "100%", height: "100%" }}>
            {selectedGroup ? (

                // <div
                //     style={{
                //         width: "100%",
                //         height: "100%",
                //         display: "flex",
                //         justifyContent: "center",
                //         textAlign: "center",
                //         flexDirection: "column",
                //     }}
                // >
                //     Negative start times group selected
                // </div>


                <div style={{ width: '100%', height: '100%', display: 'felx', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>

                    {selectedGroup["groupID"] !== "Negative start times" && (
                        < OperationStatsTable operationStats={selectedGroup["operation_stats"]} selectedOperation={selectedOperation} setSelectedOperation={setSelectedOperation} />
                    )}
                    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
                        <TraceSelector traces={selectedGroup["traces"]} setSelectedTrace={setSelectedTrace}
                            selectedTrace={selectedTrace} />
                        {selectedTrace && <TraceTable
                            selectedTrace={selectedGroup["traces"].find((trace) => trace["traceID"] === selectedTrace)}
                            operationStats={selectedGroup["operation_stats"]}
                            selectedSpan={selectedSpan} setSelectedSpan={setSelectedSpan} />}
                    </div>
                </div>


            ) : (
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        textAlign: "center",
                        flexDirection: "column",
                    }}
                >
                    No group selected
                </div>
            )
            }
        </div >
    );
}

export default TablePage;
