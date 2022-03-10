import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { SubscriptionProduct } from 'src/subscription/entities/subscriptionProduct.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { CoreEntityAndDelete } from '../../core.entity';

@Entity({ name: 'products' })
export class Product extends CoreEntityAndDelete {
  @ApiProperty({
    example: '리필면도날 4개입',
    description: '이름',
  })
  @Length(2, 10)
  @IsString()
  @Column({ name: 'name', type: 'varchar', length: 50 })
  name: string;

  @ApiProperty({
    example: 5900,
    description: '판매가',
  })
  @IsNotEmpty()
  @Column({ name: 'price', type: 'int' })
  price: number;

  @OneToMany(
    () => SubscriptionProduct,
    (subscriptionProduct) => subscriptionProduct.Product,
  )
  SubscriptionProduct: SubscriptionProduct[];
}
