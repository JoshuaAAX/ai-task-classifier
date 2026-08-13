import bcrypt
from jose import jwt
from datetime import datetime, timedelta
import os
import re

JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM")

def hash_password(password: str):
    password = password[:72].encode("utf-8")  # bcrypt no permite más de 72 bytes
    return bcrypt.hashpw(password, bcrypt.gensalt()).decode("utf-8")

def verify_password(plain_password, hashed_password):
    plain_password = plain_password[:72].encode("utf-8")
    try:
        return bcrypt.checkpw(plain_password, hashed_password.encode("utf-8"))
    except ValueError:
        return False
    
def create_access_token(data: dict, expires_delta: int = 60):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expires_delta)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)


"""
Convierte el texto generado por ChatGPT en un JSON estructurado.
Tolerante a mayúsculas/minúsculas y pequeñas variaciones de formato.
"""
def parse_recommendation_text(text: str):
   
    result = {
        "descripcion_tarea": "",
        "herramientas_recomendadas": []
    }

    # Normaliza saltos y espacios
    text = re.sub(r'\r', '', text).strip()

    # --- Extraer descripción de la tarea ---
    match_desc = re.search(r"(?i)descripción\s*de\s*la\s*tarea\s*[:\-–]\s*(.*)", text)
    if match_desc:
        result["descripcion_tarea"] = match_desc.group(1).strip()

    # --- Extraer las herramientas recomendadas ---
    # Busca bloques numerados como "1." o "1:" o "1 -" (ignora mayúsculas)
    tools = re.split(r"\n\s*(?:\d+[\.\-:]|•)\s*", text)
    for block in tools[1:]:  # Omitir lo anterior al primer número
        lines = [l.strip() for l in block.split("\n") if l.strip()]
        if not lines:
            continue

        # Extraer nombre de la herramienta
        nombre_match = re.match(r"([^-—:]+)", lines[0])
        nombre = nombre_match.group(1).strip() if nombre_match else "Sin nombre"

        descripcion = ""
        link = ""
        motivo = ""

        # Buscar campos clave dentro del bloque, sin importar mayúsculas
        for line in lines[1:]:
            line_lower = line.lower()
            if "descripción" in line_lower:
                descripcion = re.split(r"(?i)descripción\s*[:\-–]", line, 1)[-1].strip()
            elif "link" in line_lower:
                link = re.split(r"(?i)link\s*verificado\s*[:\-–]", line, 1)[-1].strip().strip("[]()")
            elif "motivo" in line_lower:
                motivo = re.split(r"(?i)motivo\s*de\s*recomendación\s*[:\-–]", line, 1)[-1].strip()

        result["herramientas_recomendadas"].append({
            "nombre": nombre,
            "descripcion": descripcion,
            "link_verificado": link,
            "motivo": motivo
        })

    return result