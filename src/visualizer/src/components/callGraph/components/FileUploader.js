import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';




const FileUploader = ({ setData }) => {

  const [fileContent, setFileContent] = useState(null);

  // Funkcja do odczytu zawartości pliku i walidacji rozszerzenia
  const handleFileDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length === 0) {
      alert('Błąd: Załaduj plik JSON.');
      return;
    }

    const file = acceptedFiles[0];
    if (file.type !== 'application/json') {
      alert('Błąd: Plik musi mieć rozszerzenie JSON.');
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
  const dropzoneConfig = useMemo(() => ({
    accept: 'application/json',
    multiple: false,
    onDrop: handleFileDrop,
  }), [handleFileDrop]);


  const { getRootProps, getInputProps, isDragActive } = useDropzone(dropzoneConfig);


  useEffect(() => {
    if (fileContent) {

      const parsedData = JSON.parse(fileContent);

      //console.log(parsedData);
      axios
        .post('http://127.0.0.1:5000/upload', parsedData, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          // Set the data using the 'setData' prop
          // console.log(response.data)

          setData(response.data);
        })
        .catch((error) => {
          console.error(error);
          alert('Error uploading the file to the server.');
        });
    }
  }, [fileContent]);

  return (
    <div {...getRootProps()} style={dropzoneStyle}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop JSON file here...</p>
      ) : (
        <p>Drag & drop file here, or click to select json file</p>
      )}
    </div>
  );
};

// Styl dropzone, możesz dostosować go według własnych preferencji
const dropzoneStyle = {
  width: '75%',
  minHeight: '150px',
  border: '2px dashed #cccccc',
  borderRadius: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
};

export default FileUploader;