using backend.DTOs;

namespace backend.Services
{
    public interface IServicioReportes
    {
        byte[] GenerarReporteProductos(List<ProductoDTO> productos);
        byte[] GenerarReporteProductosAdmin(List<ProductoDTO> productos);
        byte[] GenerarReporteUsuarios(List<UsuarioDTO> usuarios);
    }
}