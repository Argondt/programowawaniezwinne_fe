import React from 'react';
import { useQuery } from 'react-query';
import { apiService } from '../Services/ApiService';
type Props = {};
interface User {
    id: string;
    username: string;
}
const UserList: React.FC = (props: Props) => {
    const { data: users, isLoading, isError, error } = useQuery<User[], Error>('users', () => apiService.getUsers());

    if (isLoading) {
        return <div>Ładowanie...</div>;
    }

    if (isError) {
        return <div>Wystąpił błąd przy pobieraniu użytkowników: {error?.message}</div>;
    }

    return (
        <div>
            <h1>Lista Użytkowników</h1>
            <ul>
                {users?.map(user => (
                    <li key={user.id}>{user.username}</li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;
