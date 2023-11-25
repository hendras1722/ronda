import { parseJwtServer } from '~/utils/jwt'
interface IUser {
  id_complex: string
  id: string
  name: string
  blok: string
  phone: string
  id_warga: string
}

export default defineNuxtRouteMiddleware(async (from) => {
  // const token = useCookie('sb_access')
  // if (!token.value) {
  //   return navigateTo('/')
  // }
  // const jwt = token.value
  // if (jwt && from.path === '/login') {
  //   return navigateTo('/')
  // } else {
  //   if (!jwt && from.path !== '/login') {
  //     return navigateTo('/login')
  //   }
  //   // const tokens: string[] = jwt?.split('.') || []
  //   // console.log(tokens)
  //   // if (tokens.length < 1) {
  //   //   return abortNavigation()
  //   // }
  // }
  // const data = parseJwtServer(jwt)
  // if (Date.now() >= data.exp * 1000) {
  //   return navigateTo('/login')
  // }
  return
})
