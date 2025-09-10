
namespace backend.Services
{
    public interface IServicioUsuarios
    {
        Task<Guid> ObtenerUsuarioId();
        Task<Guid> ObtenerUsuarioIdPorEmail(string email);
        Task<string> ObtenerUsuarioEmailPorId(Guid id);
    }
}