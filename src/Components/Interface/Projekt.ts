export interface Projekt {
    id: number;
    name: string;
    description: string;
    endDate: string;
    startDate: string;
    modificationTime: string;
}
export interface ProjektUpdatedTO {
    projectId: string;
    name: string;
    description: string;
}
export interface ProjektUpdate {
    name: string;
    description: string;
}

export interface ProjectFile {
    id: string;
    fileName: string;
    url: string;
}
