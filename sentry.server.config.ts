import * as Sentry from "@sentry/nuxt";
import dotenv from "dotenv";

dotenv.config()

Sentry.init({
  // We can't read useRuntimeConfig here, reading configs from .env
  dsn: process.env.NUXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NUXT_PUBLIC_API_BASE,

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});
