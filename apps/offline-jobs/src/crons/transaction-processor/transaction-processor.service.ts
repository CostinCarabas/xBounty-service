import { Injectable } from '@nestjs/common';
import { CacheService } from '@multiversx/sdk-nestjs-cache';
import { Constants } from '@multiversx/sdk-nestjs-common';
import { ShardTransaction, TransactionProcessor } from '@multiversx/sdk-transaction-processor';
import { AppInstallationsService } from '@XBounty/core';
import { GithubApiService } from '@XBounty/external-apis';
import { Address } from '@multiversx/sdk-core/out';

@Injectable()
export class TransactionProcessorService {
  private readonly transactionProcessor = new TransactionProcessor();
  constructor(
    private readonly cacheService: CacheService,
    private readonly appInstallationsService: AppInstallationsService,
    private readonly githubApiService: GithubApiService,
  ) {
    // this.cacheService.setRemote(this.getCacheKey(0), 6659536, this.getCacheTTL());
    // this.cacheService.setRemote(this.getCacheKey(1), 6659536, this.getCacheTTL());
    // this.cacheService.setRemote(this.getCacheKey(2), 6659536, this.getCacheTTL());
    // this.cacheService.setRemote(this.getCacheKey(4294967295), 6659536, this.getCacheTTL());
  }

  async execute() {
    await this.transactionProcessor.start({
      gatewayUrl: 'https://devnet-gateway.multiversx.com',
      maxLookBehind: 200,

      onTransactionsReceived: async (
        _shardId: unknown, _nonce: unknown, transactions: ShardTransaction[]) => {
        for (const transaction of transactions) {
          if (transaction.receiver === 'erd1qqqqqqqqqqqqqpgqxg2fkdys8drkyd0h2ngrzgp882le03z6d8sschy06e') {
            // console.log(transaction)
            switch (transaction.getDataFunctionName()) {
              case 'fund': {
                this.sendCommentForFundEvent(transaction);
                break;
              }
              case 'register': {
                this.sendCommentForRegisterEvent(transaction);
                break;
              }
              case 'releaseBounty': {
                this.sendCommentForReleaseBountyEvent(transaction);
                break;
              }
              default:
                console.log(`Tx ${transaction.hash} with function name ${transaction.getDataFunctionName()}` +
                  ' not handled!');
                break;
            }
          }
        }
      },
      getLastProcessedNonce: async (shardId: number) => {
        return await this.cacheService.getRemote(this.getCacheKey(shardId));
      },
      setLastProcessedNonce: async (shardId: number, nonce: number) => {
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

  private async sendCommentForFundEvent(transaction: ShardTransaction) {
    const args = transaction.getDataArgs();
    console.log('Found fund transaction with args:', args, transaction.hash);
    if (args && args.length === 3) {
      const repoOwner = Buffer.from(args[0], 'hex').toString('utf-8');
      const repoName = Buffer.from(args[1], 'hex').toString('utf-8');
      const issueId = parseInt(args[2], 16);

      const installationId = await this.appInstallationsService.getInstallation(repoOwner, repoName);
      if (installationId == null) {
        console.log('Installation not found for', repoOwner, repoName);
        return;
      }

      console.log('Creating comment for', repoOwner, repoName, issueId);

      await this.githubApiService.createIssueComment(
        installationId,
        repoOwner,
        repoName,
        issueId,
        `Transaction https://devnet-explorer.multiversx.com/transactions/${transaction.hash} funded the bounty! ` +
        'You can use "@xbounty register" to register as a bounty hunter!',
      );
    }
  }

  private async sendCommentForRegisterEvent(transaction: ShardTransaction) {
    const args = transaction.getDataArgs();
    if (args && args.length === 4) {
      const repoOwner = Buffer.from(args[0], 'hex').toString('utf-8');
      const repoName = Buffer.from(args[1], 'hex').toString('utf-8');
      const issueId = parseInt(args[2], 16);
      const solverGithubUser = Buffer.from(args[3], 'hex').toString('utf-8');

      const installationId = await this.appInstallationsService.getInstallation(repoOwner, repoName);
      if (installationId == null) {
        return;
      }

      await this.githubApiService.createIssueComment(
        installationId,
        repoOwner,
        repoName,
        issueId,
        `Transaction https://devnet-explorer.multiversx.com/transactions/${transaction.hash} ` +
        `registered @${solverGithubUser} as a bounty hunter!`,
      );
    }
  }

  private async sendCommentForReleaseBountyEvent(transaction: ShardTransaction) {
    const args = transaction.getDataArgs();
    console.log('Found release bounty transaction with args:', args, transaction.hash);
    if (args && args.length === 5) {
      const repoOwner = Buffer.from(args[0], 'hex').toString('utf-8');
      const repoName = Buffer.from(args[1], 'hex').toString('utf-8');
      const issueId = parseInt(args[2], 16);
      const solverGithubAddr = Address.newFromHex(args[3]).toBech32();
      const solverGithubUser = Buffer.from(args[4], 'hex').toString('utf-8');

      const installationId = await this.appInstallationsService.getInstallation(repoOwner, repoName);
      if (installationId == null) {
        return;
      }

      await this.githubApiService.createIssueComment(
        installationId,
        repoOwner,
        repoName,
        issueId,
        `Transaction https://devnet-explorer.multiversx.com/transactions/${transaction.hash} released the bounty to ` +
        `@${solverGithubUser} with wallet address ${solverGithubAddr}!`,
      );
    }
  }
}
