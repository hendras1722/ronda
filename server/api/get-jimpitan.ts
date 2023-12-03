import { createError } from 'h3'
import { supabase } from '@/utils/supabase'
import { endOfDay, startOfDay } from 'date-fns'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
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

  const startDate = startOfDay(new Date()).getTime()
  const endDate = endOfDay(new Date()).getTime()

  try {
    let { data, error } = await client
      .from('db_user')
      .select(
        `
      *,
      jimpitan: db_jimpitan(
        id,
        created_at
      )
      `
      )
      .eq('id_complex', query.q || '')
    const result =
      data &&
      data?.map((item: any) => {
        return {
          ...item,
          jimpitan: item.jimpitan.filter(
            (item: any) =>
              new Date(item.created_at).getTime() >= startDate &&
              new Date(item.created_at).getTime() <= endDate
          ),
        }
      })

    if (error) {
      throw createError({
        statusCode: 403,
        message: String(error.message),
      })
    }
    return {
      data: result,
    }
  } catch (error) {
    return {
      error,
    }
  }
})
