import React, { useState, useEffect } from 'react';
import reportService from '../../services/reportService';
import classService from '../../services/classService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import YearDetailPanel from '../../components/details/YearDetailPanel';
import GradeDetailPanel from '../../components/details/GradeDetailPanel';
import ClassDetailPanel from '../../components/details/ClassDetailPanel';
import { FaChevronRight, FaCalendarAlt, FaBuffer, FaChalkboardTeacher, FaArrowLeft } from 'react-icons/fa';

const HierarchyExplorer = () => {
    const [view, setView] = useState('years'); // 'years', 'grades', 'classes'
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selection, setSelection] = useState({
        year: null,
        grade: null,
        class: null
    });

    // Detail panel states
    const [showYearDetail, setShowYearDetail] = useState(false);
    const [showGradeDetail, setShowGradeDetail] = useState(false);
    const [showClassDetail, setShowClassDetail] = useState(false);
    const [selectedYearGrades, setSelectedYearGrades] = useState([]);
    const [selectedGradeClasses, setSelectedGradeClasses] = useState([]);
    const [selectedClassData, setSelectedClassData] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const params = {};
            if (selection.year) params.yearId = selection.year.id;
            if (selection.grade) params.gradeId = selection.grade.id;

            const res = await reportService.getHierarchyData(params);
            setData(res);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selection]);

    const handleSelectYear = async (year) => {
        setSelection({ ...selection, year });
        setView('grades');
    };

    const handleSelectGrade = async (grade) => {
        setSelection({ ...selection, grade });
        setView('classes');
    };

    const handleYearClick = async (year) => {
        // Fetch grades for this year
        const params = { yearId: year.id };
        const grades = await reportService.getHierarchyData(params);
        setSelectedYearGrades(grades);
        setSelection({ ...selection, year });
        setShowYearDetail(true);
    };

    const handleGradeClick = async (grade) => {
        // Fetch classes for this grade
        const params = { yearId: selection.year.id, gradeId: grade.id };
        const classes = await reportService.getHierarchyData(params);
        setSelectedGradeClasses(classes);
        setSelection({ ...selection, grade });
        setShowGradeDetail(true);
    };

    const handleClassClick = async (cls) => {
        // Fetch full class details with students
        try {
            const classData = await classService.getById(cls.id);
            setSelectedClassData(classData);
            setShowClassDetail(true);
        } catch (error) {
            console.error(error);
        }
    };

    const goBack = () => {
        if (view === 'classes') {
            setSelection({ ...selection, grade: null });
            setView('grades');
        } else if (view === 'grades') {
            setSelection({ year: null, grade: null });
            setView('years');
        }
    };

    const renderHeader = () => (
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6 bg-gray-50 p-3 rounded-lg border border-gray-100">
            <span className={view === 'years' ? 'font-bold text-blue-600' : ''}>Tất cả năm học</span>
            {selection.year && (
                <>
                    <FaChevronRight className="w-3 h-3" />
                    <span className={view === 'grades' ? 'font-bold text-blue-600' : ''}>{selection.year.name}</span>
                </>
            )}
            {selection.grade && (
                <>
                    <FaChevronRight className="w-3 h-3" />
                    <span className={view === 'classes' ? 'font-bold text-blue-600' : ''}>{selection.grade.name}</span>
                </>
            )}
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Khám phá Hệ thống</h1>
                {(view !== 'years') && (
                    <Button variant="ghost" icon={FaArrowLeft} onClick={goBack}>Quay lại</Button>
                )}
            </div>

            {renderHeader()}

            {loading ? (
                <div className="flex justify-center p-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {view === 'years' && data.map(year => (
                        <div 
                            key={year.id}
                            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:border-blue-300"
                        >
                            <div 
                                onClick={() => handleSelectYear(year)}
                                className="flex items-center space-x-4 mb-4"
                            >
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    <FaCalendarAlt className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 text-lg">{year.name}</h3>
                                    <p className="text-sm text-gray-500">{year.studentCount} học sinh · {year._count.grades} khối</p>
                                </div>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleYearClick(year);
                                }}
                                className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium text-left"
                            >
                                → Xem chi tiết năm học
                            </button>
                        </div>
                    ))}

                    {view === 'grades' && data.map(grade => (
                        <div 
                            key={grade.id}
                            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:border-emerald-300"
                        >
                            <div 
                                onClick={() => handleSelectGrade(grade)}
                                className="flex items-center space-x-4 mb-4"
                            >
                                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                    <FaBuffer className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 text-lg">{grade.name}</h3>
                                    <p className="text-sm text-gray-500">{grade.studentCount} học sinh · {grade.classCount} lớp</p>
                                </div>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleGradeClick(grade);
                                }}
                                className="w-full text-sm text-emerald-600 hover:text-emerald-800 font-medium text-left"
                            >
                                → Xem chi tiết khối học
                            </button>
                        </div>
                    ))}

                    {view === 'classes' && data.map(cls => (
                        <Card key={cls.id} className="hover:border-violet-300 transition-all cursor-pointer">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-gray-800 text-lg">{cls.name}</h3>
                                    <p className="text-sm text-gray-500">GV: {cls.homeroomTeacher?.fullName || 'Chưa có'}</p>
                                </div>
                                <div className="px-2 py-1 bg-violet-100 text-violet-700 text-xs font-bold rounded">
                                    {cls._count.enrollments} HS
                                </div>
                            </div>
                            <button
                                onClick={() => handleClassClick(cls)}
                                className="w-full text-sm bg-violet-50 hover:bg-violet-100 text-violet-700 font-medium py-2 px-4 rounded-lg transition-all"
                            >
                                Xem danh sách học sinh
                            </button>
                        </Card>
                    ))}
                </div>
            )}

            {/* Detail Panels */}
            {showYearDetail && (
                <YearDetailPanel
                    year={selection.year}
                    grades={selectedYearGrades}
                    onClose={() => setShowYearDetail(false)}
                />
            )}

            {showGradeDetail && (
                <GradeDetailPanel
                    grade={selection.grade}
                    classes={selectedGradeClasses}
                    year={selection.year}
                    onClose={() => setShowGradeDetail(false)}
                    onSelectClass={(cls) => {
                        setShowGradeDetail(false);
                        handleClassClick(cls);
                    }}
                />
            )}

            {showClassDetail && selectedClassData && (
                <ClassDetailPanel
                    classData={selectedClassData}
                    onClose={() => setShowClassDetail(false)}
                />
            )}
        </div>
    );
};

export default HierarchyExplorer;
