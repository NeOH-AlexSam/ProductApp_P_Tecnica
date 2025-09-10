"use client";

import { Button } from "@mui/material";
import { FormEvent } from "react";
import { useFormStatus } from "react-dom";

export default function DeleteButton({id, action}: {id: string; action: (id: string) => Promise<void>}) {
    const { pending } = useFormStatus();

    async function handleSubmit(e: FormEvent<HTMLFormElement>){
        e.preventDefault();

        const confirmDelete = window.confirm("¿Estás seguro de eliminar este producto?");
        if(!confirmDelete) return;

        await action(id);
    }

    return (
        <form onSubmit={handleSubmit}>
            <Button type="submit" variant="contained" size="small" color="error" disabled={pending}>
                {pending ? "Eliminando..." : "Eliminar"}
            </Button>
        </form>
    );
}