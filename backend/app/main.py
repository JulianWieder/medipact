from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth, invites, mediations
from app.models.mediation import Mediation
app = FastAPI(title="Mediation API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(invites.router)
app.include_router(mediations.router)

@app.get("/health")
def health_check():
    return {"status": "ok"}