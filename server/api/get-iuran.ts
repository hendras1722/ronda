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
      console.log(query)
      let { data, error, count } = await client
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
      `,
          { count: 'exact' }
        )
        .eq('id_complex', query.v || '')
        .gte('created_at', query.dateStart || '')
        .lt('created_at', query.dateEnd || '')
        .ilike('db_user.name', `%${query.q}%`)
        .range(from, to)
        .order('created_at', { ascending: false })

      if (error) {
        throw createError({
          statusCode: 403,
          message: String(error.message),
        })
      }
      return {
        data,
        total: count,
        page: Number(query.page),
      }
    }
    let { data, error, count } = await client
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
      `,
        { count: 'exact' }
      )
      .eq('id_complex', query.v || '')
      .eq('status', query.filter || '')
      .gte('created_at', query.dateStart || '')
      .lt('created_at', query.dateEnd || '')
      .ilike('db_user.name', `%${query.q}%`)
      .range(from, to)
      .order('created_at', { ascending: false })

    if (error) {
      throw createError({
        statusCode: 403,
        message: String(error.message),
      })
    }
    return {
      data,
      total: count,
      page: Number(query.page),
    }
  } catch (error) {
    return {
      error,
    }
  }
})
