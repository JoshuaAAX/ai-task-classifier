# IA Task Classifier

Proyecto de tesis de la **Universidad del Valle** que clasifica automáticamente si una tarea requiere el uso de inteligencia artificial y, en caso afirmativo, recomienda herramientas, papers o frameworks actuales para resolverla.

![Stack](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Stack](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![Stack](https://img.shields.io/badge/Scikit--learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)
![Stack](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)

## ✨ Características

- 🔐 **Autenticación JWT** — registro, login, perfil y cambio de contraseña.
- 🤖 **Clasificación con SVM** — modelo de Machine Learning entrenado que determina si una tarea requiere IA ("Sí" o "No").
- 🧠 **Recomendación con GPT** — cuando la tarea requiere IA, un agente basado en OpenAI recomienda hasta 3 herramientas/papers con links verificados y ejemplo en Python.
- 🔎 **Búsqueda en Hugging Face** — sugiere modelos relacionados con la tarea vía la API pública de Hugging Face.
- 💬 **Interfaz tipo chat** — dashboard con conversación estilo chat y markdown renderizado.
- 🌗 **Tema claro/oscuro** — selector de tema persistente (sistema, claro u oscuro).
- 🌐 **Multilenguaje** — interfaz en español e inglés con detección automática del navegador.

## 🏗️ Arquitectura

```
┌─────────────────────┐        ┌──────────────────────────────┐
│   Frontend          │  HTTP  │   Backend (FastAPI)          │
│   Next.js 16        │ ─────► │   Auth / predict / recommend │
│   app/ + ui/        │        │   app/                       │
└─────────────────────┘        └──────┬───────┬──────────┬────┘
                                      │       │          │
                                ┌─────┘   ┌───┴───┐  ┌───┴──────────┐
                                │ SQLite  │  SVM   │  │ OpenAI API   │
                                │ app.db  │  .pkl  │  │ + HuggingFace│
                                └─────────┴────────┘  └──────────────┘
```

### Backend — `backend-task-ia/`

| Ruta                  | Método | Descripción                                   |
|-----------------------|--------|-----------------------------------------------|
| `/auth/register`      | POST   | Registro de usuario                           |
| `/auth/login`         | POST   | Inicio de sesión (devuelve JWT)               |
| `/auth/me`            | GET    | Datos del usuario autenticado                 |
| `/auth/update`        | PUT    | Actualizar nombre/username/email              |
| `/auth/change-password`| PUT   | Cambiar contraseña                            |
| `/auth/delete`        | DELETE | Eliminación lógica de cuenta                  |
| `/predict`            | POST   | Clasifica si la tarea requiere IA (SVM)       |
| `/recommend`          | POST   | Recomienda herramientas con OpenAI + HF       |

### Frontend — `frontend-task-ia/`

- `/` — landing page
- `/auth/login`, `/auth/register` — autenticación
- `/dashboard` — chat de análisis y recomendación
- `/dashboard/profile`, `/dashboard/password` — gestión de cuenta

## 🧠 Modelo de clasificación

El modelo es un **SVM** (Support Vector Machine) sobre vectores **TF-IDF**, guardado en:

```
backend-task-ia/app/models/svm_model.pkl
backend-task-ia/app/models/tfidf_vectorizer.pkl
```

Se carga al arrancar el backend y clasifica nuevas tareas en tiempo real.

## 🚀 Ejecución local

### Requisitos

- Python 3.10+
- Node.js 18+ (probado con 22)
- pnpm o npm

### 1. Backend (FastAPI)

```bash
cd backend-task-ia

# Crear y activar entorno virtual
python -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
# 👉 Abre .env y coloca tu OPENAI_API_KEY (déjalo vacío si aún no la tienes;
#    la clasificación y la autenticación funcionan igual)

# Ejecutar el servidor
uvicorn app.main:app --reload --port 8000
```

Documentación interactiva de la API: <http://localhost:8000/docs>

### 2. Frontend (Next.js)

```bash
cd frontend-task-ia

# Instalar dependencias
npm install            # o: pnpm install

# Configurar URL del backend
cp .env.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:8000

# Ejecutar en desarrollo
npm run dev
```

Abrir <http://localhost:3000>

> ⚠️ El frontend usa `localStorage` y cookies para el token JWT. Ambas apps deben correr a la vez.

## 🔑 Variables de entorno

### Backend (`.env`)

| Variable           | Descripción                                     | Ejemplo                 |
|--------------------|-------------------------------------------------|-------------------------|
| `DATABASE_URL`     | URL de la base de datos (SQLite por defecto)    | `sqlite:///./app.db`    |
| `JWT_SECRET`       | Secreto para firmar tokens JWT                  | `cambiar-en-produccion` |
| `JWT_ALGORITHM`    | Algoritmo de firma                              | `HS256`                 |
| `OPENAI_API_KEY`   | Clave de OpenAI para recomendaciones (opcional) | *(vacío)*               |

> 💡 **Sin `OPENAI_API_KEY`**: la autenticación y la clasificación con SVM funcionan.
> Solo el módulo de recomendación (`/recommend`) devolverá error 500 hasta que la configures.

### Frontend (`.env.local`)

| Variable              | Descripción                   | Ejemplo                  |
|-----------------------|-------------------------------|--------------------------|
| `NEXT_PUBLIC_API_URL` | URL del backend FastAPI       | `http://localhost:8000`  |

## ☁️ Despliegue

### Backend → Render

> Despliegue actual: **https://ai-task-classifier-backend.onrender.com**

1. Sube el repo a GitHub.
2. En [Render](https://render.com) → **New → Web Service** (o **Blueprint** con `render.yaml`), conecta el repo.
3. Configura:
   - **Root Directory:** `backend-task-ia`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Environment Variables:** `JWT_SECRET`, `JWT_ALGORITHM=HS256`, `OPENAI_API_KEY` (necesaria para `/recommend`).
4. ⚠️ **Paso obligatorio para que las recomendaciones funcionen:** en el dashboard de Render (Service → **Environment**) agrega `OPENAI_API_KEY` con tu clave de OpenAI y haz **Deploy**.

> ℹ️ Los archivos `.pkl` del modelo ya están en el repo, así que no necesitas build extra.

### Frontend → Vercel

> ⚠️ El proyecto actual de Vercel `ai-task-classifier` sirve otra app. Para desplegar ESTE frontend:

1. En [Vercel](https://vercel.com) → **Add New Project** (o **Import** el repo `JoshuaAAX/ai-task-classifier`).
2. Configura:
   - **Root Directory:** `frontend-task-ia`
   - **Framework Preset:** Next.js
   - **Build Command:** `npm run build`
   - **Environment Variables:** `NEXT_PUBLIC_API_URL=https://ai-task-classifier-backend.onrender.com`
3. Deploy.

> ⚠️ Si mantienes el CORS en `*` no necesitas cambios. Si quieres restringirlo, en Render define `ALLOWED_ORIGINS=https://tu-dominio.vercel.app`.

## 📁 Estructura del proyecto

```
.
├── backend-task-ia/
│   ├── app/
│   │   ├── main.py          # FastAPI + CORS + rutas
│   │   ├── auth.py          # Autenticación JWT
│   │   ├── ml.py            # Carga y predicción del modelo SVM
│   │   ├── recommend.py     # Recomendación con OpenAI + Hugging Face
│   │   ├── models/          # svm_model.pkl + tfidf_vectorizer.pkl
│   │   ├── schemas.py       # Modelos Pydantic
│   │   ├── database.py      # SQLAlchemy + SQLite
│   │   └── utils.py         # bcrypt, JWT, parser de respuestas
│   ├── tests/               # Pruebas unitarias (pytest)
│   ├── requirements.txt
│   └── .env.example
└── frontend-task-ia/
    ├── app/                 # Páginas (landing, auth, dashboard)
    ├── components/          # Componentes UI (shadcn/ui, theme, i18n)
    ├── lib/                 # api.ts + i18n.ts (diccionarios es/en)
    ├── middleware.ts        # Protección de rutas /dashboard
    └── package.json
```

## 🧪 Pruebas

### Backend (pytest)

```bash
cd backend-task-ia
pip install -r requirements-dev.txt
pytest
```

Cubre: parser de recomendaciones (`parse_recommendation_text`), normalización/búsqueda en Hugging Face y endpoints de la API (registro, login, predict, recommend) con base de datos en memoria.

### Frontend (vitest)

```bash
cd frontend-task-ia
npm install
npm test
```

Cubre: diccionarios de traducción es/en, `LanguageProvider` (persistencia en localStorage) y `ThemeToggle` (cambio de tema claro/oscuro).

## 🛠️ Tecnologías

**Backend:** Python, FastAPI, SQLAlchemy, scikit-learn (SVM + TF-IDF), joblib, python-jose, bcrypt, OpenAI SDK, SQLite.

**Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, shadcn/ui, Radix UI, react-markdown, lucide-react.

## 📄 Licencia

Uso académico — Proyecto de tesis, Universidad del Valle.