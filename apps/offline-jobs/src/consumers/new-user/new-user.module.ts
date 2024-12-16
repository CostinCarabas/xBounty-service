import { Module } from '@nestjs/common';
import { NewUserConsumer } from './new-user.consumer';

@Module({
  providers: [
    NewUserConsumer,
  ],
  exports: [
    NewUserConsumer,
  ],
})
export class NewUserModule { }
