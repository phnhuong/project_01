import React from 'react';
import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';
import { 
  FaHome, 
  FaUserGraduate, 
  FaClipboardList, 
  FaChartBar, 
  FaCog, 
  FaSignOutAlt,
  FaChalkboardTeacher,
  FaBook,
  FaUsers,
  FaUserFriends,
  FaBuffer,
  FaSearch
} from 'react-icons/fa';

import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { logout } = useAuth();
  const navItems = [
    { path: '/', label: 'Dashboard', icon: FaHome },
    { path: '/students', label: 'Học sinh', icon: FaUserGraduate },
    { path: '/explorer', label: 'Khám phá', icon: FaSearch },
    { path: '/scores/input', label: 'Nhập điểm', icon: FaClipboardList },
    { path: '/reports', label: 'Báo cáo', icon: FaChartBar },
    { path: '/settings', label: 'Cài đặt', icon: FaCog },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col z-10 transition-transform duration-300">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <span className="text-xl font-bold text-blue-600">SMS System</span>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => clsx(
              "flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors",
              isActive 
                ? "bg-blue-50 text-blue-700" 
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            )}
          >
            <item.icon className={clsx("w-5 h-5 mr-3", )} />
            {item.label}
          </NavLink>
        ))}

        <div className="mt-6 mb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Quản trị hệ thống
        </div>
        
        <NavLink
            to="/admin/academic-years"
            className={({ isActive }) => clsx(
              "flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors",
              isActive 
                ? "bg-blue-50 text-blue-700" 
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            )}
        >
            <FaCog className="w-5 h-5 mr-3" />
            Năm học
        </NavLink>
        <NavLink
            to="/admin/classes"
            className={({ isActive }) => clsx(
              "flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors",
              isActive 
                ? "bg-blue-50 text-blue-700" 
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            )}
        >
            <FaChalkboardTeacher className="w-5 h-5 mr-3" />
            Lớp học
        </NavLink>
        <NavLink
            to="/admin/grades"
            className={({ isActive }) => clsx(
              "flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors",
              isActive 
                ? "bg-blue-50 text-blue-700" 
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            )}
        >
            <FaBuffer className="w-5 h-5 mr-3" />
            Khối học
        </NavLink>
        <NavLink
            to="/admin/subjects"
            className={({ isActive }) => clsx(
              "flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors",
              isActive 
                ? "bg-blue-50 text-blue-700" 
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            )}
        >
            <FaBook className="w-5 h-5 mr-3" />
            Môn học
        </NavLink>
        <NavLink
            to="/admin/users"
            className={({ isActive }) => clsx(
              "flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors",
              isActive 
                ? "bg-blue-50 text-blue-700" 
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            )}
        >
            <FaUsers className="w-5 h-5 mr-3" />
            Người dùng
        </NavLink>
        <NavLink
            to="/admin/parents"
            className={({ isActive }) => clsx(
              "flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors",
              isActive 
                ? "bg-blue-50 text-blue-700" 
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            )}
        >
            <FaUserFriends className="w-5 h-5 mr-3" />
            Phụ huynh
        </NavLink>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button 
          className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          onClick={logout}
        >
          <FaSignOutAlt className="w-5 h-5 mr-3" />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
