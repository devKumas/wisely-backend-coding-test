import { CoreEntityAndDelete } from '../../core.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { SubscriptionProduct } from './subscription-product.entity';
import { IsDate, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import { Order } from '../../order/entities/order.entity';

@Entity({ name: 'sucscriptions' })
export class Subscription extends CoreEntityAndDelete {
  @ApiProperty({
    example: '2022-03-10',
    description: '기준일',
  })
  @IsDate()
  @Column({
    name: 'start_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  startDate: Date;

  @ApiProperty({ enum: [4, 8, 12, 16], description: '구독 주기' })
  @IsEnum([4, 8, 12, 16], {
    message: '구독주기는 4, 8, 12, 16로만 입력해 주세요',
  })
  @Column({ name: 'repeat', type: 'int' })
  repeat: number;

  @OneToMany(
    () => SubscriptionProduct,
    (subscriptionProduct) => subscriptionProduct.Subscription,
  )
  SubscriptionProduct: SubscriptionProduct[];

  @OneToMany(() => Order, (order) => order.Subscription)
  Order: Order[];

  @ManyToOne(() => User, (user) => user.Subscription)
  @JoinColumn({ name: 'user_id' })
  User: User;
}
