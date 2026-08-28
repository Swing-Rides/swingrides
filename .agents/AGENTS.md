# Project Rules

- **Avoid `useEffect`**: Always prefer event-driven state updates (e.g. event handlers, `onValueChange` callbacks, derived state, or form control callbacks) instead of `useEffect`.

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