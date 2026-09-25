import { createBrowserRouter, RouterProvider } from "react-router-dom"; // fix: should be 'react-router-dom'
import { lazy, Suspense, useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { onAuthStateChanged } from "firebase/auth";

// Store
import { store, persistor } from "./features/store";

// Components
import Layout from "./components/Layout";
import Auth from "./components/Auth";
import Spinner from "./components/Spinner";
import RequireAuth from "./components/RequireAuth";
import { auth, isVerifiedUser } from "./Firebase/config";
import { clearAdmin, setAdmin } from "./features/slices/adminReducer";
import { clearFinalizedOrder } from "./features/slices/orderSlice";

// Lazy-loaded Pages
const SignUp = lazy(() => import("./pages/SignUp"));
const Landing = lazy(() => import("./pages/Landing"));
const SpaceScreen = lazy(() => import("./pages/SpaceScreen"));
const CreateSpacePage = lazy(() => import("./pages/CreateSpacePage"));
const FinalizedOrderPage = lazy(() => import("./pages/FinalizedOrderPage"));
const ComponentsTestPage = lazy(() => import("./pages/ComponentsTestPage"));
const AboutUsPage = lazy(() => import("./pages/AboutUsPage"));
const ContactUsPage = lazy(() => import("./pages/ContactUsPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function AuthSessionSync() {
  const dispatch = useDispatch();
  const adminId = useSelector((state) => state.admin.id);

  useEffect(() => onAuthStateChanged(auth, (user) => {
    if (isVerifiedUser(user)) {
      if (adminId && adminId !== 0 && adminId !== user.uid) {
        dispatch(clearFinalizedOrder());
      }
      dispatch(setAdmin({ id: user.uid }));
    } else {
      dispatch(clearAdmin());
      dispatch(clearFinalizedOrder());
      if (user) auth.signOut();
    }
  }), [adminId, dispatch]);

  return null;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <Auth />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: "signin",
        element: <Auth />,
      },
      {
        path: "home",
        element: <RequireAuth><Landing /></RequireAuth>,
      },
      {
        path: "checkout/:spaceId",
        element: <SpaceScreen />,
      },
      {
        path: "create-space",
        element: <RequireAuth><CreateSpacePage /></RequireAuth>,
      },
      {
        path: "finalized-order/:spaceId",
        element: <RequireAuth><FinalizedOrderPage /></RequireAuth>,
      },
      {
        path: "finalized-order",
        element: <RequireAuth><FinalizedOrderPage /></RequireAuth>,
      },
      // Developer playground; not shipped in production builds.
      ...(import.meta.env.DEV
        ? [
            {
              path: "components-test",
              element: <RequireAuth><ComponentsTestPage /></RequireAuth>,
            },
          ]
        : []),
      {
        path: "space/:spaceId",
        element: <SpaceScreen />,
      },
      {
        path: "about-us",
        element: <AboutUsPage />,
      },
      {
        path: "contact-us",
        element: <ContactUsPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<Spinner />} persistor={persistor}>
        <AuthSessionSync />
        <Suspense fallback={<Spinner />}>
          <RouterProvider router={router} />
        </Suspense>
      </PersistGate>
    </Provider>
  );
}

export default App;
