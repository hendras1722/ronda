import { supabase } from '@/utils/supabase'
interface IUser {
  id_complex: string
  id: string
  name: string
  blok: string
  phone: string
  id_warga: string
}

export default defineNuxtPlugin(async () => {
  const nuxtApp = useNuxtApp()
  const store = storeToRefs(useGetuser(nuxtApp.$pinia))

  const { data } = useFetch<{ data: IUser[] }>('/api/get-user')

  store.user.value = data.value?.data
})
