import { ConfigUtils } from '@XBounty/common';
import { SqlDatabaseModule, UserEntity, UserEntityRepository } from '@XBounty/db';
import { UserByAddressLoaderModule } from '@XBounty/db-loaders';
import { Module } from '@nestjs/common';
import { getRedisConfiguration } from '../../../config';
import { CreateUserService } from './create-user.service';

@Module({
  imports: [
    UserByAddressLoaderModule.register(
      ConfigUtils.buildRedisOptions(getRedisConfiguration()),
    ),
    SqlDatabaseModule.forFeature(
      [
        UserEntity,
      ],
      [
        UserEntityRepository,
      ],
    ),
  ],
  providers: [
    CreateUserService,
  ],
  exports: [
    CreateUserService,
  ],
})
export class CreateUserModule { }
