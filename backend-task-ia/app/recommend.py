from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app import auth, database
from openai import OpenAI
from dotenv import load_dotenv
import os, requests
from app.utils import parse_recommendation_text

load_dotenv()

router = APIRouter(prefix="/recommend", tags=["Recomendaciones"])


def get_openai_client():
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Falta OPENAI_API_KEY en el entorno")
    return OpenAI(api_key=api_key)

SYSTEM_PROMPT_TEST = """Tu tarea es recomendar herramientas, papers o frameworks actuales y válidos para resolver una tarea previamente clasificada como una tarea que requiere IA.Herramientas recomendadas:
[Nombre de la herramienta o paper] — breve descripción y propósito.
Link verificado: [URL actual]
Motivo de recomendación: explicación breve.

(Repite según corresponda, máximo 3 herramientas, puede ser en Hugging Face, papers, models zoo, etc. LOS LINKS DEBEN FUNCIONAR)"""

SYSTEM_PROMPT_ZERO = """
Eres un agente inteligente especializado en Inteligencia Artificial aplicada. Tu tarea es recomendar herramientas, papers o frameworks actuales y válidos para resolver una tarea previamente clasificada como tarea que requiere IA.
Reglas estrictas:

1. Solo responde usando esta estructura EXACTA, sin desviaciones ni explicaciones extra:

Descripción de la tarea: [Muy breve resumen de la tarea entregada]

Herramientas recomendadas: 

1. [Nombre de la herramienta o paper] — 
   Descripción: breve descripción y propósito.
   Link verificado: [URL válido]
   Motivo de recomendación: breve explicación.

2. [Nombre de la herramienta o paper] —
   Descripción:  breve descripción y propósito.
   Link verificado: [URL  válido]
   Motivo de recomendación: breve explicación.

3. [Nombre de la herramienta o paper] — 
   Descripción: breve descripción y propósito.
   Link verificado: [URLválido]
   Motivo de recomendación: breve explicación.

2. No agregues más de 3 herramientas.  
3. Todos los links deben ser válidos y actuales  
4. No agregues pasos, sugerencias o comentarios adicionales.  
5. Cada descripción y motivo debe ser muy breve (1–2 líneas máximo).

Tarea: [aquí va la descripción de la tarea]
"""

# prompt del sistema de recomendacion
SYSTEM_PROMPT = """
Agente Recomendador de Herramientas de IA
Contexto del sistema:
Formas parte de una aplicación web que combina tres módulos:
1. Un modelo de clasificación que determina si una tarea requiere IA.
2. Este módulo de recomendación, encargado de sugerir herramientas relevantes.
3. Un módulo de web scraping, que se usa para recolectar información actualizada sobre las herramientas sugeridas.

Eres un agente inteligente especializado en Inteligencia Artificial aplicada.
Tu tarea es recomendar herramientas, papers o frameworks actuales y válidos para resolver una tarea previamente clasificada como una tarea que requiere IA.

Debes:
- Comprender la descripción de la tarea que se te entrega.
- Buscar y recomendar herramientas actuales (papers, modelos, APIs, librerías o frameworks).
- Verificar que los enlaces sean válidos y actualizados.
- Explicar brevemente por qué cada herramienta es adecuada.
- Proporcionar un pequeño ejemplo en Python mostrando cómo se podría utilizar una de las herramientas sugeridas.

Tu respuesta debe seguir exactamente este formato:

Descripción de la tarea:
Muy breve resumen de la tarea entregada (aclaración de brevedad).

Herramientas recomendadas:
[Nombre de la herramienta o paper] — breve descripción y propósito.
Link verificado: [URL actual]
Motivo de recomendación: explicación breve.

(Repite según corresponda, máximo 3 herramientas, puede ser en Hugging Face, papers, models zoo, etc. LOS LINKS DEBEN FUNCIONAR)

Ejemplo en Python:
Incluye un fragmento de código (máx. 20 líneas) que demuestre el uso básico de una de las herramientas recomendadas.

Sigue la estructura obligatoriamente y evita dar sugerencias después del código o cualquier otro comentario.
"""

# --- MODELO DE PETICIÓN ---
class RecommendRequest(BaseModel):
    text: str


# --- OPCIONAL: FUNCIÓN DE BÚSQUEDA EN HUGGING FACE ---
HUGGINGFACE_SEARCH_URLS = {
    "models": "https://huggingface.co/api/models",
    "papers": "https://huggingface.co/api/papers",
    "spaces": "https://huggingface.co/api/spaces"
}

def search_huggingface(category: str, query: str, limit: int = 3):
    url = f"{HUGGINGFACE_SEARCH_URLS[category]}?search={query}&limit={limit}"
    try:
        response = requests.get(url, timeout=10)
        if response.status_code != 200:
            return []
        data = response.json()
        results = []
        for item in data:
            name = item.get("id", "Sin nombre")
            desc = item.get("cardData", {}).get("description", "Sin descripción")
            if category == "papers":
                item_url = f"https://huggingface.co/papers/{name}"
            else:
                item_url = f"https://huggingface.co/{name}"
            results.append({"name": name, "description": desc, "url": item_url})
        return results
    except Exception:
        return []




# --- NUEVA RUTA PRINCIPAL DE RECOMENDACIÓN ---

@router.post("/")
def recommend_tools(
    data: RecommendRequest,
    db: Session = Depends(database.get_db),
    user=Depends(auth.get_current_user)
):
    query = data.text.strip()
    if not query:
        raise HTTPException(status_code=400, detail="Texto vacío")

    try:
        # ✅ Nueva forma con responses.create()
        response = get_openai_client().responses.create(
            model="gpt-5-mini",
            input=[
                {
                    "role": "developer",
                    "content": SYSTEM_PROMPT_ZERO
                },
                 {
                    "role": "user",
                    "content": f"La tarea es: {query}"
                }
            ],
            max_output_tokens=5000,
        )
        #print(response)
        # ✅ Extraer respuesta de texto principal
        result_text = response.output_text
        #print(result_text)

        # Parsear formato personalizado (si tu función lo hace)
        respuesta_formateada = parse_recommendation_text(result_text)

        # Buscar sugerencias complementarias
        related_models = search_huggingface("models", query)

        return {
            "query": query,
            "respuesta": result_text,
            "respuesta_formateada": respuesta_formateada,
            "huggingface_sugeridos": related_models
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error con el agente: {str(e)}")