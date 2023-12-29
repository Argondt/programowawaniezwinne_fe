// NotificationContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import useNotificationService from "../Services/NotificationService";

// Define an interface for your notification context
interface NotificationContextType {
    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
    warning: (message: string) => void;
}

// Create the context with the expected type
const NotificationContext = createContext<NotificationContextType | null>(null);

// Custom hook to use the notification context
export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

// Define the type for the props
interface NotificationProviderProps {
    children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
    const { notification } = useNotificationService();

    return (
        <NotificationContext.Provider value={notification}>
            {children}
        </NotificationContext.Provider>
    );
};
