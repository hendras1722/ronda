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
  // const jwt = parseJwt(cookie?.get('sb-access-token'))

  const query = getQuery(event)
  if (path['postman-token']) {
    throw createError({
      statusCode: 403,
      message: 'Forbidden Access',
    })
  }

  try {
    let { data, error } = await supabase
      .from('db_user')
      .select(
        `
    id,
    name,
    email,
    role,
    complex: id_complex(
      *
    ),
    blok
    `
      )
      .eq('id', query.q)
    console.log(data, 'inidata')
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
