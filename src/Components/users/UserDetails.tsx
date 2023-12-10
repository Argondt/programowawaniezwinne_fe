import {
    CircularProgress, Grid, IconButton, Stack, Typography, Card,
    CardContent, useTheme, Box
} from "@mui/material";
import {useQuery} from 'react-query';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import React from "react";
import {User, UserDetailsProps} from "./User";
import {apiService} from '../../Services/ApiService';
import ErrorMessage from "../alerts/ErrorMessage";
import {useNavigate} from "react-router";
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';


const UserDetails = ({id}: UserDetailsProps) => {
    const navigate = useNavigate();
    const theme = useTheme();

    const {data: user, isLoading, isError, error} =
        useQuery<User, Error>(['user', id], () => apiService.getUserById(id));

    if (isLoading) {
        return <CircularProgress/>;
    }
    if (isError || !user) {
        return <ErrorMessage message={error?.message || "Wystąpił błąd przy pobieraniu danych użytkownika."}/>;
    }

    const handleBack = () => {
        navigate(-1);
    };
    return (
        <Card elevation={1} sx={{margin: theme.spacing(3)}}>
            <CardContent>
                <Stack spacing={3}>
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 2, marginBottom: theme.spacing(3)}}>
                        <IconButton onClick={handleBack} size="large">
                            <ArrowBackIcon/>
                        </IconButton>
                        <Typography variant="h4" gutterBottom>Szczegóły:</Typography>
                    </Box>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" gutterBottom><PersonIcon/> Name</Typography>
                            <Typography variant="body2">{user.firstName} {user.lastName}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" gutterBottom><EmailIcon/> Email</Typography>
                            <Typography variant="body2">{user.email}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" gutterBottom><BadgeIcon/> Username</Typography>
                            <Typography variant="body2">{user.username}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" gutterBottom><BadgeIcon/> User ID</Typography>
                            <Typography variant="body2">{user.id}</Typography>
                        </Grid>
                    </Grid>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default UserDetails;
