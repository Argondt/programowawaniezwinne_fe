import React, {useState} from 'react';
import {useQuery} from 'react-query';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Button,
    IconButton
} from '@mui/material';
import {User} from "./User";
import {useNavigate} from "react-router";
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {apiService} from "../../Services/ApiService";
import UpdateUserForm from "./UpdateUserForm";

type Props = {};


const UserList: React.FC<Props> = () => {
    const navigate = useNavigate();

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);

    const {data, isLoading, isError, error} = useQuery<User[], Error>('users', apiService.getUsers, {
        onSuccess: (data) => {
            setUsers(data); // aktualizacja stanu users danymi z zapytania
        }
    });
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const handleEditClick = (user: User) => {
        setSelectedUser(user);
        setIsUpdateFormOpen(true);
    };

    const handleCloseUpdateForm = () => {
        setIsUpdateFormOpen(false);
        setSelectedUser(null);
    };
    // Handle change rows per page
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    if (isLoading) {
        return <div>Ładowanie...</div>;
    }

    if (isError) {
        return <div>Wystąpił błąd przy pobieraniu użytkowników: {error?.message}</div>;
    }
    const handleDeleteClick = async (userId: any) => {
        // Wywołaj funkcję usuwania użytkownika
        await apiService.deleteUser(userId);
        const updatedUsers = users.filter(user => user.id !== userId);
        setUsers(updatedUsers);
    };
    const handleUserClick = (id: any) => {
        navigate(`/users/${id}`); // Navigate to the project's detail page
    };
    return (
        <Card sx={{margin: 4}}>
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h5">Lista użytkowników</Typography>
                    {/*<Button variant="contained" color="primary" onClick={() => navigate('/add-user')}>*/}
                    {/*    Add User*/}
                    {/*</Button>*/}
                    {selectedUser && (
                        <UpdateUserForm
                            user={selectedUser}
                            isOpen={isUpdateFormOpen}
                            onClose={handleCloseUpdateForm}
                        />
                    )}
                </Box>
                <Box mb={2}>
                    <TextField
                        variant="outlined"
                        placeholder="Search User"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon/>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>No</TableCell>
                                <TableCell>Profile</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users?.map((user, index) => (
                                <TableRow key={user.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{user.firstName} {user.lastName}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{/* Role information if available */}</TableCell>
                                    <TableCell>
                                        <IconButton color="primary" onClick={() => handleUserClick(user.id)}>
                                            <SearchIcon/>
                                        </IconButton>
                                        <IconButton color="primary" onClick={() => handleEditClick(user)}>
                                            <EditIcon/>
                                        </IconButton>
                                        <IconButton color="error" onClick={() => handleDeleteClick(user.id)}>
                                            <DeleteIcon/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={users?.length || 0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </CardContent>
        </Card>
    );
};

export default UserList;
