import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainPage from "./Pages/MainPage";
import Layout from "./Layouts/mainLayouts";
import "./App.css";
import DashBoardLayouts from "./Layouts/DashBoardLayouts";
import DashBoardMain from "./Pages/DashBoardMain";

import ServicesPage from "./Pages/ServicesPage";
import ProfilePage from "./Pages/ProfilePage";
import AppointmentsPage from "./Pages/AppointmentsPage";
import ServiceHistoryPage from "./Pages/ServiceHistoryPage";
import OrdersPage from "./Pages/OrdersPage";
import PromotionsPage from "./Pages/PromotionsPage";
import NotificationsPage from "./Pages/NotificationsPage";
import ChangePasswordPage from "./Pages/ChangePasswordPage";

import {
  publicUserLoader,
  protectedUserLoader,
  changePasswordAction,
  updateProfileAction,
} from "@/loaders/userLoaders";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <MainPage />,
        loader: publicUserLoader,
      },
      {
        path: "services",
        element: <ServicesPage />,
        loader: publicUserLoader,
      },
      {
        path: "profile",
        element: <ProfilePage />,
        loader: protectedUserLoader,
        action: updateProfileAction,
      },
      {
        path: "appointments",
        element: <AppointmentsPage />,
        loader: protectedUserLoader,
      },
      {
        path: "service-history",
        element: <ServiceHistoryPage />,
        loader: protectedUserLoader,
      },
      {
        path: "orders",
        element: <OrdersPage />,
        loader: protectedUserLoader,
      },
      {
        path: "promotions",
        element: <PromotionsPage />,
        loader: protectedUserLoader,
      },
      {
        path: "notifications",
        element: <NotificationsPage />,
        loader: protectedUserLoader,
      },
      {
        path: "change-password",
        element: <ChangePasswordPage />,
        loader: publicUserLoader,
        action: changePasswordAction,
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
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
