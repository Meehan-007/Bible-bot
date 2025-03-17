/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly MODE: string
  // Add other env variables you use
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 