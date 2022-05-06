import Keycloak from "keycloak-js";

const keycloakConfig = {
    url: "http://localhost:9090/",
    realm: "foodcoop",
    clientId: "foodcoop-pwa"
}

export const keycloak = new Keycloak(keycloakConfig);
