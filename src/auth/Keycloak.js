import Keycloak from "keycloak-js";

const keycloakConfig = {
    url: "https://foodcoops-keycloak.herokuapp.com/auth",
    realm: "foodcoop",
    clientId: "foodcoop-pwa"
}

export const keycloak = new Keycloak(keycloakConfig);