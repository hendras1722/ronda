// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    rootId: 'MSA',
    rootTag: 'MSA',
    head: {
      title: 'Ronda Indonesia',
    },
  },
  ui: {
    icons: ['ion'],
  },
  devtools: { enabled: true, vscode: {} },
  supabase: {
    redirect: true,
    redirectOptions: {
      login: '/login',
      callback: '/auth/callback',
      exclude: ['/jimpitan-**', '/'],
    },
  },
  modules: [
    '@nuxt/content',
    '@nuxt/ui',
    '@vueuse/nuxt',
    '@nuxt/devtools',
    '@nuxtjs/supabase',
    [
      '@nuxtjs/google-fonts',
      {
        families: {
          Roboto: true,
          Mulish: true,
          Nunito: true,
        },
        prefetch: false,
        preconnect: false,
        preload: false,
        download: true,
        base64: false,
      },
    ],
    [
      '@pinia/nuxt',
      {
        autoImports: ['defineStore', 'storeToRefs'],
      },
    ],
  ],
  css: ['~/assets/scss/main.scss'],
  colorMode: {
    preference: 'light',
  },
})
