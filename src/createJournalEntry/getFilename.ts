export function getFilename() {
  const date = new Date()

  const year = date.getUTCFullYear()

  const month = date.getMonth()

  const day = date.getDate()

  const humanReadableDate = new Date().toDateString().replace(/ /gi, '_')

  return `${year}${month}${day}-${humanReadableDate}`
}
