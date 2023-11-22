import { createError } from 'h3'
import { supabase } from '@/utils/supabase'

export default defineEventHandler(async (event) => {
  const path = getHeaders(event)
  const body = await readBody(event)

  if (String(path['postman-token'])) {
    throw createError({
      statusCode: 403,
      message: 'Forbidden Access',
    })
  }

  try {
    const { data, error } = await supabase
      .from('db_warga_complex')
      .upsert(body)
      .select()

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
