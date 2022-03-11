import { Controller, Get } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';

@ApiTags('Product')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({
    summary: '전체 상품 조회',
    description: '등록된 모든 상품을 조회합니다.',
  })
  @ApiCreatedResponse({
    description: '성공',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        data: [
          {
            id: 1,
            name: '리필면도날 4개입',
            price: 5900,
          },
          {
            id: 2,
            name: '쉐이빙젤 150mL',
            price: 2900,
          },
          {
            id: 3,
            name: '애프터쉐이브 60mL',
            price: 3900,
          },
        ],
      },
    },
  })
  @Get()
  findAll() {
    return this.productService.findAll();
  }
}
