import { createError } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseServiceRole(event)
  const path = getHeaders(event)
  const query = getQuery(event)

  const route = getRequestHost(event)
  const BASE_URL = process.env.BASE_URL

  // if (!route.includes(String(BASE_URL))) {
  //  throw createError({
  //  statusCode: 403,
  // message: 'Forbidden Access',
  // })
  // }

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
            *
          ),
          blok,
          phone
          `
      )
      .eq('id_complex', query.v || '')
      .ilike('name', `%${query.q}%`)

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
