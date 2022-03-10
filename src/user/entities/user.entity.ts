import { Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { CoreEntityAndDelete } from '../../core.entity';

@Entity({ name: 'users' })
export class User extends CoreEntityAndDelete {
  @ApiProperty({
    example: 'user@domain.com',
    description: '이메일',
  })
  @Length(1, 30)
  @IsEmail()
  @Column({ name: 'email', type: 'varchar', unique: true, length: 30 })
  email: string;

  @ApiProperty({
    example: '$2b$12$hXpTBhOI.4nLGbJFvr1le.LFVBIyXUvm2g6.JLn.E.D/gUzNsLy4G',
    description: '암호화된 비밀번호',
  })
  @IsNotEmpty()
  @Column({ name: 'password', type: 'varchar', length: 100, select: false })
  password: string;

  @ApiProperty({
    example: '홍길동',
    description: '이름',
  })
  @Length(2, 10)
  @IsString()
  @Column({ name: 'name', type: 'varchar', length: 10 })
  name: string;
}
