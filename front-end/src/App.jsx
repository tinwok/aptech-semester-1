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

import PaymentPage from "./Pages/PaymentPage";
import InvoicesPage from "./Pages/InvoicesPage";
import InvoiceDetailPage from "./Pages/InvoiceDetailPage";

import AboutPage from "./Pages/About";

import Staffs from "./Pages/Dashboard/Staffs";
import Customers from "./Pages/Dashboard/Customers";
import Appointments from "./Pages/Dashboard/Appointments";
import Services from "./Pages/Dashboard/Services";
import Feedbacks from "./Pages/Dashboard/Feedbacks";
import CustomerPreferences from "./Pages/Dashboard/CustomerPreferences";

import Booking from "./Pages/Booking/Booking";
import DashBoard from "./Pages/Dashboard/DashBoard";
import Inventory from "./Pages/Dashboard/Inventory";
import Products from "./Pages/Dashboard/Products/Products";

import MainPage from "./Pages/MainPage";
import Layout from "./Layouts/mainLayouts";
import DashBoardLayouts from "./Layouts/DashBoardLayouts";

import {
  protectedUserLoader,
  changePasswordAction,
  updateProfileAction,
} from "@/loaders/userLoaders";

import { homeLoader } from "./loaders/homeLoader";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <MainPage />, loader: homeLoader },

      {
        path: "services",
        element: <ServicesPage />,
        loader: homeLoader,
      },

      {
        path: "booking",
        element: <Booking />,
        loader: homeLoader,
      },

      {
        path: "about-us",
        element: <AboutPage />,
        loader: homeLoader,
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
        path: "user/payment/:appointmentId",
        element: <PaymentPage />,
        loader: protectedUserLoader,
      },

      {
        path: "user/invoices",
        element: <InvoicesPage />,
        loader: protectedUserLoader,
      },

      {
        path: "user/invoices/:invoiceId",
        element: <InvoiceDetailPage />,
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
    element: <DashBoardLayouts />,
    loader: protectedUserLoader,
    children: [
      {
        index: true,
        element: <DashBoard />,
      },

      {
        path: "appointments",
        element: <Appointments />,
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
        path: "customer-preferences",
        element: <CustomerPreferences />,
      },

      {
        path: "inventory",
        element: <Products />,
      },

      {
        path: "feedbacks",
        element: <Feedbacks />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </>
  );
}

export default App;
