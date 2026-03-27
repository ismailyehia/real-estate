# LuxeEstates - Real Estate Platform

## Overview

Full-stack real estate web application with React frontend and Express backend. Modern, premium UI inspired by Zillow and Airbnb.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite + Tailwind CSS (artifacts/real-estate)
- **API framework**: Express 5 (artifacts/api-server)
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: JWT (jsonwebtoken + bcryptjs)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild

## Features

1. **Authentication & Authorization**: JWT-based auth with roles (user, agent, admin)
2. **Property Listings**: Full CRUD for properties (Admin/Agent only)
3. **Advanced Search & Filtering**: Keyword, city, type, status, price range, bedrooms, sort
4. **Property Details**: Image gallery, full info, agent contact, reviews, similar properties
5. **Favorites System**: Save/unsave properties
6. **Messaging**: Send messages to agents about properties
7. **Admin Dashboard**: Stats, user management, property management
8. **Reviews & Ratings**: Rate properties (1-5 stars)
9. **Dark Mode**: Toggleable dark mode

## Pages

- `/` — Home (hero, search bar, featured properties, stats)
- `/listings` — Property listings with filters sidebar
- `/properties/:id` — Property detail page
- `/login` & `/register` — Auth pages
- `/favorites` — Saved properties (auth required)
- `/messages` — Messaging inbox (auth required)
- `/dashboard` — Admin/Agent dashboard (auth required)
- `/properties/new` & `/properties/:id/edit` — Property form (agent/admin)

## Test Accounts

- **Admin**: admin@realestate.com / admin123
- **Agent**: sarah@realestate.com / agent123
- **User**: user@realestate.com / user123

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── real-estate/          # React frontend (port 20263, preview at /)
│   └── api-server/           # Express API server (preview at /api)
├── lib/
│   ├── api-spec/             # OpenAPI spec + Orval codegen config
│   ├── api-client-react/     # Generated React Query hooks
│   ├── api-zod/              # Generated Zod schemas
│   └── db/                   # Drizzle ORM schema + DB connection
│       └── src/schema/
│           ├── users.ts
│           ├── properties.ts
│           ├── favorites.ts
│           ├── messages.ts
│           └── reviews.ts
└── scripts/
    └── src/seed.ts           # Database seeding script
```

## API Endpoints

### Auth
- `POST /api/auth/register` — Register
- `POST /api/auth/login` — Login
- `GET /api/auth/me` — Get current user

### Properties
- `GET /api/properties` — List with filters
- `GET /api/properties/featured` — Featured properties
- `GET /api/properties/:id` — Property detail
- `POST /api/properties` — Create (agent/admin)
- `PUT /api/properties/:id` — Update (agent/admin)
- `DELETE /api/properties/:id` — Delete (agent/admin)
- `GET /api/properties/:id/similar` — Similar properties

### Favorites
- `GET /api/favorites` — User's favorites
- `POST /api/favorites/:propertyId` — Add favorite
- `DELETE /api/favorites/:propertyId` — Remove favorite

### Messages
- `GET /api/messages` — User's messages
- `POST /api/messages` — Send message

### Reviews
- `GET /api/reviews/:propertyId` — Property reviews
- `POST /api/reviews/:propertyId` — Create review

### Admin
- `GET /api/admin/stats` — Dashboard stats
- `GET /api/admin/users` — All users
- `PUT /api/admin/users/:id` — Update user role
- `DELETE /api/admin/users/:id` — Delete user

## Database Schema

- `users` — Users with roles (user, agent, admin)
- `properties` — Property listings with all fields
- `favorites` — User-property favorites (unique constraint)
- `messages` — Messaging between users about properties
- `reviews` — Property reviews and ratings

## Development Commands

- `pnpm --filter @workspace/api-server run dev` — Start API server
- `pnpm --filter @workspace/real-estate run dev` — Start frontend
- `pnpm --filter @workspace/db run push` — Push DB schema
- `pnpm --filter @workspace/scripts run seed` — Seed sample data
- `pnpm --filter @workspace/api-spec run codegen` — Regenerate API client
