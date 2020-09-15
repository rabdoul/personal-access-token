import express = require("express");
import helmet = require("helmet");
import frameguard = require("frameguard");
import csp = require("helmet-csp");
import * as path from "path";
import bodyParser = require("body-parser");

import LOGGER from "../application/Logger";
import errorMiddleware from "./ErrorMiddleware";
import { K8sResources } from "./resources/K8sResources";
import { HealthcheckResource } from "./resources/HealthcheckResource";
import { HealthIndicator } from "../application/HealthIndicator";
import { AuthenticationConfigResource } from "./resources/AuthenticationConfigResource";
import { Authentication } from "../application/Authentication";
import { CommandQueryExecutor } from "../application/CommandQueryExecutor";
import { AuthenticationMiddleware } from "./AuthenticationMiddleware";
import { FeatureFlippingConfig } from "../application/FeatureFlipping";
import HelpResource from "./resources/HelpResource";
import { FeatureFlippingConfigResource } from "./resources/FeatureFlippingConfigResource";

const fallback = require("express-history-api-fallback");
const expressPino = require("express-pino-logger")({ logger: LOGGER });

export class ExpressServer {
  private readonly app: express.Application;

  constructor(
    private readonly healthIndicators: HealthIndicator[],
    private readonly authentication: Authentication,
    private readonly featureFlippingConfig: FeatureFlippingConfig,
    private readonly commandQueryExecutor: CommandQueryExecutor,
  ) {
    this.app = express();
  }

  start() {
    this.setup();
    this.app.listen(process.env.PORT || 8080, () =>
      LOGGER.info(`Cutting Room Parameters application started`)
    );
  }

  private setup() {
    this.app.use(helmet());
    this.app.use(frameguard({ action: "deny" }));
    this.app.use(csp({ directives: { frameAncestors: ["'none'"] } }));
    this.app.use(
      helmet.featurePolicy({ features: { fullscreen: ["'self'"] } })
    );
    this.app.use(helmet.referrerPolicy({ policy: "strict-origin" }));

    this.app.use(expressPino);
    this.app.use(bodyParser.json());
    this.app.use(errorMiddleware);

    this.app.use(this.unauthenticatedRouter());
    this.app.use(this.staticResourcesRouter());
    this.app.use(this.authenticatedRouter());
  }

  private staticResourcesRouter() {
    const staticResourcesRouter = express.Router();
    const root = path.join(__dirname, "../client");
    staticResourcesRouter.use(express.static(root));
    staticResourcesRouter.use(fallback("index.html", { root: root }));
    return staticResourcesRouter;
  }

  private authenticatedRouter() {
    const authenticatedRouter = express.Router();
    authenticatedRouter.use(this.authenticationMiddleware());
    authenticatedRouter.use(new HelpResource().router);
    return authenticatedRouter;
  }

  private authenticationMiddleware() {
    return new AuthenticationMiddleware(this.authentication).check;
  }

  private unauthenticatedRouter() {
    const unauthenticatedRouter = express.Router();
    unauthenticatedRouter.use(new K8sResources().router);
    unauthenticatedRouter.use(new AuthenticationConfigResource(this.authentication.getConfig()).router);
    unauthenticatedRouter.use(new HealthcheckResource(this.healthIndicators).router);
    unauthenticatedRouter.use(new FeatureFlippingConfigResource(this.featureFlippingConfig).router);

    return unauthenticatedRouter;
  }
}
