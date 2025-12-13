# Add this to your server.py

# At the top with other imports:
from fastapi.middleware.cors import CORSMiddleware

# After creating your FastAPI app (after: app = FastAPI()):
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://text-video-app-ten.vercel.app",
        "http://localhost:5173",
        "http://localhost:5174",
        "*"  # Allow all origins (you can remove this in production)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Example of what your server.py should look like:
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Your existing routes...
@app.post("/generate/text")
async def generate_text(request: dict):
    # your code
    pass
"""
