import Keycloak from "keycloak-js";

const keycloakConfig = {
    url: "http://kohlrettig.ddns.net:9090/",
    realm: "foodcoop",
    clientId: "foodcoop-pwa"
}

export const keycloak = new Keycloak(keycloakConfig);
