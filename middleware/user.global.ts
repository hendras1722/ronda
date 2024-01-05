export default defineNuxtRouteMiddleware(async (from) => {
  const { user } = storeToRefs(useGetuser())
  if (from.path.match(/\/jimpitan-(\w+)/gm)) {
    return
  }
  if (
    !user.value.isComplex &&
    ['/iuran', '/member', '/ronda/jadwal', '/ronda/jimpitan', '/'].includes(
      from.path
    )
  ) {
    if (process.client) {
      // window.location.href = '/register-profile'
      // return
      // return navigateTo('/register-profile')
    }
  }
  return
})
