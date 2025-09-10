using backend.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class ServicioUsuarios : IServicioUsuarios
    {
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly ApplicationDbContext context;

        public ServicioUsuarios(IHttpContextAccessor httpContextAccessor, ApplicationDbContext context)
        {
            this.httpContextAccessor = httpContextAccessor;
            this.context = context;
        }

        public async Task<Guid> ObtenerUsuarioId()
        {
            var email = httpContextAccessor.HttpContext!.User.Claims.FirstOrDefault(x => x.Type == "email")!.Value;
            var usuario = await context.Usuarios.FirstOrDefaultAsync(u => u.Email == email);
            return usuario!.Id;
        }

        public async Task<Guid> ObtenerUsuarioIdPorEmail(string email)
        {
            var usuario = await context.Usuarios.FirstOrDefaultAsync(u => u.Email == email);
            return usuario!.Id;
        }

        public async Task<string> ObtenerUsuarioEmailPorId(Guid id)
        {
            var usuario = await context.Usuarios.FirstOrDefaultAsync(u => u.Id == id);
            return usuario!.Email;
        }
    }
}
