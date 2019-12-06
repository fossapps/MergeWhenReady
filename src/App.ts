import {Application} from "probot";
import {CheckrunHandler} from "./CheckrunHandler";
import {LabelHelper} from "./LabelHelper";
import {NewRepoHandler} from "./NewRepoHandler";
import {PullRepository} from "./PullRepository";
import {PullRequestHandler} from "./PullRequestHandler";
import {PullRequestMergeService} from "./PullRequestMergeService";

// tslint:disable-next-line:no-unnecessary-class
export class App {
    public static handle(context: Application): void {
        context.on("installation.created", async (c) => {
            c.log.info(c.event);
            const handler = new NewRepoHandler(new LabelHelper(c.github));
            await handler.handleRepositories(c.payload.repositories);
        });

        context.on("repository", (c) => {
            c.log.info(c.event);
            const newRepoHandler = new NewRepoHandler(new LabelHelper(c.github));
            return newRepoHandler.handle(c.repo());
        });

        context.on("check_run.completed", async (c) => {
            c.log.info(c.event);
            const handler = new CheckrunHandler(new LabelHelper(c.github), new PullRepository(c.github, c.repo()), new PullRequestMergeService(c.github));
            await handler.handle(c.payload.check_run.check_suite.pull_requests.map((x) => x.number));
        });

        context.on("pull_request", async (c) => {
            c.log.info(c.event);
            const prHandler = new PullRequestHandler(
                new LabelHelper(c.github),
                new PullRequestMergeService(c.github),
                c.repo()
            );
            await prHandler.handle(c.payload.pull_request);
            const handler = new CheckrunHandler(new LabelHelper(c.github), new PullRepository(c.github, c.repo()), new PullRequestMergeService(c.github));
            await handler.handle(c.payload.check_run.check_suite.pull_requests.map((x) => x.number));

        });
    }
}
