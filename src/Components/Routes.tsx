import {createBrowserRouter} from "react-router-dom";
import Dashboar from "./Dashboar";
import {ChatController} from "./Chat/ChatController";
import App from "../App";
import KanbanBoard from './KanbanBoard';
import UserList from "./UserList";
import React from "react";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {path: "", element: <Dashboar/>},
            {path: "chat", element: <ChatController/>},
            {path: "users", element: <UserList />},
            {path: "projekty/:id", element: <KanbanBoard/>},
            //   {
            //     path: "company/:ticker",
            //     element: <CompanyPage />,
            //     children: [
            //       { path: "company-profile", element: <CompanyProfile /> },
            //       { path: "income-statement", element: <IncomeStatement /> },
            //       { path: "balance-sheet", element: <BalanceSheet /> },
            //       { path: "cashflow-statement", element: <CashflowStatement /> },
            //       { path: "historical-dividend", element: <HistoricalDividend /> },
            //     ],
            //   },
        ],
    },
]);