import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import AuthScreen from "../auth/AuthScreen";

export const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/auth", element: <AuthScreen /> },
]);