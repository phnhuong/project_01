import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-9xl font-extrabold text-blue-600 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy trang</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        Trang bạn đang tìm kiếm có thể đã bị xóa, chuyển đi hoặc không tồn tại.
      </p>
      <Link to="/">
        <Button size="lg">
          Về Trang Chủ
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
