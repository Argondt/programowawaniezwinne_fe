export interface TaskData {
    id: string; // assuming id is a string, adjust if it's a number or another type
    nazwa: string;
    opis: string;
    kolejnosc: number;
    projektId: string; // or number, depending on your project structure
}
export interface TaskDataCreate {
    nazwa: string;
    opis: string;
    kolejnosc: number;
    projektId: string; // or number, depending on your project structure
}

export interface TaskDataUpdate {
    nazwa: string;
    opis: string;
    kolejnosc: number;
}

export interface CreateTaskDrawerFormProps {
    projectId: any;
    onTaskAdded: () => void; // Callback wywoływany po dodaniu zadania

}