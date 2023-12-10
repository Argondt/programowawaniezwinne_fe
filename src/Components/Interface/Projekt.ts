export interface Projekt {
    id: number;
    name: string;
    description: string;
    endDate: string;
    startDate: string;
    modificationTime: string;
}

export interface ProjectFile {
    id: string;
    fileName: string;
    url: string;
}
