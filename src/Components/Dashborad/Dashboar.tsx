// Dashboard.js
import React, {useState} from "react";
import {Box, CircularProgress, Container, Grid, Paper, Typography} from "@mui/material";
import {useQuery} from 'react-query';
import {apiService} from "../../Services/ApiService";
import ProjektForm from "../Project/ProjektAdd";
import {useNavigate} from "react-router";
import {useNotification} from "../../Providers/NotificationContext";

const Dashboard = () => {
    const notification = useNotification();

    const [searchQuery, setSearchQuery] = useState(""); // State to hold the search query
    const {data: projekty, isLoading, error} = useQuery(['projekty', searchQuery], () =>
        apiService.getAllProjects({page: 0, size: 10, nazwa: searchQuery}) // Include the search query in the API call
    );
    const navigate = useNavigate();
    if (isLoading) return <div><CircularProgress size={120}/></div>;

    let handleSearchChange: (event: any) => void;
    handleSearchChange = (event: any) => {
        setSearchQuery(event.target.value); // Update the search query on input change
    };


    const handleProjectClick = (projectId: string | null) => {
        if (!projectId) {
            // Display an error message or handle the null/undefined case as needed
            console.error("No project ID provided. Operation cannot proceed.");
            notification.error("No project ID provided. Operation cannot proceed.");
            return; // Exit the function if projectId is null or undefined
        }
        navigate(`/projekty/${projectId}`); // Navigate to the project's detail page only if projectId is valid
    };
    // @ts-ignore
    return (
        <Container>
            <Box style={{padding: "20px", display: "flex", justifyContent: "flex-end", marginBottom: "20px"}}>
                <input type="text" value={searchQuery} onChange={handleSearchChange}
                       placeholder="Search Projects"/> {/* Search input */}
                <ProjektForm/>
            </Box>

            <Box style={{padding: "20px"}}>
                <Grid container spacing={3}>
                    {projekty?.content.map((projekt) => (
                        <Grid item xs={12} sm={6} md={4} key={projekt.id}>
                            <Paper elevation={3} style={{padding: "20px", textAlign: "center"}}
                                   onClick={() => handleProjectClick(projekt.projectId)} // Navigate to project details on click
                            >
                                <Typography variant="h6" style={{marginBottom: "10px"}}>
                                    {projekt.name}
                                </Typography>
                                <Typography variant="body2" style={{marginBottom: "10px"}}>
                                    {projekt.description}
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
