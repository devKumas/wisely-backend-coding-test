import { EntityRepository, Repository } from 'typeorm';
import { Product } from '../entities/product.entity';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
  async findAll() {
    return await this.createQueryBuilder('product').getMany();
  }
}
