import Keycloak from "keycloak-js";

const keycloakConfig = {
    url: "http://152.53.32.66:8089/",
    realm: "foodcoop",
    clientId: "foodcoop-pwa"
}

export const keycloak = new Keycloak(keycloakConfig);

export const keycloakInitConfig = keycloakConfig;

export const getUsersOfRole = async (roleName) => {
    const url = `${keycloakConfig.url}admin/realms/${keycloakConfig.realm}/roles/${roleName}/users`;
    const tokenEndpoint = `${keycloakConfig.url}realms/${keycloakConfig.realm}/protocol/openid-connect/token`;

    const response1 = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'grant_type': 'client_credentials',
            'client_id': 'foodcoop-service',
            'client_secret': 'NLgKypRN86i3qYakyZLMK9sbPRZQbJYz'
        })
    });

    if (response1.ok) {
        const data = await response1.json();
        const token = data.access_token;

        const response2 = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response2.ok) {
            const usersOfRole = await response2.json();
            return usersOfRole;
        } else {
            console.error('Error fetching users of role:', response2.status);
            return null;
        }
    }
};