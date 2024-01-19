import React, {useState} from 'react';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import {Drawer, Box, Button, TextField, Paper, FormControlLabel, Checkbox} from '@mui/material';
import AddIcon from "@mui/icons-material/Add";
import {apiService} from "../../Services/ApiService";
import {CreateTaskDrawerFormProps, TaskData, TaskDataCreate} from "../Interface/TaskData";
import {User} from "../users/User";

interface UserDto {
    id: number;
    name: string; // Ensure this exists
    // ... other properties
}

const CreateTaskDrawerForm: React.FC<CreateTaskDrawerFormProps> = ({projectId, onTaskAdded}) => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskOrder, setTaskOrder] = useState('');
    const queryClient = useQueryClient();
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const {data: users, isLoading, isError} = useQuery<User[], Error>('users', apiService.getUsers);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    const handleCheckboxChange = (userId: string, checked: boolean) => {
        if (checked) {
            setSelectedUserId(userId);
        } else if (selectedUserId === userId) {
            setSelectedUserId(null);
        }
    };
    const createTaskMutation = useMutation(
        (taskData: TaskDataCreate) => apiService.createTask({
            ...taskData,
            userIds: selectedUserIds
        }),
        {
            onSuccess: () => {
                onTaskAdded();
                setDrawerOpen(false);
            }
        }
    );
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedUserId) {
            createTaskMutation.mutate({
                nazwa: taskName,
                opis: taskDescription,
                kolejnosc: Number(taskOrder),
                projektId: projectId,
                userId: selectedUserId
            });
        }
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
                            {/* Displaying users with checkboxes */}
                            {isLoading ? (
                                <div>Loading users...</div>
                            ) : isError ? (
                                <div>Error loading users</div>
                            ) : (
                                users?.map(user => (
                                    <FormControlLabel
                                        key={user.id}
                                        control={
                                            <Checkbox
                                                checked={user.id === selectedUserId}
                                                onChange={(e) => handleCheckboxChange(user.id, e.target.checked)}
                                            />
                                        }
                                        label={`${user.firstName} ${user.lastName}`}
                                    />
                                ))
                            )}
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
