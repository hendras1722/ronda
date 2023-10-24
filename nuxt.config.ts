// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ui: {
    icons: ['ion'],
  },
  devtools: { enabled: true, vscode: {} },
  modules: [
    '@nuxt/ui-edge',
    '@vueuse/nuxt',
    '@nuxt/devtools',
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
