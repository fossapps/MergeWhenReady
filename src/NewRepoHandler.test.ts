import * as Webhooks from "@octokit/webhooks";
import {ILabelHelper} from "./LabelHelper";
import {NewRepoHandler} from "./NewRepoHandler";

describe("NewRepoHandler", () => {
    it("should creates label when handle is called if label does not exists", async () => {
        const mock: ILabelHelper = {
            createDefaultLabelIfExists: jest.fn() as any,
            isMatchWhenReadyLabelPresent: null as any
        };
        const unit = new NewRepoHandler(mock);
        expect(mock.createDefaultLabelIfExists).not.toHaveBeenCalled();
        await unit.handle({owner: "cyberhck", repo: "test"});
        expect(mock.createDefaultLabelIfExists).toHaveBeenCalledWith({owner: "cyberhck", repo: "test"});
    });

    it("should be able to handle multiple repo as well", async () => {
        const mock: ILabelHelper = {
            createDefaultLabelIfExists: jest.fn() as any,
            isMatchWhenReadyLabelPresent: null as any
        };
        const unit = new NewRepoHandler(mock);
        expect(mock.createDefaultLabelIfExists).not.toHaveBeenCalled();
        const mockData: Webhooks.WebhookPayloadInstallationRepositoriesItem[] = [
            {name: "test_repo", full_name: "cyberhck/test_repo", id: 1, private: false},
            {name: "test_repo_2", full_name: "cyberhck/test_repo_2", id: 2, private: false}
        ];
        await unit.handleRepositories(mockData);
        expect(mock.createDefaultLabelIfExists).toHaveBeenCalledTimes(mockData.length);
        mockData.forEach((d) => {
            expect(mock.createDefaultLabelIfExists).toHaveBeenCalledWith({owner: "cyberhck", repo: d.name});
        });
    });
});
