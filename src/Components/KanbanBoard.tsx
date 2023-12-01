import React, {useEffect, useState} from 'react';
import {useQuery, useMutation, useQueryClient} from 'react-query';
import {Grid, Paper, Typography, Box, Button, Drawer, Container, CircularProgress} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useParams } from "react-router-dom";
import { apiService } from '../Services/ApiService';
import { DragDropContext, Droppable, Draggable, DroppableProvided, DraggableProvided } from 'react-beautiful-dnd';
import CreateTaskDrawerForm from './CreateTaskForm';

// Definicja interfejsu dla plików projektu
interface ProjectFile {
    id: string;
    fileName: string;
    url: string;
}
interface ProjectTask {
    id: string;
    name: string;
    status: string;
}
const KanbanBoard = () => {
    const { id: id } = useParams();
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [drawerOpen1, setDrawerOpen1] = React.useState(false);
    const [selectedFiles, setSelectedFiles] = React.useState<FileList | null>(null);
    const queryClient = useQueryClient();
    const [columns, setColumns] = useState<{ [key: string]: ProjectTask[] }>({});
    // UseQuery do pobrania plików projektu
    const { data: plikiProjektu, isLoading, isError } = useQuery<ProjectFile[], Error>(
        ['plikiProjektu', id],
        () => apiService.getProjectFiles(id)
    );

    const { data: projectTasks, isLoading: isLoadingTasks, isError: isErrorTasks } = useQuery<ProjectTask[], Error>(
        ['projectTasks', id],
        () => apiService.getProjectTask(id)
    );

    useEffect(() => {
        console.log(projectTasks)
        if (projectTasks) {
            const groupedTasks = projectTasks.reduce((acc: { [x: string]: any; }, task: { status: string; }) => {
                const status = task.status || 'no_status';
                acc[status] = [...(acc[status] || []), task];
                return acc;
            }, {});
            setColumns(groupedTasks);
        }
    }, [projectTasks]);
    // UseMutation dla przesyłania plików
    const uploadMutation = useMutation(
        (formData: FormData) => apiService.uploadFiles(formData, id),
        {
            onSuccess: () => {
                // Odświeżanie danych po udanym przesłaniu pliku
                queryClient.invalidateQueries(['plikiProjektu', id]);
                setDrawerOpen(false)
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
    const handleTaskAdded = () => {
        queryClient.invalidateQueries(['projectTasks', id]);
    };
    const handleDownload = async (filename: string) => {
        const url = await apiService.downloadFile(id, filename);
        window.open(url, '_blank');
    };

    if (isLoadingTasks) return <div><CircularProgress size={120} /></div>;
    if (isErrorTasks) return <div>Error loading tasks</div>;
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

    if (isLoading) return <div><CircularProgress size={120} /></div>;
    if (isError) return <div>Error loading files</div>;
    const onDragEnd = () => {
        // Logika obsługi przeciągania i upuszczania
    };
    // @ts-ignore
    return (
        <Container>
            <Box style={{ padding: "20px", display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
                <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setDrawerOpen(true)}>
                    Dodaj Pliki
                </Button>
                <CreateTaskDrawerForm projectId={id} onTaskAdded={handleTaskAdded}/>
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

            <DragDropContext onDragEnd={onDragEnd}>
                {Object.entries(columns).map(([status, tasks]) => (
                    <Droppable droppableId={status} key={status}>
                        {(provided: DroppableProvided) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >
                                <Typography variant="h6">{status}</Typography>
                                {tasks.map((task: ProjectTask, index: number) => (
                                    <Draggable key={task.id} draggableId={task.id} index={index}>
                                        {(provided: DraggableProvided) => (
                                            <Paper
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={{ margin: "8px 0", padding: "8px" }}
                                            >
                                                {task.name}
                                            </Paper>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                ))}
            </DragDropContext>
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
