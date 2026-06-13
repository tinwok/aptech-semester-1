import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";

import ServicesPage from "./Pages/ServicesPage";
import UserPortalPage from "./Pages/UserPortalPage";
import ProfilePage from "./Pages/ProfilePage";
import PreferencesPage from "./Pages/PreferencesPage";
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

import Staffs from "./Pages/Dashboard/Staffs";

import Customers from "./Pages/Dashboard/Customers";
import Appointments from "./Pages/Dashboard/Appointments";
import Services from "./Pages/Dashboard/Services";

import MainPage from "./Pages/MainPage";
import Layout from "./Layouts/mainLayouts";
import DashBoardLayouts from "./Layouts/DashBoardLayouts";
import DashBoardMain from "./Pages/Dashboard/DashBoardMain";
import ProtectedRoute from "./Pages/ProtectedRoute";

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
        loader: publicUserLoader,
      },
      {
        path: "services",
        element: <ServicesPage />,
        loader: publicUserLoader,
      },
      {
        path: "user",
        element: <UserPortalPage />,
        loader: protectedUserLoader,
      },
      {
        path: "user/profile",
        element: <ProfilePage />,
        loader: protectedUserLoader,
        action: updateProfileAction,
      },
      {
        path: "user/preferences",
        element: <PreferencesPage />,
        loader: protectedUserLoader,
      },
      {
        path: "user/appointments",
        element: <AppointmentsPage />,
        loader: protectedUserLoader,
      },
      {
        path: "user/service-history",
        element: <ServiceHistoryPage />,
        loader: protectedUserLoader,
      },
      {
        path: "user/orders",
        element: <OrdersPage />,
        loader: protectedUserLoader,
      },
      {
        path: "user/promotions",
        element: <PromotionsPage />,
        loader: protectedUserLoader,
      },
      {
        path: "user/notifications",
        element: <NotificationsPage />,
        loader: protectedUserLoader,
      },
      {
        path: "user/change-password",
        element: <ChangePasswordPage />,
        loader: protectedUserLoader,
        action: changePasswordAction,
      },

      {
        path: "staff",
        element: <UserPortalPage />,
        loader: protectedUserLoader,
      },
      {
        path: "staff/profile",
        element: <ProfilePage />,
        loader: protectedUserLoader,
        action: updateProfileAction,
      },
      {
        path: "staff/appointments",
        element: <AppointmentsPage />,
        loader: protectedUserLoader,
      },
      {
        path: "staff/service-history",
        element: <ServiceHistoryPage />,
        loader: protectedUserLoader,
      },
      {
        path: "staff/change-password",
        element: <ChangePasswordPage />,
        loader: protectedUserLoader,
        action: changePasswordAction,
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
