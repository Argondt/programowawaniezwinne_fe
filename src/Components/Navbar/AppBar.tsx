import {AppBar, Button, Toolbar, Typography} from "@mui/material";
import {useKeycloak} from "@react-keycloak/web";
import React from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import {Link} from "react-router-dom";
import ChatIcon from "@mui/icons-material/Chat";
import FolderIcon from "@mui/icons-material/Folder";
import PeopleIcon from "@mui/icons-material/People";
import {isAuthorized} from "../../keycloak";
import {Role} from "../users/User";

export const AppBarMenu = () => {
    const {keycloak} = useKeycloak();

    return (
        <AppBar position="static" style={{backgroundColor: "#333"}}>
            {" "}
            <Toolbar>
                <Typography variant="h6" style={{flexGrow: 1}}>
                    Nazwa Twojej Aplikacji
                </Typography>
                <Button
                    variant="outlined"
                    component={Link}
                    startIcon={<ChatIcon/>}
                    style={{marginLeft: "10px"}}
                    to="/chat"
                >
                    Chat
                </Button>
                {isAuthorized([Role.ADMIN]) && (
                    <Button
                        variant="outlined"
                        component={Link}
                        startIcon={<PeopleIcon/>}
                        style={{marginLeft: "10px"}}
                        to="/users" // Ścieżka do UserList
                    >
                        Użytkownicy
                    </Button>
                )}
                <Button
                    variant="outlined"
                    startIcon={<FolderIcon/>}
                    style={{marginLeft: "10px", marginRight: "10px"}}
                    component={Link}
                    to="/"
                >
                    Projekty
                </Button>

                <Button
                    variant="outlined"
                    startIcon={<LogoutIcon/>}
                    onClick={() => keycloak.logout()}
                >
                    Wyloguj się
                </Button>
            </Toolbar>
        </AppBar>
    );
};
