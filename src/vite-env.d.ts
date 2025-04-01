/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string,
  readonly VITE_APP_TAGLINE: string,
  readonly VITE_TAKEOUT_BOX_FEE: number
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
