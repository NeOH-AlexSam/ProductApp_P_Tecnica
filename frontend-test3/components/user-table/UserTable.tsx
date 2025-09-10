"use client";

import { editarAdmin, getUsuarios } from "@/app/(app)/admin/user/actions";
import { UsuarioDTO } from "@/interfaces/usuario";
import { Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TablePagination, Button } from "@mui/material";
import { useState } from "react";

interface Props {
  registrosIniciales: UsuarioDTO[];
  totalInicial: number;
  recordsPorPagina: number;
}

export default function ProductTable({registrosIniciales, totalInicial, recordsPorPagina}: Props) {
    const [usuarios, setUsuarios] = useState(registrosIniciales);
    const [totalRegistros, setTotalRegistros] = useState(totalInicial);
    const [pagina, setPagina] = useState(0);

    const handleChangePage = async (_event: unknown, newPage: number) => {
        setPagina(newPage);
        const { usuarios, totalRegistros } = await getUsuarios(newPage + 1, recordsPorPagina); // backend es 1-based

        setUsuarios(usuarios);
        setTotalRegistros(totalRegistros);
    };

    const handleEditarAdmin = async (email: string, esAdmin: boolean) => {
        const result = await editarAdmin(email, esAdmin);

        if(result.ok){
            setUsuarios((prev) => prev.map((u) => 
                u.email === email ? {...u, esAdmin: esAdmin}: u
            ));
        }
        else {
            alert(result.error);
        }
    };

    return(
        <Paper sx={{width: "100%" }}>
            <TableContainer>
                <Table sx={{minWidth: 750}}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Correo Electrónico</TableCell>
                            <TableCell>¿Es administrador?</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {usuarios.map((usuario) => (
                            <TableRow key={usuario.id}>
                                <TableCell>{usuario.email}</TableCell>
                                <TableCell>{usuario.esAdmin ? "SÍ" : "NO"}</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="success" size="small" 
                                    disabled={usuario.esAdmin} onClick={() => handleEditarAdmin(usuario.email, true)}
                                     sx={{ mr: 2}}>Hacer admin</Button>
                                    <Button variant="contained" color="error" size="small"
                                    disabled={!usuario.esAdmin} onClick={() => handleEditarAdmin(usuario.email, false)}>Quitar admin</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination component="div" 
            count={totalRegistros} 
            page={pagina} 
            rowsPerPage={recordsPorPagina} 
            onPageChange={handleChangePage}
            rowsPerPageOptions={[recordsPorPagina]}
            />
        </Paper>
    );
}
