import {
  EntityManager,
  EntityRepository,
  Repository,
  TransactionManager,
} from 'typeorm';
import { SubscriptionProduct } from '../entities/subscription-product.entity';

@EntityRepository(SubscriptionProduct)
export class SubscriptionProductRepository extends Repository<SubscriptionProduct> {
  async transactionSave(
    @TransactionManager() transactionManager: EntityManager,
    subscriptionProduct: SubscriptionProduct,
  ) {
    return await transactionManager.save(subscriptionProduct);
  }

  async findJoinSubscriptionAndUserById(id: number) {
    return await this.createQueryBuilder('subscriptionProduct')
      .leftJoinAndSelect('subscriptionProduct.Subscription', 'subscription')
      .leftJoinAndSelect('subscription.User', 'user')
      .where('subscriptionProduct.id = :id', { id })
      .getOne();
  }
}
