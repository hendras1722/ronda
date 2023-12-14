export default defineNuxtPlugin(async (event) => {
  const token = useCookie('sb-access-token')
  const tokenUser = useCookie('sb-access-token')
  const route = useRoute()
  const _fetch = useRequestFetch()
  const store = storeToRefs(useGetuser())
  const path = route.path
  const user = useSupabaseUser()

  if (path.match(/jimpitan-\w+/gm)) {
    const jwt = tokenUser.value
    if (!jwt) return
    const tokens: string[] = jwt?.split('.') || []
    const data = JSON.parse(atob(tokens[1]))
    delete data.iss
    store.userLogin.value = data

    try {
      const getUser = await _fetch<IUser>('/api/get-user', {
        baseURL: process.env.NUXT_API_BASE_URL,
        query: {
          q: data.sub,
        },
      })

      store.user.value = getUser || []
    } catch (error) {
      console.log(error)
    }
    return
  }

  if (!user.value) return
  const jwt = token.value
  const tokens: string[] = jwt?.split('.') || []
  const data = JSON.parse(atob(tokens[1]))
  delete data.iss
  store.userLogin.value = data

  try {
    const getUser = await _fetch<IUser>('/api/get-user', {
      baseURL: process.env.NUXT_API_BASE_URL,
      query: {
        q: user.value.id,
      },
    })

    store.user.value = getUser || []
  } catch (error) {
    console.log(error)
  }
})
