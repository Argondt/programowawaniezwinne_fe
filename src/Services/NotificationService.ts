// useNotificationService.ts
import { useSnackbar, OptionsObject } from 'notistack';

const useNotificationService = () => {
    const { enqueueSnackbar } = useSnackbar();

    const notify = (message: string, options?: OptionsObject) => {
        enqueueSnackbar(message, options);
    };

    const services = {
        success: (message: string) => notify(message, { variant: 'success' }),
        error: (message: string) => notify(message, { variant: 'error' }),
        info: (message: string) => notify(message, { variant: 'info' }),
        warning: (message: string) => notify(message, { variant: 'warning' }),
    };

    return { notification: services };
};

export default useNotificationService;
