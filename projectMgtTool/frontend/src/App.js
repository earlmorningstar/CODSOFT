import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const router = createBrowserRouter(
  [
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
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
}

export default App;
