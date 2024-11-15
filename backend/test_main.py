import pytest
from fastapi.testclient import TestClient
from main import app  

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "OK"}

@pytest.mark.asyncio
async def test_transcribe():
    file_path = "temp/testing1.mp3"
    with open(file_path, "rb") as f:
        response = client.post(
            "/transcribe", 
            files={"files": ("audio.mp3", f, "audio/mpeg")}
        )
            
    assert response.status_code == 200
    assert "message" in response.json()
    assert "results" in response.json()
    assert isinstance(response.json()["results"], list)
    assert len(response.json()["results"]) > 0
    assert "filename" in response.json()["results"][0]
    assert "transcription" in response.json()["results"][0]
    
    
def test_get_transcriptions():
    response = client.get("/transcriptions")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_search_transcriptions():
    response = client.get("/search", params={"query": "audio.mp3"})
    assert response.status_code == 200
    assert isinstance(response.json(), list)
