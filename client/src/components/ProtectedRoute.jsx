import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/authContext";

const ProtectedRoute = ({ children }) => {
    const { userInfo } = useAuthContext();

    if (!userInfo) {
        // Not logged in → redirect to /login
        return <Navigate to="/login" replace />;
    }

    return children; // Allow access
};

export default ProtectedRoute;
