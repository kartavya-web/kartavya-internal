import React from "react";
import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiUserPlus,
  FiUsers,
  FiLayers,
  FiSettings,
  FiList,
  FiChevronRight
} from "react-icons/fi";

const menuItems = [
  { to: "/", label: "Home", icon: <FiHome /> },
  { to: "/enter-student-details", label: "Add Student", icon: <FiUserPlus /> },
  { to: "/student-spreadsheet", label: "Students", icon: <FiUsers /> },
  {
    label: "Allotment",
    icon: <FiLayers />,
    children: [
      { to: "/allotment", label: "Allotment Home", icon: <FiChevronRight /> },
      { to: "/allotment/action", label: "Allot Child", icon: <FiChevronRight /> },
      {
        to: "/allotment/addDonationsToCSM",
        label: "Donate to CSM",
        icon: <FiChevronRight />,
      },
    ],
  },
  { to: "/sponsors", label: "Sponsors", icon: <FiList /> },
  { to: "/hello", label: "Test Sample", icon: <FiSettings /> },
];

export default function Navbar() {
  return (
    <aside className="w-64 min-h-screen bg-white border-r shadow-sm">
      <div className="p-6 border-b">
        <img src="/kartavya_logo.png" alt="" />
      </div>

      <nav className="p-4 space-y-2">
        {menuItems.map((item, index) =>
          item.children ? (
            <div key={index} className="space-y-1">
              <div className="font-semibold text-gray-700 flex items-center gap-2">
                {item.icon}
                {item.label}
              </div>

              <div className="ml-6 space-y-1">
                {item.children.map((child, cIndex) => (
                  <NavLink
                    key={cIndex}
                    to={child.to}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-2 py-1 rounded text-sm ${
                        isActive ? "bg-indigo-50 text-indigo-600" : "text-gray-600"
                      }`
                    }
                  >
                    {child.icon}
                    {child.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ) : (
            <NavLink
              key={index}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded text-sm font-medium ${
                  isActive ? "bg-indigo-50 text-indigo-600" : "text-gray-700 hover:bg-gray-50"
                }`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          )
        )}
      </nav>
    </aside>
  );
}
