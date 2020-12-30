export function encodeToBase64(str: string) {
  if (!str) {
    return ''
  }
  return Buffer.from(str).toString('base64')
}
