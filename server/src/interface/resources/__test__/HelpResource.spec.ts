import "jest";
import { mockHttpRequest, mockHttpResponse } from "../../../__test__/Mocks";
import HelpResource from "../HelpResource";
const nock = require("nock");

describe("Helps Resource", () => {
  beforeAll(() => {
    process.env.HELP_URI = "https://help.dev.mylectra.com/help/systemmanager"
  })
  beforeEach(() => {
    nock.cleanAll();
  });
  it("GET should return 200 en-us help by default", async () => {
    nock("https://help.dev.mylectra.com")
      .get("/help/systemmanager/languages.json")
      .reply(
        200,
        ["en-us", "fr-fr"],
        { "Access-Control-Allow-Origin": "*" } // Needed to avoid CORS error
      )
      .get("/help/systemmanager/alias.json")
      .reply(
        200,
        {
          PARAMS_TAB: "Content/03-Parametres-Avances/00-Param-Avances.htm",
          PARAMS_DISPLAY: "Content/03-Parametres-Avances/01-Afficher.htm",
        },
        { "Access-Control-Allow-Origin": "*" } // Needed to avoid CORS error
      );
    const req = mockHttpRequest("/api/help", {}, {}, {});
    const [res, _] = mockHttpResponse();

    await new HelpResource().get(req, res);

    expect(res.statusCode).toEqual(200);
    expect(res._getData()).toEqual(
      JSON.stringify({
        PARAMS_TAB:
          "https://help.dev.mylectra.com/help/systemmanager/en-us/Content/03-Parametres-Avances/00-Param-Avances.htm",
        PARAMS_DISPLAY:
          "https://help.dev.mylectra.com/help/systemmanager/en-us/Content/03-Parametres-Avances/01-Afficher.htm",
      })
    );
  });
  it("GET should return 200 fr-fr help", async () => {
    nock("https://help.dev.mylectra.com")
      .get("/help/systemmanager/languages.json")
      .reply(
        200,
        ["fr-fr", "en-us"],
        { "Access-Control-Allow-Origin": "*" } // Needed to avoid CORS error
      )
      .get("/help/systemmanager/alias.json")
      .reply(
        200,
        {
          PARAMS_TAB: "Content/03-Parametres-Avances/00-Param-Avances.htm",
          PARAMS_DISPLAY: "Content/03-Parametres-Avances/01-Afficher.htm",
        },
        { "Access-Control-Allow-Origin": "*" } // Needed to avoid CORS error
      );
    const req = mockHttpRequest("/api/help", {}, {}, { lang: "fr-fr" });
    const [res, _] = mockHttpResponse();

    await new HelpResource().get(req, res);

    expect(res.statusCode).toEqual(200);
    expect(res._getData()).toEqual(
      JSON.stringify({
        PARAMS_TAB:
          "https://help.dev.mylectra.com/help/systemmanager/fr-fr/Content/03-Parametres-Avances/00-Param-Avances.htm",
        PARAMS_DISPLAY:
          "https://help.dev.mylectra.com/help/systemmanager/fr-fr/Content/03-Parametres-Avances/01-Afficher.htm",
      })
    );
  });
  it("GET should return 200 with en-us if language does not exist", async () => {
    nock("https://help.dev.mylectra.com")
      .get("/help/systemmanager/languages.json")
      .reply(
        200,
        ["en-us", "fr-fr"],
        { "Access-Control-Allow-Origin": "*" } // Needed to avoid CORS error
      )
      .get("/help/systemmanager/alias.json")
      .reply(
        200,
        {
          PARAMS_TAB: "Content/03-Parametres-Avances/00-Param-Avances.htm",
          PARAMS_DISPLAY: "Content/03-Parametres-Avances/01-Afficher.htm",
        },
        { "Access-Control-Allow-Origin": "*" } // Needed to avoid CORS error
      );
    const req = mockHttpRequest("/api/help", {}, {}, { lang: "nz" });
    const [res, _] = mockHttpResponse();

    await new HelpResource().get(req, res);

    expect(res.statusCode).toEqual(200);
    expect(res._getData()).toEqual(
      JSON.stringify({
        PARAMS_TAB:
          "https://help.dev.mylectra.com/help/systemmanager/en-us/Content/03-Parametres-Avances/00-Param-Avances.htm",
        PARAMS_DISPLAY:
          "https://help.dev.mylectra.com/help/systemmanager/en-us/Content/03-Parametres-Avances/01-Afficher.htm",
      })
    );
  });
});
