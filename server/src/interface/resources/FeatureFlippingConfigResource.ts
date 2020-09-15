import express = require('express');
import { FeatureFlippingConfig } from '../../application/FeatureFlipping';

export class FeatureFlippingConfigResource {
    readonly router = express.Router();

    constructor(private readonly featureFlippingConfig: FeatureFlippingConfig) {
        this.router.get('/feature-flipping-config', this.config.bind(this))
    }

    config(_: express.Request, res: express.Response) {
        res.contentType("application/json").send(
          {
              clientKey : this.featureFlippingConfig.clientKey,
              isLocal : this.featureFlippingConfig.isLocal()
          }
        )
    }
}