import * as fs from 'fs'
import * as path from 'path'

export class FileManagerUtil {
  static ensureDirectoryExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }
  }

  static fileExists(filePath: string): boolean {
    return fs.existsSync(filePath)
  }

  static readJsonFile<T>(filePath: string): T {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  }

  static deleteFile(filePath: string): void {
    try {
      fs.unlinkSync(filePath)
    } catch {
      // Ignore error
    }
  }

  static cleanupUnusedImage(filename: string): void {
    try {
      const imagePath = path.join(process.cwd(), 'static', 'images', filename)
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath)
      }
    } catch {
      // Ignore error
    }
  }
}
