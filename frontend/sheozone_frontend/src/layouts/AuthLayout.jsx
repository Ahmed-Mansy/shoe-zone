import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <div className="w-full min-h-screen h-full flex items-center justify-center bg-light-gray">
      <div className="min-w-[450px] w-1/4 rounded-xl shadow-md bg-light">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
