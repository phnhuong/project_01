import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import { FaChalkboardTeacher, FaUserGraduate, FaChartLine, FaTimes, FaPlus, FaUser } from 'react-icons/fa';

const ClassDetailPanel = ({ classData, onClose }) => {
    const navigate = useNavigate();

    if (!classData) return null;

    const students = classData.enrollments || [];
    const maleCount = students.filter(e => e.student?.gender === 'MALE').length;
    const femaleCount = students.filter(e => e.student?.gender === 'FEMALE').length;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-violet-600 to-violet-700 text-white p-6 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                            <FaChalkboardTeacher className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">Lớp {classData.name}</h2>
                            <p className="text-violet-100">
                                {classData.grade?.name} • {classData.academicYear?.name}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all">
                        <FaTimes className="w-6 h-6" />
                    </button>
                </div>

                {/* Class Info */}
                <div className="p-6 bg-gray-50 border-b">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <div className="text-sm text-gray-600 mb-1">Giáo viên chủ nhiệm</div>
                            <div className="font-bold text-gray-800 flex items-center">
                                <FaUser className="mr-2 text-violet-600" />
                                {classData.homeroomTeacher?.fullName || 'Chưa có'}
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <div className="text-sm text-gray-600 mb-1">Tổng số học sinh</div>
                            <div className="text-2xl font-bold text-violet-600">{students.length}</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <div className="text-sm text-gray-600 mb-1">Nam</div>
                            <div className="text-2xl font-bold text-blue-600">{maleCount}</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <div className="text-sm text-gray-600 mb-1">Nữ</div>
                            <div className="text-2xl font-bold text-pink-600">{femaleCount}</div>
                        </div>
                    </div>
                </div>

                {/* Students List */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-800">Danh sách Học sinh</h3>
                        <Button size="sm" icon={FaPlus} onClick={() => navigate('/students/new')}>
                            Thêm học sinh
                        </Button>
                    </div>
                    {students.length > 0 ? (
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">STT</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã HS</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Họ và tên</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giới tính</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày sinh</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {students.map((enrollment, index) => (
                                        <tr key={enrollment.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {enrollment.student?.studentCode}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {enrollment.student?.fullName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                    enrollment.student?.gender === 'MALE' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                                                }`}>
                                                    {enrollment.student?.gender === 'MALE' ? 'Nam' : 'Nữ'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {enrollment.student?.dob ? new Date(enrollment.student.dob).toLocaleDateString('vi-VN') : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <button
                                                    onClick={() => {
                                                        navigate(`/students/${enrollment.student?.id}`);
                                                        onClose();
                                                    }}
                                                    className="text-violet-600 hover:text-violet-900 font-medium"
                                                >
                                                    Xem chi tiết
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">Chưa có học sinh nào trong lớp</p>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-gray-50 border-t flex justify-end space-x-3">
                    <Button variant="secondary" onClick={onClose}>Đóng</Button>
                    <Button icon={FaChartLine} onClick={() => {
                        navigate(`/scores?classId=${classData.id}`);
                        onClose();
                    }}>Xem bảng điểm</Button>
                </div>
            </div>
        </div>
    );
};

export default ClassDetailPanel;
