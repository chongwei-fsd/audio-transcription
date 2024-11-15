export const uploadFiles = async (files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
  
    await fetch("http://localhost:8000/transcribe", {
      method: "POST",
      body: formData,
    });
  };
  
  export const fetchTranscriptions = async () => {
    const response = await fetch("http://localhost:8000/transcriptions");
    const data = await response.json();
    return data;
  };
  
  export const searchTranscriptions = async (searchQuery) => {
    const response = await fetch(
      `http://localhost:8000/search?query=${searchQuery}`
    );
    const data = await response.json();
    return data;
  };
  