import { createError } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseServiceRole(event)
  const path = getHeaders(event)
  const query = getQuery(event)

  const route = getRequestHeaders(event)
  const BASE_URL = process.env.BASE_URL

  // if (!route.includes(String(BASE_URL))) {
  //   throw createError({
  //     statusCode: 403,
  //     message: 'Forbidden Access',
  //   })
  // }

  if (path['postman-token']) {
    throw createError({
      statusCode: 403,
      message: 'Forbidden Access',
    })
  }

  try {
    if (query.q) {
      const select = route.referer?.includes('/iuran')
        ? `id, name, id_house`
        : '*'
      let { data, error } = await client
        .from('user_view')
        .select(select)
        .eq('id_house', query.v || '')
        .ilike('name', `%${query.q}%`)

      if (error) {
        throw createError({
          statusCode: 403,
          message: String(error.message),
        })
      }
      return {
        data: data?.map((item: any) => {
          if (route.referer?.includes('/iuran')) {
            return {
              id: item.id,
              name: item.name,
            }
          }
          return {
            ...item,
          }
        }),
      }
    }
    const select = route.referer?.includes('/iuran')
      ? `id, name, id_house`
      : '*'
    let { data, error } = await client
      .from('user_view')
      .select(select)
      .eq('id_house', query.v || '')

    if (error) {
      throw createError({
        statusCode: 403,
        message: String(error.message),
      })
    }
    return {
      data: data?.map((item: any) => {
        if (route.referer?.includes('/iuran')) {
          return {
            id: item.id,
            name: item.name,
          }
        }
        return {
          ...item,
        }
      }),
    }
  } catch (error) {
    return {
      error,
    }
  }
})
