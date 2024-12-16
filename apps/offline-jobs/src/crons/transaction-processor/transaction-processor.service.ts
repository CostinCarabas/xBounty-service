import { Injectable } from '@nestjs/common';
import { CacheService } from '@multiversx/sdk-nestjs-cache';
import { Constants } from '@multiversx/sdk-nestjs-common';
import { ShardTransaction, TransactionProcessor } from "@multiversx/sdk-transaction-processor";

@Injectable()
export class TransactionProcessorService {
  private readonly transactionProcessor = new TransactionProcessor();
  constructor(
    private readonly cacheService: CacheService,
  ) {
    // this.cacheService.setRemote(this.getCacheKey(0), 6659536, this.getCacheTTL());
    // this.cacheService.setRemote(this.getCacheKey(1), 6659536, this.getCacheTTL());
    // this.cacheService.setRemote(this.getCacheKey(2), 6659536, this.getCacheTTL());
    // this.cacheService.setRemote(this.getCacheKey(4294967295), 6659536, this.getCacheTTL());

  }

  async execute() {
    await this.transactionProcessor.start({
      gatewayUrl: 'https://devnet-api.multiversx.com',
      maxLookBehind: 1200,
      // eslint-disable-next-line require-await
      onTransactionsReceived: async (_shardId, _nonce, transactions, _statistics) => {

        for (const transaction of transactions) {
          if (transaction.receiver === 'erd1qqqqqqqqqqqqqpgqxg2fkdys8drkyd0h2ngrzgp882le03z6d8sschy06e') {
            // console.log(transaction)
            switch (transaction.getDataFunctionName()) {
              case 'fund': {
                const [repoOwner, repoName, issuerId] = this.getFundParsedArgs(transaction);
                if (!repoOwner || !repoName || !issuerId) {
                  return
                }
                // TODO: create comment
                break;
              }
              case 'register': {
                const [repoOwner, repoName, issuerId, solverGithubUser] = this.getRegisterParsedArgs(transaction);
                if (!repoOwner || !repoName || !issuerId || !solverGithubUser) {
                  return
                }
                // TODO: create comment
                break;
              }
              default:
                console.log(`Tx ${transaction.hash} with function name ${transaction.getDataFunctionName()} not handled!`)
                break;
            }
          }

        }
      },
      getLastProcessedNonce: async (shardId) => {
        return await this.cacheService.getRemote(this.getCacheKey(shardId));
      },
      setLastProcessedNonce: async (shardId, nonce) => {
        await this.cacheService.setRemote(this.getCacheKey(shardId), nonce, this.getCacheTTL());
      },
    });
  }

  private getCacheKey(shardId: number) {
    return `${TransactionProcessorService.name}-last-nonce-${shardId}`;
  }

  private getCacheTTL() {
    return Constants.oneMinute() * 5;
  }

  private getFundParsedArgs(transaction: ShardTransaction) {
    const args = transaction.getDataArgs();
    if (args && args.length === 3) {
      const repoOwner = Buffer.from(args[0], 'hex').toString('utf-8');
      const repoName = Buffer.from(args[1], 'hex').toString('utf-8');
      const issuerId = parseInt(args[2], 16);

      return [repoOwner, repoName, issuerId];
    }
    return []
  }

  private getRegisterParsedArgs(transaction: ShardTransaction) {
    const args = transaction.getDataArgs();
    if (args && args.length === 4) {
      const repoOwner = Buffer.from(args[0], 'hex').toString('utf-8');
      const repoName = Buffer.from(args[1], 'hex').toString('utf-8');
      const issuerId = parseInt(args[2], 16);
      const solverGithubUser = Buffer.from(args[3], 'hex').toString('utf-8');
      return [repoOwner, repoName, issuerId, solverGithubUser];
    }
    return []
  }


}