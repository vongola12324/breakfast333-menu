/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TAKEOUT_BOX_FEE: number
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
