// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    rootId: 'MSA',
    rootTag: 'MSA',
  },
  ui: {
    icons: ['ion'],
  },
  devtools: { enabled: true, vscode: {} },
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
