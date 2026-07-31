Sistema Web Escalable – Tienda de Equipos de Cómputo
Sistema de comercio electrónico desarrollado con una arquitectura cliente-servidor desacoplada utilizando Laravel, PostgreSQL, React y Vite.
________________________________________
Integrantes
•	Jesus Rafael Aviles Poita
•	Moises Bertin Ordoñez Mendoza
________________________________________
Repositorio
GitHub:
https://github.com/USUARIO/NOMBRE_DEL_REPOSITORIO
________________________________________
Estructura del proyecto
Proyecto
│
├── backend
│   ├── app
│   ├── database
│   ├── routes
│   └── ...
│
└── frontend
    ├── src
    ├── public
    └── ...
El frontend consume la API REST del backend y no accede directamente a la base de datos.
________________________________________
Tecnologías utilizadas
Backend
•	Laravel 12
•	PHP 8.2
•	PostgreSQL
•	Laravel Sanctum
Frontend
•	React 18
•	Vite
•	Axios
________________________________________
Modelo de negocio
El sistema administra una tienda de equipos de cómputo mediante las siguientes entidades:
•	Usuarios
•	Direcciones
•	Categorías
•	Marcas
•	Productos
•	Imágenes de productos
•	Carritos de compra
•	Pedidos
•	Pagos
________________________________________
Requisitos
•	PHP 8.2 o superior
•	Composer
•	Node.js 18 o superior
•	PostgreSQL 14 o superior
________________________________________
Instalación del Backend
cd backend

composer install

cp .env.example .env

php artisan key:generate

php artisan migrate --seed

php artisan serve
API disponible en:
http://127.0.0.1:8000/api
________________________________________
Configuración del archivo .env
El proyecto incluye un archivo .env.example.
Después de copiarlo:
cp .env.example .env
Configurar la conexión a PostgreSQL:
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=tienda-computacion
DB_USERNAME=postgres
DB_PASSWORD=
Posteriormente ejecutar:
php artisan key:generate
________________________________________
Instalación del Frontend
cd frontend

npm install

npm run dev
Aplicación disponible en:
http://localhost:5173
________________________________________
Autenticación
El sistema utiliza Laravel Sanctum para la autenticación mediante tokens.
Roles implementados:
•	Administrador
•	Cliente
Los módulos administrativos se encuentran protegidos mediante middleware.
________________________________________
API REST
La documentación de los endpoints puede consultarse en:
•	docs/API.md
•	Colección de Postman incluida en el proyecto.
________________________________________
Ejecución de pruebas
cd backend

php artisan test

cd frontend

nmp run dev