import { TaskStatus } from "../TaskInterface";

export const getChipColor = (status: string | undefined) => {
    switch (status) {
        case TaskStatus.TO_DO:
            return 'warning';
        case TaskStatus.IN_PROGRESS:
            return 'info';
        case TaskStatus.DONE:
            return 'success';
        default:
            return 'default';
    }
};
