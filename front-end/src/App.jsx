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
import InvoiceDetailsPage from "./Pages/InvoiceDetailsPage";
import AboutPage from "./Pages/About";
import StaffPage from "./Pages/Staff";
import { staffLoader } from "./loaders/staffLoader";

import Staffs from "./Pages/Dashboard/Staffs";
import Customers from "./Pages/Dashboard/Customers";
import Appointments from "./Pages/Dashboard/Appointments";
import Services from "./Pages/Dashboard/Services";
import Booking from "./Pages/Booking/Booking";
import DashBoard from "./Pages/Dashboard/DashBoard";
import Supplier from "./Pages/Dashboard/Supplier/Supplier";
import Products from "./Pages/Dashboard/Products/Products";
import FeedbackReports from "./Pages/Dashboard/FeedbackReports";
import CustomerPreference from "./Pages/Dashboard/CustomerPreference";
import { homeLoader } from "./loaders/homeLoader";
import {
  protectedUserLoader,
  changePasswordAction,
  updateProfileAction,
} from "@/loaders/userLoaders";

import MainPage from "./Pages/MainPage";
import Layout from "./Layouts/mainLayouts";
import DashBoardLayouts from "./Layouts/DashBoardLayouts";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <MainPage />, loader: homeLoader },
      { path: "services", element: <ServicesPage />, loader: homeLoader },
      { path: "booking", element: <Booking />, loader: homeLoader },
      {
        path: "about-us",
        element: <AboutPage />,
        loader: homeLoader,
      },
      {
        path: "staff",
        element: <StaffPage />,
        loader: staffLoader,
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
        path: "user/invoice-details",
        element: <InvoiceDetailsPage />,
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
        path: "staff/invoice-details",
        element: <InvoiceDetailsPage />,
        loader: protectedUserLoader,
      },
      {
        path: "staff/notifications",
        element: <NotificationsPage />,
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
      { index: true, element: <DashBoard /> },
      { path: "services", element: <Services /> },
      { path: "staffs", element: <Staffs /> },
      { path: "customers", element: <Customers /> },
      { path: "customer-preference", element: <CustomerPreference /> },
      { path: "feedback-reports", element: <FeedbackReports /> },
      { path: "inventory", element: <Products /> },
      {
        path: "customers",
        element: <Customers />,
      },
      {
        path: "inventory",
        element: <Products />,
      },
      {
        path: "supplier",
        element: <Supplier />,
      },
      { path: "appointments", element: <Appointments /> },
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
