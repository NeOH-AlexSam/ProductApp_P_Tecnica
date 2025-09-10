"use client";

import { logout } from "@/app/auth/actions"
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material"
import Link from "next/link"
import { useRouter } from "next/navigation";

export const TopMenu = ({isAdmin}: {isAdmin: boolean}) => {
    const router = useRouter();

    const handleLogout = async () => {

        const  confirmLogout = window.confirm("¿Estás seguro que deseas cerrar sesión?");

        if(!confirmLogout) return;

        const res = await logout();
        if(res.ok){
            router.push("/auth/login");
        }
    }

    return (
        <div>
            <AppBar position='static' color='transparent'>
                <Toolbar>
                    <Link href="/"><Typography variant='h6' sx={{mr: 4}}>Product App</Typography></Link>
                    {isAdmin && (
                        <>
                            <Link href="/admin/product"><Button size='small' color='inherit' sx={{mr: 2}}>Productos</Button></Link>
                            <Link href="/admin/user"><Button size='small' color='inherit' sx={{mr: 2}}>Usuarios</Button></Link>
                        </>
                    )}
                    <Box sx={{flexGrow: 1}}></Box>
                    <Button size="small" color="inherit" onClick={handleLogout}>Logout</Button>
                </Toolbar>
            </AppBar>
        </div>
    )
}