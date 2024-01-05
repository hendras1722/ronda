import { createError } from 'h3'
import { supabase } from '@/utils/supabase'
import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseServiceRole(event)
  const path = getHeaders(event)
  const query = getQuery(event)

  const route = getRequestHost(event)
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
    // let { data, error } = await supabase.from('db_patrol').select()
    // // .eq('id_complex', query.q)
    let { data: User, error: errUser } = await client
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
      .eq('id_complex', query.v || '')
      .ilike('name', `%${query.q}%`)

    let { data, error } = await client.from('db_patrol').select(`
    *,
    ...db_user(
      name
    )
    `)

    const result = User?.map((item: any) => {
      let obj = Object.assign({}, item)
      obj.day = null
      obj.id_user = null
      data?.forEach((data: any) => {
        if (obj.id === data.id_warga) {
          obj.day = data.day
          obj.id_user = data.id
        }
      })
      delete obj.email
      delete obj.role
      delete obj.blok
      return obj
    })

    console.log(result, 'iniresult23')

    if (error || errUser) {
      throw createError({
        statusCode: 403,
        message: String(error?.message) || String(errUser?.message),
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
