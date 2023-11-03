import { Suspense } from "react";
import { CircularProgress } from "@mui/material";
import Dashboar from "./Components/Dashboar";
import { AppBarMenu } from "./Components/AppBar";
import { SideBar } from "./Components/Interface/SideBar";
import { ChatController } from "./Components/Chat/ChatController";

import {
  Outlet,
  Route,
  Routes,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

// const MainApp = lazy(() => import('./Main'));

export default function App() {
  return (
    <div>
      <AppBarMenu />
      <SideBar />
      <Suspense fallback={<CircularProgress size={120} />}>
        <Dashboar />
      </Suspense>
      {/* <Routes>
        <Route path="/" element={<Dashboar />} />

        <Route path="/chat" element={<ChatController />}></Route>
      </Routes> */}
    </div>
  );
}
