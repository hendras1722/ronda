import { createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import { format } from 'date-fns'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const path = getHeaders(event)
  const query = getQuery(event)

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
        created_at
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

    const money = contribution
      ?.map((item) => item.contribution)
      .reduce((partialSum, a) => partialSum + a, 0)

    const result: { money: number; created_at: string }[] = []
    const resultNotDay: { money: number; created_at: string }[] = []
    let newArr = jimpitan || []

    newArr.forEach((item, i, current) => {
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

    const i = result.reduce(
      (acc: any, currentValue: any) => {
        if (acc) {
          return {
            money: acc.money + currentValue.money,
            created_at: currentValue.created_at,
          }
        }
      },
      { money: 0 }
    )

    const resultIn = [...resultNotDay, i]
      .filter(Boolean)
      .sort(
        (a: any, b: any) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )

    const graphicData = resultIn?.map((item) => item?.money)
    const graphicDate = resultIn?.map(
      (item) =>
        (item?.created_at && format(new Date(item.created_at), 'dd/MM')) || null
    )
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
        graphicDate,
      },
    }
  } catch (error) {
    return {
      error,
    }
  }
})
