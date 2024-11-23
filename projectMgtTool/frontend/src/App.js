import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Splashscreen from "./pages/Splashscreen";
import Dashboard from "./pages/Dashboard";
import CreateProject from "./pages/CreateProject";
import EditProject from "./pages/EditProject";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import Profile from "./pages/Profile";
import ScrollPosition from "./hooks/ScrollPosition";
import ErrorPage from "./pages/ErrorPage";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Splashscreen />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/signup",
      element: <Signup />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/login",
      element: <Login />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/create-project",
      element: <CreateProject />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/edit-project/:id",
      element: <EditProject />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/projects/:projectId",
      element: <ProjectDetailsPage />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/profile",
      element: <Profile />,
      errorElement: <ErrorPage />,
    },
  ],
  {
    future: {
      v7_skipActionErrorRevalidation: true,
    },
  }
);

const App = () => {
  return (
    <RouterProvider router={router}>
      <ScrollPosition />
    </RouterProvider>
  );
};

export default App;
