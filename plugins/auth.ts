export default defineNuxtPlugin(async (event) => {
  const token = useCookie('sb_access')
  const _fetch = useRequestFetch()
  if (!token.value) return
  const jwt = token.value
  const tokens: string[] = jwt?.split('.') || []
  const store = storeToRefs(useGetuser())
  const data = JSON.parse(atob(tokens[1]))
  delete data.iss
  store.userLogin.value = data
  // if (Date.now() >= data.exp * 1000) {
  //   navigateTo('/login')
  // }
  try {
    const user = await _fetch<IUser>('/api/get-user', {
      baseURL: process.env.NUXT_API_BASE_URL,
      query: {
        q: data.sub,
      },
    })
    store.user.value = user || []
  } catch (error) {
    console.log(error)
  }
})
