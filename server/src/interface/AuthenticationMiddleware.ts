import express = require('express');
import { createNamespace } from 'cls-hooked';
import { Authentication, AUTH_NAMESPACE } from '../application/Authentication';
import { AccessToken, Principal } from 'lectra-auth-nodejs';

const authNamespace = createNamespace(AUTH_NAMESPACE);

export class AuthenticationMiddleware {

  constructor(private readonly authentication: Authentication) {
    this.check = this.check.bind(this);
  }

  async check(req: express.Request, res: express.Response, next: Function) {
    const authorizationHeader = req.get('Authorization');

    if (this.authentication.getConfig().domain === 'localhost') {
      authNamespace.run(async () => {
        authNamespace.set('principal', new Principal("sub|42", "123456789_A", "en", []));
        next();
      });
    } else if (!authorizationHeader) {
      res.status(401).type('application/json').send({ message: 'Missing Authorization header' });
    } else {
      try {
        const token = this.extractToken(authorizationHeader);
        const principal = await this.authenticate(token);
        authNamespace.run(async () => {
          authNamespace.set('principal', principal);
          next();
        });
      } catch (error) {
        res.status(401).type('application/json').send({ message: error.message });
      }
    }
  }

  private extractToken(authorizationHeader: string): AccessToken {
    const parts = authorizationHeader.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer' && parts[1] !== '') return parts[1];
    else throw new Error('Malformed Authorization header');
  }

  async authenticate(token: AccessToken): Promise<Principal> {
    const result = await this.authentication.authenticate(token);
    if (result instanceof Principal) return result;
    else throw new Error('Invalid credentials');
  }
}
