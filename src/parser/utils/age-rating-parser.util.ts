export class AgeRatingParserUtil {
  static parseAgeRating(ageRatingString: string): number {
    if (!ageRatingString) return 0

    try {
      const match = ageRatingString.match(/(\d+)/)
      const age = match ? parseInt(match[1]) : 0
      return age
    } catch {
      return 0
    }
  }
}
