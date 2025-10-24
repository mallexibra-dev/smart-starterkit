# Smart Starterkit

 **Smart Starterkit** adalah template monorepo modern yang dibangun dengan teknologi terdepan untuk pengembangan aplikasi full-stack yang cepat dan efisien.

## ✨ Fitur Utama

- **⚡ Bun** - Runtime JavaScript yang super cepat
- **Hono** - Framework web modern untuk backend
- **Tanstack Router** - Routing, State and fetching API management
- **⚛️ React 19** - Library UI terbaru dengan fitur-fitur canggih
- **🎨 Tailwind CSS** - Framework CSS utility-first
- **📦 Turbo** - Build system untuk monorepo
- **🔐 Clerk** - Authentication yang mudah digunakan
- **📝 React Hook Form** - Form handling yang powerful
- **✅ Zod** - Schema validation yang type-safe
- **🌐 Axios** - HTTP client untuk API calls
- **🎯 TypeScript** - Type safety di seluruh project
- **🎨 shadcn/ui** - Beautiful & accessible UI components
- **🗄️ MySQL** - Database dengan connection pooling

##  Struktur Project

```
smart-starterkit/
├── 📁 client/                     # Frontend React App
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   └── 📁 ui/            # shadcn/ui components
│   │   │       └── 📄 button.tsx
│   │   ├── 📁 routes/            # TanStack Router
│   │   │   ├── 📄 __root.tsx
│   │   │   ├── 📄 index.tsx
│   │   │   └── 📁 users/         # User routes
│   │   ├── 📁 lib/               # Utility functions
│   │   │   ├── 📄 axios.ts       # HTTP client config
│   │   │   └── 📄 utils.ts       # Helper functions
│   │   ├── 📁 assets/            # Static assets
│   │   ├── 📄 main.tsx           # App entry point
│   │   ├── 📄 index.css          # Global styles
│   │   └── 📄 routeTree.gen.ts   # Generated route tree
│   ├── 📁 public/                # Public assets
│   ├── 📁 dist/                  # Build output
│   ├── 📁 node_modules/          # Dependencies
│   ├── 📄 package.json           # Client dependencies
│   ├── 📄 vite.config.ts         # Vite configuration
│   ├── 📄 components.json        # shadcn/ui config
│   ├── 📄 eslint.config.js       # ESLint configuration
│   ├── 📄 index.html             # HTML template
│   └── 📄 README.md              # Client documentation
│
├── 📁 server/                     # Backend Hono API
│   ├── 📁 src/
│   │   ├── 📁 route/             # API routes
│   │   │   └── 📄 index.ts
│   │   ├── 📁 controller/        # Route controllers
│   │   │   └── 📄 users.controller.ts
│   │   ├── 📁 service/           # Business logic
│   │   │   └── 📄 users.service.ts
│   │   ├── 📁 validation/        # Request validation
│   │   │   └── 📄 users.validation.ts
│   │   └── 📄 index.ts           # Server entry point
│   ├── 📁 database/              # Database files
│   │   └── 📄 query.sql          # SQL query
│   ├── 📁 utils/                 # Server utilities
│   │   ├── 📄 enums.ts
│   │   └── 📄 db.ts              # MySQL connection
│   ├── 📁 dist/                  # Build output
│   ├── 📄 package.json           # Server dependencies
│   └── 📄 README.md              # Server documentation
│
├── 📁 shared/                     # Shared code & types
│   ├── 📁 src/
│   │   ├── 📁 types/             # TypeScript type definitions
│   │   │   └── 📄 index.ts
│   │   └── 📄 index.ts           # Shared utilities
│   ├── 📁 dist/                  # Build output
│   ├── 📁 node_modules/          # Dependencies
│   ├── 📄 package.json           # Shared dependencies
│   └── 📄 tsconfig.json          # TypeScript config
│
├── 📁 .turbo/                     # Turbo cache
├── 📄 package.json               # Root workspace config
├── 📄 turbo.json                 # Turbo build configuration
├── 📄 tsconfig.json              # Root TypeScript config
├── 📄 .gitignore                 # Git ignore rules
└── 📄 README.md                  # Project documentation
```

Struktur sekarang mencerminkan project Anda yang sebenarnya dengan semua folder dan file yang ada.

## 🛠️ Teknologi yang Digunakan

### Frontend (Client)
- **React 19** - UI library dengan concurrent features
- **Vite** - Build tool yang super cepat
- **TanStack Router** - Type-safe routing
- **TanStack Query** - Data fetching & caching
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful & accessible UI components
- **Radix UI** - Accessible component primitives
- **React Hook Form** - Performant form handling
- **Clerk** - Authentication & user management
- **Axios** - HTTP client untuk API calls
- **Zod** - Schema validation

### Backend (Server)
- **Hono** - Lightweight web framework
- **Bun** - Fast JavaScript runtime
- **MySQL** - Relational database
- **mysql2** - MySQL client dengan connection pooling
- **Zod** - Runtime type validation
- **TypeScript** - Type safety

### Development Tools
- **Turbo** - Monorepo build system
- **ESLint** - Code linting
- **TypeScript** - Static type checking

## 🚀 Cara Memulai

### Prerequisites
- **Bun** v1.2.4 atau lebih baru
- **Node.js** (opsional, untuk compatibility)
- **MySQL** database server

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
   CREATE DATABASE mydatabase;
   
   # Jalankan schema dan seed data
   mysql -u root -p mydatabase < server/database/query.sql
   ```


3. **Setup environment variables**
   ```bash
   # Copy example env files
   cp client/.env.example client/.env.local
   cp server/.env.example server/.env.local
   ```

4. **Start development servers**
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
bun run dev              # Start semua services
bun run dev:client       # Start hanya frontend
bun run dev:server       # Start hanya backend
bun run build            # Build semua packages
bun run build:client     # Build hanya frontend
bun run build:server     # Build hanya backend
bun run lint             # Lint semua packages
bun run type-check       # Type check semua packages
bun run test             # Run tests
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
```

## 🔧 Konfigurasi

### Environment Variables

**Client (.env.local)**
```env
API_URL=http://localhost:3000
CLERK_PUBLISHABLE_KEY=your_clerk_key
```

**Server (.env.local)**
```env
PORT=3000
CLERK_SECRET_KEY=your_clerk_secret
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=mydatabase
```

### Database Configuration
Project menggunakan **MySQL** dengan connection pooling:
- Database schema didefinisikan di `server/database/query.sql`
- Connection pool dikonfigurasi di `server/utils/db.ts`
- Support untuk soft delete dengan `deleted_at` column


### Workspace Configuration
Project ini menggunakan **Bun workspaces** untuk mengelola dependencies:
- Dependencies diinstall otomatis untuk semua workspace
- Shared code bisa diakses melalui `"shared": "workspace:*"`
- Type definitions dibagikan melalui shared package

## 🏗️ Development Workflow

1. **Buat feature baru**
   ```bash
   # Buat branch baru
   git checkout -b feature/nama-feature
   
   # Develop di workspace yang sesuai
   cd client  # atau server
   bun run dev
   ```

2. **Type checking**
   ```bash
   bun run type-check
   ```

3. **Linting**
   ```bash
   bun run lint
   ```

4. **Build & test**
   ```bash
   bun run build
   bun run test
   ```

##  Package Management

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
    "client": "workspace:*",
    "server": "workspace:*"
  }
}
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
bun run build:client
# Deploy dist/ folder
```

### Backend (Railway/Render)
```bash
bun run build:server
# Deploy dengan start script
```

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Buat Pull Request

##  Acknowledgments

- [Bun](https://bun.sh) - Fast JavaScript runtime
- [Hono](https://hono.dev) - Modern web framework
- [React](https://react.dev) - UI library
- [Turbo](https://turbo.build) - Monorepo build system
- [shadcn/ui](https://ui.shadcn.com) - Beautiful UI components

---

**Happy Coding! 🎉**

Jika ada pertanyaan atau butuh bantuan, silakan buat issue di repository ini.
