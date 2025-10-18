from fastapi import FastAPI, Depends
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from . import models, database, auth, ml, recommend
from sqlalchemy.orm import Session
from app.schemas import PredictRequest  

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Backend Task IA")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # en prod cámbialo a tu dominio Next.js
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
