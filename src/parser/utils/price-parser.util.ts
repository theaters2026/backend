export class PriceParserUtil {
  static parsePrice(priceString: string): number | null {
    if (!priceString) return null

    try {
      const priceMatch = priceString.match(/(\d+(?:\s*\d+)*(?:[.,]\d+)?)/)
      if (priceMatch) {
        const cleanPrice = priceMatch[1].replace(/\s+/g, '').replace(',', '.')
        const price = parseFloat(cleanPrice)

        if (!isNaN(price)) {
          return price
        }
      }

      return null
    } catch {
      return null
    }
  }
}
