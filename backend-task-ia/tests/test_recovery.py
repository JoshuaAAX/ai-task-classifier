import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app import database, models
from app.main import app


@pytest.fixture()
def client(monkeypatch):
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


def _register(client):
    res = client.post(
        "/auth/register",
        json={
            "name": "Test",
            "username": "recovery",
            "email": "recovery@example.com",
            "password": "Vieja1234",
        },
    )
    assert res.status_code == 200


def test_forgot_password_devuelve_enlace_sin_smtp(client):
    _register(client)
    res = client.post("/auth/forgot-password", json={"email": "recovery@example.com"})
    assert res.status_code == 200
    data = res.json()
    assert data["dev_mode"] is True
    assert data["reset_link"].startswith("http://localhost:3000/auth/reset-password?token=")


def test_forgot_password_no_revela_si_correo_no_existe(client):
    res = client.post("/auth/forgot-password", json={"email": "nadie@example.com"})
    assert res.status_code == 200
    assert "reset_link" not in res.json()


def test_reset_password_cambia_contrasena(client):
    _register(client)
    res = client.post("/auth/forgot-password", json={"email": "recovery@example.com"})
    token = res.json()["reset_link"].split("token=")[1]

    res = client.post(
        "/auth/reset-password",
        json={"token": token, "new_password": "Nueva1234"},
    )
    assert res.status_code == 200

    # La contraseña nueva funciona
    res = client.post(
        "/auth/login",
        json={"email": "recovery@example.com", "password": "Nueva1234"},
    )
    assert res.status_code == 200

    # La anterior ya no funciona
    res = client.post(
        "/auth/login",
        json={"email": "recovery@example.com", "password": "Vieja1234"},
    )
    assert res.status_code == 401


def test_reset_password_token_invalido(client):
    res = client.post(
        "/auth/reset-password",
        json={"token": "token-falso", "new_password": "Nueva1234"},
    )
    assert res.status_code == 400
    assert "inválido" in res.json()["detail"]


def test_reset_password_token_no_reutilizable(client):
    _register(client)
    res = client.post("/auth/forgot-password", json={"email": "recovery@example.com"})
    token = res.json()["reset_link"].split("token=")[1]

    first = client.post(
        "/auth/reset-password",
        json={"token": token, "new_password": "Nueva1234"},
    )
    assert first.status_code == 200

    second = client.post(
        "/auth/reset-password",
        json={"token": token, "new_password": "Otra1234"},
    )
    assert second.status_code == 400
    assert "ya fue utilizado" in second.json()["detail"]