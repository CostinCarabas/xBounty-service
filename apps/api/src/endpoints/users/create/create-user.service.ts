import { BadRequestError } from '@XBounty/common';
import { NewUserEvent, RabbitExchanges, RegularJwtUser } from '@XBounty/core';
import { UserEntityRepository } from '@XBounty/db';
import { UserByAddressLoaderService } from '@XBounty/db-loaders';
import { RabbitPublisherService } from '@multiversx/sdk-nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateUserService {
  constructor(
    private readonly userEntityRepository: UserEntityRepository,
    private readonly userByAddressLoaderService: UserByAddressLoaderService,
    private readonly rabbitPublisherService: RabbitPublisherService,
  ) { }

  async execute(user: RegularJwtUser): Promise<void> {
    const userEntity = await this.userByAddressLoaderService.load(user.address);
    if (userEntity != null) {
      throw new BadRequestError();
    }

    await this.userEntityRepository.insertNew(user.address);

    const newUserEvent: NewUserEvent = {
      address: user.address,
    };
    await this.rabbitPublisherService.publish(RabbitExchanges.newUser, newUserEvent);
  }
}
