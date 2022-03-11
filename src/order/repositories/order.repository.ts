import {
  EntityManager,
  EntityRepository,
  Repository,
  TransactionManager,
} from 'typeorm';
import { Order } from '../entities/order.entity';

@EntityRepository(Order)
export class OrderRepository extends Repository<Order> {
  async findOneById(id: number) {
    return await this.createQueryBuilder('order')
      .where('order.id =:id', { id })
      .getMany();
  }

  async transactionSave(
    @TransactionManager() transactionManager: EntityManager,
    order: Order,
  ) {
    return await transactionManager.save(order);
  }
}
