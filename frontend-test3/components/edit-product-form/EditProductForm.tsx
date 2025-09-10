"use client";

import { updateProducto } from "@/app/(app)/admin/product/actions";
import { ProductoActualizarDTO, ProductoDTO } from "@/interfaces/producto";
import { Alert, Button, Checkbox, FormControlLabel, TextField } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function EditProductForm({producto}: {producto: ProductoDTO}) {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        const formData = new FormData(e.currentTarget);

        const dto: ProductoActualizarDTO = {
            nombre: formData.get("nombre") as string,
            descripcion: formData.get("descripcion") as string,
            precio: Number(formData.get("precio")),
            estado: Boolean(formData.get("estado")),
            usuarioCreacion: producto.usuarioCreacion, // se conserva
            fechaCreacion: producto.fechaCreacion,     // se conserva
        };

        const result = await updateProducto(producto.id, dto);

        if(result.ok){
            router.push("/admin/product");
        }
        else {
            setError(result.error!);
        }
    };

    return(
        <>
            {error && (<Alert severity="error" sx={{width: 500, mb: 2}}>{error}</Alert>)}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <TextField name="nombre" required variant="outlined" label="Nombre" sx={{width: 500}} defaultValue={producto.nombre} />
                <TextField name="descripcion" multiline maxRows={4} variant="outlined" label="Descripción" sx={{width: 500}} defaultValue={producto.descripcion} />
                <TextField name="precio" helperText={"Debe agregar un valor decimal. Ejemplo: 123.75"} required variant="outlined" label="Precio" sx={{width: 500}} defaultValue={producto.precio} />
                <FormControlLabel control={<Checkbox name="estado" defaultChecked={producto.estado} />} label="¿Disponible?" />
                <div className="flex flex-row gap-2">
                    <Button type="submit" variant="contained">Guardar cambios</Button>
                    <Link href="/admin/product"><Button variant="outlined">Regresar</Button></Link>
                </div>
            </form>
        </>
    );
}