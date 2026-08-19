from app.utils import parse_recommendation_text


SAMPLE = """Descripción de la tarea: Clasificación de imágenes con redes neuronales convolucionales.

Herramientas recomendadas:

1. PyTorch —
   Descripción: Framework de aprendizaje profundo para CNNs.
   Link verificado: https://pytorch.org/
   Motivo de recomendación: Flexible y ampliamente usado.

2. TensorFlow —
   Descripción: Plataforma para construir y desplegar CNNs.
   Link verificado: https://www.tensorflow.org/
   Motivo de recomendación: Fácil prototipado.

3. EfficientNet (paper) —
   Descripción: Arquitectura eficiente de CNNs.
   Link verificado: https://arxiv.org/abs/1905.11946
   Motivo de recomendación: State-of-the-art.
"""


def test_parse_descripcion_tarea():
    result = parse_recommendation_text(SAMPLE)
    assert "Clasificación de imágenes" in result["descripcion_tarea"]


def test_parse_numero_de_herramientas():
    result = parse_recommendation_text(SAMPLE)
    assert len(result["herramientas_recomendadas"]) == 3


def test_parse_campos_de_cada_herramienta():
    result = parse_recommendation_text(SAMPLE)
    tool = result["herramientas_recomendadas"][0]
    assert tool["nombre"].startswith("PyTorch")
    assert tool["descripcion"] != ""
    assert tool["link_verificado"] == "https://pytorch.org/"
    assert tool["motivo"] != ""


def test_parse_quita_corchetes_de_los_links():
    texto = SAMPLE.replace("https://pytorch.org/", "[https://pytorch.org/]")
    result = parse_recommendation_text(texto)
    assert result["herramientas_recomendadas"][0]["link_verificado"] == "https://pytorch.org/"


def test_parse_texto_vacio():
    result = parse_recommendation_text("")
    assert result["descripcion_tarea"] == ""
    assert result["herramientas_recomendadas"] == []


def test_parse_tolerante_a_mayusculas():
    texto = SAMPLE.replace("Descripción", "descripción")
    result = parse_recommendation_text(texto)
    assert len(result["herramientas_recomendadas"]) == 3
    assert result["herramientas_recomendadas"][0]["descripcion"] != ""