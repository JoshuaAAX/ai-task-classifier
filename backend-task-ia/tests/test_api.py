import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app import database, models
from app.main import app


@pytest.fixture()
def client(monkeypatch):
    # Base de datos en memoria aislada para cada test
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    TestingSession = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    models.Base.metadata.create_all(bind=engine)

    def override_get_db():
        db = TestingSession()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[database.get_db] = override_get_db

    with TestClient(app) as tc:
        yield tc

    app.dependency_overrides.clear()


@pytest.fixture()
def auth_token(client):
    client.post(
        "/auth/register",
        json={
            "name": "Test",
            "username": "testuser",
            "email": "test@example.com",
            "password": "Test1234",
        },
    )
    res = client.post(
        "/auth/login",
        json={"email": "test@example.com", "password": "Test1234"},
    )
    assert res.status_code == 200
    return res.json()["access_token"]


def test_registro_exitoso(client):
    res = client.post(
        "/auth/register",
        json={
            "name": "Ana",
            "username": "ana",
            "email": "ana@example.com",
            "password": "Clave1234",
        },
    )
    assert res.status_code == 200
    assert res.json()["msg"] == "Usuario creado exitosamente"


def test_registro_correo_duplicado(client, auth_token):
    res = client.post(
        "/auth/register",
        json={
            "name": "Otro",
            "username": "otro",
            "email": "test@example.com",
            "password": "Clave1234",
        },
    )
    assert res.status_code == 400
    assert "ya registrado" in res.json()["detail"]


def test_login_credenciales_incorrectas(client):
    res = client.post(
        "/auth/login",
        json={"email": "test@example.com", "password": "incorrecta"},
    )
    assert res.status_code == 401


def test_auth_me_requiere_token(client):
    res = client.get("/auth/me")
    assert res.status_code == 401


def test_auth_me_devuelve_usuario(client, auth_token):
    res = client.get("/auth/me", headers={"Authorization": f"Bearer {auth_token}"})
    assert res.status_code == 200
    assert res.json()["email"] == "test@example.com"


def test_predict_requiere_ia(client, auth_token):
    res = client.post(
        "/predict",
        json={"text": "Desarrollar un sistema de reconocimiento facial con deep learning"},
        headers={"Authorization": f"Bearer {auth_token}"},
    )
    assert res.status_code == 200
    assert res.json()["requiere_ia"] in ("si", "no")


def test_predict_sin_token(client):
    res = client.post("/predict", json={"text": "Tarea cualquiera"})
    assert res.status_code == 401


def test_recommend_devuelve_recomendaciones(client, auth_token, monkeypatch):
    class FakeResponse:
        output_text = (
            "Descripción de la tarea: Clasificación de imágenes.\n\n"
            "Herramientas recomendadas:\n\n"
            "1. PyTorch —\n"
            "   Descripción: Framework de deep learning.\n"
            "   Link verificado: https://pytorch.org/\n"
            "   Motivo de recomendación: Muy usado.\n"
        )

    class FakeResponses:
        def create(self, **kwargs):
            return FakeResponse()

    class FakeOpenAI:
        def __init__(self):
            self.responses = FakeResponses()

    monkeypatch.setattr("app.recommend.get_openai_client", lambda: FakeOpenAI())
    monkeypatch.setattr("app.recommend.search_huggingface", lambda *a, **k: [])

    res = client.post(
        "/recommend",
        json={"text": "Clasificación de imágenes"},
        headers={"Authorization": f"Bearer {auth_token}"},
    )
    assert res.status_code == 200
    data = res.json()
    assert data["respuesta"]
    assert len(data["respuesta_formateada"]["herramientas_recomendadas"]) == 1
    assert data["respuesta_formateada"]["herramientas_recomendadas"][0]["nombre"].startswith("PyTorch")