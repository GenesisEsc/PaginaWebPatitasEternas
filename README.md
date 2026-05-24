
🛒 Proyecto Tienda Tuti - Fullstack Dockerizado
Materia: Calidad de Software

Institución: Instituto Tecnológico Quito (ITQ)

Líder Técnico & DevOps: Byron Melo

Desarrollador Backend: Mathew

Desarrolladora Frontend: Génesis

Este proyecto es un sistema de e-commerce robusto que integra validaciones de seguridad de grado profesional, validación de cédula ecuatoriana (Módulo 10) y una arquitectura basada en contenedores.

🏗️ Arquitectura del Proyecto
El sistema está dividido en dos grandes bloques orquestados por Docker:

Backend: API REST desarrollada en Django con validaciones de "Doble Candado" (Serializer + Database).

Frontend: Aplicación dinámica en Angular con interceptores de errores globales.

Base de Datos: PostgreSQL 15 (Producción/Docker) y SQLite (Desarrollo local).

🛠️ Tecnologías Usadas
Backend: Python 3.13, Django 6.0.3, Django REST Framework.

Frontend: Angular 21.2.3, TypeScript, Node 22.17.

DevOps: Docker, Docker Compose, Nginx.

Base de Datos: PostgreSQL (Contenedorizado).

📂 Estructura de Archivos

CALIDAD_DE_SOFTWARE/
├── backend_tuti/          # Servidor Django (API)
│   ├── api/               # Lógica de negocio y validaciones
│   ├── backend/           # Configuraciones y .env
│   └── Dockerfile         # Receta de Python 3.13
├── frontend/              # Aplicación Angular
│   ├── src/               # Componentes y servicios
│   └── Dockerfile         # Receta de Node 22 + Nginx
└── docker-compose.yml     # Orquestador del sistema completo

🚀 Guía de Despliegue con Docker (Recomendado)
Esta es la forma más rápida de levantar el proyecto con las 8 tiendas precargadas.

Asegúrate de tener Docker Desktop iniciado.

En la raíz del proyecto, ejecuta:

Bash
docker-compose up --build
Acceso al sistema:

Frontend: http://localhost:4200

API Backend: http://localhost:8000/api/tiendas/

Admin Django: http://localhost:8000/admin (User: admin / Pass: adminpassword)

🔧 Despliegue Manual (Desarrollo)
Si prefieres trabajar sin Docker, sigue estos pasos:

1. Configuración del Backend
Bash
# Entrar a la carpeta del servidor
cd backend_tuti

# Crear y activar entorno virtual
python -m venv venv
.\venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Migrar y cargar datos de las 8 tiendas
python manage.py migrate
python manage.py loaddata datos_iniciales.json

# Iniciar
python manage.py runserver
2. Configuración del Frontend
Bash
# Entrar a la carpeta del cliente
cd frontend

# Instalar dependencias (usando legacy-peer-deps por ngx-bootstrap)
npm install --legacy-peer-deps

# Iniciar servidor de desarrollo
ng serve


🛡️ Características Destacadas
Validaciones de Seguridad: Los campos de nombre, apellido y teléfono están protegidos con expresiones regulares (Regex) tanto en el cliente como en el servidor.

Módulo 10: Validación automática de cédulas ecuatorianas en el proceso de checkout.

Control de Stock: El sistema impide compras si no hay existencias reales en la base de datos.

Error Interceptor: Captura automática de errores del servidor para mostrar mensajes amigables al usuario (Toasts).