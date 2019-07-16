import {IPrData, PullRepository} from "./PullRepository";

describe("PullRepository", () => {
    it("should be defined", () => {
        expect(PullRepository).toBeDefined();
    });
    it("should be able to resolve pull request data", async () => {
        const mockData = {
            data: {
                labels: ["bug", "enhancement"]
            }
        };
        const mock = jest.fn((_: IPrData) => new Promise((resolve) => {
            resolve(mockData);
        }));
        const pullRepository = new PullRepository({pulls: {get: mock}} as any, {repo: "test", owner: "cyberhck"});
        const labels = (await pullRepository.queryPr(1)).data.labels;
        expect(labels).toEqual(["bug", "enhancement"]);
    });

    it("should be able to resolve multiple PRs into array of data", async () => {
        const mockData: { [key: number]: { labels: string[] } } = {
            1: {
                labels: ["bug", "enhancement"]
            },
            2: {
                labels: ["help wanted"]
            }
        };

        const expectations: {labels: string[]}[] = [
            {labels: ["bug", "enhancement"]},
            {labels: ["help wanted"]}
        ];
        const mock = jest.fn((info: IPrData) => new Promise((resolve) => {
            resolve({data: mockData[info.pull_number]});
        }));
        const pullRepository = new PullRepository({pulls: {get: mock}} as any, {owner: "cyberhck", repo: "test"});
        const queryData = [
            1,
            2
        ];
        const labels = (await pullRepository.queryMultiplePr(queryData));
        expect(labels).toEqual(expectations);
    });

    it("should also return org info", () => {
        const prRepo = new PullRepository(undefined as any, {owner: "cyberhck", repo: "test"});
        expect(prRepo.getOrg()).toEqual({owner: "cyberhck", repo: "test"});
    });
});
