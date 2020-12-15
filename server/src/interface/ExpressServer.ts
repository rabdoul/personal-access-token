import express = require("express");
import featurePolicy = require("feature-policy");
import permissionsPolicy = require('permissions-policy');
import helmet = require("helmet");
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
import { ActivitiesResource } from "./resources/ActivitiesResource";
import { RulesResource } from "./resources/RulesResource";
import { ProductCategoriesResource } from "./resources/ProductCategoriesResource";
import { MaterialGroupsResource } from "./resources/MaterialGroupsResource";
import { RequirementsResource } from "./resources/CutParametersResource";
import { OffloadingRulesResource } from "./resources/OffloadingRulesResource";
import { ProductionLinesResource } from "./resources/ProductionLinesResource";
import { BlockingRulesResource } from "./resources/BlockingRulesResource";
import { PositioningRulesResource } from "./resources/PositioningRulesResource";
import { ProximityRulesResource } from "./resources/ProximityRulesResource";
import { CuttingRoomResource } from "./resources/CuttingRoomResource";

const fallback = require("express-history-api-fallback");
const expressPino = require("express-pino-logger")({ logger: LOGGER });
const compression = require('compression')

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
    this.app.use(helmet.frameguard({ action: "deny" }));
    this.app.use(helmet.contentSecurityPolicy({ directives: { 
      defaultSrc: ["'self'","'unsafe-eval'","'unsafe-inline'"], 
      frameSrc: ["'self'","https://*.mylectra.com"],
      connectSrc: ["'self'", "https://*.launchdarkly.com", "https://*.mylectra.com", "http://localhost"],
      imgSrc : ["'self'", "data:"], 
      fontSrc : ["'self'", "data:", "https://assets.mylectra.com"], 
      frameAncestors: ["'none'"] } }));
    this.app.use(helmet.referrerPolicy({ policy: "strict-origin" }));
    /* https://scotthelme.co.uk/goodbye-feature-policy-and-hello-permissions-policy/ */
    this.app.use(featurePolicy({ features: { fullscreen: ["'self'"] } }));
    this.app.use(permissionsPolicy({ features: { fullscreen: ['self'] } }));

    this.app.use(expressPino);
    this.app.use(bodyParser.json());
    this.app.use(errorMiddleware);

    this.app.use(compression({
      filter: (req: express.Request, res: express.Response) => {
        if (req.path.includes('api')) {
          return false
        }
        return compression.filter(req, res)
      }
    }));

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
    authenticatedRouter.use(new ActivitiesResource(this.commandQueryExecutor).router);
    authenticatedRouter.use(new RulesResource(this.commandQueryExecutor).router);
    authenticatedRouter.use(new ProductCategoriesResource(this.commandQueryExecutor).router);
    authenticatedRouter.use(new MaterialGroupsResource(this.commandQueryExecutor).router);
    authenticatedRouter.use(new RequirementsResource(this.commandQueryExecutor).router);
    authenticatedRouter.use(new ProductionLinesResource(this.commandQueryExecutor).router);
    authenticatedRouter.use(new OffloadingRulesResource(this.commandQueryExecutor).router);
    authenticatedRouter.use(new BlockingRulesResource(this.commandQueryExecutor).router);
    authenticatedRouter.use(new PositioningRulesResource(this.commandQueryExecutor).router);
    authenticatedRouter.use(new ProximityRulesResource(this.commandQueryExecutor).router);
    authenticatedRouter.use(new CuttingRoomResource(this.commandQueryExecutor).router);
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
