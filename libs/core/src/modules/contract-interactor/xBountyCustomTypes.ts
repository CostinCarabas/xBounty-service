import { Address } from "@multiversx/sdk-core";

export type Solver = {
    solver_addr: Address;
    solver_github: Uint8Array;
};

export type Bounty = {
    repo_url: Uint8Array;
    issue_id: bigint;
    repo_owner: Uint8Array;
    amount: bigint;
    proposer: Address;
    solvers: Solver[];
    status: BountyStatus;
    created_at: bigint;
};

export enum BountyStatus {
    Funded = 0,
    Registered = 1,
    Completed = 2,
}
