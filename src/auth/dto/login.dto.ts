import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { User } from '../../user/entities/user.entity';

export class LoginRequestDto extends PickType(User, ['email'] as const) {
  @ApiProperty({
    example: 'password',
    description: '비밀번호',
  })
  @IsNotEmpty()
  password: string;
}
