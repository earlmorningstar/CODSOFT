import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
import Splashscreen from "./pages/Splashscreen";

const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CreateProject = lazy(() => import("./pages/CreateProject"));
const EditProject = lazy(() => import("./pages/EditProject"));
const ProjectDetailsPage = lazy(() => import("./pages/ProjectDetailsPage"));
const Profile = lazy(() => import("./pages/Profile"));
const ScrollPosition = lazy(() => import("./hooks/ScrollPosition"));
const ErrorPage = lazy(() => import("./pages/ErrorPage"));
const Fallback = lazy(() => import("./components/Fallback"));

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Splashscreen />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/signup",
      element: (
        <Suspense fallback={<Fallback />}>
          <Signup />
        </Suspense>
      ),
      errorElement: (
        <Suspense fallback={<Fallback />}>
          <ErrorPage />
        </Suspense>
      ),
    },
    {
      path: "/login",
      element: (
        <Suspense fallback={<Fallback />}>
          <Login />
        </Suspense>
      ),
      errorElement: (
        <Suspense fallback={<Fallback />}>
          <ErrorPage />
        </Suspense>
      ),
    },
    {
      path: "/dashboard",
      element: (
        <Suspense fallback={<Fallback />}>
          <Dashboard />
        </Suspense>
      ),
      errorElement: (
        <Suspense fallback={<Fallback />}>
          <ErrorPage />
        </Suspense>
      ),
    },
    {
      path: "/create-project",
      element: (
        <Suspense fallback={<Fallback />}>
          <CreateProject />
        </Suspense>
      ),
      errorElement: (
        <Suspense fallback={<Fallback />}>
          <ErrorPage />
        </Suspense>
      ),
    },
    {
      path: "/edit-project/:id",
      element: (
        <Suspense fallback={<Fallback />}>
          <EditProject />
        </Suspense>
      ),
      errorElement: (
        <Suspense fallback={<Fallback />}>
          <ErrorPage />
        </Suspense>
      ),
    },
    {
      path: "/projects/:projectId",
      element: (
        <Suspense fallback={<Fallback />}>
          <ProjectDetailsPage />
        </Suspense>
      ),
      errorElement: (
        <Suspense fallback={<Fallback />}>
          <ErrorPage />
        </Suspense>
      ),
    },
    {
      path: "/profile",
      element: (
        <Suspense fallback={<Fallback />}>
          <Profile />
        </Suspense>
      ),
      errorElement: (
        <Suspense fallback={<Fallback />}>
          <ErrorPage />
        </Suspense>
      ),
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
    <>
      <Suspense fallback={<Fallback />}>
        <RouterProvider router={router}>
          <ScrollPosition />
        </RouterProvider>
      </Suspense>
    </>
  );
};

export default App;
