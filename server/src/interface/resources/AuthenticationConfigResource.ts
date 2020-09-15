import express = require('express');
import { AuthenticationConfig } from 'lectra-auth-nodejs';

export class AuthenticationConfigResource {
    readonly router = express.Router();

    constructor(private readonly authenticationConfig: AuthenticationConfig) {
        this.router.get('/authentication-config', this.config.bind(this));
    }

    config(_: express.Request, res: express.Response) {
        res.contentType("application/json").send(
            {
                domain : this.authenticationConfig.domain,
                clientId : this.authenticationConfig.clientId,
                audience : this.authenticationConfig.audience,
            }
        )
    }
}
