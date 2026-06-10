import Staffs from "./Pages/Dashboard/Staffs";
import { staffLoader } from "./Pages/Dashboard/staffLoader";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import Customers from "./Pages/Dashboard/Customers";
import Appointments from "./Pages/Dashboard/Appointments";

// import { customerLoader } from "./Pages/Dashboard/customerLoader";
// import { appointmentLoader } from "./Pages/Dashboard/appointmentLoader";
import MainPage from "./Pages/MainPage";
import Layout from "./Layouts/mainLayouts";

import DashBoardLayouts from "./Layouts/DashBoardLayouts";
import DashBoardMain from "./Pages/Dashboard/DashBoardMain";

import { dashboardLoader } from "./Pages/Dashboard/loader";

import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
    ],
  },

  {
    path: "/dashboard",
    element: <DashBoardLayouts />,
    children: [
      {
        index: true,
        element: <DashBoardMain />,
        loader: dashboardLoader,
      },

      {
        path: "staffs",
        element: <Staffs />,
        loader: staffLoader,
      },

      {
        path: "customers",
        element: <Customers />,
        // loader: customerLoader,
      },

      {
        path: "appointments",
        element: <Appointments />,
        // loader: appointmentLoader,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
