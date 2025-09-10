namespace backend.DTOs
{
    public class UsuarioDTO
    {
        public Guid Id { get; set; }
        public required string Email { get; set; }
        public bool EsAdmin { get; set; }
    }
}
