import { Injectable, Logger } from '@nestjs/common'
import { exec } from 'child_process'
import { promisify } from 'util'
import * as path from 'path'

const execAsync = promisify(exec)

@Injectable()
export class PythonExecutorService {
  private readonly logger = new Logger(PythonExecutorService.name)

  async executePythonParser(url?: string): Promise<void> {
    const mainScriptPath = path.join(process.cwd(), 'src', 'parser', 'python', 'main.py')

    if (!require('fs').existsSync(mainScriptPath)) {
      throw new Error(`Main parser file not found at: ${mainScriptPath}`)
    }

    const pythonCommand = url
      ? `python3 "${mainScriptPath}" "${url}"`
      : `python3 "${mainScriptPath}"`

    this.logger.log(`Executing Python command: ${pythonCommand}`)

    const { stderr, stdout } = await execAsync(pythonCommand, {
      cwd: process.cwd(),
      timeout: 180000,
    })

    if (stdout) {
      this.logger.log(`Python stdout: ${stdout}`)
    }

    if (stderr) {
      this.logger.error(`Python stderr: ${stderr}`)
    }
  }
}
