import {WebhookPayloadPullRequestPullRequest} from "@octokit/webhooks";
import {ILabelHelper} from "./LabelHelper";
import {IRepoInfo} from "./PullRepository";
import {IPullRequestMergeService} from "./PullRequestMergeService";

export class PullRequestHandler {
    constructor(private readonly labelHelper: Pick<ILabelHelper, "isMatchWhenReadyLabelPresent">, private readonly merger: Pick<IPullRequestMergeService, "merge">, private readonly repo: IRepoInfo) {
    }

    public async handle(pullRequest: WebhookPayloadPullRequestPullRequest): Promise<void> {
        if (!this.labelHelper.isMatchWhenReadyLabelPresent(pullRequest.labels)) {
            return;
        }
        if (pullRequest.mergeable_state === "clean") {
            await this.merger.merge({pull_number: pullRequest.number, ...this.repo});
        }
    }
}
