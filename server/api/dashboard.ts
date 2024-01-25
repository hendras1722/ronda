import { createError } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { format, parseISO } from 'date-fns'
import { createArrayByDateRange } from '@/utils/DateOneMonth'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseServiceRole(event)
  const path = getHeaders(event)
  const query = getQuery(event)

  const dateAnalytic = createArrayByDateRange(query.dateStart, query.dateEnd)

  if (path['postman-token']) {
    throw createError({
      statusCode: 403,
      message: 'Forbidden Access',
    })
  }
  try {
    let { data: contribution, error: errMoney } = await client
      .from('db_contribution')
      .select(
        `
        id,
        contribution,
        created_at,
        status
          `
      )
      .eq('id_complex', query.v || '')

    let { data: jimpitan, error: errJimpitan } = await client
      .from('db_jimpitan')
      .select(
        `
        id,
        money,
        created_at
          `
      )
      .eq('id_address', query.v || '')
      .gte('created_at', query.dateStart || '')
      .lt('created_at', query.dateEnd || '')

    const money = contribution
      ?.filter((item) => item.status)
      .map((item) => item.contribution)
      .reduce((partialSum, a) => partialSum + a, 0)

    const result: { money: number; created_at: string }[] = []
    const resultNotDay: { money: number; created_at: string }[] = []
    let newArr = jimpitan || []

    newArr.forEach((item, _, current) => {
      const filter = current.filter((data) => data.id !== item.id)
      const filterDate = filter.filter(
        (data) =>
          new Date(data.created_at).getDay() +
            new Date(data.created_at).getMonth() ===
          new Date(item.created_at).getDay() +
            new Date(item.created_at).getMonth()
      )
      if (filterDate.length > 0) {
        result.push({
          money: item.money,
          created_at: item.created_at,
        })
      } else {
        resultNotDay.push({
          money: item.money,
          created_at: item.created_at,
        })
      }
    })

    const byCreatedAt =
      jimpitan?.reduce((acc, current) => {
        const key = new Date(current.created_at).toISOString().slice(0, 10) // Gunakan tanggal saja untuk pengelompokan
        const value = acc.get(key) || 0
        acc.set(key, value + current.money)
        return acc
      }, new Map()) || []

    const resultIn: { value: string; created_at: string }[] = []
    for (const [key, value] of byCreatedAt) {
      resultIn.push({
        value: value,
        created_at: key,
      })
    }

    const graphicData = dateAnalytic.map((item) => {
      for (let i in resultIn) {
        if (format(new Date(resultIn[i].created_at), 'dd-MM-yyyy') === item) {
          return resultIn[i].value
        }
      }
      return 0
    })

    let { count: warga, error: errWarga } = await client
      .from('db_user')
      .select(
        `
        *,
          complex: id_complex(
            *
          )
       `,
        { count: 'exact', head: true }
      )
      .eq('id_complex', query.v || '')

    const danaMasuk = contribution
      ?.filter((item) => item.status === 'true')
      .reduce(
        (acc: any, currentValue: any) => {
          if (acc) {
            return {
              contribution: acc.contribution + currentValue.contribution,
            }
          }
        },
        { contribution: null }
      )
    const danaKeluar = contribution
      ?.filter((item) => item.status === 'false')
      .reduce(
        (acc: any, currentValue: any) => {
          if (acc) {
            return {
              contribution: acc.contribution + currentValue.contribution,
            }
          }
        },
        { contribution: null }
      )

    if (errMoney || errWarga || errJimpitan) {
      throw createError({
        statusCode: 403,
        message: String(
          errWarga?.message || errMoney?.message || errJimpitan?.message
        ),
      })
    }

    return {
      data: {
        contribution: money,
        warga,
        graphicData,
        graphicDate: dateAnalytic,
        danaMasuk,
        danaKeluar,
      },
    }
  } catch (error) {
    return {
      error,
    }
  }
})
