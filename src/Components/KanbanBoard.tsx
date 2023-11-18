import React from 'react';
import { useQuery, useMutation } from 'react-query';
import { Grid, Paper, Typography, Box, Button, Drawer, Container } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useParams } from "react-router-dom";
import { chatService } from '../Services/chatService';

// Definicja interfejsu dla plików projektu
interface ProjectFile {
    id: string;
    fileName: string;
    url: string;
}

const KanbanBoard = () => {
    const { id: projektId } = useParams();
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [selectedFiles, setSelectedFiles] = React.useState<FileList | null>(null);

    // UseQuery do pobrania plików projektu
    const { data: plikiProjektu, isLoading, isError } = useQuery<ProjectFile[], Error>(
        ['plikiProjektu', projektId],
        () => chatService.getProjectFiles(projektId)
    );

    // UseMutation dla przesyłania plików
    const uploadMutation = useMutation(
        (formData: FormData) => chatService.uploadFiles(formData, projektId),
        {
            onSuccess: () => {
                // Odświeżanie danych po udanym przesłaniu pliku
            },
            onError: (error) => {
                // Obsługa błędów
            },
        }
    );

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setSelectedFiles(event.target.files);
        }
    };

    const handleSubmit = () => {
        if (!selectedFiles) {
            return;
        }

        const formData = new FormData();
        for (let i = 0; i < selectedFiles.length; i++) {
            formData.append("file", selectedFiles[i]);
        }

        uploadMutation.mutate(formData);
    };
    const columns = {
        todo: {title: "To Do", tasks: ["Task 1", "Task 2"]},
        inProgress: {title: "In Progress", tasks: ["Task 3"]},
        done: {title: "Done", tasks: ["Task 4", "Task 5"]},
    };
    const handleDownload = async (filename: string) => {
        const url = await chatService.downloadFile(projektId, filename);
        window.open(url, '_blank');
    };

    const NoFilesMessage = () => (
        <Grid item xs={12}>
            <Paper elevation={3} style={{ padding: "20px", textAlign: "center" }}>
                <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
                    <ErrorOutlineIcon style={{ fontSize: 60, color: "#ff6f61" }} />
                    <Typography variant="h6" style={{ marginTop: "20px" }}>
                        Nie znaleziono plików
                    </Typography>
                    <Typography variant="body1" style={{ marginTop: "10px" }}>
                        Nie ma żadnych plików przypisanych do tego projektu.
                    </Typography>
                </Box>
            </Paper>
        </Grid>
    );

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading files</div>;

    return (
        <Container>
            <Box style={{ padding: "20px", display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
                <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setDrawerOpen(true)}>
                    Add Files
                </Button>
            </Box>

            <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <Box sx={{ width: 250, padding: 3 }}>
                    <Typography variant="h6">Upload Files</Typography>
                    <input type="file" multiple onChange={handleFileChange} style={{ display: "none" }} id="file-input" />
                    <label htmlFor="file-input" style={{ width: "100%" }}>
                        <Box sx={{ border: '2px dashed grey', padding: 5, marginTop: 2, minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            Drag and drop files here or click to select files
                        </Box>
                    </label>
                    <Button onClick={handleSubmit}>Upload</Button>
                </Box>
            </Drawer>
            <Grid container spacing={3}>
                {Object.entries(columns).map(([columnId, column]) => (
                    <Grid item xs={4} key={columnId}>
                        <Paper elevation={3} sx={{minHeight: "300px", padding: "16px"}}>
                            <Typography variant="h6">{column.title}</Typography>
                            {column.tasks.map((task, index) => (
                                <Paper key={index} elevation={1} sx={{margin: "8px 0", padding: "8px"}}>
                                    {task}
                                </Paper>
                            ))}
                        </Paper>
                    </Grid>
                ))}
            </Grid>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3}}>
                <Typography variant="h5" sx={{padding: "16px"}}>
                    Pliki projektu:
                </Typography>
            </Box>
            <Grid container spacing={3}>
                {plikiProjektu && plikiProjektu.length > 0 ? (
                    plikiProjektu.map((plik, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Paper elevation={3} style={{ padding: "20px", textAlign: "center", cursor: "pointer" }} onClick={() => handleDownload(plik.fileName)}>
                                <Typography sx={{ marginLeft: 2, wordBreak: 'break-all' }}>{plik.fileName}</Typography>
                            </Paper>
                        </Grid>
                    ))
                ) : (
                    <NoFilesMessage />
                )}
            </Grid>

        </Container>
    );
};

export default KanbanBoard;
