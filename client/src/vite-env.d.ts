interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_OMDB_API_KEY: string
  readonly VITE_OPENAI_API_KEY: string
  readonly PROD?: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
