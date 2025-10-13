export interface User {
  id?: number
  name: string
  email: string
  username: string
  is_active?: boolean
}

export interface UpdateUser {
  name?: string
  email?: string
  username?: string
}

export interface LoginData {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
}

export interface RegisterData {
  name: string
  email: string
  username: string
  password: string
}export interface SettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}
