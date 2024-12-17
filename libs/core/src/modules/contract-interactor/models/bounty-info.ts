export class BountyInfo {
  repo_owner: string;
  repo_url: string;
  issue_id: number;
  amount: bigint;
  proposer: string;
  solvers: {
    solver_addr: string,
    solver_github: string
  }[];
  status: {
    name: string,
    fields: unknown[],
  };
}
