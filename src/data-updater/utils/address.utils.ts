export function extractCityFromAddress(address: string): string | null {
  if (!address || !address.trim()) {
    return null
  }

  const cleanAddress = address.trim()

  const commaIndex = cleanAddress.indexOf(',')

  if (commaIndex === -1) {
    return cleanAddress
  }

  const cityName = cleanAddress.substring(0, commaIndex).trim()

  return cityName || null
}

export function capitalizeFirstLetter(text: string): string {
  if (!text || text.length === 0) {
    return text
  }

  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}
