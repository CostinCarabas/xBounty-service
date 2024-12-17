import {
  AbiRegistry, ApiNetworkProvider, QueryRunnerAdapter, SmartContractQueriesController,
  SmartContractTransactionsFactory, TransactionsFactoryConfig,
} from '@multiversx/sdk-core/out';
import abi from './xbounty.abi.json';
import { ContractInteractiorModuleOptions } from './options';
import { Injectable } from '@nestjs/common';
import { BountyInfo } from './models';
@Injectable()
export class ContractInteractorService {
  protected queryController: SmartContractQueriesController;
  protected factory: SmartContractTransactionsFactory;
  constructor(
    private readonly options: ContractInteractiorModuleOptions,
  ) {
    const apiNetworkProvider = new ApiNetworkProvider(this.options.api, {
      clientName: 'x-bounty-service',
    });
    const factoryConfig = new TransactionsFactoryConfig({
      chainID: this.options.chainId,
    });
    const queryRunner = new QueryRunnerAdapter({
      networkProvider: apiNetworkProvider,
    });
    const abiRegistry = AbiRegistry.create(abi);

    this.queryController = new SmartContractQueriesController({
      queryRunner: queryRunner,
      abi: abiRegistry,
    });

    this.factory = new SmartContractTransactionsFactory({
      config: factoryConfig,
      abi: abiRegistry,
    });
  }

  /**
  *This is a view method. This will run a vm-query.
  */
  async getBounty(options: { repoOwner: string; repoUrl: string; issueId: number }): Promise<BountyInfo | undefined> {
    const args: unknown[] = [];

    args.push(options.repoOwner);
    args.push(options.repoUrl);
    args.push(options.issueId);

    const query = this.queryController.createQuery({
      contract: this.options.contract,
      function: 'getBounty',
      arguments: args,
    });

    try {
      const responseRaw = await this.queryController.runQuery(query);
      const response = this.queryController.parseQueryResponse(responseRaw);
      if (response[0]) {
        return response.map(item => ({
          repo_owner: item.repo_owner.toString(),
          repo_url: item.repo_url.toString(),
          issue_id: item.issue_id.toNumber(),
          amount: item.amount.toNumber(),
          proposer: item.proposer.toString(),
          solvers: item.solvers.map((solver: { solver_addr: string, solver_github: string }) => (
            {
              solver_addr: solver.solver_addr.toString(),
              solver_github: solver.solver_github.toString(),
            })),
          status: item.status,
          created_at: item.created_at.toNumber(),
        }))[0];
      }
      return undefined;
    } catch (error) {
      console.error('error :>> ', error);
      return undefined;
    }
  }

  /**
   *This is a view method. This will run a vm-query.
   */
  async getBountyIds(options: { repoOwner: string; repoUrl: string; issueId: bigint }): Promise<unknown[]> {
    const args: unknown[] = [];

    args.push(options.repoOwner);
    args.push(options.repoUrl);
    args.push(options.issueId);

    const query = this.queryController.createQuery({
      contract: this.options.contract,
      function: 'getBountyIds',
      arguments: args,
    });

    const response = await this.queryController.runQuery(query);
    return this.queryController.parseQueryResponse(response);
  }
}
