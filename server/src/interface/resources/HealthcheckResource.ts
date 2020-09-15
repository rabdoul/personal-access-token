import express = require('express');
import { HealthIndicator, Health } from '../../application/HealthIndicator';
import LOGGER from '../../application/Logger';

/**
 * https://confluence.infra.mylectra.com/display/PROD/Healthcheck+standards
 */
export class HealthcheckResource {
    readonly router = express.Router();

    constructor(private readonly indicators: HealthIndicator[]) {
        this.router.get('/healthcheck', this.healthcheck.bind(this));
    }

    async healthcheck(_: express.Request, res: express.Response) {
        try {
            const healths = await Promise.all(this.indicators.map(async i => new NamedHealth(i.name(), await i.health())));
            const ok = healths.filter(namedHealth => namedHealth.health === Health.KO).length === 0;
            const output = ok
                ? 'OK'
                : 'KO\n' +
                healths
                    .filter(namedHealth => namedHealth.health === Health.KO)
                    .map(namedHealth => `${namedHealth.name} not available`)
                    .join('\n');
            res.contentType('text/plain').send(output);
        } catch (error) {
            LOGGER.error(error);
            res.contentType('text/plain').send('KO');
        }
    }
}

class NamedHealth {
    readonly health: Health;
    readonly name: string;

    constructor(name: string, health: Health) {
        this.health = health;
        this.name = name;
    }
}
