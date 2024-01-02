import React, { useCallback, useMemo, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";

const FileUploader = ({ setData, setFName }) => {
  const [fileContent, setFileContent] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  var fname=""

  // Funkcja do odczytu zawartości pliku i walidacji rozszerzenia
  const handleFileDrop = useCallback((acceptedFiles) => {
    setIsLoading(true);
    if (acceptedFiles.length === 0) {
      alert("Błąd: Załaduj plik JSON.");
      return;
    }

    const file = acceptedFiles[0];
    if (file.type !== "application/json") {
      alert("Błąd: Plik musi mieć rozszerzenie JSON.");
      return;
    }
    setFileName(file.name)
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      setFileContent(content);
    };
    reader.readAsText(file);
  }, [setFileName]);

  // Konfiguracja dropzone
  const dropzoneConfig = useMemo(
    () => ({
      accept: "application/json",
      multiple: false,
      onDrop: handleFileDrop,
    }),
    [handleFileDrop]
  );

  const { getRootProps, getInputProps, isDragActive } =
    useDropzone(dropzoneConfig);

  useEffect(() => {
    if (fileContent) {
      const parsedData = JSON.parse(fileContent);

      axios
        .post("http://127.0.0.1:5000/upload", parsedData, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          setFName(fileName)
          setIsLoading(false);
          // Set the data using the 'setData' prop
          // console.log(response.data)

          const data = response.data
          data["groups"] = data['groups'].sort((a, b) => b.traceNumber - a.traceNumber);
          setData(data);
        })
        .catch((error) => {
          console.error(error);
          alert("Error uploading the file to the server.");
        });
    }
  }, [fileContent]);

  return (
    <div {...getRootProps()} style={dropzoneStyle}>
      <input {...getInputProps()} />
      {isLoading ? (
        <ThreeDots type="ThreeDots" color="#00BFFF" height={80} width={80} />
      ) : isDragActive ? (
        <p>Drop JSON file here...</p>
      ) : (
        <p>Drag & drop file here, or click to select json file</p>
      )}
    </div>
  );
};


const dropzoneStyle = {
  width: "75%",
  minHeight: "150px",
  border: "2px dashed #cccccc",
  borderRadius: "4px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

export default FileUploader;
