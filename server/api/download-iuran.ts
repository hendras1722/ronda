import { createError } from 'h3'
import { getPagination } from '@/utils/pagination'
import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseServiceRole(event)
  const path = getHeaders(event)
  const query = getQuery(event)

  const route = getRequestHost(event)
  const BASE_URL = process.env.BASE_URL

  // if (!route.includes(String(BASE_URL))) {
  //   throw createError({
  //     statusCode: 403,
  //     message: 'Forbidden Access',
  //   })
  // }

  const { from, to } = getPagination(
    Number(query.page) - 1,
    Number(query.limit)
  )

  if (path['postman-token']) {
    throw createError({
      statusCode: 403,
      message: 'Forbidden Access',
    })
  }

  try {
    if (query.filter === 'all') {
      let { data, error } = await client
        .from('db_contribution')
        .select(
          `
      *,
      ...db_user!inner(
        name
      ),
      ...db_complex(
        house_complex
      )
      `
        )
        .eq('id_complex', query.v || '')
      if (error) {
        throw createError({
          statusCode: 403,
          message: String(error.message),
        })
      }

      return {
        data: data,
      }
    }
    let { data, error } = await client
      .from('db_contribution')
      .select(
        `
      *,
      ...db_user!inner(
        name
      ),
      ...db_complex(
        house_complex
      )
      `
      )
      .eq('id_complex', query.v || '')
      .eq('status', query.filter || '')

    if (error) {
      throw createError({
        statusCode: 403,
        message: String(error.message),
      })
    }

    return {
      data: data,
    }
  } catch (error) {
    return {
      error,
    }
  }
})
