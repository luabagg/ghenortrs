/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string;
  readonly VITE_GHENO_STORE_URL?: string;
  readonly VITE_B2B_CONTACT_EMAIL?: string;
  readonly VITE_B2B_SUBMIT_URL?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_B2B_MINIMUM_ORDER_QUANTITY?: string;
  readonly VITE_GTM_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
