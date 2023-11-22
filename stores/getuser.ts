interface IUser {
  id_complex: string
  id: string
  name: string
  blok: string
  phone: string
  id_warga: string
}
export const useGetuser = defineStore('useGetuser', () => {
  const user = ref<IUser[]>()

  return {
    user,
  }
})
