// tslint:disable-next-line:import-name
import autobind from "autobind-decorator";
import {Octokit} from "probot";
import {GitHubAPI} from "probot/lib/github";

export interface ILabelHelper {
    createDefaultLabelIfExists(repoInfo: IRepoInfo): Promise<void>;
    isMatchWhenReadyLabelPresent(labelInfo: IBasicLabelData[]): boolean;
}

export interface IBasicLabelData {
    name: string;
    description: string;
    color: string;
}

interface IRepoInfo {
    owner: string;
    repo: string;
}

export class LabelHelper implements ILabelHelper {
    private readonly labelInfo: IBasicLabelData = {
        name: ":rocket: MergeWhenReady :robot:",
        description: "Add this label to merge when status checks pass",
        color: "0052cc"
    };

    constructor(private gh: GitHubAPI) {
    }

    public async createDefaultLabelIfExists(labelInfo: IRepoInfo): Promise<void> {
        const exists = await this.checkIfDefaultLabelExists(labelInfo);
        if (exists) {
            return;
        }
        await this.createDefaultLabel(labelInfo);
    }

    public isMatchWhenReadyLabelPresent(labels: IBasicLabelData[]): boolean {
        return labels.find(this.isMatchWhenReadyLabel) !== undefined;
    }

    @autobind
    private isMatchWhenReadyLabel(labelInfo: IBasicLabelData): boolean {
        return labelInfo.name === this.labelInfo.name;
    }

    private async createDefaultLabel(labelInfo: IRepoInfo): Promise<Octokit.Response<Octokit.IssuesCreateLabelResponse>> {
        return this.gh.issues.createLabel({...labelInfo, ...this.labelInfo});
    }

    private async checkIfDefaultLabelExists(labelInfo: IRepoInfo): Promise<boolean> {
        try {
            const response = await this.gh.issues.getLabel({...labelInfo, name: this.labelInfo.name});
            return response.data && response.data.name === this.labelInfo.name;
        } catch (e) {
            return false;
        }
    }
}
