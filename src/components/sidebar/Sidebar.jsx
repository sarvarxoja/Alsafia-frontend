import "./sidebar.css";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import Logo from "../../../public/logo.png";
import { Home, Package, Users, LogOut, Database, User } from "lucide-react";
import axios from "axios";

const Sidebar = ({ myData }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { title: "Bosh sahifa", icon: Home, link: "/home", role: ["admin", "pm"] },
    { title: "Dashboard", icon: Package, link: "/dashboard", role: ["admin"] },
    {
      title: "Xodimlar",
      icon: Users,
      link: "/employees",
      role: ["admin", "hr"],
    },
    {
      title: "Adminlar",
      icon: Database,
      link: "/site/admins",
      role: ["admin"],
    },
  ];

  async function handleExit() {
    try {
      await axios.post("/auth/logout");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div
      className={`${
        isCollapsed ? "w-16" : "w-64"
      } min-h-screen bg-gray-800 text-white transition-all duration-300 ease-in-out relative main_sidebar`}
    >
      <div className="p-4 flex items-center justify-center border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Link to={"/home"}>
            <img src={Logo} alt="Logo" className="alsafia_sidebar_logo" />
          </Link>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="mt-4">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.link}
            className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            style={{
              display: item.role.includes(myData.role) || myData.supperAdmin ? "" : "none",
            }}
          >
            <item.icon className="h-5 w-5" />
            {!isCollapsed && <span className="ml-3">{item.title}</span>}
          </Link>
        ))}
      </nav>
      <div className="absolute bottom-0 w-full border-t border-gray-700">
        <Link
          to={`/admin/${myData.id}`}
          className="flex items-center w-full px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
        >
          <User className="h-5 w-5" />
          {!isCollapsed && <span className="ml-3">Profil</span>}
        </Link>
        <button
          className="flex items-center w-full px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
          onClick={() => handleExit()}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span className="ml-3">Chiqish</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
