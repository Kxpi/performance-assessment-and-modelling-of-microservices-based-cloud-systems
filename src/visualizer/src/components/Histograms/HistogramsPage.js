import { React, useEffect } from 'react'
import {
    setDataForScatterPlotGroups
} from "../../helpers.js";
import DurationHistogramGroups from './components/DurationHistogramGroups.jsx';
import StartTimeHistogramGroups from './components/StartTimeHistogramGroups.jsx';

// #toDo Add group selection from Histogram of all groups (click on bar method?)
// #toDo Add operation selection (click on bar method?)

function HistogramsPage({ jsonData, selectedGroup, setSelectedGroup }) {

    //            const groupsData = jsonData.groups.filter(
    //(item) => item["groupID"] !== "Negative start times"
    //);



    return (
        <div style={{ width: '100%', height: '100%' }}>
            {selectedGroup ? (

                selectedGroup["groupID"] === "Negative start times" ?
                    (
                        <div style={{
                            width: '100%', height: '100%', display: 'flex', justifyContent: 'center',
                            textAlign: 'center', flexDirection: 'column'
                        }}>Negative start times group selected</div>
                    ) :
                    (
                        <div>
                            <h2>Wybrana Grupa: {selectedGroup.groupID}, Histogram dla wybranej grupy</h2>
                            <h3>Duration Histogram of Group {selectedGroup.groupID}'s Operations</h3>
                            <h3>Start Time Histogram of {selectedGroup.groupID}'s Operations</h3>
                            <h3>Duration Histogram of a {selectedGroup.groupID}'s</h3>
                            <h3>Start Time Histogram of {selectedGroup.groupID}'s</h3>
                            <h4>Czym się różni Operations od bez Operations, czy bez Operations to są trejsy?</h4>



                        </div>
                    )
            ) :
                <div className='no-selected-group' style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    {/* <h2>Nie wybrano grupy, pokazuje graf dla wszystkich grup</h2> */}
                    {/* <h3>Duration Histogram of Groups</h3> */}
                    <DurationHistogramGroups data={setDataForScatterPlotGroups(jsonData)} />
                    {/* <h3>Start Time Histogram of Groups</h3> */}
                    <StartTimeHistogramGroups data={setDataForScatterPlotGroups(jsonData)} />
                </div>



            }

        </div>

    )
}

export default HistogramsPage;