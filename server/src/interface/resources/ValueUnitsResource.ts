import express = require('express');
import { UnitType, valueUnitFromUnitType } from '../../application/model';

export class ValueUnitsResource {

    readonly router = express.Router();

    constructor() {
        this.router.get('/api/value-units', this.get.bind(this))
    }

    async get(_: express.Request, res: express.Response) {
        const unitTypeKeys = Object.keys(UnitType).filter(key => isNaN(Number(key)))
        const result = unitTypeKeys.reduce(
            (acc: any, current: string) => {
                acc[current] = valueUnitFromUnitType(current);
                return acc
            }, {})
        res.send(result)
    }

}