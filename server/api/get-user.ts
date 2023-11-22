import { createError } from 'h3'
import { supabase } from '@/utils/supabase'
import { useCookie } from 'nuxt/app'
import { parseJwt } from '~/utils/jwt'

export default defineEventHandler(async (event) => {
  const path = getHeaders(event)
  const cookie = path.cookie
    ?.split(';')
    .map((s) => s.split('=').map((s) => s.trim()))
    .reduce((m, [k, v]) => (m.set(k, v), m), new Map())
  const jwt = parseJwt(cookie?.get('sb-access-token'))

  if (String(path['user-agent'])?.toLocaleLowerCase().includes('postman')) {
    throw createError({
      statusCode: 403,
      message: 'Forbidden Access',
    })
  }

  try {
    let { data, error } = await supabase
      .from('db_warga_complex')
      .select(
        `
        id_complex,
        id,
        name: name_warga,
        blok,
        phone,
        id_warga
      `
      )
      .eq('id_warga', jwt.sub)
    if (error) {
      throw createError({
        statusCode: 403,
        message: String(error.message),
      })
    }
    return {
      data,
    }
  } catch (error) {
    return {
      error,
    }
  }
})
