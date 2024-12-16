import { Injectable } from '@nestjs/common';

@Injectable()
export class TransactionGeneratorService {
  constructor() { }

  async execute(): Promise<void> {
    console.log('Generating transaction...');
  }
}
