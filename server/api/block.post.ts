import { createError } from 'h3'
import { supabase } from '@/utils/supabase'
import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseServiceRole(event)
  const path = getHeaders(event)
  const body = await readBody(event)

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
    let { data, error: errBlock } = await client
      .from('db_block')
      .select(`*`)
      .eq('id', body.v || '')
      .eq('block', body.block || '')
    // console.log(data, 'inique')
    if (data) {
      // throw Error('Block already exist')
    }

    return {
      data: data,
    }
  } catch (error) {
    return {
      error,
    }
  }
})
