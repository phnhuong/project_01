import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import studentService from '../../services/studentService';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import debounce from 'lodash.debounce';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });

  const navigate = useNavigate();
  const location = useLocation(); // To handle URL query params if needed later

  const { register, watch, setValue } = useForm({
    defaultValues: {
      search: '',
      gradeId: '',
      classId: '', // To be implemented with dynamic class loading
      status: ''
    }
  });

  // Watch filters for changes - Destructure to get primitives for dependency array
  const { search, gradeId, classId, status } = watch();

  const fetchStudents = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const queryParams = {
        page: pagination.page,
        limit: pagination.limit,
        search,
        gradeId,
        classId,
        status,
        ...params
      };

      // Remove empty keys
      Object.keys(queryParams).forEach(key => 
        (queryParams[key] === '' || queryParams[key] === null) && delete queryParams[key]
      );

      const data = await studentService.getAll(queryParams);
      
      setStudents(data.data || []); 
      setPagination(prev => ({
        ...prev,
        page: data.pagination?.page || 1,
        total: data.pagination?.total || 0,
        totalPages: data.pagination?.totalPages || 1
      }));
    } catch (error) {
      toast.error('Failed to fetch students.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, search, gradeId, classId, status]); 
  // Note: Including filters in dependency array might cause double fetch if not careful with debouncing.
  // Better approach: Use debounced value for search, and direct values for selects.

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value) => {
       // Trigger fetch or update state that triggers fetch
       // For now, we'll rely on the useEffect below, but we need to ensure search text update doesn't trigger immediately
       // Implementation detail: The watch() above triggers on every keystroke. 
       // We should ideally separate search text state or debounce the setFilter.
       // For simplicity in this version, we will fetch when filters change, but user might experience delay.
    }, 500),
    []
  );

  useEffect(() => {
    // Basic debounce for search input is handled by effect cleanup or explicit debounce
    const timer = setTimeout(() => {
        fetchStudents();
    }, 500); // Debounce all filter changes including search
    return () => clearTimeout(timer);
  }, [fetchStudents]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentService.delete(id);
        toast.success('Student deleted successfully');
        fetchStudents(); // Refresh list
      } catch (error) {
        toast.error('Failed to delete student');
      }
    }
  };

  const columns = [
    { 
      header: 'Student Code', 
      accessor: 'studentCode',
      className: 'font-medium text-gray-900'
    },
    { header: 'Full Name', accessor: 'fullName' },
    { 
      header: 'DOB', 
      accessor: 'dob',
      render: (student) => new Date(student.dob).toLocaleDateString('vi-VN')
    },
    { header: 'Gender', accessor: 'gender' },
    { 
      header: 'Class', 
      accessor: 'className', // Assuming backend returns class name or we map it
      render: (student) => student.enrollments?.[0]?.class?.name || 'N/A'
    },
    {
      header: 'Actions',
      className: 'text-right',
      render: (student) => (
        <div className="flex justify-end gap-2">
          <Button 
            size="sm" 
            variant="ghost" 
            icon={FaEye} 
            onClick={() => navigate(`/students/${student.id}`)}
            title="View Details"
          />
          <Button 
            size="sm" 
            variant="secondary" 
            icon={FaEdit} 
            onClick={() => navigate(`/students/edit/${student.id}`)}
            title="Edit"
          />
          <Button 
            size="sm" 
            variant="danger" 
            icon={FaTrash} 
            onClick={() => handleDelete(student.id)}
            title="Delete"
          />
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Student Management</h1>
          <p className="text-gray-600">View and manage student records</p>
        </div>
        <Button icon={FaPlus} onClick={() => navigate('/students/new')}>
          Add Student
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
           <Input 
             placeholder="Search by name or code..." 
             icon={FaSearch}
             {...register('search')}
           />
        </div>
        <Select 
          placeholder="All Grades"
          options={[
            { value: '', label: 'All Grades' },
            { value: '10', label: 'Grade 10' },
            { value: '11', label: 'Grade 11' },
            { value: '12', label: 'Grade 12' }
          ]}
          {...register('gradeId')}
        />
        <Select 
          placeholder="Status"
          options={[
            { value: '', label: 'All Status' },
            { value: 'active', label: 'Active' },
            { value: 'graduated', label: 'Graduated' },
            { value: 'dropped', label: 'Dropped Out' }
          ]}
          {...register('status')}
        />
      </div>

      {/* Table */}
      <Table 
        columns={columns} 
        data={students} 
        isLoading={loading}
        keyExtractor={(item) => item.id}
        emptyMessage="No students found matching your criteria."
      />

      {/* Pagination */}
      {!loading && students.length > 0 && (
        <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-gray-200">
          <span className="text-sm text-gray-600">
            Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} items)
          </span>
          <div className="flex gap-2">
            <Button 
              variant="secondary" 
              size="sm" 
              disabled={pagination.page === 1}
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
            >
              Previous
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              disabled={pagination.page === pagination.totalPages}
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
