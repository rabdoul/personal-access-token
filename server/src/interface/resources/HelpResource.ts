import express = require("express");
const fetch = require("node-fetch");
import LOGGER from "../../application/Logger";

export default class HelpResource {
  readonly router = express.Router();

  private readonly helpUrl = process.env.HELP_URI;

  private readonly defaultLanguage = "EN";

  constructor() {
    this.router.get("/api/help", this.get.bind(this));
  }

  async get(req: express.Request, res: express.Response) {
    let uppercaseLanguage = req.query.lang !== undefined ? String(req.query.lang).toUpperCase().toString() : this.defaultLanguage
    let language = await this.getLanguage(uppercaseLanguage);
    await fetch(`${this.helpUrl}/alias.json`)
      .then((r: any) => r.json())
      .then((j: any) => {
        res.json(this.toHelpResponse(j, language));
      })
      .catch((err: any) => LOGGER.error(err));
  }

  private async getLanguage(queriedLanguage: string): Promise<string> {
    const languages = await fetch(`${this.helpUrl}/languages.json`)
      .then((r: any) => r.json())
      .catch((err: any) => LOGGER.error(err));
    return languages.includes(queriedLanguage) ? queriedLanguage : this.defaultLanguage;
  }

  private toHelpResponse(data: any, language: string): string {
    let helpResponse: any = {};
    for (const [key, value] of Object.entries(data)) {
      helpResponse[key] = `${this.helpUrl}/${language}/${value}`;
    }
    return helpResponse;
  }
}
