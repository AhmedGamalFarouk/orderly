import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth, isVerifiedUser } from "../Firebase/config";
import { clearAdmin, setAdmin } from "../features/slices/adminReducer";
import Spinner from "./Spinner";

export default function RequireAuth({ children }) {
  const adminId = useSelector((state) => state.admin.id);
  const location = useLocation();
  const dispatch = useDispatch();
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      if (isVerifiedUser(user)) {
        dispatch(setAdmin({ id: user.uid }));
      } else {
        dispatch(clearAdmin());
        if (user) auth.signOut();
      }
      setSessionReady(true);
    });
  }, [dispatch]);

  if (!sessionReady) {
    return <Spinner />;
  }

  if (!isVerifiedUser(auth.currentUser) || !adminId || adminId === 0) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  return children;
}
