using backend.DTOs;
using backend.Models;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace backend.Services
{
    public class ServicioReportes : IServicioReportes
    {
        public byte[] GenerarReporteProductos(List<ProductoDTO> productos)
        {
            QuestPDF.Settings.License = LicenseType.Community;

            return Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.Letter);
                    page.Margin(20);
                    page.DefaultTextStyle(x => x.FontSize(12));

                    page.Header().Text("Reporte de Productos").FontSize(20).Bold().AlignCenter();

                    page.Content().PaddingVertical(25).Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.RelativeColumn();
                            columns.RelativeColumn();
                            columns.RelativeColumn();
                            columns.RelativeColumn();
                        });

                        // Encabezados
                        table.Header(header =>
                        {
                            header.Cell().BorderBottom(2).Padding(8).Text("Nombre").Bold();
                            header.Cell().BorderBottom(2).Padding(8).Text("Descripción").Bold();
                            header.Cell().BorderBottom(2).Padding(8).Text("Precio").Bold();
                            header.Cell().BorderBottom(2).Padding(8).Text("¿Disponible?").Bold();
                        });

                        foreach (var p in productos)
                        {
                            table.Cell().BorderBottom(1).Padding(8).Text(p.Nombre);
                            table.Cell().BorderBottom(1).Padding(8).Text(p.Descripcion ?? "-");
                            table.Cell().BorderBottom(1).Padding(8).Text($"B/. {p.Precio:F2}");
                            table.Cell().BorderBottom(1).Padding(8).Text(p.Estado ? "SÍ" : "NO");
                        }
                    });

                    page.Footer().AlignCenter().Text(text =>
                    {
                        text.CurrentPageNumber();
                        text.Span(" / ");
                        text.TotalPages();
                    });
                });
            }).GeneratePdf();
        }

        public byte[] GenerarReporteProductosAdmin(List<ProductoDTO> productos)
        {
            QuestPDF.Settings.License = LicenseType.Community;

            return Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.Letter);
                    page.Margin(20);
                    page.DefaultTextStyle(x => x.FontSize(10));

                    page.Header().Text("Reporte de Productos (Admin)").FontSize(20).Bold().AlignCenter();

                    page.Content().PaddingVertical(25).Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.RelativeColumn();
                            columns.RelativeColumn();
                            columns.RelativeColumn();
                            columns.RelativeColumn();
                            columns.RelativeColumn();
                            columns.RelativeColumn();
                        });

                        // Encabezados
                        table.Header(header =>
                        {
                            header.Cell().BorderBottom(2).Padding(8).Text("Nombre").Bold();
                            header.Cell().BorderBottom(2).Padding(8).Text("Descripción").Bold();
                            header.Cell().BorderBottom(2).Padding(8).Text("Precio").Bold();
                            header.Cell().BorderBottom(2).Padding(8).Text("¿Disponible?").Bold();
                            header.Cell().BorderBottom(2).Padding(8).Text("Creado por").Bold();
                            header.Cell().BorderBottom(2).Padding(8).Text("Modificado por").Bold();
                        });

                        foreach (var p in productos)
                        {
                            table.Cell().BorderBottom(1).Padding(8).Text(p.Nombre);
                            table.Cell().BorderBottom(1).Padding(8).Text(p.Descripcion ?? "-");
                            table.Cell().BorderBottom(1).Padding(8).Text($"B/. {p.Precio:F2}");
                            table.Cell().BorderBottom(1).Padding(8).Text(p.Estado ? "SÍ" : "NO");
                            table.Cell().BorderBottom(1).Padding(8).Text(p.UsuarioCreacion);
                            table.Cell().BorderBottom(1).Padding(8).Text(p.UsuarioModificacion ?? "-");
                        }
                    });

                    page.Footer().AlignCenter().Text(text =>
                    {
                        text.CurrentPageNumber();
                        text.Span(" / ");
                        text.TotalPages();
                    });
                });
            }).GeneratePdf();
        }

        public byte[] GenerarReporteUsuarios(List<UsuarioDTO> usuarios)
        {
            QuestPDF.Settings.License = LicenseType.Community;

            return Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.Letter);
                    page.Margin(20);
                    page.DefaultTextStyle(x => x.FontSize(12));

                    page.Header().Text("Reporte de Usuarios").FontSize(20).Bold().AlignCenter();

                    page.Content().PaddingVertical(25).Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.RelativeColumn();
                            columns.RelativeColumn();
                        });

                        // Encabezados
                        table.Header(header =>
                        {
                            header.Cell().BorderBottom(2).Padding(8).Text("Correo electrónico").Bold();
                            header.Cell().BorderBottom(2).Padding(8).Text("¿Es administrador?").Bold();
                        });

                        foreach (var u in usuarios)
                        {
                            table.Cell().BorderBottom(1).Padding(8).Text(u.Email);
                            table.Cell().BorderBottom(1).Padding(8).Text(u.EsAdmin ? "SÍ" : "NO");
                        }
                    });

                    page.Footer().AlignCenter().Text(text =>
                    {
                        text.CurrentPageNumber();
                        text.Span(" / ");
                        text.TotalPages();
                    });
                });
            }).GeneratePdf();
        }
    }
}
