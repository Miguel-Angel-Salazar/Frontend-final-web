# Respawn — Frontend (Tienda Gamer)

Aplicación web desarrollada con **Next.js 16 (App Router), React 19, TypeScript y Tailwind CSS 4** para el Proyecto de Aula de Desarrollo Web Full-Stack (2026-2).

**Respawn** es una tienda especializada en videojuegos, consolas, accesorios y figuras coleccionables de personajes. El diseño apuesta por una estética editorial cálida e inspirada en el arcade táctil, con bordes orgánicos, sombras sólidas interactivas y modo oscuro persistente.

---

## Enlaces del proyecto

| Recurso | Enlace |
| :--- | :--- |
| **Frontend desplegado (Vercel)** | [https://frontend-final-web.vercel.app](https://frontend-final-web.vercel.app) |
| **Backend API REST desplegada (Render)** | [https://backend-final-web-xbbs.onrender.com](https://backend-final-web-xbbs.onrender.com) |
| **Repositorio Frontend (GitHub)** | [https://github.com/Miguel-Angel-Salazar/Frontend-final-web](https://github.com/Miguel-Angel-Salazar/Frontend-final-web) |
| **Repositorio Backend (GitHub)** | [https://github.com/Juan-Manuel3132007/Backend-final-web](https://github.com/Juan-Manuel3132007/Backend-final-web) |

---

## Credenciales de prueba (creadas por el seed)

Para probar el inicio de sesión en `/login` y verificar los permisos según el rol del usuario:

| Rol | Nombre | Correo | Contraseña | Vistas y permisos en la aplicación |
| :--- | :--- | :--- | :--- | :--- |
| **ADMIN** | Admin Respawn | `admin@respawn.com` | `Admin123!` | Acceso completo al panel de administración en `/admin`, `/admin/productos/nuevo` y `/admin/productos/[id]/editar`: crear, editar y eliminar productos con imagen, administrar categorías y actualizar el estado de todos los pedidos. |
| **USER** | Camila Gómez | `user@respawn.com` | `User123!` | Explorar `/catalogo`, ver el detalle en `/catalogo/[id]`, realizar pedidos y consultarlos o cancelarlos en `/pedidos`. Si intenta acceder a `/admin` (incluso escribiendo la URL), es redirigido automáticamente al inicio. |

> También puedes registrar cualquier cuenta nueva desde `/register` (se crea con rol `USER` e inicia sesión automáticamente).

---

## Instalación y ejecución local

1. **Clonar el repositorio e instalar dependencias:**

   ```bash
   git clone https://github.com/Miguel-Angel-Salazar/Frontend-final-web.git
   cd Frontend-final-web
   npm install
   ```

2. **Configurar variables de entorno:**

   Copia el archivo `.env.example` a `.env.local` y ajusta la URL del backend:

   ```bash
   cp .env.example .env.local
   ```

   Variables requeridas:

   | Variable | Descripción | Ejemplo |
   | :--- | :--- | :--- |
   | `NEXT_PUBLIC_API_HOST` | URL base de la API REST del equipo (sin `/` al final) | `http://localhost:4000` |

3. **Iniciar el servidor de desarrollo:**

   ```bash
   npm run dev
   ```

   La aplicación estará disponible en `http://localhost:3000`.

4. **Compilar para producción:**

   ```bash
   npm run build
   npm start
   ```

---

## Arquitectura por features

El proyecto sigue la organización por módulos (`src/features/`) y rutas del App Router (`src/app/`) vista en clase:

```text
src/
├── app/                                      # Rutas de Next.js (solo componen vistas)
│   ├── page.tsx                              # Landing page (/)
│   ├── login/page.tsx                        # Inicio de sesión (/login)
│   ├── register/page.tsx                     # Registro de usuario (/register)
│   ├── catalogo/page.tsx                     # Listado con filtros combinados y paginación (/catalogo)
│   ├── catalogo/[id]/page.tsx                # Detalle de producto y creación de pedido (/catalogo/[id])
│   ├── pedidos/page.tsx                      # Historial de pedidos del usuario (/pedidos - Protegida)
│   ├── admin/page.tsx                        # Panel de administración (/admin - Protegida ADMIN)
│   ├── admin/productos/nuevo/page.tsx        # Crear producto con imagen (/admin/productos/nuevo - ADMIN)
│   ├── admin/productos/[id]/editar/page.tsx  # Editar producto (/admin/productos/[id]/editar - ADMIN)
│   ├── not-found.tsx                         # Página 404 personalizada
│   └── layout.tsx                            # Layout raíz, tipografías y barra flotante
│
└── features/
    ├── common/                               # Configuración, cliente HTTP y componentes reutilizables
    │   ├── config/env.ts                     # Lectura de NEXT_PUBLIC_API_HOST y claves de sesión
    │   ├── http/httpClient.ts                # Cliente HTTP centralizado (inyecta Bearer token y maneja 401)
    │   ├── session/sessionStore.ts           # Persistencia reactiva de sesión en localStorage
    │   └── components/                       # Button, FormFields, ConfirmDialog, PaginationBar, StateMessages...
    ├── auth/                                 # Autenticación, sesión y guardias de ruta
    │   ├── domain/                           # User, LoginRequest, RegisterRequest
    │   ├── services/authService.ts           # Llamadas a POST /api/auth/login y /api/auth/register
    │   ├── hooks/useAuth.ts                  # Hook reactivo de sesión y rol
    │   └── components/                       # LoginForm, RegisterForm, RouteGuard, GuestGuard
    ├── categories/                           # Recurso 1: Categorías del catálogo
    │   ├── domain/category.ts
    │   ├── services/categoryService.ts       # CRUD sobre /api/categories
    │   ├── hooks/useCategories.ts
    │   └── components/CategoryManager.tsx
    ├── products/                             # Recurso 2: Productos (relacionado con Categorías + imagen S3)
    │   ├── domain/product.ts
    │   ├── services/productService.ts        # CRUD multipart/form-data sobre /api/products
    │   ├── hooks/useProducts.ts
    │   └── components/                       # ProductCard, ProductFilterBar, ProductForm, AdminDashboard...
    ├── orders/                               # Recurso 3: Pedidos (relacionado con Usuarios y Productos)
    │   ├── domain/order.ts
    │   ├── services/orderService.ts          # CRUD sobre /api/orders
    │   ├── hooks/useOrders.ts
    │   └── components/                       # UserOrdersView, AdminOrdersManager, OrderStatusBadge
    └── landing/                              # Secciones de la página de inicio
        └── components/                       # HeroSection, HeroArt, MarqueeBand, CategoryShowcase...
```

---

## Reparto del trabajo

| Integrante | Responsabilidades en el proyecto |
| :--- | :--- |
| **Miguel Ángel Guarnizo Salazar** | Arquitectura por features del frontend, cliente HTTP centralizado y manejo de sesión JWT (`common/` y `auth/`), vistas del catálogo con filtros combinados y paginación (`products/`), gestión de pedidos (`orders/`), panel de administración con subida de imágenes (`admin/`) y despliegue en Vercel. |
| **Juan Manuel Moreno Muñoz** | Diseño del dominio, modelos y contratos de repositorios (`domain/`), esquemas y migraciones con Prisma y PostgreSQL en Supabase, configuración del proyecto y despliegue en Render. |
| **Andrés Ortega** | Casos de uso y reglas de negocio (`application/`), repositorios Prisma, integración con Supabase Storage S3, autenticación JWT y bcrypt (`infrastructure/`), controladores, routers, middlewares (`interface/`), seed y pruebas automatizadas (`tests/`). |
