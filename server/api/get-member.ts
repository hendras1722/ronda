import { createError } from 'h3'
import { supabase } from '@/utils/supabase'
import { useGetuser } from '~/stores/getuser'

export default defineEventHandler(async (event) => {
  const path = getHeaders(event)
  const query = getQuery(event)

  if (String(path['user-agent'])?.toLocaleLowerCase().includes('postman')) {
    throw createError({
      statusCode: 403,
      message: 'Forbidden Access',
    })
  }

  try {
    let { data, error } = await supabase
      .from('db_warga_complex')
      .select(
        `
              id,
              name: name_warga,
              blok,
              phone
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
