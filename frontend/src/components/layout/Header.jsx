import React from 'react';
import { FaBars, FaUserCircle } from 'react-icons/fa';

const Header = ({ onMenuClick }) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-20">
      <div className="flex items-center">
        <button 
          className="mr-4 text-gray-500 hover:text-gray-700 lg:hidden"
          onClick={onMenuClick}
        >
          <FaBars className="w-6 h-6" />
        </button>
        <h2 className="text-lg font-semibold text-gray-800 hidden sm:block">
          Hệ Thống Quản Lý Học Sinh
        </h2>
      </div>

      <div className="flex items-center space-x-4">
        <div className="text-right hidden md:block">
          <p className="text-sm font-medium text-gray-900">Giáo viên</p>
          <p className="text-xs text-gray-500">GVCN Lớp 10A1</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-300 transition-colors">
          <FaUserCircle className="w-6 h-6" />
        </div>
      </div>
    </header>
  );
};

export default Header;
