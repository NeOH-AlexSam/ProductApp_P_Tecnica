"use client";

import { CredencialesUsuarioDTO } from "@/interfaces/usuario";
import { TextField, Button, Alert } from "@mui/material";
import Link from "next/link";
import { register } from "../actions";
import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [credenciales, setCredenciales] = useState<CredencialesUsuarioDTO>({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCredenciales({
      ...credenciales,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const result = await register(credenciales);

    if(result.ok){
      router.push("/");
    }
    else {
      setError(result.error!);
    }
  }

  return (
    <div className="flex flex-col min-h-screen pt-45">
      <h1 className="text-4xl ml-2 mb-2">Registrarse</h1>
      {error && (
          <Alert severity="error" sx={{ m: 1 }}>
            {error}
          </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <div className="flex">
          <TextField name="email" type="email" helperText required variant='outlined' label='Correo electrónico' sx={{m: 1, width: '50ch' }} 
          onChange={handleChange} />
        </div>
        <div className="flex">
          <TextField name="password" type="password" helperText required variant='outlined' label='Contraseña' sx={{m: 1, width: '50ch' }} 
          onChange={handleChange} />
        </div>
        <div className="flex flex-col">
          <Button type="submit" variant='contained' color='primary' sx={{m: 1}}>Crear cuenta</Button>
        </div>
        <div className="flex flex-col">
          <Link href="/auth/login" className="flex flex-col">
            <Button variant='outlined' color='primary' sx={{m: 1}}>Iniciar sesión</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}