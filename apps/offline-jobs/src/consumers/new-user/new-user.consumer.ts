import { CompetingRabbitConsumer } from '@multiversx/sdk-nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { NewUserEvent, RabbitExchanges, RabbitQueues } from '@XBounty/core';
import { getDisabledConsumersConfiguration } from '../../config';

@Injectable()
export class NewUserConsumer {
  @CompetingRabbitConsumer({
    exchange: RabbitExchanges.newUser,
    queue: RabbitQueues.newUser,
    disable: getDisabledConsumersConfiguration()?.newUser,
  })
  async consume(event: NewUserEvent): Promise<void> {
    console.log(`New user joined ${event.address}`);
  }
}
