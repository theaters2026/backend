import { Injectable } from '@nestjs/common'
import * as path from 'path'
import * as fs from 'fs'
import { ParsedPerformance } from '../types/parsed-performance.interface'
import { PythonExecutorService } from './python-executor.service'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class ParserService {
  constructor(
    private pythonExecutorService: PythonExecutorService,
    private prisma: PrismaService,
  ) {}

  async getInfo(url?: string): Promise<{ message: string; count: number; updated: number }> {
    try {
      console.log(`Starting info parsing with URL: ${url || 'default'}`)

      await this.pythonExecutorService.executePythonParser(url)

      const outputPath = path.join(process.cwd(), 'performances.json')

      if (!fs.existsSync(outputPath)) {
        console.log('No output file found, displaying Python output only')
        return {
          message: 'Parsing completed. Check console for Python output.',
          count: 0,
          updated: 0,
        }
      }

      const fileContent = fs.readFileSync(outputPath, 'utf-8')
      const performances: ParsedPerformance[] = JSON.parse(fileContent)

      console.log(`=== PARSED PERFORMANCES INFO ===`)
      console.log(`Total performances found: ${performances.length}`)
      console.log(`================================`)

      let updatedCount = 0

      for (const [index, perf] of performances.entries()) {
        console.log(`\n--- Performance ${index + 1} ---`)
        console.log(`Title: ${perf.title}`)
        console.log(`Category: ${perf.category}`)
        console.log(`Age Rating: ${perf.age_rating}`)
        console.log(`DateTime: ${perf.datetime}`)
        console.log(`Venue: ${perf.venue}`)
        console.log(`Price: ${perf.price}`)
        console.log(`Image URL: ${perf.image_url}`)
        console.log(`Detail URL: ${perf.detail_url || 'N/A'}`)

        // Ищем совпадение по названию и обновляем detailed_url
        if (perf.title && perf.detail_url) {
          try {
            const matchingShow = await this.prisma.show.findFirst({
              where: {
                name: {
                  equals: perf.title,
                  mode: 'insensitive', // Case-insensitive поиск
                },
              },
            })

            if (matchingShow) {
              await this.prisma.show.update({
                where: { id: matchingShow.id },
                data: { detailed_url: perf.detail_url },
              })

              updatedCount++
              console.log(`✓ Updated detailed_url for show: "${perf.title}"`)
            } else {
              console.log(`✗ No matching show found for: "${perf.title}"`)
            }
          } catch (error) {
            console.error(`Error updating show "${perf.title}":`, error.message)
          }
        } else {
          console.log(`⚠ Missing title or detail_url for performance ${index + 1}`)
        }

        console.log(`------------------------`)
      }

      console.log(`\n=== PARSING COMPLETED ===`)
      console.log(`Total performances processed: ${performances.length}`)
      console.log(`Shows updated with detailed_url: ${updatedCount}`)

      // Очистка файла после обработки
      fs.unlinkSync(outputPath)

      return {
        message: `Parsing completed. Found ${performances.length} performances, updated ${updatedCount} shows. Check console for details.`,
        count: performances.length,
        updated: updatedCount,
      }
    } catch (error) {
      console.error('Parsing error:', error)
      return {
        message: `Parsing error: ${error.message}. Check console for details.`,
        count: 0,
        updated: 0,
      }
    }
  }
}
