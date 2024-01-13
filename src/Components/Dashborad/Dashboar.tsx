import React, {useState} from "react";
import {Box, CircularProgress, Container, Grid, IconButton, Paper, Typography} from "@mui/material";
import {useQuery} from 'react-query';
import {apiService} from "../../Services/ApiService";
import ProjektForm from "../Project/ProjektAdd";
import {useNavigate} from "react-router";
import {useNotification} from "../../Providers/NotificationContext";
import EditIcon from '@mui/icons-material/Edit';
import UpdateProjectForm from "../Project/UpdateProject";
import {ProjektUpdate, ProjektUpdatedTO} from "../Interface/Projekt";
import {isAdmin, isUserInGroup} from "../../keycloak";

const Dashboard = () => {
    const notification = useNotification();
    const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);
    const [selectedProject, setSelectedProject] = useState<ProjektUpdatedTO | null>(null);

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

    const handleEditProject = (projekt: ProjektUpdatedTO) => {
        console.log("Editing project:", projekt); // Check if this logs correctly
        setSelectedProject(projekt);
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
                    {isAdmin() ? (
                        projekty?.content.map((projekt) => (
                            isUserInGroup("/" + projekt.name) ? (
                                <Grid item xs={12} sm={6} md={4} key={projekt.id}
                                      onMouseEnter={() => setHoveredProjectId(projekt.id)}
                                      onMouseLeave={() => setHoveredProjectId(null)}
                                >
                                    <div style={{position: 'relative'}}> {/* Container for hover effect */}
                                        <Paper elevation={3}
                                               style={{padding: "20px", textAlign: "center", position: 'relative'}}
                                               onClick={() => handleProjectClick(projekt.projectId)}
                                        >
                                            <Typography variant="h6" style={{marginBottom: "10px"}}>
                                                {projekt.name}
                                            </Typography>
                                            <Typography variant="body2" style={{marginBottom: "10px"}}>
                                                {projekt.description}
                                            </Typography>
                                        </Paper>

                                        {/* Edit icon bar */}
                                        {hoveredProjectId === projekt.id && (
                                            <Box style={{
                                                position: "absolute",
                                                top: '-50px', // Positioning the bar above the tile
                                                left: 0,
                                                right: 0,
                                                backgroundColor: "white",
                                                padding: "10px",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                zIndex: 2 // Ensures the box is above other elements
                                            }}>
                                                <IconButton onClick={(e) => {
                                                    e.stopPropagation();
                                                    const projektUpdate: ProjektUpdatedTO = {
                                                        projectId: projekt.projectId,
                                                        name: projekt.name,
                                                        description: projekt.description,
                                                    };
                                                    handleEditProject(projektUpdate);
                                                }}>
                                                    <EditIcon color="action"/>
                                                </IconButton>
                                            </Box>
                                        )}
                                    </div>
                                </Grid>
                            ) : null // Zwraca null, gdy użytkownik nie jest autoryzowany
                        ))
                    ) : (projekty?.content.map((projekt) => (
                        <Grid item xs={12} sm={6} md={4} key={projekt.id}
                              onMouseEnter={() => setHoveredProjectId(projekt.id)}
                              onMouseLeave={() => setHoveredProjectId(null)}
                        >
                            <div style={{position: 'relative'}}> {/* Container for hover effect */}
                                <Paper elevation={3}
                                       style={{padding: "20px", textAlign: "center", position: 'relative'}}
                                       onClick={() => handleProjectClick(projekt.projectId)}
                                >
                                    <Typography variant="h6" style={{marginBottom: "10px"}}>
                                        {projekt.name}
                                    </Typography>
                                    <Typography variant="body2" style={{marginBottom: "10px"}}>
                                        {projekt.description}
                                    </Typography>
                                </Paper>

                                {/* Edit icon bar */}
                                {hoveredProjectId === projekt.id && (
                                    <Box style={{
                                        position: "absolute",
                                        top: '-50px', // Positioning the bar above the tile
                                        left: 0,
                                        right: 0,
                                        backgroundColor: "white",
                                        padding: "10px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        zIndex: 2 // Ensures the box is above other elements
                                    }}>
                                        <IconButton onClick={(e) => {
                                            e.stopPropagation();
                                            const projektUpdate: ProjektUpdatedTO = {
                                                projectId: projekt.projectId,
                                                name: projekt.name,
                                                description: projekt.description,
                                            };
                                            handleEditProject(projektUpdate);
                                        }}>
                                            <EditIcon color="action"/>
                                        </IconButton>
                                    </Box>
                                )}
                            </div>
                        </Grid>
                    )))}
                </Grid>
                {selectedProject && <UpdateProjectForm projekt={selectedProject} open={true}/>}
            </Box>
        </Container>
    );
};

export default Dashboard;