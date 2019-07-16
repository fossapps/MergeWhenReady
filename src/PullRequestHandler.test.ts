import {PullRequestHandler} from "./PullRequestHandler";

describe("PullRequestHandler", () => {
    it("should be defined", () => {
        expect(PullRequestHandler).toBeDefined();
    });

    it("should not merge if labels don't match", async () => {
        const labelMock = {
            isMatchWhenReadyLabelPresent: () => false
        };
        const mockMerge = jest.fn();
        const prMerger = {
            merge: mockMerge
        };
        const handler = new PullRequestHandler(labelMock, prMerger, {repo: "", owner: ""});
        await handler.handle({mergable_state: "clean"} as any);
        expect(mockMerge).not.toHaveBeenCalled();
    });

    it("should not merge if labels don't match, even if state is clean", async () => {
        const labelMock = {
            isMatchWhenReadyLabelPresent: () => false
        };
        const mockMerge = jest.fn();
        const prMerger = {
            merge: mockMerge
        };
        const handler = new PullRequestHandler(labelMock, prMerger, {repo: "", owner: ""});
        await handler.handle({mergeable_state: "clean"} as any);
        expect(mockMerge).not.toHaveBeenCalled();
    });

    it("should not merge if labels match but PR is not clean", async () => {
        const labelMock = {
            isMatchWhenReadyLabelPresent: () => true
        };
        const mockMerge = jest.fn();
        const prMerger = {
            merge: mockMerge
        };
        const handler = new PullRequestHandler(labelMock, prMerger, {repo: "", owner: ""});
        await handler.handle({mergeable_state: "blocked"} as any);
        expect(mockMerge).not.toHaveBeenCalled();
    });

    it("should merge if state is clean and label match", async () => {
        const labelMock = {
            isMatchWhenReadyLabelPresent: () => true
        };
        const mockMerge = jest.fn();
        const prMerger = {
            merge: mockMerge
        };
        const handler = new PullRequestHandler(labelMock, prMerger, {repo: "", owner: ""});
        // @ts-ignore
        await handler.handle({mergeable_state: "clean"});
        expect(mockMerge).toHaveBeenCalled();
    });
});
