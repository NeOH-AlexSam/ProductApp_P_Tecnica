using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Producto
    {
        public Guid Id { get; set; }

        [Required]
        public required string Nombre { get; set; }

        public string? Descripcion { get; set; }

        [Required]
        [Precision(18, 2)]
        public decimal Precio { get; set; }

        [Required]
        public bool Estado { get; set; }

        [Required]
        public required Guid UsuarioCreacion { get; set; }

        [Required]
        public DateTime FechaCreacion { get; set; }

        public Guid? UsuarioModificacion { get; set; }

        public DateTime? FechaModificacion { get; set; }


        // Propiedades de navegación
        public Usuario Creador { get; set; } = null!;

        public Usuario? Modificador { get; set; }
    }
}
