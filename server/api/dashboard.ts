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
    let { error: errMoney, data: contribution } = await supabase
      .from('total_money')
      .select('*')
    let { error: errWarga, data: warga } = await supabase
      .from('total_warga')
      .select('*')
    if (errMoney || errWarga) {
      throw createError({
        statusCode: 403,
        message: String(errWarga?.message || errMoney?.message),
      })
    }
    return {
      data: {
        ...contribution?.[0],
        ...warga?.[0],
      },
    }
  } catch (error) {
    return {
      error,
    }
  }
})
