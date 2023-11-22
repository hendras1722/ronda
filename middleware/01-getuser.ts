export default defineNuxtRouteMiddleware(() => {
  const token = useCookie('sb-access-token')
  // if (!token.value) {
  //   navigateTo('/')
  //   return
  // }
  const jwt = token.value
  console.log(jwt)
  if (jwt) {
    navigateTo('/')
    return
  }
  const tokens: string[] = jwt?.split('.') || []
  if (tokens.length < 1) {
    navigateTo('/login')
    return
  }
  const data = JSON.parse(atob(tokens[1]))
  console.log(JSON.parse(atob(tokens[0])))
  if (Date.now() >= data.exp * 1000) {
    navigateTo('/login')
    return
  }
})
