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
    let { data, error } = await supabase.auth.signUp({
      email: 'muhsyahendraa1722@gmail.com',
      password: '123123321',
    })

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
