import type { User, UpdateUser, LoginData, LoginResponse, RegisterData, AnalyzeResult } from "@/types/user"

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// Obtener token desde localStorage
function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token")
  }
  return null
}

// Obtener usuario actual
export async function getCurrentUser(): Promise<User> {
  const token = getToken()
  if (!token) throw new Error("Token no encontrado")

  const res = await fetch(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) throw new Error("Error al obtener usuario")
  return res.json()
}

// Actualizar usuario
export async function updateUser(data: UpdateUser): Promise<{ msg: string }> {
  const token = getToken()
  if (!token) throw new Error("Token no encontrado")

  const res = await fetch(`${API_URL}/auth/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || "Error al actualizar usuario")
  }

  return res.json()
}


export async function loginUser(data: LoginData): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  const result = await res.json()

  if (!res.ok) {
    // backend podría devolver {"detail": "..."} o {"message": "..."}
    throw new Error(result.detail || result.message || "Error al iniciar sesión")
  }

  return result
}


export async function registerUser(data: RegisterData): Promise<User> {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  const json = await res.json()

  if (!res.ok) {
    let errorMsg = "Error al registrarse"

    if (Array.isArray(json.detail) && json.detail.length > 0) {
      errorMsg = json.detail[0].msg
    } else if (typeof json.detail === "string") {
      errorMsg = json.detail
    } else if (json.message) {
      errorMsg = json.message
    }

    throw new Error(errorMsg)
  }

  return json
}


// cambiar la contraseña
export async function changePassword(old_password: string, new_password: string): Promise<{ msg: string }> {
  const token = getToken()
  if (!token) throw new Error("Token no encontrado")

  const res = await fetch(`${API_URL}/auth/change-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ old_password, new_password }),
  })

  const json = await res.json()
  if (!res.ok) {
    throw new Error(json.detail || json.message || "Error al cambiar la contraseña")
  }

  return json
}

// enviar la tarea para predecir con ia
export async function analyzeTask(task: string): Promise<AnalyzeResult> {
  const token = getToken()
  if (!token) throw new Error("Token no encontrado")

  const res = await fetch(`${API_URL}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text: task }),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.detail || "Error analizando tarea")
  }

  return {
    requiresAI: data.requiere_ia === "si" || data.requiere_ia === true,
    text: data.texto || "Resultado recibido del modelo IA",
  }
}


export async function recommendTools(task: string) {
  const token = localStorage.getItem("auth_token")
  if (!token) throw new Error("Token no encontrado")

  const res = await fetch(`${API_URL}/recommend`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text: task }),
  })

  const text = await res.text()

  if (!res.ok) {
    console.error("❌ Error backend:", res.status, text)
    throw new Error(`Error obteniendo recomendaciones: ${res.status}`)
  }

  // intentar parsear JSON seguro
  try {
    return JSON.parse(text)
  } catch (err) {
    console.error("⚠️ Respuesta no es JSON válido:", text)
    throw new Error("Respuesta inválida del servidor")
  }

}
