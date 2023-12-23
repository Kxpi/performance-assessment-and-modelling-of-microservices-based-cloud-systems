import { React, useEffect } from "react";
import OperationStatsTable from './components/OperationStatsTable'
function TablePage({ selectedGroup, selectedOperation, setSelectedOperation }) {


    return (
        <div style={{ width: "100%", height: "100%" }}>
            {selectedGroup ? (
                selectedGroup["groupID"] === "Negative start times" ? (
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
                        Negative start times group selected
                    </div>
                ) : (

                    <div style={{ width: '100%', height: '100%', display: 'felx', flexDirection: 'column', justifyContent: 'space-between' }}>
                        < OperationStatsTable operationStats={selectedGroup["operation_stats"]} selectedOperation={selectedOperation} setSelectedOperation={setSelectedOperation} />
                    </div>

                )
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
