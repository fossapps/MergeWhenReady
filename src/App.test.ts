import {App} from "./App";

describe("App", () => {
    it("should be defined", () => {
        expect(App).toBeDefined();
        expect(App.handle).toBeDefined();
    });

    it("registers handler for pull_request.opened and issue.opened", () => {
        const spy = jest.fn();
        App.handle({on: spy} as any);
        expect(spy).toHaveBeenCalled();
    });
});
