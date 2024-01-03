import { createError } from 'h3'
import { supabase } from '@/utils/supabase'

export default defineEventHandler(async (event) => {
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
    const { data, error } = await supabase
      .from('db_patrol')
      .delete()
      .eq('id', query.id)

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
