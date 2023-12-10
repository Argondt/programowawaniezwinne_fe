import { Suspense } from "react";
import { CircularProgress } from "@mui/material";
import { AppBarMenu } from "./Components/Navbar/AppBar";

import { Outlet } from "react-router-dom";
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
