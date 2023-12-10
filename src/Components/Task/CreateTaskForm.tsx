import React, {useState} from 'react';
import {useMutation, useQueryClient} from 'react-query';
import {Drawer, Box, Button, TextField, Paper} from '@mui/material';
import AddIcon from "@mui/icons-material/Add";
import {apiService} from "../../Services/ApiService";
import {CreateTaskDrawerFormProps, TaskData} from "../Interface/TaskData";

const CreateTaskDrawerForm: React.FC<CreateTaskDrawerFormProps> = ({projectId, onTaskAdded}) => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskOrder, setTaskOrder] = useState('');
    const queryClient = useQueryClient();

    const createTaskMutation = useMutation(
        (taskData: TaskData) => apiService.createTask(taskData),
        {
            onSuccess: () => {
                onTaskAdded(); // Wywołanie callbacku po pomyślnym dodaniu zadania
                setDrawerOpen(false);
            }
        }
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createTaskMutation.mutate({
            nazwa: taskName,
            opis: taskDescription,
            kolejnosc: Number(taskOrder),
            projektId: projectId
        });
    };

    return (
        <>
            <Button variant="outlined" startIcon={<AddIcon/>} onClick={() => setDrawerOpen(true)}>
                Dodaj Zadanie
            </Button>

            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            >
                <Paper style={{padding: 20, margin: 20}}>
                    <form onSubmit={handleSubmit}>
                        <Box display="flex" flexDirection="column" gap={2}>
                            <TextField
                                label="Nazwa zadania"
                                value={taskName}
                                onChange={(e) => setTaskName(e.target.value)}
                                required
                            />
                            <TextField
                                label="Opis zadania"
                                value={taskDescription}
                                onChange={(e) => setTaskDescription(e.target.value)}
                                required
                                multiline
                                rows={4}
                            />
                            <TextField
                                label="Kolejność"
                                type="number"
                                value={taskOrder}
                                onChange={(e) => setTaskOrder(e.target.value)}
                                required
                            />
                            <Button type="submit" variant="contained" color="primary">
                                Utwórz zadanie
                            </Button>
                        </Box>
                    </form>
                </Paper>
            </Drawer>
        </>
    );
};

export default CreateTaskDrawerForm;
