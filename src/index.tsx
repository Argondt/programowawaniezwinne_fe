import React, {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import AuthenticationProvider from "./Providers/AuthenticationProvider";
import {RouterProvider} from "react-router-dom";
import {router} from "./Components/Routes/Routes";
import {QueryClient, QueryClientProvider} from 'react-query'

// window.fetch = fetchInterceptor;

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);
const queryClient = new QueryClient();

root.render(
    <AuthenticationProvider>
        <StrictMode>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router}/>
            </QueryClientProvider>
        </StrictMode>
    </AuthenticationProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
