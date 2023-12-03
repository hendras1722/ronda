import { createError } from 'h3'
import { supabase } from '@/utils/supabase'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const path = getHeaders(event)
  const query = getQuery(event)
  if (path['postman-token']) {
    throw createError({
      statusCode: 403,
      message: 'Forbidden Access',
    })
  }

  try {
    // let { data, error } = await supabase.from('db_patrol').select()
    // // .eq('id_complex', query.q)

    let { data, error } = await client.from('db_patrol').select(`
    *,
    ...db_user(
      name
    )
    `)

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
