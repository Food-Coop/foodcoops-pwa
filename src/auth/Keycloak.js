import Keycloak from "keycloak-js";

const keycloakConfig = {
    url: "http://185.252.235.49:8089/",
    realm: "foodcoop",
    clientId: "foodcoop-pwa"
}

export const keycloak = new Keycloak(keycloakConfig);
