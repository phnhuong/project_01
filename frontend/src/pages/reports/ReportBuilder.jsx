import React, { useState, useEffect } from 'react';
import reportService from '../../services/reportService';
import academicYearService from '../../services/academicYearService';
import gradeService from '../../services/gradeService';
import subjectService from '../../services/subjectService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
import Table from '../../components/common/Table';
import { FaFilter, FaFileDownload, FaChartBar, FaChartLine, FaChartPie } from 'react-icons/fa';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

const ReportBuilder = () => {
    const [years, setYears] = useState([]);
    const [grades, setGrades] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [filters, setFilters] = useState({
        yearId: '',
        gradeId: '',
        semester: '1',
        subjectId: '',
        scoreType: ''
    });
    const [chartType, setChartType] = useState('bar'); // 'bar', 'line', 'pie'
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(false);

    const COLORS = ['#3B82F6', '#10B981', '#6366F1', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'];

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const [yrs, grds, subjs] = await Promise.all([
                    academicYearService.getAll(),
                    gradeService.getAll(),
                    subjectService.getAll()
                ]);
                const yrsData = Array.isArray(yrs.data) ? yrs.data : (Array.isArray(yrs) ? yrs : []);
                setYears(yrsData);
                setGrades(Array.isArray(grds) ? grds : (grds.data || []));
                setSubjects(Array.isArray(subjs.data) ? subjs.data : (Array.isArray(subjs) ? subjs : []));

                // Default current year
                const current = yrsData.find(y => y.isCurrent);
                if (current) setFilters(f => ({ ...f, yearId: current.id.toString() }));
            } catch (error) {
                console.error(error);
            }
        };
        fetchFilters();
    }, []);

    const generateReport = async () => {
        setLoading(true);
        try {
            const data = await reportService.getPerformanceReport(filters);
            setReportData(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { header: 'Môn học', accessor: 'subject' },
        { header: 'Điểm trung bình', accessor: 'average', render: (row) => (
            <span className={`font-bold ${row.average >= 8 ? 'text-green-600' : row.average < 5 ? 'text-red-600' : 'text-blue-600'}`}>
                {row.average}
            </span>
        )},
        { header: 'Số lượng bài kiểm tra', accessor: 'count' }
    ];

    const renderChart = () => {
        if (chartType === 'bar') {
            return (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        layout="vertical"
                        data={reportData}
                        margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                        <XAxis type="number" domain={[0, 10]} />
                        <YAxis dataKey="subject" type="category" width={80} />
                        <Tooltip />
                        <Bar dataKey="average" name="Điểm TB" radius={[0, 4, 4, 0]} barSize={20}>
                            {reportData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            );
        } else if (chartType === 'line') {
            return (
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={reportData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="subject" angle={-15} textAnchor="end" height={80} />
                        <YAxis domain={[0, 10]} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="average" stroke="#3B82F6" strokeWidth={3} name="Điểm TB" dot={{ fill: '#3B82F6', r: 5 }} />
                    </LineChart>
                </ResponsiveContainer>
            );
        } else if (chartType === 'pie') {
            // For pie chart, we'll show distribution of performance levels
            const performanceLevels = {
                'Xuất sắc (≥9)': reportData.filter(d => d.average >= 9).length,
                'Giỏi (8-8.9)': reportData.filter(d => d.average >= 8 && d.average < 9).length,
                'Khá (6.5-7.9)': reportData.filter(d => d.average >= 6.5 && d.average < 8).length,
                'Trung bình (5-6.4)': reportData.filter(d => d.average >= 5 && d.average < 6.5).length,
                'Yếu (<5)': reportData.filter(d => d.average < 5).length
            };
            const pieData = Object.entries(performanceLevels)
                .filter(([_, value]) => value > 0)
                .map(([name, value]) => ({ name, value }));

            return (
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            );
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                    <FaChartBar className="mr-3 text-blue-600" />
                    Báo cáo Hiệu suất Chi tiết
                </h1>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setChartType('bar')}
                        className={`p-2 rounded-lg transition-all ${chartType === 'bar' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        title="Biểu đồ cột"
                    >
                        <FaChartBar className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setChartType('line')}
                        className={`p-2 rounded-lg transition-all ${chartType === 'line' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        title="Biểu đồ đường"
                    >
                        <FaChartLine className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setChartType('pie')}
                        className={`p-2 rounded-lg transition-all ${chartType === 'pie' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        title="Biểu đồ tròn"
                    >
                        <FaChartPie className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <Card className="bg-gray-50 border-none">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
                    <Select
                        label="Năm học"
                        value={filters.yearId}
                        onChange={(e) => setFilters({ ...filters, yearId: e.target.value })}
                        options={years.map(y => ({ value: y.id.toString(), label: y.name }))}
                    />
                    <Select
                        label="Khối"
                        value={filters.gradeId}
                        onChange={(e) => setFilters({ ...filters, gradeId: e.target.value })}
                        options={[
                            { value: '', label: 'Tất cả các khối' },
                            ...grades
                                .filter(g => !filters.yearId || g.academicYearId === parseInt(filters.yearId))
                                .map(g => ({ value: g.id.toString(), label: g.name }))
                        ]}
                    />
                    <Select
                        label="Môn học"
                        value={filters.subjectId}
                        onChange={(e) => setFilters({ ...filters, subjectId: e.target.value })}
                        options={[
                            { value: '', label: 'Tất cả môn học' },
                            ...subjects.map(s => ({ value: s.id.toString(), label: s.name }))
                        ]}
                    />
                    <Select
                        label="Học kỳ"
                        value={filters.semester}
                        onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
                        options={[
                            { value: '', label: 'Cả năm' },
                            { value: '1', label: 'Học kỳ 1' },
                            { value: '2', label: 'Học kỳ 2' }
                        ]}
                    />
                    <Select
                        label="Loại điểm"
                        value={filters.scoreType}
                        onChange={(e) => setFilters({ ...filters, scoreType: e.target.value })}
                        options={[
                            { value: '', label: 'Tất cả loại' },
                            { value: 'ORAL', label: 'Miệng' },
                            { value: 'FIFTEEN_MIN', label: '15 phút' },
                            { value: 'ONE_PERIOD', label: '1 tiết' },
                            { value: 'SEMESTER', label: 'Học kỳ' }
                        ]}
                    />
                    <Button onClick={generateReport} icon={FaFilter} className="w-full h-11">Lập báo cáo</Button>
                </div>
            </Card>

            {loading ? (
                <div className="flex justify-center p-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                </div>
            ) : reportData.length > 0 ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <Card title="Thống kê theo môn học">
                            <Table 
                                columns={columns} 
                                data={reportData} 
                                keyExtractor={(item) => item.subject}
                            />
                            <div className="mt-4 flex justify-between items-center">
                                <div className="text-sm text-gray-500">
                                    Tổng số môn: <span className="font-bold text-gray-800">{reportData.length}</span>
                                </div>
                                <Button size="sm" variant="secondary" icon={FaFileDownload}>Xuất PDF</Button>
                            </div>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card title={`Biểu đồ ${chartType === 'bar' ? 'cột' : chartType === 'line' ? 'đường' : 'tròn'}`}>
                            <div className="h-96 w-full pt-4">
                                {renderChart()}
                            </div>
                        </Card>
                    </div>
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-100">
                    <FaChartBar className="mx-auto text-4xl text-gray-200 mb-4" />
                    <p className="text-gray-500 font-medium">Chọn tham số và bấm "Lập báo cáo" để xem dữ liệu</p>
                </div>
            )}
        </div>
    );
};

export default ReportBuilder;
