import Keycloak from 'keycloak-js';
import {Role} from "./Components/users/User";

const keycloakConfig = {
    url: 'https://auth.fundacjamhw.pl/', // np. 'http://localhost:8080/auth'
    realm: 'pz-2023', // np. 'myrealm'
    clientId: 'pz-client', // np. 'myclient'
};

const keycloak = new Keycloak(keycloakConfig);
export const isAdmin = (): boolean => {
    return keycloak && keycloak.idTokenParsed?.roles?.includes('ADMIN');
};
export default keycloak;
export const isAuthorized = (roles: string[]): boolean => {
    if (keycloak && roles) {
        return roles.some((role) => {
            const hasRealmRole = keycloak.hasRealmRole(role);
            const hasResourceRole = keycloak.hasResourceRole(role);
            return hasRealmRole || hasResourceRole;
        });
    }
    return false;
};
export const isUserInGroup = (groupName: string): boolean => {
    if (keycloak && keycloak.idTokenParsed?.user_group_in_jwt) {
        return keycloak.idTokenParsed.user_group_in_jwt.includes(groupName);
    }
    return false;
};