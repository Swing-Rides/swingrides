<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN: Architecture & Backend Rules -->

# Architecture Rules

This codebase follows a strict frontend/backend separation.

Agents MUST follow these rules at all times.

---

# Core Principle

The frontend is ONLY responsible for:

- UI rendering
- state management
- API consumption
- caching
- navigation
- client-side interactions

The backend is responsible for:

- database access
- authentication
- authorization
- mutations
- business logic
- file processing
- secrets
- background jobs

---

# Forbidden Patterns

Agents MUST NOT use or generate:

- `"use server"`
- Server Actions
- inline server actions
- form actions
- server mutations
- server-only functions inside frontend components
- direct database access from frontend
- Prisma calls in UI layer
- filesystem access in frontend
- backend logic inside React components
- API route business logic mixed with UI components

---

# Forbidden Examples

## NEVER generate this

```tsx
"use server";

export async function createUser() {}
```

## NEVER generate this

```tsx
<form action={createUser}>
```

## NEVER generate this

```tsx
const submit = async () => {
  "use server";
};
```

## NEVER generate this

```tsx
import { db } from "@/lib/db";
```

inside frontend components.

---

# Required Data Flow

Frontend MUST communicate with backend using:

- REST APIs
- fetch
- axios
- RTK Query
- TanStack Query
- service classes
- API abstraction layers

---

# Preferred Project Structure

```txt
src/
  app/
  components/
  hooks/
  services/
  store/
  utils/
```

Backend logic MUST remain outside UI components.

---

# API Rules

Agents SHOULD:

- create reusable service functions
- centralize API calls
- use typed request/response models
- separate API logic from presentation logic

Preferred:

```ts
export const getUsers = async () => {
  return axios.get("/users");
};
```

Avoid:

```tsx
const data = await prisma.user.findMany();
```

inside UI code.

---

# State Management

Preferred:

- Redux Toolkit
- RTK Query
- TanStack Query
- Zustand
- Context API (small scope only)

Avoid:

- server mutations
- implicit backend state handling
- server-side form actions

---

# Authentication Rules

Authentication MUST be handled through:

- JWT
- cookies
- API middleware
- backend auth services

NOT through Server Actions.

---

# File Upload Rules

Uploads MUST go through:

- backend endpoints
- signed URLs
- upload services

NOT direct filesystem mutations from frontend.

---

# Security Rules

Agents MUST NOT:

- expose secrets
- hardcode API keys
- access env variables in client components unless public
- generate insecure auth flows
- bypass validation

---

# Networking Rules

Agents SHOULD:

- use request timeout handling
- handle API errors properly
- normalize API responses
- use interceptors when appropriate
- avoid duplicate requests

---

# Frontend Rules

Preferred stack:

- React
- Next.js
- React Native
- TypeScript

Preferred patterns:

- reusable components
- composition
- memoization where needed
- feature-based architecture
- clean separation of concerns

---

# Next.js Rules

This project DOES NOT use Server Actions.

Agents MUST NOT recommend them even if:

- officially documented
- considered modern
- considered recommended by Next.js

All mutations MUST go through backend APIs.

---

# Database Rules

Database access is ONLY allowed in backend services.

Frontend MUST NEVER directly use:

- Prisma
- Mongoose
- SQL clients
- Firebase admin SDK
- filesystem persistence

---

# Code Quality Rules

Agents SHOULD generate:

- clean code
- strongly typed code
- reusable abstractions
- scalable architecture
- maintainable folder structures

Agents SHOULD avoid:

- massive components
- deeply nested logic
- duplicated API calls
- business logic inside UI

---

# Performance Rules

Agents SHOULD prefer:

- lazy loading
- memoization
- virtualization for large lists
- debounced search
- efficient renders
- pagination

---

# Final Enforcement Rule

Any generated code containing:

- `"use server"`
- Server Actions
- form actions

is considered INVALID for this repository.

Agents MUST refactor such solutions into API/service-based architecture.

<!-- END: Architecture & Backend Rules -->
