from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .api.v1 import upload, generate, decks

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API cho hệ thống học tập trò chơi hóa bằng AI (Chicken Shooter, Magic Touch, Quiz Arena)",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix=f"{settings.API_V1_STR}", tags=["Upload & Parse"])
app.include_router(generate.router, prefix=f"{settings.API_V1_STR}", tags=["AI Content Generator"])
app.include_router(decks.router, prefix=f"{settings.API_V1_STR}", tags=["Learning Decks"])

@app.get("/")
async def root():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "docs_url": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
