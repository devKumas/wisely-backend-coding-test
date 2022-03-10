import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import bcrypt from 'bcrypt';
import { User } from '../../user/entities/user.entity';
import { Product } from '../../product/entities/product.entity';

export class CreateInitialData implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const hashedPassword = await bcrypt.hash('password', 10);
    await connection
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([
        {
          id: 1,
          email: 'user@admin.com',
          password: hashedPassword,
          name: 'user',
        },
      ])
      .execute();

    await connection
      .createQueryBuilder()
      .insert()
      .into(Product)
      .values([
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
      ])
      .execute();
  }
}
