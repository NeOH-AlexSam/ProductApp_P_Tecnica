using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class ProductoDTO
    {
        public Guid Id { get; set; }

        public required string Nombre { get; set; }

        public string? Descripcion { get; set; }

        public decimal Precio { get; set; }

        public bool Estado { get; set; }

        public required string UsuarioCreacion { get; set; }

        public DateTime FechaCreacion { get; set; }

        public string? UsuarioModificacion { get; set; }

        public DateTime? FechaModificacion { get; set; }
    }
}
