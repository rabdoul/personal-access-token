package scripts;

import com.github.kevinsawicki.http.HttpRequest;
import com.lectra.test.LectraTestScript;
import javax.json.Json;
import javax.json.JsonReader;
import java.io.StringReader;

public class ResetProductionRules extends LectraTestScript {

    public String testMain(Object[] args) throws Exception {
        String user = String.valueOf(args[0]);
        String password = String.valueOf(args[1]);
        String clientId = "7odO00bwfhacSBCjb8WcUT89T30P9mMK";
        String audience = "https://custom-offer-definition-connector.mylectra.com";

        String gatewayCuttingRoomUrl = "https://gateway-auth.cloudservices.dev.mylectra.com/auth/my-credentials";
        String accessToken;

        HttpRequest createdTokenResponse = HttpRequest.post(gatewayCuttingRoomUrl)
                    .basic(user, password)
                    .contentType("application/json")
                    .send(Json.createObjectBuilder()
                            .add("clientId", clientId)
                            .add("audience", audience).build().toString());
            if (createdTokenResponse.ok()) {
                try (JsonReader reader = Json.createReader(new StringReader(createdTokenResponse.body()))) {
                    accessToken = reader.readObject().getString("access_token");
                }
            } else {
                throw new IllegalStateException("Cannot create token for " + user + " to " + audience);
            }
        
        HttpRequest response = HttpRequest.delete("https://gateway-cuttingroom.cloudservices.dev.mylectra.com/api/productionrules")
                .contentType("application/json")
                .header("x-api-version", "4.0")
                .header("Authorization", "Bearer " + accessToken);
        if (response.code() == 200) {
            return "";
        } else {
            return "Error " + response.code() + " when deleting production rules : " + response.message();
        }
    }

    public static void main(String[] args) throws Exception {
        new ResetProductionRules().testMain(new String[]{"valid-orderform-od@framboise.com","!Lectra33!"});
    }
}
