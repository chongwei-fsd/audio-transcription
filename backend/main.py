from fastapi import FastAPI, UploadFile, Form
from fastapi.responses import JSONResponse
from sqlalchemy import create_engine, Column, String, Text, DateTime
from sqlalchemy.orm import sessionmaker, declarative_base
from datetime import datetime
from transformers import pipeline
import whisper
from fastapi.middleware.cors import CORSMiddleware
import os
from typing import List
from fastapi import File

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = "sqlite:///./transcriptions.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Define Database Model
class Transcription(Base):
    __tablename__ = "transcriptions"
    id = Column(String, primary_key=True, index=True)
    filename = Column(String, unique=True, nullable=False)
    transcription = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)

@app.get("/health")
def health():
    return {"status": "OK"}

@app.post("/transcribe")
async def transcribe(files: List[UploadFile] = File(...)):
    session = SessionLocal()
    try:
        model = whisper.load_model("tiny")
        responses = []
        for file in files:
            file_location = f"temp/{file.filename}"
            with open(file_location, "wb") as f:
                f.write(await file.read())
            result = model.transcribe(file_location)
            transcription = Transcription(
                id=str(datetime.now().timestamp()),
                filename=file.filename,
                transcription=result["text"],
            )
            session.add(transcription)
            responses.append({
                "filename": file.filename,
                "transcription": result["text"]
            })
            os.remove(file_location)
        session.commit()
        return {"message": "Transcription successful", "results": responses}
    except Exception as e:
        session.rollback()
        return JSONResponse(content={"error": str(e)}, status_code=500)
    finally:
        session.close()

@app.get("/transcriptions")
def get_transcriptions():
    session = SessionLocal()
    transcriptions = session.query(Transcription).all()
    session.close()
    return transcriptions

@app.get("/search")
def search_transcriptions(query: str):
    session = SessionLocal()
    result = (
        session.query(Transcription)
        .filter(Transcription.filename.contains(query))
        .all()
    )
    session.close()
    return result
