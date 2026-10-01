export type ApiValidationError = {
  location?: string;
  msg?: string;
  message?: string;
  path?: string;
  type?: string;
  value?: unknown;
};

export type ApiErrorResponse = {
  errors?: ApiValidationError[];
  message?: string;
  error?: string;
  success?: boolean;
};

/**
 * Extracts human-readable error messages from API error response structures.
 * Prioritizes `errors[].msg` (field validation errors) before falling back to `message`, `error`, or generic fallback.
 * Supports RTK Query error objects, Axios responses, fetch error payloads, standard Error instances, and plain strings.
 */
export function extractApiErrorMessages(
  error: unknown,
  fallbackMessage = "An unexpected error occurred. Please try again.",
): string[] {
  if (!error) return [fallbackMessage];

  if (typeof error === "string") return [error];

  const err = error as Record<string, unknown>;
  const data =
    (err.data as Record<string, unknown> | undefined) ??
    (err.response as { data?: Record<string, unknown> } | undefined)?.data ??
    err;

  // 1. First choice: Check `errors` array for `msg` or `message`
  const rawErrors = (data?.errors ?? err?.errors) as unknown;
  if (Array.isArray(rawErrors) && rawErrors.length > 0) {
    const messages = rawErrors
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object") {
          const m =
            (item as { msg?: unknown; message?: unknown }).msg ??
            (item as { msg?: unknown; message?: unknown }).message;
          if (typeof m === "string" && m.trim()) return m;
        }
        return null;
      })
      .filter((msg): msg is string => Boolean(msg));

    if (messages.length > 0) {
      return messages;
    }
  }

  // 2. Second choice: data.message or err.message
  if (typeof data?.message === "string" && data.message.trim()) {
    return [data.message];
  }
  if (typeof data?.error === "string" && data.error.trim()) {
    return [data.error];
  }
  if (typeof err?.message === "string" && err.message.trim()) {
    return [err.message];
  }

  return [fallbackMessage];
}

