import { PickType } from '@nestjs/swagger';
import { SubscriptionProduct } from '../entities/subscription-product.entity';
import { Subscription } from '../entities/subscription.entity';

export class UpdateSubscriptionDto extends PickType(Subscription, [
  'repeat',
] as const) {}

export class UpdateSubscriptionProductDto extends PickType(
  SubscriptionProduct,
  ['amount'] as const,
) {}
