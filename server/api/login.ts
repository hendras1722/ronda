import { createError } from 'h3'
import { supabase } from '@/utils/supabase'

export default defineEventHandler(async (event) => {
  const path = getHeaders(event)
  const body = await readBody(event)
  if (path['postman-token']) {
    throw createError({
      statusCode: 403,
      message: 'Forbidden Access',
    })
  }
  try {
    let { data, error } = await supabase.auth.signInWithPassword(body)

    // let { data, error } = await supabase.auth.admin.inviteUserByEmail(
    //   'muhsyahendraa1722@gmail.com'
    // )
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
