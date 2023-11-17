import React, { useCallback, useMemo, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";
import { Button } from "react-bootstrap";

const FileUploader = ({ setData }) => {
  const [fileContent, setFileContent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      setFileContent(content);
    };
    reader.readAsText(file);
  }, []);

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

      //console.log(parsedData);
      axios
        .post("http://127.0.0.1:5000/upload", parsedData, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          setIsLoading(false);
          // Set the data using the 'setData' prop
          // console.log(response.data)

          setData(response.data);
        })
        .catch((error) => {
          console.error(error);
          alert("Error uploading the file to the server.");
        });
    }
  }, [fileContent]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      <div {...getRootProps()} style={isDragActive ? dropzoneStyle : {}}>
        <input {...getInputProps()} />
        {isLoading ? (
          <ThreeDots type="ThreeDots" color="#00BFFF" height={80} width={80} />
        ) : (
          <Button
            variant="primary"
            as="label"
            htmlFor="file-upload"
            style={buttonStyle}
          >
            Upload JSON
          </Button>
        )}
      </div>
    </div>
  );
};

const dropzoneStyle = {
  width: "200px",
  height: "38px",
  border: "2px dashed #cccccc",
  borderRadius: "4px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  fontSize: "0.9rem",
  padding: "0.375rem 1rem",
};

const buttonStyle = {
  fontSize: "0.9rem",
  padding: "0.375rem 1rem",
  height: "38px",
};

export default FileUploader;
