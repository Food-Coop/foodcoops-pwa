import Keycloak from "keycloak-js";

const keycloakConfig = {
    url: "http://152.53.32.66:8089/",
    realm: "foodcoop",
    clientId: "foodcoop-pwa"
}

export const keycloak = new Keycloak(keycloakConfig);
