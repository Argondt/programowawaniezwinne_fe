import React, {useState, useEffect} from 'react';
import {useMutation, useQueryClient} from 'react-query';
import {Drawer, Box, Button, TextField, Paper} from '@mui/material';
import EditIcon from "@mui/icons-material/Edit";
import {apiService} from "../../Services/ApiService";
import {TaskData, TaskDataUpdate} from "../Interface/TaskData";
import {Task} from "./TaskInterface";

interface EditTaskDrawerFormProps {
    task: Task;
    onTaskUpdated: () => void;
}

const EditTaskDrawerForm: React.FC<EditTaskDrawerFormProps> = ({task, onTaskUpdated}) => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskOrder, setTaskOrder] = useState('');
    const [isEditDrawerOpen, setEditDrawerOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState<Task | null>(null);

    useEffect(() => {
        setTaskName(task.name);
        setTaskDescription(task.description);
    }, [task]);


    const updateTaskMutation = useMutation(
        (taskData: TaskDataUpdate) => {
            if (currentTask && currentTask.id) {
                return apiService.updateTask(currentTask.id, taskData);
            }
            throw new Error('Current task or task ID is undefined.');
        },
        {
            onSuccess: () => {
                onTaskUpdated(); // Callback for after the task is successfully updated
                // ... other success handling
            },
            // ... other configuration like onError
        }
    );


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
            updateTaskMutation.mutate({
                nazwa: taskName,
                opis: taskDescription,
                kolejnosc: Number(taskOrder)
            });
    };

    return (
        <>
            <Button variant="outlined" startIcon={<EditIcon/>} onClick={() => setDrawerOpen(true)}>
                Edytuj Zadanie
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
                                Aktualizuj zadanie
                            </Button>
                        </Box>
                    </form>
                </Paper>
            </Drawer>
        </>
    );
};

export default EditTaskDrawerForm;
