export interface UsuarioDTO {
  id: string;
  email: string;
  esAdmin: boolean;
}

export interface CredencialesUsuarioDTO {
  email: string;
  password: string;
}

export interface RespuestaAutenticacionDTO {
  token: string;
  expiracion: string;
}

export interface EditarAdminDTO {
  email: string;
  esAdmin: boolean;
}