import { ApiProperty } from '@nestjs/swagger'

export class ShowDto {
  @ApiProperty({ format: 'uuid' })
  id: string

  @ApiProperty()
  externalId: number

  @ApiProperty()
  name: string

  @ApiProperty({ nullable: true })
  detailedUrl?: string

  @ApiProperty({ nullable: true })
  image?: string

  @ApiProperty({ nullable: true })
  desc?: string

  @ApiProperty()
  partnerId: number

  @ApiProperty()
  ageLimit: number

  @ApiProperty({ nullable: true })
  shortInfo?: string

  @ApiProperty({ nullable: true })
  fullInfo?: string

  @ApiProperty({ nullable: true })
  duration?: string

  @ApiProperty({ nullable: true })
  minPrice?: number

  @ApiProperty({ nullable: true })
  maxPrice?: number

  @ApiProperty()
  isPushkin: boolean

  @ApiProperty()
  shopId: string

  @ApiProperty({ type: 'array', items: { type: 'object' } })
  events: object[]

  @ApiProperty({ type: 'array', items: { type: 'object' } })
  showCategories: object[]
}
