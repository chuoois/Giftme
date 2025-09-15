import { Outlet } from "react-router-dom";
import { Header } from "./header-admin-layout";
import { Sidebar } from "./siderbar-admin-layut";
import { useContext } from "react";
import { AuthContext } from "@/hook/auth/AuthProvider"; 

export const AdminLayout = () => {
  const { logout } = useContext(AuthContext); 

  return (
    <div>
      <Header logout={logout} /> 
      <div className="flex">
        <Sidebar />
        <Outlet />
      </div>
    </div>
  );
};