// src/types/global.d.ts

export {};

declare global {
  interface Window {
    env: {
      ENVIRONMENT_ENDPOINT: string | undefined;
    };
  }
}
