import { createError } from 'h3'
import { supabase } from '@/utils/supabase'

export default defineEventHandler(async (event) => {
  const path = getHeaders(event)
  const query = getQuery(event)

  if (path['postman-token']) {
    throw createError({
      statusCode: 403,
      message: 'Forbidden Access',
    })
  }

  try {
    let { data, error } = await supabase
      .from('db_contribution')
      .select(
        `
      *,
      ...db_user(
        name
      ),
      ...db_complex(
        house_complex
      )
      `
      )
      .eq('id_complex', query.v)

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
