# AWR Store – Full-Stack E-Commerce Project

A full-stack e-commerce application built as part of a technical take-home challenge.
I did build the app only to follow instructions but also to demonstrate expertise on solving problems, tooling (trade offs), intuitiveness, engineering best practices and creativity. 
- I spined up the entire project on Docker to run on a single command. 
- I added Github actions to run the test cases, lint and format on PR for both ends. 
- I followed best practices on github by utilizing the PR system, Branching system, pr readable and purposeful naming convention system (Would have included versioning in real life for more robust systems if it was deployed)
- I also used a Monorepo and introduced a shared directory where BE and FE had something in common that did not need to be repeated by this applied the principle of DRY.
- I applied engineering principles like YAGNI by removing all files and codes that were not necessary most especially from the vite+react boilerplate.
- I applied principles like KISS by not over-engineering, for instance, I also used only native react tooling for everything
    - API Consumption, I used fetch API and not any library
    - State management, I used useContext API and not libraries like Redux, Mobx, Zustand etc.
    - I utilized the power of inline css, Not libraries for component frameworks or styled libraries like Tailwindcss, Mui, AndDesign, Bootstrap, Scss etc 
    - I spined up my monorepo with npm instead of pnpm because in this project scale, it was not needed even though it is the most suitable choice for Monorepos.
    - I used native javascript (alert) instead of building a component for the purpose or a library.
- I worked with every preexisting setups and tools on the BE to demonstrate not scared about new techs and the ability to pick and learn tools fast. That also hits on the engineering principle fail fast, learn quick.
- I did a couple of modularization which rings the bell on the software engineering principle SOC. 
- I made sure all modules had a Single source of truth for easy readability by mostly adding index.ts files in almost each module. This also helps not just for readability but also makes extensibility easy and encourages the Open/Close Principle to be adhered to.
- I added some business logic test cases based on the functional requirement of the task to encourage functions integrity.
- I did not put down so many comments in the code base as I assumed most part of it would be easily readable and understandable.
- I handled validations, errors, states (loading, error, ) on both ends


This monorepo contains:

- A **NestJS backend** with PostgreSQL + Prisma  
- A **React + Vite + Typescript frontend**  
- A **Shared workspace** for TypeScript interfaces (also with room for future extensions) 
- A **Docker-based development environment** that runs the entire stack with one command

---

## ✨ Features Implemented

### Backend (NestJS + Prisma + PostgreSQL)
- REST API for:
  - Products (CRUD)
  - Orders & Relational Modeling (CRUD)
- Prisma schema with migrations
- PostgreSQL container with health checks
- Shared types imported from `/shared`
- Input validation, DTOs, modular architecture based on Monorepo
- Error handling with clean responses returned to FE
- Test cases for important business logics
- Clean, modular codes, Robust validation & error handling, Safe transactions (Data integrity) as per instructions

### Frontend (React + Vite)
- Admin Dashboard Page
- Product listing page  (Shop page)
- Create Product form Page
- Page not found page
- Order Confirmation page
- Add-to-cart experience  
- Cart management  
- Checkout flow connected to BE  
- Shared TypeScript types from `/shared`  
- Simple/clean styling (per instructions)

### Monorepo Structure (npm workspaces)
```
awr-store-project/
├── BE/        # Backend (NestJS)
├── FE/        # Frontend (Vite + React)
├── shared/    # Shared types
├── package.json # Scripts and workspace definitions
└── docker-compose.yml

```

---

## 🐳 Running the Project (Docker)

### Requirements (Make sure already have)
- Docker
- Docker Compose
- .env inside the BE directory (check BE/.env.example for what to provide)

### Start the entire stack (from the root)
```bash
npm run dev
```

This brings up:

| Service | URL |
|--------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3000 |
| PostgreSQL | localhost:5432 |

### Rebuild containers if needed
```bash
npm run dev:build
```

### Stop all containers
```bash
npm run dev:down
```

---

## 🛠 Tech Stack

### Backend
- NestJS
- Prisma ORM
- PostgreSQL
- TypeScript
- Docker

### Frontend
- React
- Vite
- TypeScript
- Docker

### Dev Tools
- Biome (format + lint)
- npm workspaces
- Docker Compose
- Tests Cases (frontend and backend)
- CI Pipeline (Github Actions: runs lint, format and tests)

---

## 🧱 Development Details

### Backend Startup Flow
The backend container runs:

```
npm run build --workspace=shared
cd BE &&
npx prisma generate &&
npx prisma migrate deploy &&
npm run start:dev --workspace=BE
```

### Frontend Startup Flow
```
npm install
npm run dev --workspace=FE
```

---

## 🧪 Tests

```
npm run test:be
npm run test:fe
```

---

## 📦 Scripts

| Script | Description |
|--------|-------------|
| npm run dev | Start full stack with Docker |
| npm run dev:build | Rebuild & restart everything |
| npm run dev:down | Stop all containers |
| npm run test:be | Backend tests |
| npm run test:fe | Frontend tests |
| npm run biome:format | Auto-format codebase |
| npm run biome:lint | Lint entire monorepo |
| npm run biome:fix | Auto-fix lint issues |

---

## 📝 Environment Variables

```
DATABASE_URL="postgresql://user:password@awr-pg:5432/awr?schema=public" //SN: Of course, in reality I will not expose

```

---
##  Constraints - What I did not do
- Like stated initially, I did not really use libraries on my FE except for routing
- I did not deploy my codes as it was not really necessary for the task, I should have been able to do something on Netlify, Vercel or AWS amplify for the FE and AWS, Heroku or Hetzner for the BE
- I did not consider Observability and monitoring on any end as it was not necessary although health was set on Docker.
- I did not consider SEO Optimization Accessibility, Localization on the FE although I considered responsiveness.
- I did not consider adding query and params to my backend for filtration and sorting, but on course for a system that is meant to grow in real life, it would be important to add that

## 🤝 Submission

This repository contains my complete submission for the Full-Stack E-Commerce Take-Home Challenge.
