export class DateParserUtil {
  private static readonly MONTH_MAPPING: { [key: string]: number } = {
    января: 0,
    январь: 0,
    янв: 0,
    февраля: 1,
    февраль: 1,
    фев: 1,
    марта: 2,
    март: 2,
    мар: 2,
    апреля: 3,
    апрель: 3,
    апр: 3,
    мая: 4,
    май: 4,
    июня: 5,
    июнь: 5,
    июн: 5,
    июля: 6,
    июль: 6,
    июл: 6,
    августа: 7,
    август: 7,
    авг: 7,
    сентября: 8,
    сентябрь: 8,
    сен: 8,
    октября: 9,
    октябрь: 9,
    окт: 9,
    ноября: 10,
    ноябрь: 10,
    ноя: 10,
    декабря: 11,
    декабрь: 11,
    дек: 11,
  }

  static parseDate(dateString: string): Date | null {
    if (!dateString) return null

    try {
      console.log(`Парсим дату: "${dateString}"`)

      const cleanDateString = dateString
        .trim()
        .replace(/[\s\u00A0\u2000-\u200B\u2028\u2029\u202F\u205F\u3000]/g, ' ')
        .replace(/\s+/g, ' ')

      console.log(`Очищенная строка: "${cleanDateString}"`)

      // Попытка парсинга русской даты
      const russianDate = this.parseRussianDate(cleanDateString)
      if (russianDate) return russianDate

      // Попытка парсинга ISO даты
      const isoDate = this.parseISODate(cleanDateString)
      if (isoDate) return isoDate

      // Попытка стандартного парсинга
      const standardDate = new Date(cleanDateString)
      if (!isNaN(standardDate.getTime())) {
        console.log(`Создана дата стандартно: ${standardDate}`)
        return standardDate
      }

      console.log(`Не удалось распарсить дату: "${dateString}"`)
      return null
    } catch (error) {
      console.error(`Ошибка при парсинге даты "${dateString}":`, error)
      return null
    }
  }

  private static parseRussianDate(cleanDateString: string): Date | null {
    const russianDateMatch = cleanDateString.match(/(\d{1,2})\s+([а-яё]+),?\s*(\d{1,2}):(\d{2})/i)

    if (russianDateMatch) {
      const [, day, monthName, hours, minutes] = russianDateMatch
      const month = this.MONTH_MAPPING[monthName.toLowerCase()]

      console.log(`Найдено: день=${day}, месяц=${monthName} (${month}), время=${hours}:${minutes}`)

      if (month !== undefined) {
        const currentYear = new Date().getFullYear()
        const parsedDate = new Date(
          currentYear,
          month,
          parseInt(day),
          parseInt(hours),
          parseInt(minutes),
        )

        console.log(`Создана дата: ${parsedDate}`)
        return parsedDate
      } else {
        console.log(`Месяц "${monthName}" не найден в словаре`)
      }
    } else {
      console.log('Регулярное выражение не сработало')
      console.log(`Длина строки: ${cleanDateString.length}`)
      console.log(
        `Коды символов: ${cleanDateString
          .split('')
          .map((c) => c.charCodeAt(0))
          .join(', ')}`,
      )
    }

    return null
  }

  private static parseISODate(cleanDateString: string): Date | null {
    const isoDateMatch = cleanDateString.match(/(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})/)

    if (isoDateMatch) {
      const [, year, month, day, hours, minutes] = isoDateMatch
      const parsedDate = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hours),
        parseInt(minutes),
      )
      console.log(`Создана дата ISO: ${parsedDate}`)
      return parsedDate
    }

    return null
  }
}
