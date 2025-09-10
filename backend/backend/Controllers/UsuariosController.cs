using AutoMapper;
using AutoMapper.QueryableExtensions;
using backend.Data;
using backend.DTOs;
using backend.Models;
using backend.Services;
using backend.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;

namespace backend.Controllers
{
    [Route("api/usuarios")]
    [ApiController]
    public class UsuariosController : ControllerBase
    {
        private readonly ApplicationDbContext context;
        private readonly IConfiguration configuration;
        private readonly IMapper mapper;
        private readonly PasswordHasher<Usuario> passwordHasher;
        private readonly IServicioReportes servicioReportes;

        public UsuariosController(ApplicationDbContext context, IConfiguration configuration, IMapper mapper,
            PasswordHasher<Usuario> passwordHasher, IServicioReportes servicioReportes)
        {
            this.context = context;
            this.configuration = configuration;
            this.mapper = mapper;
            this.passwordHasher = passwordHasher;
            this.servicioReportes = servicioReportes;
        }

        [HttpGet("ListadoUsuarios")]
        [Authorize(Policy = "esadmin")]
        public async Task<ActionResult<List<UsuarioDTO>>> ListadoUsuarios([FromQuery] PaginacionDTO paginacion)
        {
            var queryable = context.Usuarios;
            await HttpContext.InsertarParametrosPaginacionEnCabecera(queryable);
            var usuarios = await queryable
                .OrderBy(p => p.Email)
                .Paginar(paginacion)
                .ProjectTo<UsuarioDTO>(mapper.ConfigurationProvider)
                .ToListAsync();

            return usuarios;
        }

        [HttpGet("ReporteUsuarios")]
        [Authorize(Policy = "esadmin")]
        public async Task<IActionResult> GenerarReporteUsuarios()
        {
            var usuarios = await context.Usuarios.ProjectTo<UsuarioDTO>(mapper.ConfigurationProvider).ToListAsync();

            var pdfBytes = servicioReportes.GenerarReporteUsuarios(usuarios);
            return File(pdfBytes, "application/pdf", "ReporteUsuarios.pdf");
        }

        [HttpPost("registrar")]
        [AllowAnonymous]
        public async Task<ActionResult<RespuestaAutenticacionDTO>> Registrar(CredencialesUsuarioDTO credencialesUsuarioDTO)
        {
            if (await context.Usuarios.AnyAsync(u => u.Email == credencialesUsuarioDTO.Email))
            {
                return BadRequest("El correo ya está registrado.");
            }

            var usuarioDTO = new UsuarioDTO
            {
                Email = credencialesUsuarioDTO.Email,
                EsAdmin = false
            };

            var usuario = mapper.Map<Usuario>(usuarioDTO);

            usuario.PasswordHash = passwordHasher.HashPassword(usuario, credencialesUsuarioDTO.Password);

            context.Usuarios.Add(usuario);
            await context.SaveChangesAsync();

            return ConstruirToken(usuarioDTO);
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<RespuestaAutenticacionDTO>> Login(CredencialesUsuarioDTO credencialesUsuarioDTO)
        {
            var usuario = await context.Usuarios.FirstOrDefaultAsync(u => u.Email == credencialesUsuarioDTO.Email);

            if(usuario is null)
            {
                return BadRequest("Login incorrecto");
            }

            var resultado = passwordHasher.VerifyHashedPassword(usuario, usuario.PasswordHash, credencialesUsuarioDTO.Password);

            if(resultado == PasswordVerificationResult.Failed)
            {
                return BadRequest("Login incorrecto");
            }

            var usuarioDTO = mapper.Map<UsuarioDTO>(usuario);

            return ConstruirToken(usuarioDTO);
        }

        [HttpPost("EditarAdmin")]
        [Authorize(Policy = "esadmin")]
        public async Task<IActionResult> HacerAdmin(EditarAdminDTO editarAdminDTO)
        {
            var usuario = await context.Usuarios.FirstOrDefaultAsync(u => u.Email == editarAdminDTO.Email);

            if (usuario is null)
            {
                return NotFound();
            }

            usuario.EsAdmin = editarAdminDTO.EsAdmin;
            await context.SaveChangesAsync();

            return NoContent();
        }

        private RespuestaAutenticacionDTO ConstruirToken(UsuarioDTO usuario)
        {
            var claims = new List<Claim>
            {
                new Claim("email", usuario.Email!),
                new Claim("esadmin", usuario.EsAdmin.ToString().ToLower())
            };

            var llave = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JwtKey"]!));
            var creds = new SigningCredentials(llave, SecurityAlgorithms.HmacSha256);

            var expiracion = DateTime.UtcNow.AddHours(1);

            var tokenDeSeguridad = new JwtSecurityToken(issuer: null, audience: null, claims: claims, expires: expiracion,
                signingCredentials: creds);

            var token = new JwtSecurityTokenHandler().WriteToken(tokenDeSeguridad);

            return new RespuestaAutenticacionDTO
            {
                Token = token,
                Expiracion = expiracion
            };
        }
    }
}
