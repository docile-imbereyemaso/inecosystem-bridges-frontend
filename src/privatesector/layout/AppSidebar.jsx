import { useCallback } from "react";
import { Link, useLocation } from "react-router";
import { FiBook, FiBarChart2 } from "react-icons/fi";

import { FaThLarge, FaUserCircle, FaBox, FaEllipsisH, FaUsers } from "react-icons/fa";
import { useSidebar } from "../context/SidebarContext";
import { NotificationBell } from "../../pages/NotificationPage";


const navItems= [
  {
    icon: <FaThLarge />,
    name: "Private sector Dashboard",
    path: "/privateSector/profile",
  },
  {
    icon: <FaUserCircle />,
    name: "Private sector Profile",
    path: "/privateSector/profile",
  },
  {
    icon: <FaBox />,
    name: "Job Board",
    path: "/privateSector/jobBoard",
  },
  {
    icon: <FiBarChart2 />,
    name: "Analytics & Insights",
    path: "/privateSector/analytics",
  },
  {
    icon: <FiBook />,
    name: "Internships and Training",
    path: "/privateSector/Internships",
  },
  {
    icon: <FiBook />,
    name: "Contributions",
    path: "/privateSector/contributions",
  },
  {
    icon: <FaUsers />,
    name: "My Community",
    path: "/privateSector/community",
  },
   {
    icon: <NotificationBell/>,
    name: "Notifications",
    path: "/user/notifications",
  },
];

const AppSidebar= () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const isActive = useCallback(
    (path) => location.pathname === path,
    [location.pathname]
  );

  const renderMenuItems = (items) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav) => (
        <li key={nav.name}>
          <Link
            to={nav.path}
            className={`menu-item group ${
              isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
            }`}
          >
            <span
              className={`menu-item-icon-size ${
                isActive(nav.path)
                  ? "menu-item-icon-active"
                  : "menu-item-icon-inactive"
              }`}
            >
              {nav.icon}
            </span>
            {(isExpanded || isHovered || isMobileOpen) && (
              <span className="menu-item-text">{nav.name}</span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/privateSector/profile">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <p>In ecosystem logo</p>
            </>
          ) : (
           <p>logo</p>
          )}
        </Link>
      </div>

      {/* Menu */}
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <FaEllipsisH className="size-6" />
                )}
              </h2>
              {renderMenuItems(navItems)}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
