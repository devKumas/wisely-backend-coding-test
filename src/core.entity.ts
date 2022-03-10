import { ApiProperty } from '@nestjs/swagger';
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class CoreEntity {
  @ApiProperty({
    example: '1',
    description: '고유 아이디',
  })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ApiProperty({
    example: '2022-01-01T00:00:00.000Z',
    description: '등록일',
  })
  @CreateDateColumn({ name: 'created_at', select: false })
  createdAt: Date;

  @ApiProperty({
    example: '2022-01-01T00:00:00.000Z',
    description: '수정일',
  })
  @UpdateDateColumn({ name: 'updated_at', select: false })
  updatedAt: Date;
}

export class CoreEntityAndDelete extends CoreEntity {
  @ApiProperty({
    example: 'null',
    description: '삭제일',
  })
  @DeleteDateColumn({ name: 'deleted_at', select: false })
  deletedAt: Date;
}
