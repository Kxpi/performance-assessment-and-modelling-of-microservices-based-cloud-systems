import { useState, React, useEffect } from "react";
import FileUploader from "./components/FileUploader";
import './FilePage.css';
import GroupSelector from './components/GroupSelector';

function FilesPage({ data, setData, fileName, setFileName, setSelectedGroup, selectedGroup }) {


    return (
        <div className="filespage-root">
            <FileUploader
                setData={setData}
                setFileName={setFileName}
            />

            <div className="filespage-files">
                {data ?
                    <div>Uploaded File: {fileName}</div>
                    :
                    <div>No File Uploaded</div>
                }
            </div>
            {data && data['groups'] &&
                <GroupSelector setSelectedGroup={setSelectedGroup} groups={data['groups']} selectedGroup={selectedGroup} />
            }

        </div>
    );
}

export default FilesPage;