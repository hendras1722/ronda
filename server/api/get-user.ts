import { createError } from 'h3'
import { supabase } from '@/utils/supabase'
import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseServiceRole(event)
  const path = getHeaders(event)

  const route = getRequestHost(event)
  const BASE_URL = process.env.BASE_URL
  console.log(BASE_URL, 'inibaseurl')
  if (!route.includes(String(BASE_URL))) {
    throw createError({
      statusCode: 403,
      message: 'Forbidden Access',
    })
  }

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
    let { data, error } = await client
      .from('db_user')
      .select(
        `
        id,
        name,
        email,
        role,
        complex: id_complex(
          id,
          house_complex,
          link
        ),
        blok
    `
      )
      .eq('id', query.q || '')

    const result = data?.filter((item) => item.complex)

    if (error) {
      throw createError({
        statusCode: 403,
        message: String(error.message),
      })
    }
    return {
      data,
      isComplex: (result && result?.length > 0) || null,
    }
  } catch (error) {
    return {
      error,
    }
  }
})
