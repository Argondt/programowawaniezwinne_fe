import { Suspense } from "react";
import { CircularProgress } from "@mui/material";
import { ChatController } from "./Components/Chat/ChatController";
import Dashboar from "./Components/Dashboar";
import { AppBarMenu } from "./Components/AppBar";
// const MainApp = lazy(() => import('./Main'));

export default function App() {
  return (
    <div>
      <AppBarMenu />
      <Suspense fallback={<CircularProgress size={120} />}>
        <Dashboar />
      </Suspense>
    </div>
  );
}
