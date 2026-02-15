import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import studentService from '../../services/studentService';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import ClassDetailPanel from '../../components/details/ClassDetailPanel';
import { FaArrowLeft, FaEdit, FaTrash, FaUserGraduate, FaChevronRight, FaChalkboardTeacher, FaCalendarAlt, FaBuffer } from 'react-icons/fa';
import { toast } from 'react-toastify';

const StudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showClassDetail, setShowClassDetail] = useState(false);
  const [currentClass, setCurrentClass] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const data = await studentService.getById(id);
        setStudent(data);
        // Get current enrollment (most recent)
        if (data.enrollments && data.enrollments.length > 0) {
          setCurrentClass(data.enrollments[0].class);
        }
      } catch (error) {
        toast.error('Failed to load student details');
        navigate('/students');
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentService.delete(id);
        toast.success('Student deleted successfully');
        navigate('/students');
      } catch (error) {
        toast.error('Failed to delete student');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading student details...</div>;
  }

  if (!student) {
    return <div className="text-center py-8">Student not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb Navigation */}
      {currentClass && (
        <div className="flex items-center space-x-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
          <FaCalendarAlt className="w-4 h-4 text-blue-600" />
          <span className="hover:text-blue-600 cursor-pointer" onClick={() => navigate('/explorer')}>
            {currentClass.academicYear?.name || 'N/A'}
          </span>
          <FaChevronRight className="w-3 h-3" />
          <FaBuffer className="w-4 h-4 text-emerald-600" />
          <span className="hover:text-emerald-600 cursor-pointer">
            {currentClass.grade?.name || 'N/A'}
          </span>
          <FaChevronRight className="w-3 h-3" />
          <FaChalkboardTeacher className="w-4 h-4 text-violet-600" />
          <span 
            className="hover:text-violet-600 cursor-pointer font-medium"
            onClick={() => setShowClassDetail(true)}
          >
            Lớp {currentClass.name}
          </span>
          <FaChevronRight className="w-3 h-3" />
          <FaUserGraduate className="w-4 h-4 text-gray-800" />
          <span className="font-bold text-gray-800">{student.fullName}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" icon={FaArrowLeft} onClick={() => navigate('/students')} />
          <h1 className="text-2xl font-bold text-gray-800">Hồ sơ Học sinh</h1>
        </div>
        <div className="flex gap-2">
          {currentClass && (
            <Button 
              variant="secondary" 
              icon={FaChalkboardTeacher}
              onClick={() => setShowClassDetail(true)}
            >
              Xem lớp
            </Button>
          )}
          <Button 
            variant="secondary" 
            icon={FaEdit} 
            onClick={() => navigate(`/students/edit/${student.id}`)}
          >
            Sửa
          </Button>
          <Button 
            variant="danger" 
            icon={FaTrash} 
            onClick={handleDelete}
          >
            Xóa
          </Button>
        </div>
      </div>

      {/* Class Context Card (if enrolled) */}
      {currentClass && (
        <Card className="bg-gradient-to-r from-violet-50 to-blue-50 border-violet-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Đang học tại</h3>
              <p className="text-xl font-bold text-gray-800">
                Lớp {currentClass.name} - {currentClass.grade?.name}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                GVCN: {currentClass.homeroomTeacher?.fullName || 'Chưa có'} • {currentClass.academicYear?.name}
              </p>
            </div>
            <Button 
              size="sm"
              onClick={() => setShowClassDetail(true)}
            >
              Chi tiết lớp →
            </Button>
          </div>
        </Card>
      )}

      {/* Main Info Card */}
      <Card className="flex flex-col md:flex-row gap-8">
        <div className="flex-shrink-0 flex justify-center md:justify-start">
          <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center text-blue-500">
            <FaUserGraduate className="w-16 h-16" />
          </div>
        </div>
        
        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-500">Mã học sinh</label>
            <p className="mt-1 text-lg font-semibold text-gray-900">{student.studentCode}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Họ và tên</label>
            <p className="mt-1 text-lg font-semibold text-gray-900">{student.fullName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Ngày sinh</label>
            <p className="mt-1 text-lg text-gray-900">
              {new Date(student.dob).toLocaleDateString('vi-VN')}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Giới tính</label>
            <p className="mt-1 text-lg text-gray-900">{student.gender === 'MALE' ? 'Nam' : 'Nữ'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Số điện thoại (Phụ huynh)</label>
            <p className="mt-1 text-lg text-gray-900">{student.phone || 'N/A'}</p>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-500">Địa chỉ</label>
            <p className="mt-1 text-lg text-gray-900">{student.address || 'N/A'}</p>
          </div>
        </div>
      </Card>

      {/* Academic History / Enrollments */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Lịch sử học tập</h2>
        {student.enrollments && student.enrollments.length > 0 ? (
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
             <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lớp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Năm học</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {student.enrollments.map((enrollment, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {enrollment.class?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {enrollment.class?.academicYear?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Đang học
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 italic">Chưa có lịch sử học tập.</p>
        )}
      </section>

      {/* Class Detail Modal */}
      {showClassDetail && currentClass && (
        <ClassDetailPanel
          classData={currentClass}
          onClose={() => setShowClassDetail(false)}
        />
      )}
    </div>
  );
};

export default StudentDetail;
