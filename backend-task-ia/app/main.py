from fastapi import FastAPI, Depends
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from . import models, database, auth, ml, recommend
from sqlalchemy.orm import Session
from app.schemas import PredictRequest  
from dotenv import load_dotenv
import os

load_dotenv()

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Backend Task IA")

# Origenes permitidos: por defecto "*" (cualquier origen).
# En producción puedes restringirlo con la variable ALLOWED_ORIGINS,
# por ejemplo: ALLOWED_ORIGINS=https://tu-app.vercel.app
allowed_origins = os.getenv("ALLOWED_ORIGINS", "*")
if allowed_origins.strip() == "*":
    _origins = ["*"]
else:
    _origins = [o.strip() for o in allowed_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(recommend.router) 


@app.post("/predict")
def predict(request: PredictRequest, db: Session = Depends(database.get_db), user=Depends(auth.get_current_user)):
    prediction = ml.predict_task(request.text)
    return {"texto": request.text, "requiere_ia": prediction}
