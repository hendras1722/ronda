import { createError } from 'h3'
import { supabase } from '@/utils/supabase'

export default defineEventHandler(async (event) => {
  const path = getHeaders(event)
  const body = getQuery(event)

  if (!(getHeaders(event).referer || '').includes('localhost')) {
    throw createError({
      statusCode: 403,
      message: 'Forbidden Access',
    })
  }
  if (path['postman-token']) {
    throw createError({
      statusCode: 403,
      message: 'Forbidden Access',
    })
  }
  try {
    let { data, error } = await supabase
      .from('db_complex')
      .select(
        `
          id,
          name: house_complex,
          kecamatan,
          kelurahan,
          kodepos,
          provinsi,
          rt,
          rw
        `
      )
      .ilike('house_complex', `%${body.search}%`)
    console.log(data, 'inidata')
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
