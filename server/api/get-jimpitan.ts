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
      *
      `
      )
      .eq('id_complex', query.q || '')

    let { data: jimpitan, error: errJimpitan } = await client
      .from('db_jimpitan')
      .select(
        `
     id_warga,
     created_at,
     by: by(
      name
     )
      `
      )
      .eq('id_address', query.q || '')
    console.log(jimpitan)
    const result =
      data &&
      data?.map((item: any) => {
        let newArr: any = []
        jimpitan?.forEach((element) => {
          if (item.id === element.id_warga) {
            newArr.push(element)
            item.jimpitan = newArr
            item.by = element.by
          }
          // return {
          //   ...item,
          //   // jimpitan: item.jimpitan
          // .filter(
          //     (item: any) =>
          //       new Date(item.created_at).getTime() >= startDate &&
          //       new Date(item.created_at).getTime() <= endDate
          //   ),
          // }
        })
        return {
          ...item,
          jimpitan: item.jimpitan
            ? item.jimpitan.filter(
                (item: any) =>
                  new Date(item.created_at).getTime() >= startDate &&
                  new Date(item.created_at).getTime() <= endDate
              )
            : [],
        }
      })
    console.log(result, 'result')
    let { data: patrol, error: errPatrol } = await client
      .from('db_patrol')
      .select(
        `
        id,
      day
      `
      )
      .eq('id_complex', query.q || '')

    if (error || errPatrol || errJimpitan) {
      throw createError({
        statusCode: 403,
        message:
          String(error?.message) ||
          String(errPatrol?.message) ||
          String(errJimpitan?.message),
      })
    }
    return {
      data: result,
      day: patrol,
    }
  } catch (error) {
    return {
      error,
    }
  }
})
