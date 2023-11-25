import { createError } from 'h3'
import { supabase } from '@/utils/supabase'
import { useGetuser } from '~/stores/getuser'

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
      .from('db_user')
      .select(
        `
          id,
          name,
          email,
          role,
          complex: id_complex(
            *
          ),
          blok,
          phone
          `
      )
      .eq('id_complex', query.v)
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
