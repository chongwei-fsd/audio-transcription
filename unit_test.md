
<h3>
<ol>
<li>Install Docker Desktop</li>

```
https://www.docker.com/products/docker-desktop/
```
<li>Build and start up backend and frontend services defined in a docker-compose.yml file.</li>

```
docker-compose up --build
```

<li>Create a new terminal for running both frontend and backend unit testing.</li>
</ol>
</h3>

<hr>

<h3>BACKEND</h3>
<ol>


<li>Run tests inside a running Docker container for the backend service</li> 

```
docker-compose exec backend pytest
```

<li><b>test_health:</b> Tests the /health endpoint to ensure it returns a status of OK.</li>
<li><b>test_transcribe:</b> Tests the /transcribe endpoint by uploading a sample audio file. It verifies the response contains a transcription and that the file is processed.</li>
<li><b>test_get_transcriptions:</b> Ensures the /transcriptions endpoint correctly retrieves all transcriptions.</li>
<li><b>test_search_transcriptions:</b> Tests the /search endpoint with a query to find a transcription.</li>

</ol>

<hr/>

<h3>FRONTEND</h3>

<ol>
<li>Run tests inside a running Docker container for the frontend service</li>

```
docker-compose exec frontend npm test
```

<li><b>Test Upload Files:</b> Upload multiple audio files for transcription.</li>
<li><b>Test Fetch Transcriptions:</b> View a list of all available transcriptions.</li>
<li><b>Test Search Transcriptions:</b> Search for transcriptions by filename.</li>

</ol>

