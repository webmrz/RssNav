/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_SITE_TITLE: string
  readonly VITE_SITE_LOGO: string
  readonly VITE_SITE_APPLE_LOGO: string
  readonly VITE_SITE_ANTHOR: string
  readonly VITE_SITE_KEYWORDS: string
  readonly VITE_SITE_DES: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 