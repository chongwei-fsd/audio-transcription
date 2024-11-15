import React, { useState, useEffect } from "react";
import { uploadFiles, fetchTranscriptions, searchTranscriptions } from "./api"; // Import functions

function App() {
  const [files, setFiles] = useState([]);
  const [transcriptions, setTranscriptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  
  const handleUpload = async () => {
    await uploadFiles(files);  // Use the uploadFiles function
    fetchTranscriptionsData();
  };

  const fetchTranscriptionsData = async () => {
    const data = await fetchTranscriptions(); // Use the fetchTranscriptions function
    setTranscriptions(data);
  };

  const handleSearch = async () => {
    const data = await searchTranscriptions(searchQuery); // Use the searchTranscriptions function
    setTranscriptions(data);
  };

  // Automatically fetch transcriptions when the component mounts
  useEffect(() => {
    fetchTranscriptionsData();
  }, []);

  return (
    <div>
      <h1>Audio Transcription</h1>

      <input
        type="file"
        multiple
        onChange={(e) => setFiles([...e.target.files])}
      />
      <button onClick={handleUpload}>Upload & Transcribe</button>

      <br /><br />
      <label htmlFor="file-input">Choose a file:</label>

      <input
        id="file-input"
        type="text"
        placeholder="Search by filename"
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      &nbsp;
      <button onClick={handleSearch}>Search</button>

      <ul>
        {transcriptions.map((transcription) => (
          <li key={transcription.id}>
            <h3>{transcription.filename}</h3>
            <p>{transcription.transcription}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
