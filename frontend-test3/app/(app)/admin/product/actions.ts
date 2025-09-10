"use server";

import { ProductoActualizarDTO, ProductoCreacionDTO, ProductoDTO } from "@/interfaces/producto";
import api from "@/lib/api";
import { cookies } from "next/headers";

export async function getProductos(pagina: number, recordsPorPagina: number) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")!.value;

    const { data, headers } = await api.get<ProductoDTO[]>("/productos", {
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
        productos: data,
        totalRegistros: totalRegistros,
    };
}

export async function createProducto(producto: ProductoCreacionDTO) {
    try{
        const cookieStore = await cookies();
        const token = cookieStore.get("token")!.value;

        await api.post("/productos", producto, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return {ok: true};
    }
    catch {
        return {ok: false, error: "Error al intentar crear el producto. [Posiblemente el problema es el campo 'Precio']"};
    }
}

export async function updateProducto(id: string, producto: ProductoActualizarDTO) {
    try{
        const cookieStore = await cookies();
        const token = cookieStore.get("token")!.value;

        await api.put(`/productos/${id}`, producto, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return {ok: true};
    }
    catch {
        return {ok: false, error: "Error al intentar actualizar el producto. [Posiblemente el problema es el campo 'Precio']"}
    }
}

export async function deleteProducto(id: string) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")!.value;

        await api.delete(`/productos/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return {ok: true};
    }
    catch {
        return {ok: false};
    }
}

export async function generarReporteProductos() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")!.value;
    
    const { data } = await api.get("/productos/ReporteProductos", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        responseType: "arraybuffer",
    });

    const base64Pdf = Buffer.from(data).toString("base64");
    return base64Pdf;
}

export async function generarReporteProductosAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")!.value;
    
    const { data } = await api.get("/productos/ReporteProductosAdmin", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        responseType: "arraybuffer",
    });

    const base64Pdf = Buffer.from(data).toString("base64");
    return base64Pdf;
}