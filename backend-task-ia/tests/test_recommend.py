import app.recommend as rec
from app.recommend import _normalize_query


def test_normalize_quita_acentos():
    assert _normalize_query("Traducción automática") == "Traduccion automatica"


def test_normalize_mantiene_palabras_sin_acentos():
    assert _normalize_query("Clasificación de imágenes") == "Clasificacion de imagenes"


def test_normalize_strip():
    assert _normalize_query("  reconocimiento facial  ") == "reconocimiento facial"


def test_search_fallback_a_palabras_clave(monkeypatch):
    """Si la consulta completa no devuelve nada, usa palabras clave."""
    llamadas = []

    def fake_search(url, limit=3):
        llamadas.append(url)
        if "search=traduccion" in url.lower():
            return [{"name": "modelo/traduccion", "description": "Desc"}]
        return []

    monkeypatch.setattr(rec, "_hf_search", fake_search)

    result = rec.search_huggingface("models", "Traducción automática de documentos legales", limit=3)
    assert any("traduccion" in u.lower() for u in llamadas)
    assert result[0]["name"] == "modelo/traduccion"
    assert result[0]["url"] == "https://huggingface.co/modelo/traduccion"


def test_search_dedup_por_nombre(monkeypatch):
    def fake_search(url, limit=3):
        return [{"name": "mismo/modelo", "description": "Desc"}]

    monkeypatch.setattr(rec, "_hf_search", fake_search)
    result = rec.search_huggingface("models", "clasificación de imágenes", limit=3)
    assert len(result) == 1


def test_search_categoria_invalida():
    assert rec.search_huggingface("invalida", "algo") == []