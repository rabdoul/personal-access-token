import express = require('express');
import { currentPrincipal } from '../application/Authentication'

const SUPPORT_ACCOUNT_TYPE = "SUPPORT";

export function disableForSupport() {
    return function (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<express.RequestHandler>) {
        const method = descriptor.value!;
        descriptor.value = async function (req, res, next) {
            const principal = currentPrincipal();
            if (principal.accountType === SUPPORT_ACCOUNT_TYPE) {
                res.sendStatus(403);
            } else {
                await method.apply(this, [req, res, next]);
            }
        };
    };
}