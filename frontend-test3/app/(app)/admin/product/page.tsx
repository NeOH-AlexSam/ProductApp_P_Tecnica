import DescargarRepProdAdmin from "@/components/boton-descargar/DescargarRepProdAdmin";
import ProductTableAdmin from "@/components/product-table/ProductTableAdmin";
import { PaginacionDTO } from "@/interfaces/paginacion";
import { ProductoDTO } from "@/interfaces/producto";
import api from "@/lib/api";
import { Button } from "@mui/material";
import { cookies } from "next/headers";
import Link from "next/link";

async function getProductos(paginacion: PaginacionDTO) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")!.value;

    const { data, headers } = await api.get<ProductoDTO[]>("/productos", {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        pagina: paginacion.pagina,
        recordsPorPagina: paginacion.recordsPorPagina,
      }
    });

    const totalRegistros = Number(headers["cantidad-total-registros"] ?? 0);

    return {
        productos: data,
        cantidadTotal: totalRegistros,
    };
}

const RECORDS_POR_PAGINA = 3;

export default async function ProductPage() {
    const paginacion: PaginacionDTO = {pagina: 1, recordsPorPagina: RECORDS_POR_PAGINA}
    const {productos, cantidadTotal} = await getProductos(paginacion);

    return (
    <div className="m-5">
      <h2 className="text-3xl font-semibold mb-4">Listado de Productos</h2>
      <div className="flex flex-row gap-2 mb-2">
        <Link href="/admin/product/create">
          <Button variant="contained" color="success">
            Crear producto
          </Button>
        </Link>
        <DescargarRepProdAdmin />
      </div>
      <ProductTableAdmin productosIniciales={productos} totalInicial={cantidadTotal} recordsPorPagina={RECORDS_POR_PAGINA} />
    </div>
  );
}