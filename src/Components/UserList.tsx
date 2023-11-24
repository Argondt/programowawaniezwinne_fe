import React from 'react';
import { useQuery } from 'react-query';
import { chatService } from '../Services/chatService';
import {
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    TablePagination,
    Checkbox,
    TextField
} from '@mui/material';
type Props = {};
interface User {
    id: string;
    username: string;
}
const UserList: React.FC = (props: Props) => {
    const { data: users, isLoading, isError, error } = useQuery<User[], Error>('users', () => chatService.getUsers());


    if (isError) {
        return <div>Wystąpił błąd przy pobieraniu użytkowników: {error?.message}</div>;
    }
    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>
                Lista Użytkowników
            </Typography>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>id</TableCell>
                            <TableCell>Username</TableCell>
                            {/* Add more header cells if needed */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users?.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                {/* Add more cells for each user property */}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};
export default UserList;
