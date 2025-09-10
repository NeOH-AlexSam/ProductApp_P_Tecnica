import EditProductForm from "@/components/edit-product-form/EditProductForm";
import { ProductoDTO } from "@/interfaces/producto";
import api from "@/lib/api";
import { cookies } from "next/headers";

async function getProducto(id: string): Promise<ProductoDTO> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")!.value;

  const { data } = await api.get(`/productos/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}

export default async function EditProductPage({params}: {params: Promise<{id: string}>}) {
  const { id } = await params;
  const producto = await getProducto(id);
  
  return (
    <div className="m-5">
      <h2 className="text-3xl font-semibold mb-6">Editar Producto</h2>
      <EditProductForm producto={producto} />
    </div>
  );
}