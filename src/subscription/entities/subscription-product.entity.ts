import { CoreEntityAndDelete } from '../../core.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Product } from '../../product/entities/product.entity';
import { Subscription } from './subscription.entity';
import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'sucscription_products' })
export class SubscriptionProduct extends CoreEntityAndDelete {
  @ApiProperty({
    example: 1,
    description: '수량',
  })
  @IsInt()
  @Min(1)
  @Column({ name: 'amount', type: 'int' })
  amount: number;

  @ManyToOne(() => Product, (product) => product.SubscriptionProduct)
  @JoinColumn({ name: 'product_id' })
  Product: Product;

  @ManyToOne(
    () => Subscription,
    (subscription) => subscription.SubscriptionProduct,
  )
  @JoinColumn({ name: 'subscription_id' })
  Subscription: Subscription;
}
