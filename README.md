Herramientas utilizadas:
Backend: Web API .NET 8,
Frontend: Next.js 15 / TypeScript,
Base de datos: SQL Server 2022

Para ejecutar esta aplicacion se necesita: 
- Visual Studio 2022 con .NET 8 o .NET 8 SDK instalado en el dispositivo
- Docker Desktop
- Node.js v22.18.0 o superior
- SQL Server Management Studio o cualquier otro (opcional)

Pasos para ejecutar el proyecto
1. Clonar el repositorio
2. cd ./ProductApp_P_Tecnica
3. Ejecutar el comando "docker compose up -d" para levantar la base de datos.
4. cd ./backend/backend (donde se encuentra el archivo backend.csproj)
-- NOTA: los siguientes comandos para el backend se deben ejecutar donde se encuentra el archivo .csproj
5. Ejecutar comando "dotnet restore"
6. Ejecutar comando "dotnet run"
7. cd ./frontend-test3
8. npm install
9. npm run dev
10. LISTO! (Ya se puede probar la aplicación)

Credenciales de la BD
Server: localhost,1433
User Id: sa
Password: P4ss@Dmin*123

Credenciales del usuario administrador de la aplicacion:
Correo: admin@gmail.com
Contraseña: admin123
