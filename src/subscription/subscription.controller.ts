import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Patch,
  Param,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import {
  CreateSubscriptionDto,
  CreateSubscriptionProductDto,
} from './dto/create-subscription.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { GetUser } from '../auth/auth.decorator';
import { User } from '../user/entities/user.entity';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  UpdateSubscriptionDto,
  UpdateSubscriptionProductDto,
} from './dto/update-subscription.dto';

@ApiTags('Subscription')
@ApiBearerAuth('accessToken')
@Controller('subscriptions')
@UseGuards(JwtAuthGuard)
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @ApiOperation({ summary: '구독 등록', description: '구독을 등록합니다.' })
  @ApiBody({
    type: CreateSubscriptionDto,
  })
  @ApiCreatedResponse({
    description: '성공',
    schema: {
      example: {
        success: true,
        statusCode: 201,
        data: {
          id: 1,
          startDate: '2022-03-10T19:46:36.000Z',
          createdAt: '2022-03-10T19:46:36.858Z',
          updatedAt: '2022-03-10T19:46:36.858Z',
          deletedAt: null,
          User: {
            id: 1,
            email: 'user@domain.com',
            name: '홍길동',
          },
          repeat: 4,
          SubscriptionProduct: [
            {
              id: 1,
              amount: 2,
              createdAt: '2022-03-10T19:46:36.832Z',
              updatedAt: '2022-03-10T19:46:36.832Z',
              deletedAt: null,
              Product: {
                id: 1,
                name: '리필면도날 4개입',
                price: 5900,
              },
            },
            {
              id: 2,
              amount: 1,
              createdAt: '2022-03-10T19:46:36.843Z',
              updatedAt: '2022-03-10T19:46:36.843Z',
              deletedAt: null,
              Product: {
                id: 2,
                name: '쉐이빙젤 150mL',
                price: 2900,
              },
            },
          ],
        },
      },
    },
  })
  @ApiForbiddenResponse({ description: '중복된 상품이 입력되었습니다.' })
  @ApiForbiddenResponse({ description: '이미 구독중입니다.' })
  @Post()
  createSubscriptio(
    @GetUser() user: User,
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ) {
    return this.subscriptionService.createSubscription(
      createSubscriptionDto,
      user,
    );
  }

  @ApiOperation({
    summary: '구독 조회',
    description: '내 구독정보를 조회합니다.',
  })
  @ApiOkResponse({
    description: '성공',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        data: {
          id: 1,
          startDate: '2022-03-10T19:53:10.000Z',
          repeat: 4,
          SubscriptionProduct: [
            {
              id: 1,
              amount: 2,
              Product: {
                id: 1,
                name: '리필면도날 4개입',
                price: 5900,
              },
            },
            {
              id: 2,
              amount: 1,
              Product: {
                id: 2,
                name: '쉐이빙젤 150mL',
                price: 2900,
              },
            },
          ],
        },
      },
    },
  })
  @ApiNotFoundResponse({ description: '구독하고 있지 않습니다.' })
  @Get()
  getSubscription(@GetUser() user: User) {
    console.log(user);
    return this.subscriptionService.readMySubscription(user);
  }

  @ApiOperation({
    summary: '구독 변경',
    description: '구독 주기를 변경합니다.',
  })
  @ApiBody({
    type: UpdateSubscriptionDto,
  })
  @ApiOkResponse({
    description: '성공',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        data: {
          id: 1,
          startDate: '2022-03-10T19:53:10.000Z',
          repeat: 4,
          updatedAt: '2022-03-11T06:29:04.000Z',
          deletedAt: null,
          User: {
            id: 1,
            email: 'user@domain.com',
            name: '홍길동',
          },
        },
      },
    },
  })
  @Patch('/:subscriptionId')
  updateSubscription(
    @GetUser() user: User,
    @Param('subscriptionId', ParseIntPipe) subscriptionId: number,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    return this.subscriptionService.updateSubscription(
      updateSubscriptionDto,
      subscriptionId,
      user,
    );
  }

  @ApiOperation({
    summary: '구독 삭제',
    description: '구독을 삭제합니다.',
  })
  @ApiOkResponse({
    description: '성공',
    schema: {
      example: {
        success: true,
        statusCode: 200,
      },
    },
  })
  @Delete('/:subscriptionId')
  deleteSubscription(
    @GetUser() user: User,
    @Param('subscriptionId', ParseIntPipe) subscriptionId: number,
  ) {
    return this.subscriptionService.deleteSubscription(subscriptionId, user);
  }

  @ApiOperation({
    summary: '구독 상품 추가',
    description: '구독한 상품을 추가 합니다.',
  })
  @ApiBody({
    type: CreateSubscriptionProductDto,
  })
  @ApiCreatedResponse({
    description: '성공',
    schema: {
      example: {
        success: true,
        statusCode: 201,
        data: {
          id: 1,
          startDate: '2022-03-10T19:46:36.000Z',
          createdAt: '2022-03-10T19:46:36.858Z',
          updatedAt: '2022-03-10T19:46:36.858Z',
          deletedAt: null,
          User: {
            id: 1,
            email: 'user@domain.com',
            name: '홍길동',
          },
          repeat: 4,
          SubscriptionProduct: [
            {
              id: 1,
              amount: 2,
              createdAt: '2022-03-10T19:46:36.832Z',
              updatedAt: '2022-03-10T19:46:36.832Z',
              deletedAt: null,
              Product: {
                id: 1,
                name: '리필면도날 4개입',
                price: 5900,
              },
            },
            {
              id: 2,
              amount: 1,
              createdAt: '2022-03-10T19:46:36.843Z',
              updatedAt: '2022-03-10T19:46:36.843Z',
              deletedAt: null,
              Product: {
                id: 2,
                name: '쉐이빙젤 150mL',
                price: 2900,
              },
            },
          ],
        },
      },
    },
  })
  @ApiForbiddenResponse({ description: '중복된 상품이 입력되었습니다.' })
  @Post('/:subscriptionId/products')
  createSubscriptionProduct(
    @GetUser() user: User,
    @Param('subscriptionId', ParseIntPipe) subscriptionId: number,
    @Body() createSubscriptionProductDto: CreateSubscriptionProductDto,
  ) {
    return this.subscriptionService.createSubscrioptionProduct(
      createSubscriptionProductDto,
      subscriptionId,
      user,
    );
  }

  @ApiOperation({
    summary: '구독 상품 수정',
    description: '구독한 상품을 수정합니다.',
  })
  @ApiBody({
    type: UpdateSubscriptionProductDto,
  })
  @ApiOkResponse({
    description: '성공',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        data: {
          id: 1,
          amount: 1,
          Subscription: {
            id: 1,
            startDate: '2022-03-11T08:20:45.000Z',
            repeat: 4,
            User: {
              id: 1,
              email: 'user@domain.com',
              name: '홍길동',
            },
          },
        },
      },
    },
  })
  @Patch('/:subscriptionId/products/:subscriptionProductId')
  updateSubscriptionProduct(
    @GetUser() user: User,
    @Param('subscriptionId', ParseIntPipe) subscriptionId: number,
    @Param('subscriptionProductId', ParseIntPipe) subscriptionProductId: number,
    @Body() updateSubscriptionProductDto: UpdateSubscriptionProductDto,
  ) {
    return this.subscriptionService.updateSubscriptionProduct(
      updateSubscriptionProductDto,
      subscriptionId,
      subscriptionProductId,
      user,
    );
  }

  @ApiOperation({
    summary: '구독 상품 삭제',
    description: '구독한 상품을 삭제합니다.',
  })
  @ApiOkResponse({
    description: '성공',
    schema: {
      example: {
        success: true,
        statusCode: 200,
      },
    },
  })
  @Delete('/:subscriptionId/products/:subscriptionProductId')
  deleteSubscriptionProduct(
    @GetUser() user: User,
    @Param('subscriptionId', ParseIntPipe) subscriptionId: number,
    @Param('subscriptionProductId', ParseIntPipe) subscriptionProductId: number,
  ) {
    return this.subscriptionService.deleteSubscriptionProduct(
      subscriptionId,
      subscriptionProductId,
      user,
    );
  }

  @ApiOperation({
    summary: '구독 결제',
    description: '현재 구독되어 있는 상품을 결제합니다.',
  })
  @ApiOkResponse({
    description: '성공',
    schema: {
      example: {
        success: true,
        statusCode: 201,
        data: {
          id: 1,
          paymentAmount: 590000,
          createdAt: '2022-03-11T16:46:23.481Z',
          updatedAt: '2022-03-11T16:46:23.481Z',
          deletedAt: null,
          Subscription: {
            id: 1,
            startDate: '2022-03-11T16:46:23.466Z',
            repeat: 4,
            SubscriptionProduct: [
              {
                id: 1,
                amount: 100,
                Product: {
                  id: 1,
                  name: '리필면도날 4개입',
                  price: 5900,
                },
              },
            ],
            Order: [],
            User: {
              id: 1,
              email: 'user@domain.com',
              name: '홍길동',
            },
          },
        },
      },
    },
  })
  @Post('/:subscriptionId/payment')
  readSubscriptionPayment(
    @GetUser() user: User,
    @Param('subscriptionId', ParseIntPipe) subscriptionId: number,
  ) {
    return this.subscriptionService.createSubscriptionPayment(
      subscriptionId,
      user,
    );
  }
}
