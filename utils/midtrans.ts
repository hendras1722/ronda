import midtransClient from 'midtrans-client'

let snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.SERVER_KEY_MIDTRANS,
  clientKey: process.env.CLIENT_KEY_MIDTRANS,
})

let coreApi = new midtransClient.CoreApi({
  isProduction: false, // Set to true for production environment
  serverKey: '',
  clientKey: '',
})

export { snap, coreApi }
