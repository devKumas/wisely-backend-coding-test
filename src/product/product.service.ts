import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductRepository } from './repositories/product.repository';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductRepository)
    private productRepository: ProductRepository,
  ) {}
  findAll() {
    return this.productRepository.findAll();
  }

  findById(id: number) {
    return this.productRepository.findById(id);
  }
}
