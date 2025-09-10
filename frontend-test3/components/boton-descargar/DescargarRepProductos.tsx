"use client";

import { generarReporteProductos } from "@/app/(app)/admin/product/actions";
import { Button } from "@mui/material";

export default function DescargarRepProductos() {
    const handleDownload = async () => {
        const base64 = await generarReporteProductos();
        const blob = new Blob([Uint8Array.from(atob(base64), c => c.charCodeAt(0))], {
            type: "application/pdf",
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "ReporteProductos.pdf";
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <Button variant="contained" color="info" onClick={handleDownload} sx={{mb: 2}}>Descargar PDF</Button>
    );
}