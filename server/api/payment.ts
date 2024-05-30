import { snap } from '@/utils/midtrans'

export default defineEventHandler(async (event) => {
  const query = await getQuery(event)

  const data = await snap.transaction.status(query.token)
  return {
    data,
  }
})
