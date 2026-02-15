import React, { useEffect, useState } from 'react';
import reportService from '../services/reportService';
import Card from '../components/common/Card';
import { FaUserGraduate, FaChalkboardTeacher, FaBook, FaChartPie, FaUsers, FaClipboardList } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    totalSubjects: 0,
    totalTeachers: 0,
    gradeDistribution: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await reportService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center transition-all hover:shadow-md">
      <div className={`p-4 rounded-xl ${color} text-white mr-4 shadow-sm`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{loading ? '...' : value}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Bảng điều khiển</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span>Hệ thống trực tuyến</span>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Tổng học sinh" 
          value={stats.totalStudents} 
          icon={FaUserGraduate} 
          color="bg-blue-600" 
        />
        <StatCard 
          title="Tổng lớp học" 
          value={stats.totalClasses} 
          icon={FaChalkboardTeacher} 
          color="bg-emerald-600" 
        />
        <StatCard 
          title="Tổng môn học" 
          value={stats.totalSubjects} 
          icon={FaBook} 
          color="bg-violet-600" 
        />
        <StatCard 
          title="Tổng giáo viên" 
          value={stats.totalTeachers} 
          icon={FaUsers} 
          color="bg-amber-600" 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Phân bổ học sinh theo Khối">
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.gradeDistribution}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <Tooltip 
                  cursor={{ fill: '#F3F4F6' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar 
                  dataKey="studentCount" 
                  fill="#3B82F6" 
                  name="Số lượng học sinh" 
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Phím tắt nhanh">
            <div className="grid grid-cols-2 gap-4 mt-2">
                <button className="p-4 border border-gray-100 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all text-left group">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <FaUserGraduate />
                    </div>
                    <span className="block font-medium text-gray-800">Thêm học sinh</span>
                    <span className="text-xs text-gray-500">Đăng ký học sinh mới</span>
                </button>
                <button className="p-4 border border-gray-100 rounded-xl hover:bg-emerald-50 hover:border-emerald-200 transition-all text-left group">
                    <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                        <FaChalkboardTeacher />
                    </div>
                    <span className="block font-medium text-gray-800">Tạo lớp học</span>
                    <span className="text-xs text-gray-500">Khởi tạo lớp mới</span>
                </button>
                <button className="p-4 border border-gray-100 rounded-xl hover:bg-violet-50 hover:border-violet-200 transition-all text-left group">
                    <div className="w-10 h-10 bg-violet-100 text-violet-600 rounded-lg flex items-center justify-center mb-3 group-hover:bg-violet-600 group-hover:text-white transition-all">
                        <FaClipboardList />
                    </div>
                    <span className="block font-medium text-gray-800">Nhập điểm</span>
                    <span className="text-xs text-gray-500">Cập nhật điểm số</span>
                </button>
                <button className="p-4 border border-gray-100 rounded-xl hover:bg-amber-50 hover:border-amber-200 transition-all text-left group">
                    <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center mb-3 group-hover:bg-amber-600 group-hover:text-white transition-all">
                        <FaChartPie />
                    </div>
                    <span className="block font-medium text-gray-800">Xem báo cáo</span>
                    <span className="text-xs text-gray-500">Phân tích kết quả</span>
                </button>
            </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
