using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class ProductoCreacionDTO
    {
        [Required]
        public required string Nombre { get; set; }

        public string? Descripcion { get; set; }

        [Required]
        public decimal Precio { get; set; }

        [Required]
        public bool Estado { get; set; }

        public string? UsuarioCreacion { get; set; }

        public DateTime? FechaCreacion { get; set; }
    }
}
