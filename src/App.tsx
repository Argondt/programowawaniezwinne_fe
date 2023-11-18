import { Suspense } from "react";
import { CircularProgress } from "@mui/material";
import { AppBarMenu } from "./Components/AppBar";

import { Outlet } from "react-router-dom";

// const MainApp = lazy(() => import('./Main'));

export default function App() {
  return (
    <>
      <AppBarMenu />
      <Suspense fallback={<CircularProgress size={120} />}>
        <Outlet />
      </Suspense>
    </>
  );
}
