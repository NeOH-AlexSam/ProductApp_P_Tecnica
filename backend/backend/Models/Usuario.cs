using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Usuario
    {
        public Guid Id { get; set; }

        [EmailAddress]
        [Required]
        public required string Email { get; set; }

        [Required]
        public required string PasswordHash { get; set; }

        [Required]
        public bool EsAdmin { get; set; } = false;

        // Propiedades de navegación
        public List<Producto> ProductosCreados { get; set; } = new();

        public List<Producto> ProductosModificados { get; set; } = new();
    }
}
