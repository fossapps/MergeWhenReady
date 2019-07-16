import {Probot} from "probot";
import {App} from "./App";
import {getAppConfig} from "./AppConfig";

const appConfig = getAppConfig();
const probot = new Probot(appConfig);
probot.load(App.handle);

probot.start();

// tslint:disable-next-line
// export = probot.server;
