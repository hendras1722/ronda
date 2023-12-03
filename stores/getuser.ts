export interface IUser {
  data: IUserData[]
  isComplex: boolean
}

export interface IUserData {
  id: string
  name: string
  email: string
  role: string
  blok: string
  complex: Complex
}

export interface Complex {
  id: string
  house_complex: string
  created_at: string
  updated_at: null
  rt: string
  provinsi: string
  kodepos: string
  kelurahan: string
  kecamatan: string
  rw: string
  link: string
}

interface IUserLogin {
  aud: string
  exp: number
  iat: number
  iss: string
  sub: string
  email: string
  phone: string
  app_metadata: AppMetadata
  user_metadata: UserMetadata
  role: string
  aal: string
  amr: AMR[]
  session_id: string
}

interface AMR {
  method: string
  timestamp: number
}

interface AppMetadata {
  provider: string
  providers: string[]
}

interface UserMetadata {}

export const useGetuser = defineStore('useGetuser', () => {
  const user = ref<IUser>({
    data: [],
    isComplex: false,
  })
  const userLogin = ref<IUserLogin>()

  return {
    user,
    userLogin,
  }
})
