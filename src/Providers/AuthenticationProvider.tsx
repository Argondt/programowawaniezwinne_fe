import type {
    AuthClientError,
    AuthClientEvent,
    AuthClientTokens,
} from "@react-keycloak/core/lib/types";
import {ReactKeycloakProvider} from "@react-keycloak/web";
import keycloak from "../keycloak";
import CircularProgress from "@mui/material/CircularProgress";

type AuthenticationProviderProps = { children: React.ReactNode };

const eventLogger = (eventType: AuthClientEvent, error?: AuthClientError) => {
    console.info("onKeycloakEvent", eventType, error);
};

const tokenLogger = (tokens: AuthClientTokens) => {
    console.info("onKeycloakTokens", tokens);
};

const initOptions = {
    onLoad: "login-required",
    checkLoginIframe: false,
};

const AuthenticationProvider = ({children}: AuthenticationProviderProps) => {
    return (
        <ReactKeycloakProvider
            authClient={keycloak}
            onEvent={eventLogger}
            onTokens={tokenLogger}
            initOptions={initOptions}
            LoadingComponent={<CircularProgress size={120} style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: 'auto'
            }}/>}
        >
            {children}
        </ReactKeycloakProvider>
    );
};

export default AuthenticationProvider;
