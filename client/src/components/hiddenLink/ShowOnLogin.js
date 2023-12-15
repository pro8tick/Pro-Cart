import { useSelector } from "react-redux";

function ShowOnLogin({ children }) {
  const { isLoggedIn } = useSelector((state) => state.auth);
  if (isLoggedIn) {
    return children;
  }
  return null;
}
function ShowOnLogOut({ children }) {
  const { isLoggedIn } = useSelector((state) => state.auth);
  if (!isLoggedIn) {
    return children;
  }
  return null;
}
function ShowOnAdmin({ children }) {
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  if (isLoggedIn && user && user.role === "admin") {
    return children;
  }
  return null;
}

export { ShowOnLogin, ShowOnLogOut, ShowOnAdmin };
