import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { UserEntity } from '../entities';

@Injectable()
export class UserEntityRepository {
  constructor(
    @InjectRepository(UserEntity) private readonly repository: Repository<UserEntity>,
  ) { }

  insertNew(address: string): Promise<InsertResult> {
    return this.repository.insert({
      address,
    });
  }

  findByAddress(address: string): Promise<UserEntity | null> {
    return this.repository.findOne({
      where: {
        address,
      },
    });
  }
}
