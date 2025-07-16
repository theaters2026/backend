import { ApiProperty } from '@nestjs/swagger'

export class UserInfoDto {
  @ApiProperty({
    description: 'User ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  sub: string

  @ApiProperty({
    description: 'Username',
    example: 'john_doe',
  })
  username: string

  @ApiProperty({
    description: 'User role',
    example: 'user',
    enum: ['user', 'admin'],
  })
  role: string

  @ApiProperty({
    description: 'Token issued at timestamp',
    example: 1516239022,
  })
  iat: number

  @ApiProperty({
    description: 'Token expiration timestamp',
    example: 1516239922,
  })
  exp: number
}
