from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import (
    ai_prompts,
    auth,
    block_responses,
    custom_steps,
    dev_test,
    discounts,
    integrations,
    invites,
    invoices,
    mediation_variants,
    mediations,
    organizations,
    phase_step_defaults,
    step_content,
)

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
app.include_router(mediation_variants.router)
app.include_router(step_content.router)
app.include_router(block_responses.router)
app.include_router(invoices.router)
app.include_router(integrations.router)
app.include_router(ai_prompts.router)
app.include_router(discounts.router)
app.include_router(organizations.router)

# Dev-Test-Endpunkte (Gemini/Claude/PayPal). Über ENABLE_DEV_TEST steuerbar –
# funktioniert auch auf dem Live-Server (nur per localhost:8000 erreichbar, da
# der Port auf 127.0.0.1 gebunden ist und nginx /v1 nicht weiterleitet).
if settings.ENABLE_DEV_TEST:
    app.include_router(dev_test.router)


@app.get("/health")
def health_check():
    return {"status": "ok"}
