export default defineNuxtRouteMiddleware(async (from) => {
  const { user } = storeToRefs(useGetuser())
  if (from.path.match(/\/jimpitan-(\w+)/gm)) {
    return
  }
  if (!user.value.isComplex && from.path.includes('admin')) {
    if (process.client) {
      // window.location.href = '/register-profile'
      // return
      // return navigateTo('/register-profile')
    }
  }
  return
})
