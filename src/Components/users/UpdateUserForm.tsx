import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { TextField, Button, Drawer, Box } from '@mui/material';
import {apiService} from "../../Services/ApiService";
import {UpdateUserFormProps, User} from "./User";




const UpdateUserForm: React.FC<UpdateUserFormProps> = ({ user, isOpen, onClose }) => {
    const [updatedUser, setUpdatedUser] = useState<User>(user);
    const queryClient = useQueryClient();

    const updateUserMutation = useMutation(
        (newUserDetails: User) => apiService.updateUser(newUserDetails.id, newUserDetails),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('users');
                onClose();
            },
        }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateUserMutation.mutate(updatedUser);
    };

    return (
        <Drawer anchor="right" open={isOpen} onClose={onClose}>
            <Box p={3} width="250px">
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Username"
                        name="username"
                        disabled={true}
                        value={updatedUser.username}
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="First Name"
                        name="firstName"
                        value={updatedUser.firstName}
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Last Name"
                        name="lastName"
                        value={updatedUser.lastName}
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Email"
                        name="email"
                        value={updatedUser.email}
                        onChange={handleChange}
                    />
                    <Button type="submit" variant="contained" color="primary">
                        Update User
                    </Button>
                </form>
            </Box>
        </Drawer>
    );
};
export default UpdateUserForm;
