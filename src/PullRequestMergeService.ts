// tslint:disable-next-line:import-name
import autobind from "autobind-decorator";
import {Octokit} from "probot";
import {GitHubAPI} from "probot/lib/github";
import {IPrData} from "./PullRepository";

export interface IPullRequestMergeService {
    merge(pr: IPrData): Promise<Octokit.AnyResponse>;
    mergeMultiple(pr: IPrData[]): Promise<Octokit.AnyResponse[]>;
}

export class PullRequestMergeService implements IPullRequestMergeService {
    constructor(private readonly github: Pick<GitHubAPI, "pulls">) {}

    @autobind
    public async merge(pr: IPrData): Promise<Octokit.AnyResponse> {
        return this.github.pulls.merge(pr);
    }

    @autobind
    public async mergeMultiple(pr: IPrData[]): Promise<Octokit.AnyResponse[]> {
        return Promise.all(pr.map(this.merge));
    }
}
