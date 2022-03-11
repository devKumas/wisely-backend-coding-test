import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionRepository } from './repositories/subscription.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { SubscriptionProductRepository } from './repositories/subscription-product.repository';
import { OrderRepository } from '../order/repositories/order.repository';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SubscriptionRepository,
      SubscriptionProductRepository,
      OrderRepository,
    ]),
    ProductModule,
    ConfigService,
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
})
export class SubscriptionModule {}
