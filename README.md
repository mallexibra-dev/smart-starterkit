# Smart Starterkit

**Smart Starterkit** adalah template monorepo modern yang dibangun dengan teknologi terdepan untuk pengembangan aplikasi full-stack yang cepat dan efisien dengan sistem authentication yang lengkap.

## ✨ Fitur Utama

- **⚡ Bun** - Runtime JavaScript yang super cepat
- **🔥 Hono** - Framework web modern untuk backend dengan OpenAPI/Swagger
- **🚀 Tanstack Router** - Type-safe routing dengan file-based routing
- **⚛️ React 18** - Library UI yang stabil dan powerful
- **🎨 Tailwind CSS 4** - Framework CSS utility-first terbaru
- **📦 Turbo** - Build system untuk monorepo yang efisien
- **🔐 JWT Authentication** - Simple JWT-based authentication system
- **📝 React Hook Form** - Form handling yang powerful dengan Zod validation
- **✅ Zod** - Schema validation yang type-safe
- **🌐 Axios** - HTTP client untuk API calls
- **🎯 TypeScript** - Type safety di seluruh project
- **🎨 shadcn/ui** - Beautiful & accessible UI components
- **🗄️ MySQL** - Database dengan Drizzle ORM
- **📊 Swagger/OpenAPI** - API documentation otomatis
- **🪝 React Query** - Data fetching dan caching

## 🛠️ Tech Stack

### Frontend (Client)
- **React 18.3** - UI library yang stabil
- **Vite 5.4** - Build tool yang super cepat
- **TanStack Router** - Type-safe routing dengan file-based
- **TanStack Query** - Data fetching & caching
- **Tailwind CSS 4.1** - Utility-first CSS framework
- **shadcn/ui** - Beautiful & accessible UI components
- **Radix UI** - Accessible component primitives
- **React Hook Form** - Performant form handling
- **Axios** - HTTP client untuk API calls
- **Zod** - Schema validation

### Backend (Server)
- **Hono 4.9** - Lightweight web framework
- **Bun Runtime** - Fast JavaScript runtime
- **JWT + bcryptjs** - Simple authentication system
- **Drizzle ORM** - Type-safe SQL toolkit
- **MySQL** - Relational database
- **Winston** - Logging library
- **Swagger/OpenAPI** - API documentation
- **TypeScript** - Type safety

### Database & Development Tools
- **Drizzle Kit** - Database migrations & management
- **Turbo** - Monorepo build system
- **ESLint** - Code linting
- **TypeScript** - Static type checking

## 📁 Struktur Project

```
smart-starterkit/
├── 📁 client/                     # Frontend React App
│   ├── 📁 src/
│   │   ├── 📁 components/         # Reusable components
│   │   │   └── 📁 ui/            # shadcn/ui components
│   │   ├── 📁 routes/            # TanStack Router
│   │   │   ├── 📁 (app)/         # Protected routes
│   │   │   │   └── 📁 auth/      # Authentication pages
│   │   │   │       ├── 📁 login/
│   │   │   │       └── 📁 register/
│   │   │   ├── 📄 __root.tsx     # Root layout
│   │   │   └── 📄 index.tsx      # Homepage
│   │   ├── 📁 hooks/             # Custom React hooks
│   │   ├── 📁 services/          # API services
│   │   ├── 📁 lib/               # Utility functions
│   │   ├── 📄 main.tsx           # App entry point
│   │   └── 📄 routeTree.gen.ts   # Generated route tree
│   ├── 📁 public/                # Public assets
│   ├── 📄 package.json           # Client dependencies
│   └── 📄 vite.config.ts         # Vite configuration
│
├── 📁 server/                     # Backend Hono API
│   ├── 📁 src/
│   │   ├── 📁 route/             # API routes
│   │   │   ├── 📄 auth.route.ts  # Authentication routes
│   │   │   └── 📄 index.ts       # Route aggregation
│   │   ├── 📁 controller/        # Route controllers
│   │   │   └── 📄 auth.controller.ts
│   │   ├── 📁 service/           # Business logic
│   │   │   └── 📄 auth.service.ts
│   │   ├── 📁 middlewares/       # Express-like middlewares
│   │   │   ├── 📄 auth.middleware.ts
│   │   │   ├── 📄 error.middleware.ts
│   │   │   ├── 📄 rate-limit.middleware.ts
│   │   │   └── 📄 security.middleware.ts
│   │   ├── 📁 lib/               # Server utilities
│   │   │   └── 📄 auth.ts        # Authentication library
│   │   ├── 📁 db/                # Database setup
│   │   │   ├── 📄 schema.ts      # Drizzle schema
│   │   │   └── 📄 seed.ts        # Database seeding
│   │   ├── 📄 drizzle.config.ts  # Drizzle configuration
│   │   └── 📄 index.ts           # Server entry point
│   ├── 📄 .env.example           # Environment variables template
│   └── 📄 package.json           # Server dependencies
│
├── 📁 shared/                     # Shared code & types
│   └── 📁 src/
│       └── 📁 validation/        # Shared validation schemas
│           └── 📄 auth.validation.ts
│
├── 📄 package.json               # Root workspace config
├── 📄 turbo.json                 # Turbo build configuration
├── 📄 tsconfig.json              # Root TypeScript config
├── 📄 .gitignore                 # Git ignore rules
└── 📄 README.md                  # Project documentation
```

## 🚀 Cara Memulai

### Prerequisites
- **Bun** v1.2.4 atau lebih baru
- **MySQL** database server
- **Git** (untuk clone repository)

### Installation

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd smart-starterkit
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```
   > Perintah ini akan otomatis menginstall semua dependencies di workspace (client, server, shared)

3. **Setup database**
   ```bash
   # Buat database MySQL
   mysql -u root -p
   CREATE DATABASE smart_starterkit;

   # Setup environment variables
   cp server/.env.example server/.env
   ```

4. **Konfigurasi environment variables**

   **Server (.env)**
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=smart_starterkit

   # JWT Secret
   JWT_SECRET="your-super-secret-jwt-key-here"

   # Server Configuration
   PORT=3000
   NODE_ENV=development
   ```

   **Client (.env)** - Tidak diperlukan untuk development default

5. **Setup database schema dengan Drizzle migrations**
   ```bash
   cd server

   # Generate migration files (jika ada perubahan schema)
   bun run db:generate

   # Run migrations ke database
   bun run db:migrate

   # Atau push schema langsung ke database (untuk development)
   bun run db:push

   # Seed database dengan data awal
   bun run seed
   ```

6. **Start development servers**
   ```bash
   # Jalankan semua services
   bun run dev

   # Atau jalankan secara terpisah
   bun run dev:client  # Frontend di http://localhost:5173
   bun run dev:server  # Backend di http://localhost:3000
   ```

## 📋 Available Scripts

### Root Level
```bash
bun run dev              # Start semua services (client + server)
bun run dev:client       # Start hanya frontend
bun run dev:server       # Start hanya backend
bun run build            # Build semua packages
bun run build:client     # Build hanya frontend
bun run build:server     # Build hanya backend
bun run lint             # Lint semua packages
bun run type-check       # Type check semua packages
```

### Client Scripts
```bash
cd client
bun run dev              # Start Vite dev server
bun run build            # Build untuk production
bun run preview          # Preview production build
bun run lint             # Lint code
```

### Server Scripts
```bash
cd server
bun run dev              # Start Hono server dengan hot reload
bun run build            # Build TypeScript

# Database Commands
bun run db:generate      # Generate migration files dari schema changes
bun run db:migrate       # Run migration files ke database
bun run db:push          # Push schema langsung ke database (development)
bun run db:studio        # Buka Drizzle Studio untuk database management
bun run seed             # Seed database dengan data awal
bun run seed:reset       # Reset dan seed ulang database
```

## 🌐 API Documentation

Setelah menjalankan server, Anda dapat mengakses:
- **Swagger UI**: `http://localhost:3000/api/docs`
- **OpenAPI JSON**: `http://localhost:3000/api/openapi.json`

### Available Endpoints

#### Authentication
- `POST /api/auth/sign-up` - Register user baru
- `POST /api/auth/sign-in` - Login user
- `GET /api/auth/me` - Get current user info (requires Bearer token)
- `POST /api/auth/sign-out` - Logout user (requires Bearer token)

## 📦 Package Management

### Menambah Dependencies

**Untuk client:**
```bash
cd client
bun add package-name
```

**Untuk server:**
```bash
cd server
bun add package-name
```

**Untuk shared:**
```bash
cd shared
bun add package-name
```

### Workspace Dependencies
Gunakan `workspace:*` untuk referensi antar workspace:
```json
{
  "dependencies": {
    "shared": "workspace:*",
    "server": "workspace:*"
  }
}
```

**Happy Coding! 🎉**