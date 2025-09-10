export interface ProductoDTO {
  id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  estado: boolean;
  usuarioCreacion: string;
  fechaCreacion: string;
  usuarioModificacion?: string;
  fechaModificacion?: string;
}

export interface ProductoCreacionDTO {
  nombre: string;
  descripcion?: string;
  precio: number;
  estado: boolean;
  usuarioCreacion?: string;
  fechaCreacion?: string;
}

export interface ProductoActualizarDTO {
  nombre: string;
  descripcion?: string;
  precio: number;
  estado: boolean;
  usuarioCreacion: string;
  fechaCreacion: string;
  usuarioModificacion?: string; 
  fechaModificacion?: string;
}