/// <reference types="vite/client" />

/** Variables de entorno del sitio. Todas son opcionales: ver .env.example. */
interface ImportMetaEnv {
  /** URL pública del sitio, sin barra final. Necesaria para canonical y OG. */
  readonly VITE_SITE_URL?: string;
  /** Script del widget del asistente. */
  readonly VITE_CHAT_WIDGET_URL?: string;
  /** Endpoint de la API del asistente. */
  readonly VITE_CHAT_API_URL?: string;
  /** Clave del tenant con la que el widget se identifica. */
  readonly VITE_CHAT_TENANT_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
