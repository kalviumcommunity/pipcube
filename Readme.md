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

GET    /api/users          → Fetch all users
POST   /api/users          → Create a user

GET    /api/tickets        → Fetch tickets (paginated)
POST   /api/tickets        → Create ticket

GET    /api/cancellations  → Fetch cancellations (paginated)
POST   /api/cancellations  → Create cancellation request

GET    /api/refunds        → Fetch refunds (paginated)
POST   /api/refunds        → Process refund


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
## Input Validation with Zod

This project uses **Zod** for runtime type validation and schema validation across all API endpoints. Zod ensures that incoming data matches expected types and formats before processing, preventing invalid data from entering the system and providing clear, actionable error messages.

---

### Why Input Validation is Important

Input validation is a critical security and reliability practice that:

- **Prevents Invalid Data**: Stops malformed or incorrect data from entering the system
- **Improves Security**: Protects against injection attacks and data corruption
- **Enhances Developer Experience**: Provides clear, structured error messages
- **Type Safety**: Ensures TypeScript types match runtime data
- **Reduces Bugs**: Catches errors early before they cause downstream issues

Without proper validation, APIs can crash unexpectedly, store invalid data, or expose security vulnerabilities.

---

### Schema Structure

All validation schemas are organized in `/lib/schemas/`:

```
lib/schemas/
├── userSchema.ts          # User creation validation
├── ticketSchema.ts         # Ticket (booking) creation validation
├── cancellationSchema.ts   # Cancellation request validation
├── refundSchema.ts        # Refund processing validation
└── zodErrorFormatter.ts   # Error formatting utility
```

---

### Example Schemas

#### User Schema (`lib/schemas/userSchema.ts`)

```typescript
import { z } from "zod";

export const createUserSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .min(2, "Name must be at least 2 characters long")
    .trim(),
  email: z
    .string()
    .email("Invalid email format")
    .optional()
    .or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;
```

#### Ticket Schema (`lib/schemas/ticketSchema.ts`)

```typescript
import { z } from "zod";

export const createTicketSchema = z.object({
  userId: z
    .string({
      required_error: "userId is required",
      invalid_type_error: "userId must be a string",
    })
    .min(1, "userId cannot be empty"),
  tripId: z
    .string({
      required_error: "tripId is required",
      invalid_type_error: "tripId must be a string",
    })
    .min(1, "tripId cannot be empty"),
  seatNumber: z
    .string({
      required_error: "seatNumber is required",
      invalid_type_error: "seatNumber must be a string",
    })
    .min(1, "seatNumber cannot be empty")
    .trim(),
});

export type CreateTicketSchema = z.infer<typeof createTicketSchema>;
```

---

### Usage in API Routes

All POST routes use Zod validation:

```typescript
import { createUserSchema } from "@/lib/schemas/userSchema";
import { formatZodError } from "@/lib/schemas/zodErrorFormatter";
import { ZodError } from "zod";

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    
    // Validate using Zod schema
    // This throws ZodError if validation fails
    const validatedData = createUserSchema.parse(body);
    
    // Use validatedData - TypeScript knows the types are correct
    const newUser = createUser({
      name: validatedData.name,
      email: validatedData.email || undefined,
    });
    
    return sendSuccess(newUser, "User created successfully", 201);
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof ZodError) {
      const validationErrors = formatZodError(error);
      return sendError(
        "Validation Error",
        ErrorCodes.VALIDATION_ERROR,
        400,
        { errors: validationErrors }
      );
    }
    // Handle other errors...
  }
}
```

---

### Example API Calls

#### ✅ Passing Example: Create User

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890"
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "4",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "createdAt": "2026-01-08T10:00:00.000Z"
  },
  "timestamp": "2026-01-08T10:00:00.000Z"
}
```

#### ❌ Failing Example: Invalid User Data

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "A",
    "email": "invalid-email"
  }'
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation Error",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": {
      "errors": [
        {
          "field": "name",
          "message": "Name must be at least 2 characters long"
        },
        {
          "field": "email",
          "message": "Invalid email format"
        }
      ]
    }
  },
  "timestamp": "2026-01-08T10:00:00.000Z"
}
```

#### ✅ Passing Example: Create Ticket

```bash
curl -X POST http://localhost:3000/api/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "1",
    "tripId": "1",
    "seatNumber": "A12"
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Ticket created successfully",
  "data": {
    "id": "6",
    "userId": "1",
    "tripId": "1",
    "seatNumber": "A12",
    "price": 45.99,
    "status": "confirmed",
    "createdAt": "2026-01-08T10:00:00.000Z"
  },
  "timestamp": "2026-01-08T10:00:00.000Z"
}
```

#### ❌ Failing Example: Missing Required Fields

```bash
curl -X POST http://localhost:3000/api/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "1"
  }'
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation Error",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": {
      "errors": [
        {
          "field": "tripId",
          "message": "tripId is required"
        },
        {
          "field": "seatNumber",
          "message": "seatNumber is required"
        }
      ]
    }
  },
  "timestamp": "2026-01-08T10:00:00.000Z"
}
```

---

### Schema Reuse

Schemas are defined once and reused across the application:

1. **Type Inference**: Use `z.infer<typeof schema>` to generate TypeScript types automatically
2. **Consistent Validation**: Same validation rules applied everywhere
3. **Single Source of Truth**: Update validation rules in one place
4. **Frontend Sharing**: Schemas can be shared with frontend for client-side validation

Example:
```typescript
// Define schema once
const createUserSchema = z.object({ ... });

// Infer TypeScript type
type CreateUserSchema = z.infer<typeof createUserSchema>;

// Use in API route
const validatedData = createUserSchema.parse(body);
```

---

### Reflection: Maintainability and Teamwork

**Maintainability:**

Using Zod for validation significantly improves code maintainability:

- **Centralized Schemas**: All validation logic lives in `/lib/schemas/`, making it easy to find and update
- **Type Safety**: TypeScript types are automatically inferred from schemas, reducing type mismatches
- **Self-Documenting**: Schemas serve as documentation for API requirements
- **Easy Updates**: Changing validation rules requires updating only the schema file

**Teamwork:**

Zod validation enhances team collaboration:

- **Clear Error Messages**: Developers get specific, actionable error messages pointing to exact fields
- **Consistent Patterns**: All routes follow the same validation pattern, reducing cognitive load
- **Reduced Code Review Time**: Validation logic is standardized and easy to review
- **Onboarding**: New team members can understand validation requirements by reading schema files

**Developer Experience (DX):**

- **IntelliSense Support**: TypeScript autocomplete works perfectly with inferred types
- **Early Error Detection**: Validation errors are caught before data reaches business logic
- **Structured Errors**: Error responses include field-level details, making debugging faster

**Debugging:**

- **Structured Error Format**: All validation errors follow the same `{ field, message }` structure
- **Multiple Errors**: Zod returns all validation errors at once, not just the first one
- **Error Tracing**: Error messages include the exact field path (e.g., `user.address.city`)

**Observability:**

- **Consistent Error Codes**: All validation errors use `VALIDATION_ERROR` code
- **Timestamp Tracking**: Every error response includes a timestamp for log correlation
- **Error Details**: Structured error details make it easy to aggregate and analyze validation failures in monitoring tools

---

### Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `VALIDATION_ERROR` | Input validation failed | 400 |
| `NOT_FOUND` | Resource not found | 404 |
| `DATABASE_FAILURE` | Database operation failed | 500 |
| `INTERNAL_ERROR` | Unexpected server error | 500 |

---

### Installation

```bash
npm install zod
```

All schemas are ready to use. No additional configuration required.
