import {
  EntityManager,
  EntityRepository,
  Repository,
  TransactionManager,
} from 'typeorm';
import { Subscription } from '../entities/subscription.entity';

@EntityRepository(Subscription)
export class SubscriptionRepository extends Repository<Subscription> {
  async findByUserId(userId: number) {
    return await this.createQueryBuilder('subscription')
      .where('subscription.user_id = :userId', { userId })
      .getOne();
  }

  async findById(id: number) {
    return await this.createQueryBuilder('subscription')
      .where('subscription.id = :id', { id })
      .getOne();
  }

  async findFullJoinByUserId(userId: number) {
    return await this.createQueryBuilder('subscription')
      .leftJoinAndSelect(
        'subscription.SubscriptionProduct',
        'subscriptionProduct',
      )
      .leftJoinAndSelect('subscriptionProduct.Product', 'product')
      .leftJoinAndSelect('subscription.Order', 'order')
      .leftJoinAndSelect('subscription.User', 'user')
      .where('subscription.user_id = :userId', { userId })
      .andWhere('order.id IS NULL')
      .getOne();
  }

  async findFullJoinById(id: number) {
    return await this.createQueryBuilder('subscription')
      .leftJoinAndSelect(
        'subscription.SubscriptionProduct',
        'subscriptionProduct',
      )
      .leftJoinAndSelect('subscriptionProduct.Product', 'product')
      .leftJoinAndSelect('subscription.Order', 'order')
      .leftJoinAndSelect('subscription.User', 'user')
      .where('subscription.id = :id', { id })
      .andWhere('order.id IS NULL')
      .getOne();
  }

  async transactionSave(
    @TransactionManager() transactionManager: EntityManager,
    subscription: Subscription,
  ) {
    return await transactionManager.save(subscription);
  }
}
