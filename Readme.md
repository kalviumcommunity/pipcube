## VP 2.3 – Concept‑1: Advanced Data Fetching (SSG, SSR, ISR)

### Pages Implemented
This project demonstrates all three rendering strategies using the Next.js App Router:

- `/about` → **Static Site Generation (SSG)**
- `/dashboard` → **Server‑Side Rendering (SSR)**
- `/news` → **Incremental Static Regeneration (ISR)**

---

### Why Each Rendering Strategy Was Used

**Static Rendering (SSG)**  
The `/about` page uses Static Site Generation because the content does not change frequently.  
It is generated at build time, resulting in very fast load times and excellent scalability.

**Dynamic Rendering (SSR)**  
The `/dashboard` page uses Server‑Side Rendering because it represents real‑time or frequently changing data.  
Rendering on every request ensures data freshness, which is important for dashboards and analytics.

**Hybrid Rendering (ISR)**  
The `/news` page uses Incremental Static Regeneration to balance performance and freshness.  
The page is statically generated but revalidated periodically, making it suitable for news or event‑based content.

---

### Caching and Revalidation Behavior

- SSG pages are cached at build time and served instantly.
- SSR pages disable caching using `cache: 'no-store'` and are rendered on every request.
- ISR pages revalidate automatically after a fixed interval, improving performance while keeping data fresh.

---

### Reflection: Performance, Scalability, and Freshness

Choosing the correct rendering strategy directly impacts application performance, scalability, and data freshness.

- Static rendering offers the best performance and scalability but may show outdated data.
- Dynamic rendering ensures fresh data but increases server load and hosting costs.
- Hybrid rendering provides a balanced approach by combining static performance with periodic updates.

If the application had 10× more users, relying entirely on SSR would not scale well.  
In such cases, static rendering and ISR should be preferred wherever possible, using SSR only for pages that require real‑time data.

---

### Case Study: “The News Portal That Felt Outdated”

In the DailyEdge scenario, static rendering made the homepage fast but caused breaking news to become outdated.  
Switching entirely to SSR improved freshness but reduced performance and increased costs.

A balanced solution would be:
- Static rendering for the homepage layout and evergreen content
- ISR for the breaking news section with short revalidation intervals
- SSR only for user‑specific or real‑time pages like dashboards

This approach ensures speed, freshness, and scalability.



## Concept -2 ✅ Environment-Aware Builds & Secrets Management — Summary

This project now supports **development**, **staging**, and **production** environments with isolated configurations.
We created `.env.development`, `.env.staging`, `.env.production`, and a safe `.env.example` file (no secrets committed).

All real secrets such as database URLs and API keys are stored securely using **GitHub Secrets**, ensuring nothing sensitive exists in the repository. During CI/CD, the correct secrets and configs are injected automatically based on the branch being deployed.

Custom build scripts (`build:dev`, `build:staging`, `build:prod`) ensure each environment uses the right API URLs and database connections. The GitHub Actions workflow handles deployment by loading environment-specific secrets and running the correct build commands.

This setup prevents accidental misuse of dev/staging credentials in production, keeps deployments predictable, and maintains a clean, secure workflow.

## Concept-3 ✅ Containerization, CI/CD & Cloud Deployment (Docker → GitHub Actions → AWS/Azure)

This concept demonstrates how the application is containerized using Docker, automatically validated using a CI/CD pipeline, and prepared for deployment on cloud platforms such as AWS or Azure.

---

### 1️⃣ Docker (Containerization)

Docker is used to package the application along with all its dependencies into a single container. This ensures the application runs consistently across development, staging, and production environments, regardless of the underlying system.

A Dockerfile is defined in the project root to:
- Use a lightweight Node.js base image
- Install dependencies
- Build the application
- Expose the required port
- Start the application inside the container

This approach eliminates environment mismatch issues and makes cloud deployment predictable and portable.

---

### 2️⃣ CI/CD Pipeline (Pull Request Based)

A CI/CD pipeline is implemented using **GitHub Actions** and is triggered automatically on **pull requests targeting the `main` branch**. This ensures all changes are validated before being merged into production.

The pipeline performs the following steps:
- Checks out the repository
- Sets up the Node.js environment
- Installs dependencies
- Builds the application

If any step fails, the pull request is blocked from merging. This prevents broken code from reaching production and enforces a clean, automated workflow.

---

### 3️⃣ Cloud Deployment (Conceptual)

The Docker container can be deployed on cloud platforms such as:
- AWS EC2
- AWS Elastic Beanstalk
- Azure App Service

The container runs independently of the cloud infrastructure, allowing easy scaling and consistent behavior across environments. Environment variables are injected through cloud configuration or CI/CD pipelines rather than being hardcoded.

---

### 4️⃣ Security & Environment Variables

Sensitive values such as API keys and database URLs are never committed to the repository. Instead:
- A `.env.example` file documents required variables
- Real secrets are stored in **GitHub Secrets**
- Cloud providers inject environment variables at runtime

This ensures strong security, proper environment isolation, and safe deployments.

---

## How do Docker and CI/CD pipelines simplify deployment workflows, and what considerations are important when deploying securely?

Docker simplifies deployments by packaging the application and its dependencies into a single container, ensuring consistency across all environments. CI/CD pipelines automate the process of building and validating the application on every pull request, reducing human error and improving reliability.

When deploying securely, it is important to manage environment variables through secure secret stores, avoid hardcoding sensitive information, and ensure proper container lifecycle management. Automated pipelines ensure deployments are versioned, repeatable, and secure.

---

## Case Study: The Never-Ending Deployment Loop

Deployment failures often occur due to missing environment variables, misconfigured CI/CD pipelines, and old containers continuing to run in production. These issues lead to runtime crashes and inconsistent application versions.

By validating code through pull requests, using proper containerization, injecting environment variables via CI/CD or cloud configuration, and stopping old containers before deploying new ones, deployments become clean, predictable, and reliable.

## Code Quality & Tooling

This project uses strict TypeScript, ESLint, Prettier, and Husky to ensure high code quality.

- Strict TypeScript catches errors at compile time
- ESLint enforces consistent coding standards
- Prettier ensures uniform formatting
- Husky pre-commit hooks prevent bad code from being committed

This setup makes the project scalable and maintainable for larger teams.

## 🔐 Environment Variables

| Variable Name | Scope | Purpose |
|--------------|------|--------|
| DATABASE_URL | Server | PostgreSQL connection |
| JWT_SECRET | Server | Token signing |
| NEXTAUTH_SECRET | Server | Auth encryption |
| NEXT_PUBLIC_API_BASE_URL | Client | API base URL |

### Setup Instructions

```bash
cp .env.example .env.local
# Fill values in .env.local
npm run dev

## 🔍 Code Review Checklist

Every Pull Request must ensure:

- Code follows naming conventions and folder structure
- Functionality tested locally
- No console errors or warnings
- ESLint and Prettier checks pass
- Code is readable and well-commented
- No secrets or environment variables exposed


## 🐳 Docker & Docker Compose Setup

### Dockerfile
The Dockerfile builds the Next.js app using Node.js, installs dependencies, builds the app, and runs it on port 3000.

### Docker Compose
Docker Compose runs three services:
- Next.js app
- PostgreSQL database
- Redis cache

All services run on a shared bridge network and communicate using service names.

### Volumes & Networks
- A Docker volume persists PostgreSQL data
- A bridge network enables inter-container communication

### How to Run
```bash
docker-compose up --build

GET    /api/users       → Fetch all users
POST   /api/users       → Create a user

GET    /api/bookings    → Fetch bookings (paginated)
POST   /api/bookings   → Create booking


## Global API Response Handler

To ensure consistency, predictability, and better developer experience across the backend, this project uses a **Global API Response Handler** for all API routes. Every endpoint returns responses in a unified structure, making frontend integration, debugging, and monitoring much easier.

---

### Why a Unified Response Format?

Without a standard response structure, different API routes may return different JSON shapes, which increases frontend complexity and makes error handling inconsistent. A global response handler ensures:

- Predictable API responses across all endpoints
- Easier frontend integration
- Clear and structured error handling
- Improved observability and debugging

---

### Standard Response Structure

All API responses follow this envelope:

#### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "timestamp": "2026-01-08T07:50:00.000Z"
}

# 🔐 Secure User Authentication API

## Overview
This assignment implements a **secure authentication system** using **Next.js App Router**, **Prisma**, **PostgreSQL**, **bcrypt**, and **JWT**.  
Users can sign up, log in, and access protected routes using token-based authentication.

---

## Objectives
- Hash user passwords securely using **bcrypt**
- Generate JWT tokens on successful login
- Protect private routes using token verification
- Understand token expiry and security best practices

---

## Tech Stack
- Next.js (App Router)
- TypeScript
- Prisma ORM
- PostgreSQL
- bcrypt
- JSON Web Tokens (JWT)

---

## API Endpoints

### Signup
- Hashes password before storing in database

### Login
- Verifies password
- Generates JWT token (expires in 1 hour)

### Protected Route
- Requires `Authorization: Bearer <JWT_TOKEN>`

---

## Security Highlights
- Passwords are never stored in plain text
- JWT tokens are signed and time-limited
- Protected routes validate tokens before access

---

## Token Storage (Concept)
- `localStorage` → simple but less secure
- `HttpOnly cookies` → recommended for production

---

## Conclusion
This assignment demonstrates a **real-world authentication flow** using password hashing and token-based security, ensuring safe user access and data protection.

