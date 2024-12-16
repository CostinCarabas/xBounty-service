import { Module } from '@nestjs/common';
import { NewUserModule } from './new-user/new-user.module';

@Module({
  imports: [
    NewUserModule,
  ],
})
export class ConsumersModule { }
