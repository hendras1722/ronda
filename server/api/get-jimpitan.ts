import { createError } from 'h3'
import { endOfDay, startOfDay, isToday } from 'date-fns'
import { serverSupabaseServiceRole } from '#supabase/server'

// import XLSX from 'xlsx'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseServiceRole(event)
  const path = getHeaders(event)
  // const head = getRequestURL(event)

  // const route = getRequestHost(event)
  // const BASE_URL = process.env.BASE_URL

  // // if (!route.includes(String(BASE_URL))) {
  // //   throw createError({
  // //     statusCode: 403,
  // //     message: 'Forbidden Access',
  // //   })
  // // }

  const cookie = path.cookie
    ?.split(';')
    .map((s) => s.split('=').map((s) => s.trim()))
    .reduce((m, [k, v]) => (m.set(k, v), m), new Map())

  const query = getQuery(event)
  if (path['postman-token']) {
    throw createError({
      statusCode: 403,
      message: 'Forbidden Access',
    })
  }

  try {
    let { data: jimpitan, error: errJimpitan } = await client
      .from('db_jimpitan')
      .select(
        `
            id_block,
            id_address,
            created_at,
            money,
            by: by(
              name
            )
        `
      )
      .eq('id_address', query.q || '')

    let { data: list_block, error: errPatrol } = await client
      .from('db_block')
      .select(
        `
      id,
        id_complex,
         block
        `
      )
      .eq('id_complex', query.q || '')

    const result =
      list_block &&
      list_block.map((item) => {
        for (let i in jimpitan) {
          if (
            jimpitan[Number(i)].id_block === item.id &&
            jimpitan[Number(i)].created_at &&
            isToday(new Date(jimpitan[Number(i)].created_at))
          ) {
            return {
              ...item,
              name: (jimpitan[Number(i)].by as any).name,
              date: isToday(new Date(jimpitan[Number(i)].created_at)),
            }
          }
        }
        return {
          ...item,
          name: null,
          date: null,
        }
      })

    return {
      data: result,
    }
  } catch (error) {
    return {
      error,
    }
  }
})
