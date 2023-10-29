import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import { useKeycloak } from "@react-keycloak/web";
import React from "react";
import LogoutIcon from '@mui/icons-material/Logout';
export const AppBarMenu = () => {
  const { keycloak } = useKeycloak();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Nazwa Twojej Aplikacji
        </Typography>
        <Button
        color="secondary"
          variant="outlined"
          data-testid="logout"
          startIcon={<LogoutIcon />}
          onClick={() => keycloak.logout()}
        >
          Wyloguj się
        </Button>
      </Toolbar>
    </AppBar>
  );
};