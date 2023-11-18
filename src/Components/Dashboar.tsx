// Dashboard.js
import React from "react";
import {Box, CircularProgress, Container, Grid, Paper, Typography} from "@mui/material";
import {useQuery} from 'react-query';
import {chatService} from "../Services/chatService";
import ProjektForm from "./ProjektAdd";
import {useNavigate} from "react-router";

const Dashboard = () => {
    const {data: projekty, isLoading, error} = useQuery('projekty', () =>
        chatService.getAllProjects({page: 0, size: 10})
    );
    const navigate = useNavigate();
    if (isLoading) return <div><CircularProgress size={120} /></div>;
    const handleProjectClick = (projektId: number) => {
        navigate(`/projekty/${projektId}`); // Navigate to the project's detail page
    };

    return (
        <Container>
            <Box style={{padding: "20px", display: "flex", justifyContent: "flex-end", marginBottom: "20px"}}>
                <ProjektForm/>
            </Box>

            <Box style={{padding: "20px"}}>
                <Grid container spacing={3}>
                    {projekty?.content.map((projekt) => (
                        <Grid item xs={12} sm={6} md={4} key={projekt.projektId}>
                            <Paper elevation={3} style={{padding: "20px", textAlign: "center"}}
                                   onClick={() => handleProjectClick(projekt.projektId)} // Navigate to project details on click
                            >
                                <Typography variant="h6" style={{marginBottom: "10px"}}>
                                    {projekt.nazwa}
                                </Typography>
                                <Typography variant="body2" style={{marginBottom: "10px"}}>
                                    {projekt.opis}
                                </Typography>
                                <Typography variant="caption" style={{display: "block", marginBottom: "5px"}}>
                                    {projekt.dataCzasUtworzeniaDateTime}
                                </Typography>
                                <Typography variant="caption">
                                    {projekt.dataCzasModyfikacji}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Container>
    );
};

export default Dashboard
