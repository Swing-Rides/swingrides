// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://6d146f85c12c476241e96cb85e030113@o4512039913193472.ingest.us.sentry.io/4512039948976128",

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  beforeSend(event, hint) {
    const error = hint?.originalException;
    // Filter out expected unauthorized/forbidden status responses from bubbling to Sentry
    if (
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      ((error as { status?: number }).status === 401 ||
        (error as { status?: number }).status === 403)
    ) {
      return null;
    }
    return event;
  },
});

