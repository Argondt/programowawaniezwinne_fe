
import axios from 'axios';
import keycloak from '../keycloak';
import { ChatMessage } from '../Components/Interface/ChatMessage';
import { Projekt } from '../Components/Interface/Projekt';
import { ProjektyResponse } from '../Components/Interface/ProjektyResponse';

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

export const chatService = {
  getAllMessages,
  getAllProjects
};
