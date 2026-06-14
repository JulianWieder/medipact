from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import auth, custom_steps, invites, mediations

app = FastAPI(title="Mediation API")

# Parse comma-separated origins from environment variable
allowed_origins = [o.strip() for o in settings.CORS_ORIGINS.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

app.include_router(auth.router)
app.include_router(invites.router)
app.include_router(mediations.router)
app.include_router(custom_steps.router)


@app.get("/health")
def health_check():
    return {"status": "ok"}
