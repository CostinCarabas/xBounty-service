import { DynamicModule, Module } from '@nestjs/common';
import { ContractInteractorService } from './contract-interactor.service';
import { ContractInteractiorModuleOptions } from './options';

@Module({})
export class ContractInteractorModule {
  static register(
    options: ContractInteractiorModuleOptions,
  ): DynamicModule {
    return {
      module: ContractInteractorModule,
      providers: [
        {
          provide: ContractInteractiorModuleOptions,
          useValue: options,
        },
        ContractInteractorService,
      ],
      exports: [ContractInteractorService],
    };
  }
}