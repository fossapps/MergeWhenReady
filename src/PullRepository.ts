// tslint:disable-next-line:import-name
import autobind from "autobind-decorator";
import {Octokit} from "probot";
import {GitHubAPI} from "probot/lib/github";

export interface IPrData {
    pull_number: number;
    owner: string;
    repo: string;
}

export interface IPullRepository {
    queryPr(pr: number): Promise<Octokit.Response<Octokit.PullsGetResponse>>;
    queryMultiplePr(prs: number[]): Promise<Octokit.PullsGetResponse[]>;
    getOrg(): {owner: string, repo: string};
}

export interface IRepoInfo {
    owner: string;
    repo: string;
}

export class PullRepository implements IPullRepository {
    constructor(private readonly github: Pick<GitHubAPI, "pulls">, private readonly repo: IRepoInfo) {
    }

    @autobind
    public queryPr(pr: number): Promise<Octokit.Response<Octokit.PullsGetResponse>> {
        return this.github.pulls.get({...this.repo, pull_number: pr});
    }

    @autobind
    public async queryMultiplePr(prs: number[]): Promise<Octokit.PullsGetResponse[]> {
        const response = await Promise.all(prs.map(this.queryPr));
        return response.map((x) => x.data);
    }

    @autobind
    public getOrg(): { owner: string; repo: string } {
        return this.repo;
    }
}
