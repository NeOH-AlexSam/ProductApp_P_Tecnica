using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class EditarAdminDTO
    {
        [EmailAddress]
        [Required]
        public required string Email { get; set; }

        public bool EsAdmin { get; set; }
    }
}
