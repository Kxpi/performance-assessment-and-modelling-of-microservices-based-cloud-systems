import { useState, React } from "react"
import OldFileUploader from "./callGraph/components/OldFileUploader"
import './FilePage.css'

function FilesPage({ setData }) {

    const [fileName, setFileName] = useState("Null");


    return (
        <div className="filespage-root">
            <OldFileUploader
                setData={setData}
                setFileName={setFileName}
            />
            <div className="filespage-files">
                <h1>Uploaded File: </h1>
                {fileName ? fileName : "No file uploaded"}
            </div>
        </div>
    )
}

export default FilesPage;

