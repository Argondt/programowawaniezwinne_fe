import {createBrowserRouter} from "react-router-dom";
import Dashboar from "../Dashborad/Dashboar";
import {ChatController} from "../Chat/ChatController";
import App from "../../App";
import KanbanBoard from '../Task/KanbanBoard';
import UserList from "../users/UserList";
import React from "react";
import UserDetails from "../users/UserDetails";
import UserDetailsView from "../users/UserDetailsView";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {path: "", element: <Dashboar/>},
            {path: "chat", element: <ChatController/>},
            {path: "users", element: <UserList />},
            {path: "users/:id", element: <UserDetailsView />},
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