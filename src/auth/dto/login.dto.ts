import { ApiProperty } from '@nestjs/swagger'
import { z } from 'zod'

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  email: z.string().email().optional(),
})

export class LoginDto {
  static schema = loginSchema

  @ApiProperty()
  username: string

  @ApiProperty()
  password: string
  @ApiProperty({ required: false })
  email?: string
}
