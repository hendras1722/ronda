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
      .eq('id', body.id_complex || '')
      .eq('block', body.block || '')
    console.log(data, 'inidata')
    if (data && (data || [])?.length > 0) {
      throw Error('Block already exist')
    }

    let { data: block, error: errAddress } = await client
      .from('db_block')
      .upsert(body)
      .select()

    console.log(errAddress)
    if (errAddress || errBlock) {
      throw Error('Failed to create block')
    }

    return {
      data: block,
    }
  } catch (error) {
    return {
      error,
    }
  }
})
