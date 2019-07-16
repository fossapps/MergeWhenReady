import {ILabelHelper} from "./LabelHelper";
import {IPrData, IPullRepository} from "./PullRepository";
import {IPullRequestMergeService} from "./PullRequestMergeService";

type TLabelHelper = Pick<ILabelHelper, "isMatchWhenReadyLabelPresent">;
type TPullRepo = Pick<IPullRepository, "getOrg" | "queryMultiplePr">;
type TMerger = Pick<IPullRequestMergeService, "mergeMultiple">;

export class CheckrunHandler {
    constructor(private readonly labelHelper: TLabelHelper, private readonly prRepo: TPullRepo, private readonly merger: TMerger) {
    }

    public async handle(pulls: number[]): Promise<void> {
        const prs = await this.prRepo.queryMultiplePr(pulls);
        const readyToMerge: IPrData[] = prs
            .filter((x) => this.labelHelper.isMatchWhenReadyLabelPresent(x.labels))
            .filter((x) => x.mergeable_state === "clean")
            .map((x) => ({pull_number: x.number, ...this.prRepo.getOrg()}));
        try {
            await this.merger.mergeMultiple(readyToMerge);
        } catch (e) {
            console.error(e);
        }
    }
}
