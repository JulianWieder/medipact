from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import auth, custom_steps, invites, mediations, phase_step_defaults

app = FastAPI(title="Mediation API")

allowed_origins = settings.cors_origins_list

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
app.include_router(phase_step_defaults.router)


@app.get("/health")
def health_check():
    return {"status": "ok"}
