export function parseJwt(token: string) {
  if (!Buffer) return
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
}
