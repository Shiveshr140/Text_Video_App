from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from worker import task_text_to_video, task_code_to_video, task_query_to_video, celery_app
import os

app = FastAPI()

# Enable CORS so your Frontend can call this directly
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "https://text-video-app-ten.vercel.app",  # Your Vercel App
        "*"  # Keep wildcard for testing, but specific domains above are prioritized
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# This lets you access files like: http://localhost:8000/files/output_final.mp4
app.mount("/files", StaticFiles(directory="."), name="files")

class VideoRequest(BaseModel):
    content: str
    language: str = "english"

# --- ENDPOINT 1: TEXT TO VIDEO ---
@app.post("/generate/text")
def generate_text(body: VideoRequest):
    # Send to background queue
    task = task_text_to_video.delay(body.content, body.language)
    return {"job_id": task.id, "status": "queued"}

# --- ENDPOINT 2: CODE TO VIDEO ---
@app.post("/generate/code")
def generate_code(body: VideoRequest):
    task = task_code_to_video.delay(body.content, body.language)
    return {"job_id": task.id, "status": "queued"}

# --- ENDPOINT 3: QUERY TO VIDEO ---
@app.post("/generate/query")
def generate_query(body: VideoRequest):
    task = task_query_to_video.delay(body.content, body.language)
    return {"job_id": task.id, "status": "queued"}

# --- STATUS CHECK (POLLING) ---
@app.get("/status/{job_id}")
def get_status(job_id: str):
    task = celery_app.AsyncResult(job_id)
    
    if task.state == 'SUCCESS':
        result = task.result
        # Result is like: {'final_video': 'query_job_123_final.mp4'}
        
        if result and "final_video" in result:
            # Create the URL for the frontend
            filename = result['final_video']
            # If the path is absolute or relative, clean it up for the URL
            # For this demo, we assume the file is relative to where we started the server
            # "full_url": f"http://localhost:8000{video_url}" -> testing
            video_url = f"/files/{filename}"
            return {
                "status": "completed", 
                "video_url": video_url
            }
        else:
            return {"status": "failed", "error": "Video generation failed (No output)"}
            
    elif task.state == 'FAILURE':
        return {"status": "failed", "error": str(task.result)}
    
    # Returns "PENDING" or "STARTED"
    return {"status": "processing"}
