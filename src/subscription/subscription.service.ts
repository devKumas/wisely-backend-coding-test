import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductService } from '../product/product.service';
import { User } from '../user/entities/user.entity';
import { EntityManager, getConnection } from 'typeorm';
import {
  CreateSubscriptionDto,
  CreateSubscriptionProductDto,
} from './dto/create-subscription.dto';
import { Subscription } from './entities/subscription.entity';
import { SubscriptionProduct } from './entities/subscription-product.entity';
import { SubscriptionRepository } from './repositories/subscription.repository';
import { SubscriptionProductRepository } from './repositories/subscription-product.repository';
import {
  UpdateSubscriptionDto,
  UpdateSubscriptionProductDto,
} from './dto/update-subscription.dto';
import { Order } from '../order/entities/order.entity';
import { OrderRepository } from '../order/repositories/order.repository';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(SubscriptionRepository)
    private subscriptionRepository: SubscriptionRepository,
    @InjectRepository(SubscriptionProductRepository)
    private subscriptionProductRepository: SubscriptionProductRepository,
    @InjectRepository(OrderRepository)
    private orderRepository: OrderRepository,
    private productService: ProductService,
    private configService: ConfigService,
  ) {}

  /**
   * 구독을 생성합니다.
   * @param createSubscriptionDto subscription 생성 DTO
   * @param user user
   */
  async createSubscription(
    createSubscriptionDto: CreateSubscriptionDto,
    user: User,
  ) {
    const { products, repeat } = createSubscriptionDto;
    const overlapProduct = new Set(products.map((v) => v.productId));
    if (overlapProduct.size !== products.length)
      throw new ForbiddenException('The product is duplicated.');

    const getUser = await this.subscriptionRepository.findFullJoinByUserId(
      user.id,
    );

    if (getUser) throw new ForbiddenException('Subscribing.');

    const getProducts = (await Promise.all(
      createSubscriptionDto.products.map(async (v) => {
        const product = await this.productService.findById(v.productId);

        return { Product: product, amount: v.amount };
      }),
    )) as SubscriptionProduct[];

    const totalPrice = await this.checkTotalPrice(getProducts);

    /**
     * 결제를 검증하는 로직 필요.
     */

    return await getConnection().transaction(
      async (transactionalEntityManager) => {
        const subscriptionProducts = await Promise.all(
          getProducts.map(async (v) => {
            const subscriptionProduct = new SubscriptionProduct();
            subscriptionProduct.Product = v.Product;
            subscriptionProduct.amount = v.amount;

            await this.subscriptionProductRepository.transactionSave(
              transactionalEntityManager,
              subscriptionProduct,
            );

            return subscriptionProduct;
          }),
        );

        const subscription = new Subscription();
        subscription.User = user;
        subscription.repeat = repeat;
        subscription.SubscriptionProduct = [...subscriptionProducts];

        const order = new Order();
        order.Subscription = subscription;
        order.paymentAmount = totalPrice;

        const result = await this.subscriptionRepository.transactionSave(
          transactionalEntityManager,
          subscription,
        );

        await this.createNextSubscription(
          transactionalEntityManager,
          subscription,
        );

        await this.orderRepository.transactionSave(
          transactionalEntityManager,
          order,
        );

        return result;
      },
    );
  }

  /**
   * 새로운 구독을 생성합니다.
   * @param transactionalEntityManager 트랜잭션
   * @param subscription
   */
  async createNextSubscription(
    transactionalEntityManager: EntityManager,
    subscription: Subscription,
  ) {
    const subscriptionProducts = await Promise.all(
      subscription.SubscriptionProduct.map(async (v) => {
        const subscriptionProduct = new SubscriptionProduct();
        subscriptionProduct.Product = v.Product;
        subscriptionProduct.amount = v.amount;

        await this.subscriptionProductRepository.transactionSave(
          transactionalEntityManager,
          subscriptionProduct,
        );

        return subscriptionProduct;
      }),
    );

    const date = new Date();
    date.setDate(date.getDate() + subscription.repeat * 7);

    const newSubscription = new Subscription();
    newSubscription.repeat = subscription.repeat;
    newSubscription.startDate = date;
    newSubscription.SubscriptionProduct = subscriptionProducts;
    newSubscription.User = subscription.User;

    await this.subscriptionRepository.transactionSave(
      transactionalEntityManager,
      newSubscription,
    );
  }

  /**
   * 아직 결제되지 않은 구독정보를 호출합니다.
   * @param user user
   */
  async readMySubscription(user: User) {
    const subscription = await this.subscriptionRepository.findFullJoinByUserId(
      user.id,
    );

    if (!subscription)
      throw new NotFoundException('There is no product subscribing to.');

    return subscription;
  }

  /**
   * 구독의 주기를 수정합니다.
   * @param updateSubscriptionDto subscription 수정 DTO
   * @param subscriptionId subscription id
   * @param user user
   */
  async updateSubscription(
    updateSubscriptionDto: UpdateSubscriptionDto,
    subscriptionId: number,
    user: User,
  ) {
    const subscription = await this.checkSubscription(subscriptionId, user.id);
    subscription.repeat = updateSubscriptionDto.repeat;

    return this.subscriptionRepository.save(subscription);
  }

  /**
   * 구독을 삭제합니다.
   * @param subscriptionId subscription id
   * @param user user
   */
  async deleteSubscription(subscriptionId: number, user: User) {
    await this.checkSubscription(subscriptionId, user.id);
    const newSubscription = new Subscription();
    newSubscription.id = subscriptionId;

    await this.subscriptionRepository.softDelete(newSubscription);
  }

  /**
   * 구독에 대한 사용자의 권한을 확인합니다.
   * @param subscriptionId subscription id
   * @param userId user id
   */
  async checkSubscription(subscriptionId: number, userId: number) {
    const subscription = await this.readSubscription(subscriptionId);

    if (subscription.User.id !== userId)
      throw new ForbiddenException("You don't have permission.");

    return subscription;
  }

  /**
   * 구독 정보를 호출합니다.
   * @param subscriptionId subscription id
   */
  async readSubscription(subscriptionId: number) {
    const subscription = await this.subscriptionRepository.findFullJoinById(
      subscriptionId,
    );

    if (!subscription) throw new NotFoundException("can't find it.");

    return subscription;
  }

  /**
   * 구독된 상품의 대한 권한을 확인합니다.
   * @param subscriptionProductId subscription product id
   * @param subscriptionId subscription id
   * @param userId user id
   */
  async checkSubscriptionProduct(
    subscriptionProductId: number,
    subscriptionId: number,
    userId: number,
  ) {
    const subscriptionProduct = await this.readSubscriptionProduct(
      subscriptionProductId,
    );

    if (
      subscriptionProduct?.Subscription?.id !== subscriptionId ||
      subscriptionProduct?.Subscription?.User?.id !== userId
    )
      throw new ForbiddenException("You don't have permission.");

    return subscriptionProduct;
  }

  /**
   * 구독상품을 호출합니다.
   * @param subscriptionProductId subscription product id
   */
  async readSubscriptionProduct(subscriptionProductId: number) {
    const subscriptionProduct =
      await this.subscriptionProductRepository.findJoinSubscriptionAndUserById(
        subscriptionProductId,
      );

    if (!subscriptionProduct) throw new NotFoundException("can't find it");

    return subscriptionProduct;
  }

  /**
   * 구독목록에 상품을 추가합니다.
   * @param createSubscriptionProductDto subscription proudct 생성 DTO
   * @param subscriptionId subscription id
   * @param user user
   */
  async createSubscrioptionProduct(
    createSubscriptionProductDto: CreateSubscriptionProductDto,
    subscriptionId: number,
    user: User,
  ) {
    const { products } = createSubscriptionProductDto;
    const overlapProduct = new Set(products.map((v) => v.productId));
    if (overlapProduct.size !== products.length)
      throw new ForbiddenException('The product is duplicated.');

    const subscription = await this.checkSubscription(subscriptionId, user.id);

    subscription.SubscriptionProduct.map((v) =>
      overlapProduct.add(v.Product.id),
    );

    if (
      overlapProduct.size !==
      products.length + subscription.SubscriptionProduct.length
    )
      throw new ForbiddenException('The product is duplicated.');

    const getProducts = (await Promise.all(
      createSubscriptionProductDto.products.map(async (v) => {
        const product = await this.productService.findById(v.productId);

        return { Product: product, amount: v.amount };
      }),
    )) as SubscriptionProduct[];

    return await getConnection().transaction(
      async (transactionalEntityManager) => {
        const subscriptionProducts = await Promise.all(
          getProducts.map(async (v) => {
            const subscriptionProduct = new SubscriptionProduct();
            subscriptionProduct.Product = v.Product;
            subscriptionProduct.amount = v.amount;

            await this.subscriptionProductRepository.transactionSave(
              transactionalEntityManager,
              subscriptionProduct,
            );

            return subscriptionProduct;
          }),
        );

        subscription.SubscriptionProduct = [
          ...subscription.SubscriptionProduct,
          ...subscriptionProducts,
        ];

        return await this.subscriptionRepository.transactionSave(
          transactionalEntityManager,
          subscription,
        );
      },
    );
  }

  /**
   * 구독목록에 있는 상품을 수정합니다.
   * @param updateSubscriptionProductDto subscription product 수정 DTO
   * @param subscriptionId subscription id
   * @param subscriptionProductId subscription product id
   * @param user user
   */
  async updateSubscriptionProduct(
    updateSubscriptionProductDto: UpdateSubscriptionProductDto,
    subscriptionId: number,
    subscriptionProductId: number,
    user: User,
  ) {
    const subscriptionProduct = await this.checkSubscriptionProduct(
      subscriptionProductId,
      subscriptionId,
      user.id,
    );

    if (subscriptionProduct.amount > updateSubscriptionProductDto.amount) {
      const subscription = await this.checkSubscription(
        subscriptionId,
        user.id,
      );
      await this.checkTotalPrice(
        subscription.SubscriptionProduct,
        subscriptionProductId,
        updateSubscriptionProductDto.amount,
      );
    }

    subscriptionProduct.amount = updateSubscriptionProductDto.amount;

    return this.subscriptionProductRepository.save(subscriptionProduct);
  }

  /**
   * 구독목록에 있는 상품을 삭제합니다.
   * @param subscriptionId subscription id
   * @param subscriptionProductId subscription product id
   * @param user user
   */
  async deleteSubscriptionProduct(
    subscriptionId: number,
    subscriptionProductId: number,
    user: User,
  ) {
    const subscriptionProduct = await this.checkSubscriptionProduct(
      subscriptionProductId,
      subscriptionId,
      user.id,
    );

    const subscription = await this.checkSubscription(subscriptionId, user.id);
    const subscriptionProducts = subscription.SubscriptionProduct.filter(
      (v) => v.id !== subscriptionProduct.id,
    );
    await this.checkTotalPrice(subscriptionProducts);

    await this.subscriptionProductRepository.softDelete(subscriptionProduct);
  }

  /**
   * 구독중이거나 구독할 상품의 목록의 금액을 확인합니다.
   * 구독 상품을 삭제하거나 수량을 감소하는 경우에는 subscriptionProductId, subscriptionProductAmount에 값을 입력합니다.
   * @param subscriptionProducts subscription products
   * @param subscriptionProductId subscription product id 변경될 상품의 id
   * @param subscriptionProductAmount subscription product amount 변경될 상품의 갯수
   */
  async checkTotalPrice(
    subscriptionProducts: SubscriptionProduct[],
    subscriptionProductId = 0,
    subscriptionProductAmount = 0,
  ) {
    const totalPrice = subscriptionProducts
      .map((v) => {
        if (v.id === subscriptionProductId)
          v.amount = subscriptionProductAmount;

        return v.amount * v.Product.price;
      })
      .reduce((a, b) => a + b, 0);

    if (totalPrice < this.configService.get('SUBSCRIPTION_MIN_PRICE'))
      throw new ForbiddenException('The amount is insufficient.');

    return totalPrice;
  }

  /**
   * 구독중인 상품을 미리 결제합니다.
   * @param subscriptionId subscription id
   * @param user user
   */
  async createSubscriptionPayment(subscriptionId: number, user: User) {
    /**
     * 결제를 검증하는 로직 필요.
     */

    const subscription = await this.checkSubscription(subscriptionId, user.id);

    subscription.startDate = new Date();
    const totalPrice = await this.checkTotalPrice(
      subscription.SubscriptionProduct,
    );

    return await getConnection().transaction(
      async (transactionalEntityManager) => {
        const order = new Order();
        order.paymentAmount = totalPrice;
        order.Subscription = subscription;

        await this.createNextSubscription(
          transactionalEntityManager,
          subscription,
        );

        return await this.orderRepository.transactionSave(
          transactionalEntityManager,
          order,
        );
      },
    );
  }
}
