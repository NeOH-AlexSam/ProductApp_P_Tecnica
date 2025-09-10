using AutoMapper;
using backend.DTOs;
using backend.Models;
using backend.Services;

namespace backend.Utilities
{
    public class AutoMapperProfiles : Profile
    {

        public AutoMapperProfiles()
        {
            ConfigurarMapeosProductos();
            ConfigurarMapeosUsuarios();
        }

        private void ConfigurarMapeosProductos()
        {
            CreateMap<ProductoCreacionDTO, Producto>()
                .ForMember(x => x.UsuarioCreacion, opt => opt.Ignore())
                .ForMember(x => x.FechaCreacion, dto => dto.MapFrom(p => DateTime.UtcNow));

            CreateMap<Producto, ProductoDTO>()
                .ForMember(x => x.UsuarioCreacion, opt => opt.Ignore())
                .ForMember(x => x.UsuarioModificacion, opt => opt.Ignore());

            CreateMap<ProductoActualizarDTO, Producto>()
                .ForMember(x => x.UsuarioCreacion, opt => opt.Ignore())
                .ForMember(x => x.UsuarioModificacion, opt => opt.Ignore())
                .ForMember(x => x.FechaModificacion, dto => dto.MapFrom(p => DateTime.UtcNow));
        }

        private void ConfigurarMapeosUsuarios()
        {
            CreateMap<Usuario, UsuarioDTO>().ReverseMap();
        }
    }
}
