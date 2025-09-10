import DescargarRepUsuarios from "@/components/boton-descargar/DescargarRepUsuarios";
import UserTable from "@/components/user-table/UserTable";
import { PaginacionDTO } from "@/interfaces/paginacion";
import { UsuarioDTO } from "@/interfaces/usuario";
import api from "@/lib/api";
import { cookies } from "next/headers";

async function getUsuarios(paginacion: PaginacionDTO) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")!.value;

    const { data, headers } = await api.get<UsuarioDTO[]>("/usuarios/ListadoUsuarios", {
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
        usuarios: data,
        cantidadTotal: totalRegistros,
    };
}

const RECORDS_POR_PAGINA = 5;

export default async function UserPage() {
    const paginacion: PaginacionDTO = {pagina: 1, recordsPorPagina: RECORDS_POR_PAGINA}
    const {usuarios, cantidadTotal} = await getUsuarios(paginacion);

    return (
        <div className="m-5">
            <h2 className="text-3xl font-semibold mb-4">Listado de Usuarios</h2>
            <DescargarRepUsuarios />
            <UserTable registrosIniciales={usuarios} totalInicial={cantidadTotal} recordsPorPagina={RECORDS_POR_PAGINA} />
        </div>
    );
}