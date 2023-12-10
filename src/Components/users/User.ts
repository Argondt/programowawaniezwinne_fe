export interface User {
    id: string;
    username: string;
    firstName: string;
    email: string;
    indexNumber: string;
    lastName: string;
}

export interface UpdateUserFormProps {
    user: User;
    isOpen: boolean;
    onClose: () => void;
}

export interface UserDetailsProps {
    id: string;
}
