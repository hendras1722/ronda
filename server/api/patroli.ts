import { createError } from 'h3'
import { supabase } from '@/utils/supabase'

export default defineEventHandler(async (event) => {
  const path = getHeaders(event)

  if (String(path['user-agent'])?.toLocaleLowerCase().includes('postman')) {
    throw createError({
      statusCode: 403,
      message: 'Forbidden Access',
    })
  }
  try {
    let { data, error } = await supabase
      .from('db_patrol')
      .select(
        `
        day,
        ...db_warga_complex(
        name_warga
        ),
        ...db_complex(
          house_complex
        )
        `
      )
      .eq('id_complex', '08ce8193-54c3-4f3c-bf60-2dead7b68351')

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
