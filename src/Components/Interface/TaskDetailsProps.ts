import {ProjectTask} from "./ProjectTask";

export interface TaskDetailsProps {
    open: boolean;
    onClose: () => void;
    task: ProjectTask | null;
}
