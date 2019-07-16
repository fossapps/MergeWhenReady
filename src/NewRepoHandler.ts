import * as Webhooks from "@octokit/webhooks";
// tslint:disable-next-line:import-name
import autobind from "autobind-decorator";
import {ILabelHelper} from "./LabelHelper";

interface IBasicRepo {
    owner: string;
    repo: string;
}

export class NewRepoHandler {
    constructor(private labelHelper: ILabelHelper) {
    }

    private static getOwner(fullName: string): string {
        return fullName.split("/")[0];
    }

    @autobind
    public async handle(repo: IBasicRepo): Promise<void> {
        await this.labelHelper.createDefaultLabelIfExists(repo);
    }

    @autobind public async handleRepositories(repositories: Webhooks.WebhookPayloadInstallationRepositoriesItem[]): Promise<void[]> {
        let promiseList: Promise<void>[] = [];
        repositories.forEach((x) => {
            promiseList = promiseList.concat(this.handle({owner: NewRepoHandler.getOwner(x.full_name), repo: x.name}));
        });
        return Promise.all(promiseList);
    }
}
