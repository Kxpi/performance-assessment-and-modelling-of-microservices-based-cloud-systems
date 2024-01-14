import { useState, React, useEffect } from "react";
import FileUploader from "./components/FileUploader";
import './FilePage.css';
import GroupSelector from './components/GroupSelector';

function FilesPage({ data, setData, fileName, setFileName, setSelectedGroup, selectedGroup,serviceColors }) {


    return (
        <div className="filespage-root">
            <FileUploader
                setData={setData}
                setFName={setFileName}
            />

            <div className="filespage-files">
                {data ?
                    <div>Uploaded File: {fileName}</div>
                    :
                    <div>No File Uploaded</div>
                }
            </div>
            {data && data['groups'] &&
                <GroupSelector setSelectedGroup={setSelectedGroup} groups={data['groups']} selectedGroup={selectedGroup} serviceColors={serviceColors} />
            }

        </div>
    );
}

export default FilesPage;