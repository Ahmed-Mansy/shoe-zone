import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ requireAdmin = false }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        // التحقق من التوكن عبر طلب إلى نقطة نهاية تتطلب مصادقة
        const response = await axios.get(
          "http://127.0.0.1:8000/api/users/profile/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsAuthenticated(true);
        // تحقق مما إذا كان المستخدم إداريًا (is_staff)
        setIsAdmin(response.data.user.is_staff);
      } catch (err) {
        setIsAuthenticated(false);
        localStorage.removeItem("token"); // إزالة التوكن غير الصالح
      }
    };

    verifyToken();
  }, []);

  // أثناء التحقق من التوكن
  if (isAuthenticated === null) {
    return <div className="text-center py-10">Loading...</div>;
  }

  // إذا كان المسار يتطلب صلاحيات إدارية ولكن المستخدم ليس إداريًا
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace state={{ fromProtected: true, message: "Unauthorized access. Admin privileges required." }} />;
  }

  // إذا لم يكن المستخدم مصادقًا
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ fromProtected: true, message: "Please log in to access this page." }} />;
  }

  // إذا كان المستخدم مصادقًا (وإداري إذا لزم الأمر)، اعرض المحتوى
  return <Outlet />;
};

export default ProtectedRoute;