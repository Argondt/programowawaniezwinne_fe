// The component props follow the TaskDataUpdate structure
import React, {useState, useEffect} from 'react';
import {useMutation, useQueryClient} from 'react-query';
import {Drawer, Button, TextField, Box, Paper} from '@mui/material';
import {ProjectTask} from "../Interface/ProjectTask";
import {TaskDataUpdate} from "../Interface/TaskData";
import {apiService} from "../../Services/ApiService";

interface UpdateFormProps {
    open: boolean;
    onClose: () => void;
    task: ProjectTask; // Pass the initial task data
}

// The UpdateForm component
export const UpdateForm: React.FC<UpdateFormProps> = ({open, onClose, task}) => {
    const queryClient = useQueryClient();
    const [taskData, setTaskData] = useState<TaskDataUpdate>({
        nazwa: task.name,       // Initialize with the task's current name
        opis: task.description, // Initialize with the task's current description
        kolejnosc: task.storyPoint || 0, // Initialize with the task's current kolejnosc or default to 0
    });

    const initialTaskData = {
        nazwa: task.name,
        opis: task.description,
        kolejnosc: task.storyPoint || 0,
    };

    // Update form state when task data changes
    useEffect(() => {
        setTaskData({
            nazwa: task.name,
            opis: task.description,
            kolejnosc: task.storyPoint || 0,
        });
    }, [task]);

    const mutation = useMutation((newData: TaskDataUpdate) => apiService.updateTask(task.id, newData), {
        onSuccess: () => {
            queryClient.invalidateQueries('tasks');
            onClose();
        },
    });

    const handleChange = (prop: keyof TaskDataUpdate) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setTaskData({...taskData, [prop]: event.target.value});
    };

    const handleSubmit = () => {
        // Check if the data has changed
        if (JSON.stringify(taskData) !== JSON.stringify(initialTaskData)) {
            mutation.mutate(taskData);
        } else {
            // Optionally handle the case where no data has changed
            console.log('No changes detected');
        }
    };

    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
            <Paper style={{padding: 20, margin: 20}}>
                <Box display="flex" flexDirection="column" gap={2}>
                    <TextField
                        label="Nazwa"
                        variant="outlined"
                        fullWidth
                        value={taskData.nazwa}
                        onChange={handleChange('nazwa')}
                    />
                    <TextField
                        label="Opis"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                        value={taskData.opis}
                        onChange={handleChange('opis')}
                    />
                    <TextField
                        label="Kolejność"
                        type="number"
                        variant="outlined"
                        fullWidth
                        value={taskData.kolejnosc}
                        onChange={handleChange('kolejnosc')}
                    />
                    <Button variant="contained" color="primary" onClick={handleSubmit} disabled={mutation.isLoading}>
                        {mutation.isLoading ? 'Updating...' : 'Zaktualizuj'}
                    </Button>
                </Box>
            </Paper>
        </Drawer>
    );
};