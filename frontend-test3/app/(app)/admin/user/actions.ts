"use server";

import { UsuarioDTO } from "@/interfaces/usuario";
import api from "@/lib/api";
import { cookies } from "next/headers";

export async function editarAdmin(email: string, esAdmin: boolean) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")!.value;

        await api.post("/usuarios/EditarAdmin", { email, esAdmin}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return {ok: true};
    }
    catch {
        return {ok: false, error: "Ocurrió un error al actualizar el rol"};
    }
}

export async function getUsuarios(pagina: number, recordsPorPagina: number) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")!.value;

    const { data, headers } = await api.get<UsuarioDTO[]>("/usuarios/ListadoUsuarios", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            pagina,
            recordsPorPagina,
        },
    });

    const totalRegistros = Number(headers["cantidad-total-registros"] ?? 0);

    return {
        usuarios: data,
        totalRegistros: totalRegistros,
    };
}

export async function generarReporteUsuario() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")!.value;
    
    const { data } = await api.get("/usuarios/ReporteUsuarios", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        responseType: "arraybuffer",
    });

    const base64Pdf = Buffer.from(data).toString("base64");
    return base64Pdf;
}