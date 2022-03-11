import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CoreEntityAndDelete } from '../../core.entity';
import { Subscription } from '../../subscription/entities/subscription.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'orders' })
export class Order extends CoreEntityAndDelete {
  @ApiProperty({
    example: 5900,
    description: '판매금액',
  })
  @IsNotEmpty()
  @Column({ name: 'payment_amount', type: 'int' })
  paymentAmount: number;

  @ManyToOne(() => Subscription, (subscription) => subscription.Order)
  @JoinColumn({ name: 'subscription_id' })
  Subscription: Subscription;
}
