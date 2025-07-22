import { Injectable, Logger } from '@nestjs/common'
import axios from 'axios'

@Injectable()
export class TranslationService {
  private readonly logger = new Logger(TranslationService.name)
  private readonly translationCache = new Map<string, string>()

  async translateToEnglish(text: string): Promise<string> {
    try {
      if (this.translationCache.has(text)) {
        const cached = this.translationCache.get(text)!
        return cached
      }

      const response = await axios.get('https://api.mymemory.translated.net/get', {
        params: {
          q: text,
          langpair: 'ru|en',
        },
        timeout: 10000,
      })

      if (
        response.data &&
        response.data.responseData &&
        response.data.responseData.translatedText
      ) {
        const translatedText = response.data.responseData.translatedText
        this.translationCache.set(text, translatedText)
        return translatedText
      }

      return text
    } catch (error) {
      this.logger.error(`Translation error for text "${text}": ${error.message}`)
      return text
    }
  }
}
