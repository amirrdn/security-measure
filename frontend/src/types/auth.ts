export interface User {
  id: number;
  email: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  token: string;
}

export interface RegisterResponse {
  message: string;
}

export interface AuthError {
  message: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData extends LoginFormData {
  confirmPassword: string;
} 