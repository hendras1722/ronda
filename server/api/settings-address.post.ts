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
    let r = (Math.random() + 1).toString(36).substring(7)
    const blok = body.blok
    delete body.blok
    const { data: db_complex, error: db_complex_error } = await supabase
      .from('db_complex')
      .upsert({
        ...body,
        link:
          String(body.house_complex.split(' ')[0]).toLocaleLowerCase() +
          '_' +
          r,
      })
      .select()
    console.log(db_complex_error, 'inidb_complex_error')
    if (db_complex && db_complex.length > 0) {
      // console.log(db_complex)
      const { error } = await supabase
        .from('db_user')
        .update({
          id_complex: db_complex[0]?.id,
          role: 'admin',
          blok: blok,
        })
        .eq('id', path.id)
        .select()
      console.log(error, 'iniwewe')
      if (error) {
        throw createError({
          statusCode: 403,
          message: String(error?.message),
        })
      }
    }

    if (db_complex_error) {
      throw createError({
        statusCode: 403,
        message: String(db_complex_error?.message),
      })
    }
    return {
      data: true,
    }
  } catch (error) {
    return {
      error,
    }
  }
})
