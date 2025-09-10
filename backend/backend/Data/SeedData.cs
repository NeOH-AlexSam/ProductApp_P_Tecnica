using AutoMapper;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Identity;

namespace backend.Data
{
    public static class SeedData
    {
        public static async Task SeedAdminUser(ApplicationDbContext db, IPasswordHasher<Usuario> hasher, IMapper mapper)
        {
            if (!db.Usuarios.Any())
            {
                var credenciales = new CredencialesUsuarioDTO
                { 
                    Email = "admin@gmail.com",
                    Password = "admin123"
                };

                var usuarioDTO = new UsuarioDTO
                {
                    Email = credenciales.Email,
                    EsAdmin = true
                };

                var usuario = mapper.Map<Usuario>(usuarioDTO);
                usuario.PasswordHash = hasher.HashPassword(usuario, credenciales.Password);

                db.Usuarios.Add(usuario);
                await db.SaveChangesAsync();
            }
        }
    }
}
