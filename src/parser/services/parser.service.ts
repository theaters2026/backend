import { Injectable, Logger } from '@nestjs/common'
import * as path from 'path'
import * as fs from 'fs'
import { ParsedPerformance } from '../types/parsed-performance.interface'
import { PythonExecutorService } from './python-executor.service'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class ParserService {
  private readonly logger = new Logger(ParserService.name)

  constructor(
    private pythonExecutorService: PythonExecutorService,
    private prisma: PrismaService,
  ) {}

  async getInfo(url?: string): Promise<{ message: string; count: number; updated: number }> {
    try {
      this.logger.log(`Starting info parsing with URL: ${url || 'default'}`)

      await this.pythonExecutorService.executePythonParser(url)

      const outputPath = path.join(process.cwd(), 'performances.json')

      if (!fs.existsSync(outputPath)) {
        this.logger.log('No output file found, displaying Python output only')
        return {
          message: 'Parsing completed. Check console for Python output.',
          count: 0,
          updated: 0,
        }
      }

      const fileContent = fs.readFileSync(outputPath, 'utf-8')
      const performances: ParsedPerformance[] = JSON.parse(fileContent)

      this.logger.log(`=== PARSED PERFORMANCES INFO ===`)
      this.logger.log(`Total performances found: ${performances.length}`)
      this.logger.log(`================================`)

      let updatedCount = 0

      for (const [index, perf] of performances.entries()) {
        this.logger.log(`\n--- Performance ${index + 1} ---`)
        this.logger.log(`Title: ${perf.title}`)
        this.logger.log(`Detail URL: ${perf.detail_url || 'N/A'}`)

        if (perf.title && perf.detail_url) {
          try {
            const matchingShow = await this.prisma.show.findFirst({
              where: {
                name: {
                  equals: perf.title,
                  mode: 'insensitive',
                },
              },
            })

            if (matchingShow) {
              await this.prisma.show.update({
                where: { id: matchingShow.id },
                data: { detailed_url: perf.detail_url },
              })

              updatedCount++
              this.logger.log(`✓ Updated detailed_url for show: "${perf.title}"`)
            } else {
              this.logger.log(`✗ No matching show found for: "${perf.title}"`)
            }
          } catch (error) {
            this.logger.error(`Error updating show "${perf.title}":`, error.message)
          }
        } else {
          this.logger.log(`⚠ Missing title or detail_url for performance ${index + 1}`)
        }

        this.logger.log(`------------------------`)
      }

      this.logger.log(`\n=== PARSING COMPLETED ===`)
      this.logger.log(`Total performances processed: ${performances.length}`)
      this.logger.log(`Shows updated with detailed_url: ${updatedCount}`)

      fs.unlinkSync(outputPath)

      return {
        message: `Parsing completed. Found ${performances.length} performances, updated ${updatedCount} shows. Check console for details.`,
        count: performances.length,
        updated: updatedCount,
      }
    } catch (error) {
      this.logger.error('Parsing error:', error)
      return {
        message: `Parsing error: ${error.message}. Check console for details.`,
        count: 0,
        updated: 0,
      }
    }
  }
}
