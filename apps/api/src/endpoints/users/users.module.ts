import { Module } from '@nestjs/common';
import { CreateUserModule } from './create/create-user.module';
import { UsersController } from './users.controller';

@Module({
  imports: [
    CreateUserModule,
  ],
  controllers: [
    UsersController,
  ],
})
export class UsersModule { }
