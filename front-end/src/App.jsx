import Staffs from "./Pages/Dashboard/Staffs";

import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { homeLoader } from "@/loaders/homeLoader";

import Customers from "./Pages/Dashboard/Customers";
import Appointments from "./Pages/Dashboard/Appointments";
import Services from "./Pages/Dashboard/Services";

import MainPage from "./Pages/MainPage";
import Layout from "./Layouts/mainLayouts";
import DashBoardLayouts from "./Layouts/DashBoardLayouts";
import DashBoardMain from "./Pages/Dashboard/DashBoardMain";
import ProtectedRoute from "./Pages/ProtectedRoute";
import "./App.css";
import AuthPage from "./Pages/Login/AuthPage";
import { Toaster } from "sonner";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <MainPage />,
        loader: homeLoader,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashBoardLayouts />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashBoardMain />,
      },
      {
        path: "services",
        element: <Services />,
      },
      {
        path: "staffs",
        element: <Staffs />,
      },

      {
        path: "customers",
        element: <Customers />,
      },

      {
        path: "appointments",
        element: <Appointments />,
      },
    ],
  },
  {
    path: "login",
    element: <AuthPage />,
  },
]);

function App() {
  return (
    <>
      {" "}
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </>
  );
}

export default App;
