import { React } from 'react'

// #toDo Add group selection from Histogram of all groups (click on bar method?)
// #toDo Add operation selection (click on bar method?)

function HistogramsPage({ jsonData, selectedGroup, setSelectedGroup }) {




    return (
        <div>
            <h1>Histograms</h1>
            {selectedGroup ? (

                <div>
                    <h2>Wybrana Grupa: {selectedGroup.groupID}, Histogram dla wybranej grupy</h2>
                    <h3>Duration Histogram of Group {selectedGroup.groupID}'s Operations</h3>
                    <h3>Start Time Histogram of {selectedGroup.groupID}'s Operations</h3>
                    <h3>Duration Histogram of a {selectedGroup.groupID}'s</h3>
                    <h3>Start Time Histogram of {selectedGroup.groupID}'s</h3>
                    <h4>Czym się różni Operations od bez Operations, czy bez Operations to są trejsy?</h4>



                </div>
            ) :
                <div>
                    <h2>Nie wybrano grupy, pokazuje graf dla wszystkich grup</h2>
                    <h3>Duration Histogram of Groups</h3>
                    <h3>Start Time Histogram of Groups</h3>
                </div>



            }

        </div>

    )
}

export default HistogramsPage;