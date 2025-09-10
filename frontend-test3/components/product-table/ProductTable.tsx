"use client";

import { ProductoDTO } from "@/interfaces/producto";
import api from "@/lib/api";
import { Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TablePagination } from "@mui/material";
import { useState } from "react";

interface Props {
  productosIniciales: ProductoDTO[];
  totalInicial: number;
  recordsPorPagina: number;
}

async function getProductos(pagina: number, recordsPorPagina: number) {
    const { data, headers } = await api.get<ProductoDTO[]>("/productos", {
        params: {
            pagina,
            recordsPorPagina,
        }
    });

    const totalRegistros = Number(headers["cantidad-total-registros"] ?? 0);

    return {
        productos: data,
        totalRegistros: totalRegistros,
    };
}

export default function ProductTable({productosIniciales, totalInicial, recordsPorPagina}: Props) {
    const [productos, setProductos] = useState(productosIniciales);
    const [totalRegistros, setTotalRegistros] = useState(totalInicial);
    const [pagina, setPagina] = useState(0);

    const handleChangePage = async (_event: unknown, newPage: number) => {
        setPagina(newPage);
        const { productos, totalRegistros } = await getProductos(newPage + 1, recordsPorPagina); // backend es 1-based

        setProductos(productos);
        setTotalRegistros(totalRegistros);
    };

    return(
        <Paper sx={{width: "100%" }}>
            <TableContainer>
                <Table sx={{minWidth: 750}}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Precio</TableCell>
                            <TableCell>¿Disponible?</TableCell>
                            <TableCell>Descripción</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {productos.map((producto) => (
                            <TableRow key={producto.id}>
                                <TableCell>{producto.nombre}</TableCell>
                                <TableCell>{`B/. ${producto.precio.toFixed(2)}`}</TableCell>
                                <TableCell>{producto.estado ? "SÍ" : "NO"}</TableCell>
                                <TableCell>{producto.descripcion}</TableCell>
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
