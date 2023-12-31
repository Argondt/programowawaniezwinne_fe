import {TaskStatus} from "./TaskStatus";

export interface ProjectTask {
    id: string;
    name: string;
    status: TaskStatus;
    storyPoint: number;
    description: string;
    endDate: string; // Data jako string ISO, można dostosować typ
}