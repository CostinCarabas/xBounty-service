import { SmartContractTransactionsFactory } from "@multiversx/sdk-core";
import { TransactionsFactoryConfig } from "@multiversx/sdk-core";
import { Address } from "@multiversx/sdk-core";
import { AbiRegistry } from "@multiversx/sdk-core";
import { ApiNetworkProvider } from "@multiversx/sdk-network-providers";
import { QueryRunnerAdapter } from "@multiversx/sdk-core";
import { SmartContractQueriesController } from "@multiversx/sdk-core";
import { TokenTransfer } from "@multiversx/sdk-core";
import { Transaction } from "@multiversx/sdk-core";

export class XBounty {
    private readonly factory: SmartContractTransactionsFactory;
    private readonly abi: AbiRegistry;
    private readonly contractAddress: Address;
    private readonly queryController: SmartContractQueriesController;

    constructor() {
        const plainAbi: any = {
            buildInfo: {
                rustc: {
                    version: "1.79.0",
                    commitHash: "129f3b9964af4d4a709d1383930ade12dfe7c081",
                    commitDate: "2024-06-10",
                    channel: "Stable",
                    short: "rustc 1.79.0 (129f3b996 2024-06-10)",
                },
                contractCrate: { name: "x_bounty", version: "0.0.0" },
                framework: { name: "multiversx-sc", version: "0.54.6" },
            },
            name: "XBounty",
            constructor: { inputs: [], outputs: [] },
            upgradeConstructor: { inputs: [], outputs: [] },
            endpoints: [
                {
                    name: "fund",
                    mutability: "mutable",
                    payableInTokens: ["EGLD"],
                    inputs: [
                        { name: "repo_owner", type: "bytes" },
                        { name: "repo_url", type: "bytes" },
                        { name: "issue_id", type: "u64" },
                    ],
                    outputs: [],
                    onlyOwner: false,
                },
                {
                    name: "register",
                    mutability: "mutable",
                    inputs: [
                        { name: "repo_owner", type: "bytes" },
                        { name: "repo_url", type: "bytes" },
                        { name: "issue_id", type: "u64" },
                        { name: "solver_github", type: "bytes" },
                    ],
                    outputs: [],
                    onlyOwner: false,
                    payableInTokens: [],
                },
                {
                    name: "releaseBounty",
                    mutability: "mutable",
                    inputs: [
                        { name: "repo_owner", type: "bytes" },
                        { name: "repo_url", type: "bytes" },
                        { name: "issue_id", type: "u64" },
                        { name: "solver_addr", type: "Address" },
                        { name: "solver_github", type: "bytes" },
                    ],
                    outputs: [],
                    onlyOwner: false,
                    payableInTokens: [],
                },
                {
                    name: "getBounty",
                    mutability: "readonly",
                    inputs: [
                        { name: "repo_owner", type: "bytes" },
                        { name: "repo_url", type: "bytes" },
                        { name: "issue_id", type: "u64" },
                    ],
                    outputs: [{ type: "Option<Bounty>" }],
                    onlyOwner: false,
                    payableInTokens: [],
                },
                {
                    name: "getBountyIds",
                    mutability: "readonly",
                    inputs: [
                        { name: "repo_owner", type: "bytes" },
                        { name: "repo_url", type: "bytes" },
                        { name: "issue_id", type: "u64" },
                    ],
                    outputs: [{ type: "Bounty" }],
                    onlyOwner: false,
                    payableInTokens: [],
                },
            ],
            events: [
                {
                    identifier: "fund",
                    inputs: [
                        { name: "repo_owner", type: "bytes", indexed: true },
                        { name: "repo_url", type: "bytes", indexed: true },
                        { name: "issue_id", type: "u64", indexed: true },
                        { name: "amount", type: "BigUint", indexed: true },
                        { name: "proposer", type: "Address", indexed: true },
                    ],
                },
                {
                    identifier: "claim",
                    inputs: [
                        { name: "repo_owner", type: "bytes", indexed: true },
                        { name: "repo_url", type: "bytes", indexed: true },
                        { name: "issue_id", type: "u64", indexed: true },
                        { name: "solver_addr", type: "Address", indexed: true },
                        { name: "solver_github", type: "bytes", indexed: true },
                    ],
                },
                {
                    identifier: "complete",
                    inputs: [
                        { name: "repo_owner", type: "bytes", indexed: true },
                        { name: "repo_url", type: "bytes", indexed: true },
                        { name: "issue_id", type: "u64", indexed: true },
                        { name: "solver_addr", type: "Address", indexed: true },
                        { name: "solver_github", type: "bytes", indexed: true },
                        { name: "amount", type: "BigUint", indexed: true },
                    ],
                },
            ],
            esdtAttributes: [],
            hasCallback: false,
            types: {
                Bounty: {
                    type: "struct",
                    fields: [
                        { name: "repo_url", type: "bytes" },
                        { name: "issue_id", type: "u64" },
                        { name: "repo_owner", type: "bytes" },
                        { name: "amount", type: "BigUint" },
                        { name: "proposer", type: "Address" },
                        { name: "solvers", type: "List<Solver>" },
                        { name: "status", type: "BountyStatus" },
                        { name: "created_at", type: "u64" },
                    ],
                },
                BountyStatus: {
                    type: "enum",
                    variants: [
                        { name: "Funded", discriminant: 0 },
                        { name: "Registered", discriminant: 1 },
                        { name: "Completed", discriminant: 2 },
                    ],
                },
                Solver: {
                    type: "struct",
                    fields: [
                        { name: "solver_addr", type: "Address" },
                        { name: "solver_github", type: "bytes" },
                    ],
                },
            },
        };
        this.abi = AbiRegistry.create(plainAbi);
        const config = new TransactionsFactoryConfig({ chainID: "T" });
        this.factory = new SmartContractTransactionsFactory({ config: config, abi: this.abi });
        this.contractAddress = Address.fromBech32("erd1qqqqqqqqqqqqqpgqak8zt22wl2ph4tswtyc39namqx6ysa2sd8ss4xmlj3");

        const api = new ApiNetworkProvider("https://devnet-api.multiversx.com");
        const queryRunner = new QueryRunnerAdapter({ networkProvider: api });
        this.queryController = new SmartContractQueriesController({ abi: this.abi, queryRunner: queryRunner });
    }

    fund(options: {
        repoOwner: Uint8Array;
        repoUrl: Uint8Array;
        issueId: bigint;
        nativeTransferAmount?: bigint;
        tokenTransfers?: TokenTransfer[];
    }): Transaction {
        let args: any[] = [];

        args.push(options.repoOwner);
        args.push(options.repoUrl);
        args.push(options.issueId);

        const tx = this.factory.createTransactionForExecute({
            sender: Address.empty(),
            contract: this.contractAddress,
            function: "fund",
            gasLimit: BigInt(0),
            arguments: args,
            nativeTransferAmount: options.nativeTransferAmount,
            tokenTransfers: options.tokenTransfers,
        });

        return tx;
    }

    register(options: {
        repoOwner: Uint8Array;
        repoUrl: Uint8Array;
        issueId: bigint;
        solverGithub: Uint8Array;
    }): Transaction {
        let args: any[] = [];

        args.push(options.repoOwner);
        args.push(options.repoUrl);
        args.push(options.issueId);
        args.push(options.solverGithub);

        const tx = this.factory.createTransactionForExecute({
            sender: Address.empty(),
            contract: this.contractAddress,
            function: "register",
            gasLimit: BigInt(0),
            arguments: args,
        });

        return tx;
    }

    releaseBounty(options: {
        repoOwner: Uint8Array;
        repoUrl: Uint8Array;
        issueId: bigint;
        solverAddr: Address;
        solverGithub: Uint8Array;
    }): Transaction {
        let args: any[] = [];

        args.push(options.repoOwner);
        args.push(options.repoUrl);
        args.push(options.issueId);
        args.push(options.solverAddr);
        args.push(options.solverGithub);

        const tx = this.factory.createTransactionForExecute({
            sender: Address.empty(),
            contract: this.contractAddress,
            function: "releaseBounty",
            gasLimit: BigInt(0),
            arguments: args,
        });

        return tx;
    }

    /**
     *This is a view method. This will run a vm-query.
     */
    async getBounty(options: { repoOwner: Uint8Array; repoUrl: Uint8Array; issueId: bigint }): Promise<any[]> {
        let args: any[] = [];

        args.push(options.repoOwner);
        args.push(options.repoUrl);
        args.push(options.issueId);

        const query = this.queryController.createQuery({
            contract: this.contractAddress.toBech32(),
            function: "getBounty",
            arguments: args,
        });

        const response = await this.queryController.runQuery(query);
        return this.queryController.parseQueryResponse(response);
    }

    /**
     *This is a view method. This will run a vm-query.
     */
    async getBountyIds(options: { repoOwner: Uint8Array; repoUrl: Uint8Array; issueId: bigint }): Promise<any[]> {
        let args: any[] = [];

        args.push(options.repoOwner);
        args.push(options.repoUrl);
        args.push(options.issueId);

        const query = this.queryController.createQuery({
            contract: this.contractAddress.toBech32(),
            function: "getBountyIds",
            arguments: args,
        });

        const response = await this.queryController.runQuery(query);
        return this.queryController.parseQueryResponse(response);
    }
}
