import Keycloak from 'keycloak-js';

const keycloakConfig = {
  url: 'https://auth.fundacjamhw.pl/', // np. 'http://localhost:8080/auth'
  realm: 'pz-2023', // np. 'myrealm'
  clientId: 'pz-client', // np. 'myclient'
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;