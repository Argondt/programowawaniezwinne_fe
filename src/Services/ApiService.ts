import axios from 'axios';
import keycloak from '../keycloak';
import {ChatMessage} from '../Components/Interface/ChatMessage';
import {ProjektyResponse} from '../Components/Interface/ProjektyResponse';
import {User} from "../Components/users/User";
import {TaskStatus} from "../Components/Interface/TaskStatus";
import {TaskData, TaskDataUpdate} from "../Components/Interface/TaskData";
import {ProjektUpdate} from "../Components/Interface/Projekt";

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    if (keycloak.token) {
        config.headers.Authorization = `Bearer ${keycloak.token}`;
    }
    return config;
});

const getAllMessages = async () => {
    const response = await api.get<ChatMessage[]>('/chat');
    return response.data;
};

interface GetAllProjectsParams {
    page?: number;
    size?: number;
    sort?: string;
    nazwa?: string;
}

const getAllProjects = async (params: GetAllProjectsParams = {}) => {
    const response = await api.get<ProjektyResponse>('/projekty', {
        params: {
            ...params
        }
    });
    console.log(response);
    return response.data;
};
const createProject = async (nazwa: string, opis: string) => {
    const response = await api.post<Response>('/projekty',
        {nazwa, opis}
    );
    return response.data;
};
const uploadFiles = async (formData: any, projektId: any) => {
    const response = await api.post(`/projekty/${projektId}/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};
const getProjectFiles = async (id: any) => {
    const response = await api.get(`/projekty/${id}/files`);
    return response.data;
};
const downloadFile = async (id: any, filename: any) => {
    const response = await api.get(`/projekty/${id}/files/${filename}/download`);
    return response.data.url; // URL do pobrania pliku
};
const getUsers = async () => {
    const response = await api.get('/users'); // URL do twojego backendowego endpointu
    return response.data;
};
const getUserById = async (userId: string) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
};
const createTask = async (taskData: any) => {
    const response = await api.post('/zadania', taskData); // URL do twojego backendowego endpointu tworzenia zadania
    return response.data;
};
const getProjectTask = async (id: any) => {
    const response = await api.get(`/zadania/projekt/${id}/zadania`); // URL do twojego backendowego endpointu tworzenia zadania
    return response.data;
};
const getTaskById = async (id: any) => {
    const response = await api.get(`/zadania/${id}`); // URL do twojego backendowego endpointu tworzenia zadania
    return response.data;
};

export const sendMessage = async (message: ChatMessage): Promise<ChatMessage> => {
    const response = await api.post('/app/chat.sendMessage', { // Replace with your actual send message endpoint
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });

    if (!response) {
        throw new Error('Network response was not ok');
    }

    return await response.data(); // Or handle the response as needed
};
const updateUser = async (userId: string, userDetails: User) => {
    const response = await api.put(`/users/${userId}/update`, userDetails);
    return response.data;
};
const updateTaskStatus = async (zadanieId: string, userDetails: TaskStatus) => {
    const response = await api.put(`/zadania/${zadanieId}/status`, userDetails);
    return response.data;
};
const deleteUser = async (userId: string) => {
    const response = await api.delete(`/users/${userId}/delete`);
    return response.data;
};
const updateTask = async (zadanieId: string, taskData: TaskDataUpdate): Promise<any> => {
    const response = await api.put(`/zadania/${zadanieId}`, taskData);
    return response.data;
};
const updateProject = async (projektId: string, projektUpdate: ProjektUpdate): Promise<any> => {
    const response = await api.put(`/projekty/${projektId}`, projektUpdate);
    return response.data;
};
const deleteProject = async (projektId: string): Promise<any> => {
    const response = await api.delete(`/projekty/${projektId}`);
    return response.data;
};
export const apiService = {
    getAllMessages,
    getAllProjects,
    createProject,
    uploadFiles,
    getProjectFiles,
    downloadFile,
    getUsers,
    createTask,
    getProjectTask,
    getUserById,
    sendMessage,
    updateUser,
    deleteUser,
    updateTaskStatus,
    getTaskById,
    updateTask, updateProject, deleteProject
};
