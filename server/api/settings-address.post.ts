import { createError } from 'h3'
import { supabase } from '@/utils/supabase'

export default defineEventHandler(async (event) => {
  const path = getHeaders(event)
  const body = await readBody(event)

  const route = getRequestHost(event)
  const BASE_URL = process.env.BASE_URL

  // if (!route.includes(String(BASE_URL))) {
  //   throw createError({
  //     statusCode: 403,
  //     message: 'Forbidden Access',
  //   })
  // }

  if (path['postman-token']) {
    throw createError({
      statusCode: 403,
      message: 'Forbidden Access',
    })
  }

  try {
    let r = (Math.random() + 1).toString(36).substring(7)
    const blok = body.blok
    const email = body.email
    const id = body.id
    const name = body.name
    const phone = body.phone
    delete body.blok
    delete body.email
    delete body.role
    delete body.id_complex
    delete body.name
    delete body.phone
    delete body.id
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
    console.log(db_complex)
    if (db_complex && db_complex.length > 0) {
      // console.log(db_complex)
      const { data, error } = await supabase
        .from('db_user')
        .upsert({
          id: id,
          id_complex: db_complex[0]?.id,
          role: 'admin',
          blok,
          email,
          name,
          phone,
        })
        // .eq('id', path.id)
        .select()
      console.log(data, error, path, 'iniwe')

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
