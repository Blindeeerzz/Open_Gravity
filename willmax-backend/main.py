from fastapi import FastAPI, Request, BackgroundTasks, HTTPException, Header
import stripe
import os
import json
from pydantic import BaseModel
from datetime import datetime

# TODO: Configurar con variables de entorno reales en producción
STRIPE_API_KEY = os.getenv("STRIPE_API_KEY", "sk_test_placeholder")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "whsec_placeholder")

stripe.api_key = STRIPE_API_KEY

app = FastAPI(title="WM Ai Systems - Backend OSINT", version="1.0.0")

class TargetInfo(BaseModel):
    target_type: str
    target_value: str

# ---------------------------------------------------------
# MOCK DE AGENT ZERO: Función asíncrona de simulación
# ---------------------------------------------------------
def run_aegis_osint(target_type: str, target_value: str, customer_email: str):
    """
    Simulación de la ejecución de Agent Zero para recopilar OSINT.
    En producción, esto invocaría el pipeline de LangChain / Scripts Python reales.
    """
    print(f"[AGENT ZERO] Iniciando rastreo OSINT sobre {target_type}: {target_value}")
    
    # Simular tiempo de espera
    import time
    # time.sleep(10) # Simulación de tiempo real
    
    print(f"[AGENT ZERO] Rastreo finalizado. Compilando PDF...")
    
    # TODO: Enviar email con el PDF adjunto al customer_email
    print(f"[AGENT ZERO] Reporte Táctico enviado a {customer_email}")


# ---------------------------------------------------------
# ENDPOINTS
# ---------------------------------------------------------

@app.get("/")
def read_root():
    return {"status": "Aegis Backend is Online"}

@app.post("/api/webhook/stripe")
async def stripe_webhook(request: Request, stripe_signature: str = Header(None), background_tasks: BackgroundTasks = BackgroundTasks()):
    """
    Webhook de Stripe para escuchar pagos completados y lanzar Aegis.
    """
    payload = await request.body()

    try:
        # En desarrollo, ignoramos la firma real si es placeholder
        if STRIPE_WEBHOOK_SECRET == "whsec_placeholder":
            event = json.loads(payload)
        else:
            event = stripe.Webhook.construct_event(
                payload, stripe_signature, STRIPE_WEBHOOK_SECRET
            )
    except ValueError as e:
        # Invalid payload
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        raise HTTPException(status_code=400, detail="Invalid signature")

    # Escuchar cuando el pago se haya completado
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        
        # Recuperamos metadata que pasamos desde Frontend (React)
        customer_email = session.get("customer_details", {}).get("email")
        target_type = session.get("metadata", {}).get("target_type", "unknown")
        target_value = session.get("metadata", {}).get("target_value", "unknown")

        print(f"Pago confirmado por Stripe. Cliente: {customer_email}")

        # Lanzar tarea en segundo plano para no bloquear el Webhook (Stripe exige respuesta 200 rápida)
        background_tasks.add_task(run_aegis_osint, target_type, target_value, customer_email)

    return {"status": "success"}

# Para ejecutar: uvicorn main:app --reload
