import {GitHubAPI} from "probot/lib/github";
import {PullRequestMergeService} from "./PullRequestMergeService";

describe("PullRequestMergeService", () => {
    it("should be able to merge a given PR", async () => {
        const mergeMock = jest.fn();
        const ghMock: Pick<GitHubAPI, "pulls"> = {
            pulls: {
                merge: mergeMock
            } as any
        };
        const prMergeService = new PullRequestMergeService(ghMock);
        await prMergeService.merge({owner: "cyberhck", pull_number: 12, repo: "test_repo"});
        expect(mergeMock).toHaveBeenCalledWith({owner: "cyberhck", pull_number: 12, repo: "test_repo"});
    });

    it("should be able to merge multiple PRs at once", async () => {
        const mergeMock = jest.fn();
        const ghMock: Pick<GitHubAPI, "pulls"> = {
            pulls: {
                merge: mergeMock
            } as any
        };
        const prMergeService = new PullRequestMergeService(ghMock);
        const inputs = [
            {owner: "cyberhck", pull_number: 12, repo: "test_repo"},
            {owner: "cyberhck", pull_number: 13, repo: "test_repo"},
            {owner: "cyberhck", pull_number: 14, repo: "test_repo"}
        ];
        await prMergeService.mergeMultiple(inputs);
        inputs.forEach((x) => {
            expect(mergeMock).toHaveBeenCalledWith(x);
        });
    });
});
