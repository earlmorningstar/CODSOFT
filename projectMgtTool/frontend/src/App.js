import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Splashscreen from "./pages/Splashscreen";
import Dashboard from "./pages/Dashboard";
import CreateProject from "./pages/CreateProject";
import EditProject from "./pages/EditProject";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Splashscreen />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
    },
    {
      path: "/create-project",
      element: <CreateProject />,
    },
    {
      path: "/edit-project/:id",
      element: <EditProject />,
    },
    {
      path: "/projects/:projectId",
      element: <ProjectDetailsPage />,
    },
  ],
  {
    future: {
      v7_skipActionErrorRevalidation: true,
    },
  }
);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
