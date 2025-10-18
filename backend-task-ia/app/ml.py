import joblib
import os

# Cargar modelo y vectorizador al iniciar
MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "svm_model.pkl")
VECTORIZER_PATH = os.path.join(os.path.dirname(__file__), "models", "tfidf_vectorizer.pkl")

model = joblib.load(MODEL_PATH)
vectorizer = joblib.load(VECTORIZER_PATH)

def predict_task(text: str) -> str:
    """
    Predice si una tarea requiere IA usando el modelo SVM.
    Devuelve "Sí" o "No".
    """
    X_tfidf = vectorizer.transform([text])
    pred = model.predict(X_tfidf)[0]
    return "si" if pred == 1 else "no"