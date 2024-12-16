import { DynamicModule, Module } from '@nestjs/common';
import { TransactionGeneratorService } from './transaction-generator.service';
import { TransactionGeneratorModuleOptions } from './options';

@Module({})
export class TransactionGeneratorModule {
  static register(
    options: TransactionGeneratorModuleOptions,
  ): DynamicModule {
    return {
      module: TransactionGeneratorModule,
      providers: [
        {
          provide: TransactionGeneratorModuleOptions,
          useValue: options,
        },
        TransactionGeneratorService,
      ],
      exports: [TransactionGeneratorService],
    };
  }
}
