import { snap } from '@/utils/midtrans'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const data = await snap
    .createTransactionToken(body)
    .then((transaction: string) => {
      // transaction token
      // let transactionToken = transaction.token;
      // console.log('transactionToken:',transactionToken);
      return transaction
    })
  // snap.pay('570aff8e-427d-4fb0-ac6e-e2d4ccb1d8cb')
  return {
    data,
  }
})
