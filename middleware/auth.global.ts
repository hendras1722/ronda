import { useGetuser } from '@/stores/getuser'

interface IUser {
  id_complex: string
  id: string
  name: string
  blok: string
  phone: string
  id_warga: string
}

export default defineNuxtRouteMiddleware(async (from, to) => {
  const user = useSupabaseUser()

  const checkUserRegister = storeToRefs(useGetuser())
  console.log(checkUserRegister.user.value, 'in')
  if (!user.value && from.path.includes('admin')) {
    return (to.path = '/login')
  }

  if (process.client) {
    if (user.value && from.path === '/') {
      return (window.location.href = '/admin/dashboard')
    }
  }

  if (
    user.value &&
    checkUserRegister.user.value.data.length < 1 &&
    (from.path.includes('admin') ||
      to.path.includes('admin') ||
      from.path === '/')
  ) {
    return (to.path = '/register-profile')
  }

  // if (user.value && from.path === '/login') {
  //   return (to.path = '/')
  // }
  // const token = useCookie('sb-access-token')
  // const jwt = token.value

  // if (from.path.match(/\/jimpitan-(\w+)/gm)) {
  //   return
  // }

  // if (!jwt && from.path !== '/login') {
  //   return navigateTo('/login')
  // }
  // // if (!jwt && from.path !== '/login') {
  // //   // if (process.client) {
  // //   //   window.location.href = '/login'
  // //   //   return
  // //   // }
  // //   return navigateTo('/login')
  // // }

  // if (!jwt) return

  // // if (!process.server) {
  // const data = parseJwt(jwt)

  // if (data && Date.now() >= data.exp * 1000 && from.path !== '/login') {
  //   token.value = null
  //   // if (process.client) {
  //   // window.location.href = '/login'
  //   // return
  //   return navigateTo('/login')
  //   // }
  // }
  // }
  // if (!jwt && from.path !== '/login') {
  //   if (process.client) {
  //     // window.location.href = '/login'
  //     // return
  //     return navigateTo('/login')
  //   }
  // }
  return
})
