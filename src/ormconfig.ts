import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import dotenv from 'dotenv';
import { Product } from './product/entities/product.entity';
import { Subscription } from './subscription/entities/subscription.entity';
import { SubscriptionProduct } from './subscription/entities/subscriptionProduct.entity';
import { User } from './user/entities/user.entity';

const isDevelopment = process.env.NODE_ENV !== 'production';

dotenv.config({
  path: `.env.${isDevelopment ? 'development' : 'production'}`,
});

console.log(process.env.DATABASE_HOST);
const connectionOptions: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [User, Product, Subscription, SubscriptionProduct],
  synchronize: isDevelopment ? true : false,
  logging: isDevelopment ? true : false,
  migrations: [__dirname + '/src/migrations/*.ts'],
  cli: { migrationsDir: 'src/migrations' },
  autoLoadEntities: true,
  charset: 'utf8mb4',
};

export default connectionOptions;
