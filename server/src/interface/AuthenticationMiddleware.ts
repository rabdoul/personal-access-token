import express = require("express");
import { createNamespace } from "cls-hooked";
import { Authentication, AUTH_NAMESPACE, Subscription } from "../application/Authentication";
import { AccessToken, Principal } from "lectra-auth-nodejs";
import { CommandQueryExecutor, CommandResponseType } from "../application/CommandQueryExecutor";

const authNamespace = createNamespace(AUTH_NAMESPACE);

type SubsriptionsResponse = {
  data: {
    subscriptions: [
      {
        offerId: string;
      }
    ];
  };
};

export class AuthenticationMiddleware {
  constructor(private readonly authentication: Authentication, private readonly commandQueryExecutor: CommandQueryExecutor) {
    this.check = this.check.bind(this);
  }

  async check(req: express.Request, res: express.Response, next: Function) {
    const authorizationHeader = req.get("Authorization");
    try {
      const isLocal = this.authentication.getConfig().domain === "localhost";
      if (!authorizationHeader && !isLocal) {
        throw Error("Missing Authorization header");
      }
      const principal = isLocal ? new Principal("sub|42", "123456789_A", "en", [], ["OD_FA"]) : await this.authenticate(this.extractToken(authorizationHeader!));
      if (!this.isGranted(principal)) {
        throw new Error("Access denied: insufficient authorizations");
      }
      const subscriptions = await this.retrieveSubscriptions(principal.tenantId);
      authNamespace.run(async () => {
        authNamespace.set("principal", principal);
        authNamespace.set("subscriptions", subscriptions);
        next();
      });
    } catch (error) {
      res
        .status(401)
        .type("application/json")
        .send({ message: (error as any).message });
    }
  }

  private isGranted(principal: Principal) {
    return principal.sitePermissions.some((p) => ["OD_FA", "OD_FU", "MASS_CUSTO", "MTO", "MTM", "SYS_MANAGER"].includes(p));
  }

  private async retrieveSubscriptions(tenantId: string) {
    const subscriptionsReponse = await this.commandQueryExecutor.executeCommand("user-management-gateway", {
      type: "user-management-api.graphql",
      parameters: {
        "query": "query subscriptions($where:SubscriptionsWhereInput!) { subscriptions(where:$where) { offerId } }",
        "variables": {
          "where": {
            tenantId,
          },
        },
      },
    });
    if (subscriptionsReponse.type == CommandResponseType.COMMAND_FAILURE) {
      throw new Error("Error retrieving tenant subscriptions");
    }
    return (subscriptionsReponse.data as SubsriptionsResponse)?.data?.subscriptions
      ?.map((s) => s.offerId.split("_"))
      .map((s) => {
        return { offer: s[0], market: s[1] } as Subscription;
      });
  }

  private extractToken(authorizationHeader: string): AccessToken {
    const parts = authorizationHeader.split(" ");
    if (parts.length === 2 && parts[0] === "Bearer" && parts[1] !== "") return parts[1];
    else throw new Error("Malformed Authorization header");
  }

  private async authenticate(token: AccessToken): Promise<Principal> {
    const result = await this.authentication.authenticate(token);
    if (result instanceof Principal) return result;
    else throw new Error("Invalid credentials");
  }
}
