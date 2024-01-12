import React, {useEffect, useState} from 'react';
import {useQuery, useMutation, useQueryClient} from 'react-query';
import {useParams} from "react-router-dom";
import {apiService} from '../../Services/ApiService';
import CreateTaskDrawerForm from './CreateTaskForm';
import {TaskStatus} from "../Interface/TaskStatus";
import {ProjectTask} from "../Interface/ProjectTask";
import TaskDetailsDialog from "./TaskDetailsDialog";
import {ColumnsType} from "../Interface/Utils";
import {ProjectFile} from "../Interface/Projekt";
import {
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Typography,
    Box,
    Button,
    Drawer,
    Grid // Add this import for Grid
} from '@mui/material';
import AddIcon from "@mui/icons-material/Add";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const KanbanBoard = () => {
    const {id} = useParams<{ id: string }>();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const queryClient = useQueryClient();
    const [columns, setColumns] = useState<ColumnsType>({});
    const [totalStoryPoints, setTotalStoryPoints] = useState(0);
    const [completedStoryPoints, setCompletedStoryPoints] = useState(0);

    const {data: plikiProjektu, isLoading, isError} = useQuery<ProjectFile[], Error>(
        ['plikiProjektu', id],
        () => apiService.getProjectFiles(id)
    );

    const {data: projectTasks, isLoading: isLoadingTasks, isError: isErrorTasks} = useQuery<ProjectTask[], Error>(
        ['projectTasks', id],
        () => apiService.getProjectTask(id)
    );
    const [selectedTask, setSelectedTask] = useState<ProjectTask | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const handleTaskClick = (task: ProjectTask) => {
        setSelectedTask(task);
        setIsDetailsOpen(true);
    };
    const handleDragEnd = (result: any) => {
        const {source, destination} = result;
        if (!destination) {
            return;
        }

        if (source.droppableId !== destination.droppableId || source.index !== destination.index) {
            const start = columns[source.droppableId];
            const finish = columns[destination.droppableId];

            if (start === finish) {
                const newTaskIds = Array.from(start);
                const [removed] = newTaskIds.splice(source.index, 1);
                newTaskIds.splice(destination.index, 0, removed);

                const newColumn = {
                    ...columns,
                    [source.droppableId]: newTaskIds,
                };

                setColumns(newColumn);
            } else {
                const startTaskIds = Array.from(start);
                const [removed] = startTaskIds.splice(source.index, 1);
                const finishTaskIds = Array.from(finish);
                finishTaskIds.splice(destination.index, 0, removed);

                const newColumn = {
                    ...columns,
                    [source.droppableId]: startTaskIds,
                    [destination.droppableId]: finishTaskIds,
                };

                setColumns(newColumn);
            }

            // Tu można puścić call do API by zmienić status taska
            // apiService.updateTaskStatus(removed.id, destination.droppableId);
        }
    };
    const handleCloseDetails = () => {
        setIsDetailsOpen(false);
        setSelectedTask(null);
    };
    useEffect(() => {
        if (projectTasks) {
            // Calculate the total and completed story points
            const total = projectTasks.reduce((acc, task) => acc + (task.storyPoint || 0), 0);
            const completed = projectTasks.reduce((acc, task) => acc + (task.status === TaskStatus.DONE ? task.storyPoint || 0 : 0), 0);
            setTotalStoryPoints(total);
            setCompletedStoryPoints(completed);
        }
    }, [projectTasks]);

    const updateTaskMutation = useMutation(
        (task: { id: string; status: TaskStatus }) => apiService.updateTaskStatus(task.id, task.status),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['projectTasks', id]);
            },
            // Opcjonalna obsługa błędów
        }
    );

    const uploadMutation = useMutation(
        (formData: FormData) => apiService.uploadFiles(formData, id),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['plikiProjektu', id]);
                setDrawerOpen(false);
            },
            // Opcjonalna obsługa błędów
        }
    );
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setSelectedFiles(event.target.files);
        }
    };
    const statusColors = {
        [TaskStatus.TO_DO]: "#f0f0f0", // Light grey for TO_DO
        [TaskStatus.IN_PROGRESS]: "#add8e6", // Light blue for IN PROGRESS
        [TaskStatus.DONE]: "#90ee90", // Light green for DONE
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

    if (isLoadingTasks) return <div><CircularProgress size={120}/></div>;
    if (isErrorTasks) return <div>Error z załadowaniem zadań</div>;

    const NoFilesMessage = () => (
        <Grid item xs={12}>
            <Paper elevation={3} style={{padding: "20px", textAlign: "center"}}>
                <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
                    <ErrorOutlineIcon style={{fontSize: 60, color: "#ff6f61"}}/>
                    <Typography variant="h6" style={{marginTop: "20px"}}>
                        Nie znaleziono plików
                    </Typography>
                    <Typography variant="body1" style={{marginTop: "10px"}}>
                        Nie ma żadnych plików przypisanych do tego projektu.
                    </Typography>
                </Box>
            </Paper>
        </Grid>
    );

    if (isLoading) return <div><CircularProgress size={120}/></div>;
    if (isError) return <div>Error wczytania plików</div>;

    return (
        <Container>
            <Box style={{padding: "20px", display: "flex", justifyContent: "flex-end", marginBottom: "20px"}}>
                <Button variant="outlined" startIcon={<AddIcon/>} onClick={() => setDrawerOpen(true)}>
                    Dodaj Pliki
                </Button>
                <CreateTaskDrawerForm projectId={id} onTaskAdded={handleTaskAdded}/>
            </Box>

            <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <Box sx={{width: 250, padding: 3}}>
                    <Typography variant="h6">Wgraj pliki</Typography>
                    <input type="file" multiple onChange={handleFileChange} style={{display: "none"}} id="file-input"/>
                    <label htmlFor="file-input" style={{width: "100%"}}>
                        <Box sx={{
                            border: '2px dashed grey',
                            padding: 5,
                            marginTop: 2,
                            minHeight: 200,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                        }}>
                            Przeciągnij i upuść pliki tutaj lub kliknij, aby wybrać pliki
                        </Box>
                    </label>
                    <Button onClick={handleSubmit}>WGRAJ</Button>
                </Box>
            </Drawer>


            <TaskDetailsDialog
                task={selectedTask}
                open={isDetailsOpen}
                onClose={handleCloseDetails}
            />
            {/*<Box style={{ display: "flex", flexDirection: "row", gap: "16px" }}>*/}
            {/*    {Object.entries(columns).map(([columnId, tasks]) => (*/}
            {/*        <Box key={columnId} style={{ flexGrow: 1, minWidth: 0, padding: "16px", border: "1px solid gray", borderRadius: "8px" }}>*/}
            {/*            <Typography variant="h6">{columnId}</Typography>*/}
            {/*            {tasks.map((task) => (*/}
            {/*                <Paper*/}
            {/*                    key={task.id}*/}
            {/*                    style={{margin: "8px 0", padding: "8px"}}*/}
            {/*                    onClick={() => handleTaskClick(task)}*/}
            {/*                >*/}
            {/*                    {task.name}*/}
            {/*                </Paper>*/}
            {/*            ))}*/}
            {/*        </Box>*/}
            {/*    ))}*/}
            {/*</Box>*/}
            <Typography variant="h6">
                Suma Story Points: {totalStoryPoints} | Ukończono: {completedStoryPoints}
            </Typography>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Nazwa zadania</TableCell>
                            <TableCell>Story Points</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {projectTasks?.map((task: ProjectTask) => {
                            const status = TaskStatus[task.status as keyof typeof TaskStatus]; // Get the text representation of the status.
                            const color = statusColors[task.status as keyof typeof statusColors]; // Determine the color based on the task's status.

                            return (
                                <TableRow
                                    key={task.id}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                    onClick={() => handleTaskClick(task)}
                                >
                                    <TableCell component="th" scope="row">
                                        {task.name}
                                    </TableCell>
                                    <TableCell>
                                        {task.storyPoint}
                                    </TableCell>
                                    <TableCell style={{backgroundColor: color}}>
                                        {status}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>


            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3}}>
                <Typography variant="h5" sx={{padding: "16px"}}>
                    Pliki projektu:
                </Typography>
            </Box>
            <Grid container spacing={3}>
                {plikiProjektu && plikiProjektu.length > 0 ? (
                    plikiProjektu.map((plik, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Paper elevation={3} style={{padding: "20px", textAlign: "center", cursor: "pointer"}}
                                   onClick={() => handleDownload(plik.fileName)}>
                                <Typography sx={{marginLeft: 2, wordBreak: 'break-all'}}>{plik.fileName}</Typography>
                            </Paper>
                        </Grid>
                    ))
                ) : (
                    <NoFilesMessage/>
                )}
            </Grid>

        </Container>
    );
};

export default KanbanBoard;
