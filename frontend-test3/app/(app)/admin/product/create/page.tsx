"use client";

import { ProductoCreacionDTO } from "@/interfaces/producto";
import { Alert, Button, Checkbox, FormControlLabel, TextField } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { createProducto } from "../actions";

export default function CreateProductPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    const dto: ProductoCreacionDTO = {
      nombre: formData.get("nombre") as string,
      descripcion: formData.get("descripcion") as string,
      precio: Number(formData.get("precio")),
      estado: Boolean(formData.get("estado")),
    };

    const result = await createProducto(dto);

    if(result.ok) {
      router.push("/admin/product");
    }
    else {
      setError(result.error!);
    }
  };

  return (
    <div className="m-5">
      <h2 className="text-3xl font-semibold mb-6">Crear Producto</h2>
      {error && (<Alert severity="error" sx={{ width: 500, mb: 2 }}>{error}</Alert>)}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3"> 
        <TextField name="nombre" required variant="outlined" label="Nombre" sx={{width: 500}} />
        <TextField name="descripcion" multiline maxRows={4} variant="outlined" label="Descripción" sx={{width: 500}} />
        <TextField name="precio" required helperText={"Debe agregar un valor decimal. Ejemplo: 123.75"} variant="outlined" label="Precio" sx={{width: 500}} />
        <FormControlLabel control={<Checkbox name="estado" />} label="¿Disponible?" />
        <div className="flex flex-row gap-2">
          <Button type="submit" variant="contained">Guardar cambios</Button>
          <Link href="/admin/product"><Button variant="outlined">Regresar</Button></Link>
        </div>
      </form>
    </div>
  );
}