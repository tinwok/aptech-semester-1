import { createBrowserRouter } from "react-router-dom";
import Layout from "@/Layouts/mainLayouts";
import HomePage from "@/Pages/Home";
import { homeLoader } from "@/loaders/homeLoader";
import MainPage from "@/Pages/MainPage";

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
]);

export default router;
