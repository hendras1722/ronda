export default defineNuxtPlugin(async (event) => {
  const token = useCookie('sb_access_admin')
  const tokenUser = useCookie('sb_access')
  const route = useRoute()
  const _fetch = useRequestFetch()
  const store = storeToRefs(useGetuser())
  const path = route.path

  if (path.match(/jimpitan-\w+/gm)) {
    const jwt = tokenUser.value
    if (!jwt) return
    const tokens: string[] = jwt?.split('.') || []
    const data = JSON.parse(atob(tokens[1]))
    delete data.iss
    store.userLogin.value = data

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
    return
  }

  if (!token.value) return
  const jwt = token.value
  const tokens: string[] = jwt?.split('.') || []
  const data = JSON.parse(atob(tokens[1]))
  delete data.iss
  store.userLogin.value = data

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
