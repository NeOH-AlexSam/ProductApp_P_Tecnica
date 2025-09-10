import DescargarRepProductos from "@/components/boton-descargar/DescargarRepProductos";
import ProductTable from "@/components/product-table/ProductTable";
import { PaginacionDTO } from "@/interfaces/paginacion";
import { ProductoDTO } from "@/interfaces/producto";
import api from "@/lib/api";
import { cookies } from "next/headers";

async function getProductos(paginacion: PaginacionDTO) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")!.value;

  const { data, headers } = await api.get<ProductoDTO[]>("/productos", {
    headers: {
      Authorization: `Bearer ${token}`,
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

const RECORDS_POR_PAGINA = 5;

export default async function AppPage() {
  const paginacion: PaginacionDTO = {pagina: 1, recordsPorPagina: RECORDS_POR_PAGINA}
  const {productos, cantidadTotal} = await getProductos(paginacion);

  return(
    <div className="m-5">
      <h2 className="text-3xl font-semibold mb-4">Productos</h2>
      <DescargarRepProductos />
      <ProductTable productosIniciales={productos} totalInicial={cantidadTotal} recordsPorPagina={RECORDS_POR_PAGINA} />
    </div>
  );
}