import axios from 'axios';
import keycloak from '../keycloak';
import {ChatMessage} from '../Components/Interface/ChatMessage';
import {ProjektyResponse} from '../Components/Interface/ProjektyResponse';

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
const getProjectFiles = async (projektId: any) => {
    const response = await api.get(`/projekty/${projektId}/files`);
    return response.data;
};
const downloadFile = async (projektId: any, filename: any) => {
    const response = await api.get(`/projekty/${projektId}/files/${filename}/download`);
    return response.data.url; // URL do pobrania pliku
};
const getUsers = async () => {
    const response = await api.get('/users'); // URL do twojego backendowego endpointu
    return response.data;
};
export const chatService = {
    getAllMessages,
    getAllProjects,
    createProject,
    uploadFiles,
    getProjectFiles, downloadFile
    , getUsers
};
