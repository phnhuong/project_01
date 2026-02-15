import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';
import { FaBuffer, FaChalkboardTeacher, FaChartLine, FaTimes, FaPlus } from 'react-icons/fa';

const GradeDetailPanel = ({ grade, classes, year, onClose, onSelectClass }) => {
    const navigate = useNavigate();

    if (!grade) return null;

    const totalStudents = classes?.reduce((sum, c) => sum + (c._count?.enrollments || 0), 0) || 0;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-6 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                            <FaBuffer className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">{grade.name}</h2>
                            <p className="text-emerald-100">
                                {year?.name || 'N/A'} • Cấp {grade.level}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all">
                        <FaTimes className="w-6 h-6" />
                    </button>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-2 gap-4 p-6 bg-gray-50 border-b">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-emerald-600">{classes?.length || 0}</div>
                        <div className="text-sm text-gray-600">Lớp học</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-violet-600">{totalStudents}</div>
                        <div className="text-sm text-gray-600">Học sinh</div>
                    </div>
                </div>

                {/* Classes List */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-800">Danh sách Lớp học</h3>
                        <Button size="sm" icon={FaPlus} onClick={() => navigate('/admin/classes')}>
                            Thêm lớp
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {classes && classes.length > 0 ? classes.map(cls => (
                            <div 
                                key={cls.id}
                                onClick={() => onSelectClass && onSelectClass(cls)}
                                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-violet-300 transition-all cursor-pointer group"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-violet-50 text-violet-600 rounded-lg group-hover:bg-violet-600 group-hover:text-white transition-all">
                                            <FaChalkboardTeacher className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-800">{cls.name}</h4>
                                            <p className="text-xs text-gray-500">
                                                {cls.homeroomTeacher?.fullName || 'Chưa có GVCN'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">{cls._count?.enrollments || 0} học sinh</span>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                        cls._count?.enrollments >= 40 ? 'bg-red-100 text-red-700' :
                                        cls._count?.enrollments >= 30 ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-green-100 text-green-700'
                                    }`}>
                                        {cls._count?.enrollments >= 40 ? 'Đầy' : cls._count?.enrollments >= 30 ? 'Gần đầy' : 'Còn chỗ'}
                                    </span>
                                </div>
                            </div>
                        )) : (
                            <p className="text-gray-500 col-span-3 text-center py-8">Chưa có lớp học nào</p>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-gray-50 border-t flex justify-end space-x-3">
                    <Button variant="secondary" onClick={onClose}>Đóng</Button>
                    <Button icon={FaChartLine} onClick={() => {
                        navigate(`/reports?gradeId=${grade.id}`);
                        onClose();
                    }}>Xem báo cáo</Button>
                </div>
            </div>
        </div>
    );
};

export default GradeDetailPanel;
