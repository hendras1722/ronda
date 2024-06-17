import { coreApi } from '@/utils/midtrans'

export default defineEventHandler(async (event) => {
  const query = await readBody(event)

  const data = await coreApi.charge(query)
  return {
    data,
  }
})
