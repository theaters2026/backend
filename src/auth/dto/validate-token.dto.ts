import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'
import { validateTokenSchema } from './validate-token.schema'

export class ValidateTokenDto {
  static schema = validateTokenSchema

  @ApiProperty({
    description: 'Access token to validate',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  accessToken: string
}
