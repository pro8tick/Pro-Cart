import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedAdmin = ({ children }) => {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    return <Navigate to="/login"></Navigate>;
  }
  if (user && user.role !== "admin") {
    return <Navigate to="/shop" replace></Navigate>;
  }
  return children;
};

export default ProtectedAdmin;
