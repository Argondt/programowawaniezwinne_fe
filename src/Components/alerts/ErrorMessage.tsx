import React from 'react';
import {Alert, Stack} from '@mui/material';

interface ErrorMessageProps {
    message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({message}) => {
    return (
        <Stack sx={{width: '100%', mt: 2}}>
            <Alert severity="error">{message}</Alert>
        </Stack>
    );
};

export default ErrorMessage;
