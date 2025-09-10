"use client";

import { ProductoDTO } from "@/interfaces/producto";
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import { deleteProducto, getProductos } from "@/app/(app)/admin/product/actions";
import DeleteButton from "../compartidos/delete-button/DeleteButton";

interface Props {
  productosIniciales: ProductoDTO[];
  totalInicial: number;
  recordsPorPagina: number;
}

export default function ProductTableAdmin({productosIniciales, totalInicial, recordsPorPagina}: Props) {
    const [productos, setProductos] = useState(productosIniciales);
    const [totalRegistros, setTotalRegistros] = useState(totalInicial);
    const [pagina, setPagina] = useState(0);

    const handleChangePage = async (_event: unknown, newPage: number) => {
        setPagina(newPage);
        const { productos, totalRegistros } = await getProductos(newPage + 1, recordsPorPagina); // backend es 1-based

        setProductos(productos);
        setTotalRegistros(totalRegistros);
    };

    const handleDelete = async (id: string) => {
        const result = await deleteProducto(id);

        if(result.ok){
            setPagina(0);
            // Recargar la página actual
            const { productos, totalRegistros } = await getProductos(1, recordsPorPagina);

            setProductos(productos);
            setTotalRegistros(totalRegistros);
        }
    }

    return(
        <Paper sx={{width: "100%" }}>
            <TableContainer>
                <Table sx={{minWidth: 750}}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Precio</TableCell>
                            <TableCell>¿Disponible?</TableCell>
                            <TableCell>Creado por</TableCell>
                            <TableCell>Creado</TableCell>
                            <TableCell>Modificado por</TableCell>
                            <TableCell>Modificado</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {productos.map((producto) => (
                            <TableRow key={producto.id}>
                                <TableCell>{producto.nombre}</TableCell>
                                <TableCell>{`B/. ${producto.precio.toFixed(2)}`}</TableCell>
                                <TableCell>{producto.estado ? "SÍ" : "NO"}</TableCell>
                                <TableCell>{producto.usuarioCreacion}</TableCell>
                                <TableCell>{new Date(producto.fechaCreacion).toLocaleString()}</TableCell>
                                <TableCell>{producto.usuarioModificacion}</TableCell>
                                <TableCell>
                                    {producto.fechaModificacion ? new Date(producto.fechaModificacion).toLocaleString() : producto.fechaModificacion}
                                </TableCell>
                                <TableCell>
                                    <Link href={`/admin/product/edit/${producto.id}`}>
                                        <Button variant="contained" size="small" sx={{mb: 2}}>Editar</Button>
                                    </Link>
                                    <DeleteButton id={producto.id} action={handleDelete} />
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
    )
}