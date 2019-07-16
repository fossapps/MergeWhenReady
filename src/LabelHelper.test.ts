import {GitHubAPI} from "probot/lib/github";
import {IBasicLabelData, LabelHelper} from "./LabelHelper";
const labelName = ":rocket: MergeWhenReady :robot:";

describe("LabelHelper", () => {

    it("should not create a label if label exists", async () => {
        const mockFn = jest.fn((info: any) => {
            return new Promise((resolve) => {
                resolve({data: {name: labelName}});
            });
        });
        const createLabelMockFn = jest.fn();
        const ghApi: GitHubAPI = {
            issues: {
                // @ts-ignore
                getLabel: mockFn,
                // @ts-ignore
                createLabel: createLabelMockFn
            }
        };
        const labelMaker = new LabelHelper(ghApi);
        await labelMaker.createDefaultLabelIfExists({owner: "", repo: ""});
        expect(mockFn).toHaveBeenCalled();
        expect(createLabelMockFn).not.toHaveBeenCalled();
    });

    it("should create a label if label doesn't exist", async () => {
        const mockFn = jest.fn((info: any) => {
            return new Promise((resolve) => {
                resolve({data: {name: undefined}});
            });
        });
        const createLabelMockFn = jest.fn();
        const ghApi: GitHubAPI = {
            issues: {
                // @ts-ignore
                getLabel: mockFn,
                // @ts-ignore
                createLabel: createLabelMockFn
            }
        };
        const labelMaker = new LabelHelper(ghApi);
        await labelMaker.createDefaultLabelIfExists({owner: "", repo: ""});
        expect(mockFn).toHaveBeenCalled();
        expect(createLabelMockFn).toHaveBeenCalledWith(expect.objectContaining({name: labelName}));
    });

    it("should create a label if http error was thrown", async () => {
        const mockFn = jest.fn((info: any) => {
            return new Promise((resolve, reject) => {
                reject("http error");
            });
        });
        const createLabelMockFn = jest.fn();
        const ghApi: GitHubAPI = {
            issues: {
                // @ts-ignore
                getLabel: mockFn,
                // @ts-ignore
                createLabel: createLabelMockFn
            }
        };
        const labelMaker = new LabelHelper(ghApi);
        await labelMaker.createDefaultLabelIfExists({owner: "", repo: ""});
        expect(mockFn).toHaveBeenCalled();
        expect(createLabelMockFn).toHaveBeenCalledWith(expect.objectContaining({name: labelName}));
    });

    describe("isMatchWhenReadyLabel", () => {

        it("should match labels correctly", () => {
            const helper = new LabelHelper(null as any);
            const expectations: {input: IBasicLabelData[], expectedResult: boolean}[] = [
                {
                    input: [],
                    expectedResult: false
                },
                {
                    input: [{name: labelName} as any],
                    expectedResult: true
                },
                {
                    input: [{name: labelName} as any, {name: "enhancement"}],
                    expectedResult: true
                },
                {
                    input: [{name: "bug"} as any, {name: "enhancement"}],
                    expectedResult: false
                }
            ];
            expectations.forEach((x) => {
                expect(helper.isMatchWhenReadyLabelPresent(x.input)).toBe(x.expectedResult);
            });
        });

    });
});
