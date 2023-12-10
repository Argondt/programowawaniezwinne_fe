export interface TaskData {
    nazwa: string;
    opis: string;
    kolejnosc: number;
    projektId: any;
}

export interface CreateTaskDrawerFormProps {
    projectId: any;
    onTaskAdded: () => void; // Callback wywoływany po dodaniu zadania

}