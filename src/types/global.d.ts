/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL?: string;
    JWT_SECRET?: string;
    ADMIN_EMAIL?: string;
    ADMIN_INITIAL_PASSWORD?: string;
    ADMIN_NOTIFICATION_EMAIL?: string;
    RESEND_API_KEY?: string;
    NEXT_PUBLIC_APP_URL?: string;
  }
}
