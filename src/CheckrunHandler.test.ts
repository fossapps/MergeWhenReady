import {Octokit} from "probot";
import {CheckrunHandler} from "./CheckrunHandler";
import {IBasicLabelData, LabelHelper} from "./LabelHelper";
import {IPullRequestMergeService} from "./PullRequestMergeService";

interface IMockPullData {
    labels: IBasicLabelData[];
    mergeable_state: string;
    number: number;
}

describe("CheckrunHandler", () => {
    it("should be defined", () => {
        expect(CheckrunHandler).toBeDefined();
    });

    it("should should merge prs which are ready and have labels", async () => {
        const labelName = ":rocket: MergeWhenReady :robot:";
        const labels: IBasicLabelData[] = [
            {name: "bug", description: "d", color: "fff"},
            {name: "enhancement", description: "d", color: "fff"},
            {name: "enhancement", description: "d", color: "fff"},
            {name: "help wanted", description: "d", color: "fff"},
            {name: "random label", description: "d", color: "fff"},
            {name: "wontfix", description: "d", color: "fff"},
            {name: labelName, description: "d", color: "fff"}
        ];
        const fixture: IMockPullData[] = [
            {mergeable_state: "blocked", number: 1, labels: [labels[0], labels[1], labels[2]]}, // blocked and has no label
            {mergeable_state: "clean", number: 2, labels: [labels[0], labels[1], labels[2]]}, // clean but has no label
            {mergeable_state: "blocked", number: 3, labels: [labels[0], labels[1], labels[2], labels[6]]}, // blocked but has label
            {mergeable_state: "blocked", number: 4, labels: []}, // blocked and has no label
            {mergeable_state: "clean", number: 5, labels: [labels[0], labels[1], labels[6]]}, // clean and has label
            {mergeable_state: "clean", number: 6, labels: [labels[6]]} // clean and has label
        ];
        const labelHelper = new LabelHelper(null as any);
        const org = {owner: "cyberhck", repo: "test"};
        const prRepo = {
            getOrg: () => org,
            queryMultiplePr: (): Promise<Octokit.PullsGetResponse[]> => fixture as any
        };
        const mockMergeFn = jest.fn();
        const merger: IPullRequestMergeService = {
            mergeMultiple: mockMergeFn
        } as any;
        const checkRunHandler = new CheckrunHandler(labelHelper, prRepo, merger);
        await checkRunHandler.handle([1, 2, 3, 4, 5, 6]);
        expect(mockMergeFn).toHaveBeenCalledWith([{...org, pull_number: 5}, {...org, pull_number: 6}]);
    });
});
