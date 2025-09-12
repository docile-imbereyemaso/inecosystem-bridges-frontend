import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { useAuth } from "../../../lib/useAuth";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout,user } = useAuth();

 console.log(user);
  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }
  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dropdown-toggle dark:text-gray-400"
      >
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
  <img
    src={`https://ui-avatars.com/api/?name=${user?.first_name}+${user?.last_name}&background=0D8ABC&color=fff&size=128`}
    alt={`${user?.first_name} ${user?.last_name}`}
    className="h-11 w-11 rounded-full"
  />
</span>

        <span className="block mr-1 font-medium text-theme-sm">{user?.email}</span>
        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <div>
       
       
        </div>

        <div className="divide-y-2 divide-gray-200 dark:divide-gray-800"></div>
          {
            isAuthenticated && <span className="mr-auto bg-red-400 px-4 md:px-5 lg:px-6 py-2 md:py-1.5 lg:py-2 
            rounded-full font-semibold hover:bg-red-400/80 transition duration-300 ease-in-out transform hover:scale-105 text-base md:text-sm lg:text-base">
            <button onClick={logout} className="text-gray-600 dark:text-gray-900 cursor-pointer">Logout</button>
         </span>
          }
      </Dropdown>
    </div>
  );
}
