import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';
import { FaCalendarAlt, FaBuffer, FaChartLine, FaTimes } from 'react-icons/fa';

const YearDetailPanel = ({ year, grades, onClose }) => {
    const navigate = useNavigate();

    if (!year) return null;

    const totalStudents = grades?.reduce((sum, g) => sum + (g.studentCount || 0), 0) || 0;
    const totalClasses = grades?.reduce((sum, g) => sum + (g.classCount || 0), 0) || 0;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                            <FaCalendarAlt className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">{year.name}</h2>
                            <p className="text-blue-100">
                                {new Date(year.startDate).toLocaleDateString('vi-VN')} - {new Date(year.endDate).toLocaleDateString('vi-VN')}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all">
                        <FaTimes className="w-6 h-6" />
                    </button>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-3 gap-4 p-6 bg-gray-50 border-b">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">{grades?.length || 0}</div>
                        <div className="text-sm text-gray-600">Khối học</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-emerald-600">{totalClasses}</div>
                        <div className="text-sm text-gray-600">Lớp học</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-violet-600">{totalStudents}</div>
                        <div className="text-sm text-gray-600">Học sinh</div>
                    </div>
                </div>

                {/* Grades List */}
                <div className="flex-1 overflow-y-auto p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Danh sách Khối học</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {grades && grades.length > 0 ? grades.map(grade => (
                            <div 
                                key={grade.id}
                                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                            <FaBuffer className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-800">{grade.name}</h4>
                                            <p className="text-xs text-gray-500">Cấp {grade.level}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>{grade.classCount || 0} lớp</span>
                                    <span>{grade.studentCount || 0} học sinh</span>
                                </div>
                            </div>
                        )) : (
                            <p className="text-gray-500 col-span-2 text-center py-8">Chưa có khối học nào</p>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-gray-50 border-t flex justify-end space-x-3">
                    <Button variant="secondary" onClick={onClose}>Đóng</Button>
                    <Button icon={FaChartLine} onClick={() => {
                        navigate(`/reports?yearId=${year.id}`);
                        onClose();
                    }}>Xem báo cáo</Button>
                </div>
            </div>
        </div>
    );
};

export default YearDetailPanel;
