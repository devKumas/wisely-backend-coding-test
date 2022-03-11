import { Type } from 'class-transformer';
import { IsArray, IsInt, ValidateNested } from 'class-validator';
import { Subscription } from '../entities/subscription.entity';
import { SubscriptionProduct } from '../entities/subscription-product.entity';
import { ApiProperty, PickType } from '@nestjs/swagger';

export class CreateSubscriptionDto extends PickType(Subscription, [
  'repeat',
] as const) {
  @ApiProperty({
    example: [
      {
        productId: 1,
        amount: 2,
      },
      {
        productId: 2,
        amount: 1,
      },
    ],
    description: '상품 목록',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Product)
  products: Product[];
}

export class CreateSubscriptionProductDto extends PickType(
  CreateSubscriptionDto,
  ['products'] as const,
) {}

export class Product extends PickType(SubscriptionProduct, [
  'amount',
] as const) {
  @IsInt()
  productId: number;
}
