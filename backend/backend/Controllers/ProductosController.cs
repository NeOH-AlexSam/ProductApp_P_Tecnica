using AutoMapper;
using AutoMapper.QueryableExtensions;
using backend.Data;
using backend.DTOs;
using backend.Models;
using backend.Services;
using backend.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/productos")]
    [ApiController]
    [Authorize]
    public class ProductosController : ControllerBase
    {
        private readonly ApplicationDbContext context;
        private readonly IMapper mapper;
        private readonly IServicioUsuarios servicioUsuarios;
        private readonly IServicioReportes servicioReportes;

        public ProductosController(ApplicationDbContext context, IMapper mapper, IServicioUsuarios servicioUsuarios,
            IServicioReportes servicioReportes)
        {
            this.context = context;
            this.mapper = mapper;
            this.servicioUsuarios = servicioUsuarios;
            this.servicioReportes = servicioReportes;
        }

        [HttpGet]
        public async Task<List<ProductoDTO>> Get([FromQuery] PaginacionDTO paginacion)
        {
            var queryable = context.Productos;
            await HttpContext.InsertarParametrosPaginacionEnCabecera(queryable);
            var productos = await queryable
                .OrderBy(p => p.Nombre)
                .Paginar(paginacion)
                .ToListAsync();

            var productoDTOs = mapper.Map<List<ProductoDTO>>(productos);

            foreach(var dto in productoDTOs)
            {
                var productoOriginal = productos.FirstOrDefault(p => p.Id == dto.Id);

                // UsuarioCreacion
                dto.UsuarioCreacion = await servicioUsuarios.ObtenerUsuarioEmailPorId(productoOriginal!.UsuarioCreacion);

                // UsuarioModificacion
                if (productoOriginal.UsuarioModificacion.HasValue)
                {
                    dto.UsuarioModificacion =
                        await servicioUsuarios.ObtenerUsuarioEmailPorId(productoOriginal.UsuarioModificacion.Value);
                }
            }

            return productoDTOs;
        }

        [HttpGet("{id:guid}", Name = "ObtenerProductoPorId")]
        [Authorize(Policy = "esadmin")]
        public async Task<ActionResult<ProductoDTO>> Get(Guid id)
        {
            var producto = await context.Productos.FirstOrDefaultAsync(p => p.Id == id);

            if (producto is null)
            {
                return NotFound();
            }

            var productoDTO = mapper.Map<ProductoDTO>(producto);

            productoDTO.UsuarioCreacion = await servicioUsuarios.ObtenerUsuarioEmailPorId(producto.UsuarioCreacion);

            productoDTO.UsuarioModificacion = 
                producto.UsuarioModificacion.HasValue ? await servicioUsuarios
                    .ObtenerUsuarioEmailPorId(producto.UsuarioModificacion.Value) : null;

            return productoDTO;
        }

        [HttpGet("ReporteProductos")]
        public async Task<IActionResult> GenerarReporteProductos()
        {
            var productos = await context.Productos.ToListAsync();
            var productoDTOs = mapper.Map<List<ProductoDTO>>(productos);

            foreach (var dto in productoDTOs)
            {
                var productoOriginal = productos.FirstOrDefault(p => p.Id == dto.Id);

                // UsuarioCreacion
                dto.UsuarioCreacion = await servicioUsuarios.ObtenerUsuarioEmailPorId(productoOriginal!.UsuarioCreacion);

                // UsuarioModificacion
                if (productoOriginal.UsuarioModificacion.HasValue)
                {
                    dto.UsuarioModificacion =
                        await servicioUsuarios.ObtenerUsuarioEmailPorId(productoOriginal.UsuarioModificacion.Value);
                }
            }

            var pdfBytes = servicioReportes.GenerarReporteProductos(productoDTOs);
            return File(pdfBytes, "application/pdf", "ReporteProductos.pdf");
        }

        [HttpGet("ReporteProductosAdmin")]
        [Authorize(Policy = "esadmin")]
        public async Task<IActionResult> GenerarReporteProductosAdmin()
        {
            var productos = await context.Productos.ToListAsync();
            var productoDTOs = mapper.Map<List<ProductoDTO>>(productos);

            foreach (var dto in productoDTOs)
            {
                var productoOriginal = productos.FirstOrDefault(p => p.Id == dto.Id);

                // UsuarioCreacion
                dto.UsuarioCreacion = await servicioUsuarios.ObtenerUsuarioEmailPorId(productoOriginal!.UsuarioCreacion);

                // UsuarioModificacion
                if (productoOriginal.UsuarioModificacion.HasValue)
                {
                    dto.UsuarioModificacion =
                        await servicioUsuarios.ObtenerUsuarioEmailPorId(productoOriginal.UsuarioModificacion.Value);
                }
            }

            var pdfBytes = servicioReportes.GenerarReporteProductosAdmin(productoDTOs);
            return File(pdfBytes, "application/pdf", "ReporteProductosAdmin.pdf");
        }

        [HttpPost]
        [Authorize(Policy = "esadmin")]
        public async Task<IActionResult> Post([FromBody] ProductoCreacionDTO productoCreacionDTO)
        {
            var producto = mapper.Map<Producto>(productoCreacionDTO);
            producto.UsuarioCreacion = await servicioUsuarios.ObtenerUsuarioId();

            context.Add(producto);
            await context.SaveChangesAsync();

            var productoDTO = mapper.Map<ProductoDTO>(producto);

            return CreatedAtRoute("ObtenerProductoPorId", new {id = productoDTO.Id}, productoDTO);
        }

        [HttpPut("{id:guid}")]
        [Authorize(Policy = "esadmin")]
        public async Task<IActionResult> Put(Guid id, [FromBody] ProductoActualizarDTO productoActualizarDTO)
        {
            var productoExiste = await context.Productos.AnyAsync(p => p.Id == id);

            if(!productoExiste)
            {
                return NotFound();
            }

            var producto = mapper.Map<Producto>(productoActualizarDTO);
            producto.Id = id;
            producto.UsuarioCreacion = await servicioUsuarios.ObtenerUsuarioIdPorEmail(productoActualizarDTO.UsuarioCreacion);
            producto.UsuarioModificacion = await servicioUsuarios.ObtenerUsuarioId();

            context.Update(producto);
            await context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id:guid}")]
        [Authorize(Policy = "esadmin")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var registrosBorrados = await context.Productos.Where(p => p.Id == id).ExecuteDeleteAsync();

            if(registrosBorrados == 0)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
