import { AbiRegistry, ApiNetworkProvider, QueryRunnerAdapter, SmartContractQueriesController, SmartContractTransactionsFactory, TransactionsFactoryConfig } from '@multiversx/sdk-core/out';
import abi from './xbounty.abi.json'
import { ContractInteractiorModuleOptions } from './options';
export class ContractInteractorService {
  protected queryController: SmartContractQueriesController;
  protected factory: SmartContractTransactionsFactory;
  constructor(
    private readonly options: ContractInteractiorModuleOptions,
  ) {
    const apiNetworkProvider = new ApiNetworkProvider(this.options.api, { clientName: 'launchpad-service-v2' });
    const factoryConfig = new TransactionsFactoryConfig({ chainID: this.options.chainId });
    const queryRunner = new QueryRunnerAdapter({ networkProvider: apiNetworkProvider });
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
  async getBounty(options: { repoOwner: string; repoUrl: string; issueId: bigint }): Promise<any[]> {
    let args: any[] = [];

    args.push(options.repoOwner);
    args.push(options.repoUrl);
    args.push(options.issueId);

    const query = this.queryController.createQuery({
      contract: this.options.contract,
      function: "getBounty",
      arguments: args,
    });

    const response = await this.queryController.runQuery(query);
    return this.queryController.parseQueryResponse(response);
  }

  /**
   *This is a view method. This will run a vm-query.
   */
  async getBountyIds(options: { repoOwner: string; repoUrl: string; issueId: bigint }): Promise<any[]> {
    let args: any[] = [];

    args.push(options.repoOwner);
    args.push(options.repoUrl);
    args.push(options.issueId);

    const query = this.queryController.createQuery({
      contract: this.options.contract,
      function: "getBountyIds",
      arguments: args,
    });

    const response = await this.queryController.runQuery(query);
    return this.queryController.parseQueryResponse(response);
  }
}