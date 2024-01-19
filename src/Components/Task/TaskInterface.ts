import {ProjectTask} from "../Interface/ProjectTask";

export interface Task {
    id: string;
    name: string;
    status: string;
    description: string;
    endDate: any;
    userid: string;
}

export interface TaskUpdate {
    id: string;
    name: string;
    status: string;
    description: string;
    kolejnosc: any;
    // ... other task properties
}

export interface TaskDetailsProps {
    task: ProjectTask | null;
    open: boolean;
    onClose: () => void;
}

export enum TaskStatus {
    TO_DO = "TO_DO",
    IN_PROGRESS = "IN_PROGRESS",
    DONE = "DONE"
}
