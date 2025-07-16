import { Injectable } from '@nestjs/common'
import { exec } from 'child_process'
import { promisify } from 'util'
import * as path from 'path'

const execAsync = promisify(exec)

@Injectable()
export class PythonExecutorService {
  async executePythonParser(url?: string): Promise<void> {
    const mainScriptPath = path.join(process.cwd(), 'src', 'parser', 'python', 'main.py')

    if (!require('fs').existsSync(mainScriptPath)) {
      throw new Error(`Main parser file not found at: ${mainScriptPath}`)
    }

    const pythonCommand = url
      ? `python3 "${mainScriptPath}" "${url}"`
      : `python3 "${mainScriptPath}"`

    console.log(`Executing Python command: ${pythonCommand}`)

    const { stderr, stdout } = await execAsync(pythonCommand, {
      cwd: process.cwd(),
      timeout: 180000,
    })

    if (stdout) {
      console.log(`Python stdout: ${stdout}`)
    }

    if (stderr) {
      console.error(`Python stderr: ${stderr}`)
    }
  }
}
