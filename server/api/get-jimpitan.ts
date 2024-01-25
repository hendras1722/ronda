import { createError } from 'h3'
import { endOfDay, startOfDay } from 'date-fns'
import { serverSupabaseServiceRole } from '#supabase/server'

// import XLSX from 'xlsx'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseServiceRole(event)
  const path = getHeaders(event)
  const head = getRequestURL(event)

  const route = getRequestHost(event)
  const BASE_URL = process.env.BASE_URL

  // if (!route.includes(String(BASE_URL))) {
  //   throw createError({
  //     statusCode: 403,
  //     message: 'Forbidden Access',
  //   })
  // }

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
      .from('db_block')
      .select(
        `
         id,
         created_at,
         block,
         id_complex
        `
      )
      .eq('id_complex', query.q || '')

    let { data: jimpitan, error: errJimpitan } = await client
      .from('db_jimpitan')
      .select(
        `
            id_address,
            id_warga,
            created_at,
            money,
            by: by(
              name
            )
        `
      )
      .eq('id_address', query.q || '')

    const result =
      data &&
      data.map((item) => {
        console.log(item, jimpitan)
        for (let i in jimpitan) {
          if (jimpitan[Number(i)].id_address === item.id_complex) {
            return {
              ...item,
              date: jimpitan[Number(i)].created_at,
            }
          }
        }
      })
    console.log(result)

    let { data: patrol, error: errPatrol } = await client
      .from('db_block')
      .select(
        `
         block
        `
      )
      .eq('id', query.q || '')

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
