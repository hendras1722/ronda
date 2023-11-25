export default defineNuxtPlugin(async (event) => {
  const _fetch = useRequestFetch()
  const token = useCookie('sb_access')
  if (!token.value) return
  const jwt = token.value

  const tokens: string[] = jwt?.split('.') || []
  const store = storeToRefs(useGetuser())

  const data = JSON.parse(atob(tokens[1]))
  delete data.iss
  store.userLogin.value = data

  // if (Date.now() >= data.exp * 1000) {
  //   return navigateTo('/login')
  // }

  try {
    const _dataProfile = await _fetch<{ data: IUser[] }>('/api/get-user', {
      baseURL: process.env.NUXT_API_BASE_URL,
      query: {
        q: data.sub,
      },
    })
    store.user.value = _dataProfile?.data || []
  } catch (error) {
    console.log(error)
  }
})
