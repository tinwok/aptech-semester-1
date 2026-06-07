import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import MainPage from "./Pages/MainPage";
import Layout from "./Layouts/mainLayouts";
import "./App.css";
import DashBoardLayouts from "./Layouts/DashBoardLayouts";
import DashBoardMain from "./Pages/DashBoardMain";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <MainPage />,
        // loader: exampleLoader,
      },
      // {
      //   element: <ProtectedRoute />,
      //   children: [
      //     {
      //       path: "",
      //       element: <Example />,
      //       loader: exampleLoader,
      //       action: exampleAction,
      //     },
      //   ],
      // },
    ],
  },
  {
    path: "/dashboard",
    element: <DashBoardLayouts />,
    children: [
      {
        index: true,
        element: <DashBoardMain />,
        // loader: exampleLoader,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
