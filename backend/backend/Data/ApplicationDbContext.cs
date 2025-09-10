using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Producto>()
                .HasOne(p => p.Creador)
                .WithMany(u => u.ProductosCreados)
                .HasForeignKey(p => p.UsuarioCreacion)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Producto>()
                .HasOne(p => p.Modificador)
                .WithMany(u => u.ProductosModificados)
                .HasForeignKey(p => p.UsuarioModificacion)
                .OnDelete(DeleteBehavior.Restrict);
        }

        public DbSet<Producto> Productos { get; set; }

        public DbSet<Usuario> Usuarios { get; set; }
    }
}
