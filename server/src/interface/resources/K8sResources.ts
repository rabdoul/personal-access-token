import express = require('express');

/**
 * Http endpoints for Kubernetes liveness/readiness 
 */
export class K8sResources {
    readonly router = express.Router();

    constructor() {
        this.router.get('/ping', this.ping.bind(this));
        this.router.get('/ready', this.ready.bind(this));
    }

    ping(_: express.Request, res: express.Response) {
        res.type('text/plain').send("pong");
    }

    ready(_: express.Request, res: express.Response) {
        res.type('text/plain').send("ready");
    }
}
