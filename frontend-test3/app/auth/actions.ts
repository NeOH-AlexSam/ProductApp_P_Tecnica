"use server";

import { CredencialesUsuarioDTO, RespuestaAutenticacionDTO } from "@/interfaces/usuario";
import api from "@/lib/api";
import { cookies } from "next/headers";

export async function login(credenciales: CredencialesUsuarioDTO) {
  try {
    const response = await api.post<RespuestaAutenticacionDTO>("/usuarios/login", credenciales);

    const data = response.data;
    
    const cookieStore = await cookies();
    cookieStore.set("token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(data.expiracion),
      path: "/",
    });

    return {ok: true};
  } catch {
    return {ok: false, error: "Credenciales inválidas"};
  }
}

export async function register(credenciales: CredencialesUsuarioDTO) {
  try {
    const response = await api.post<RespuestaAutenticacionDTO>("/usuarios/registrar", credenciales);

    const data = response.data;

    const cookieStore = await cookies();
    cookieStore.set("token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(data.expiracion),
      path: "/",
    });

    console.log("creo cookie");
    return { ok: true };
  } catch {
    return { ok: false, error: "Este usuario ya existe" };
  }
}

export async function logout() {
  (await cookies()).delete("token");
  
  return { ok: true };
}