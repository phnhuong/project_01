import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import gradeService from '../../services/gradeService';
import academicYearService from '../../services/academicYearService';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaFilter } from 'react-icons/fa';

const Grades = () => {
    const [grades, setGrades] = useState([]);
    const [years, setYears] = useState([]);
    const [selectedYearId, setSelectedYearId] = useState('');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGrade, setEditingGrade] = useState(null);

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

    const fetchYears = async () => {
        try {
            const res = await academicYearService.getAll();
            const yearsData = Array.isArray(res) ? res : (res.data || []);
            setYears(yearsData);
            
            // Set default selected year to the current one
            const currentYear = yearsData.find(y => y.isCurrent);
            if (currentYear) {
                setSelectedYearId(currentYear.id.toString());
            } else if (yearsData.length > 0) {
                setSelectedYearId(yearsData[0].id.toString());
            }
        } catch (error) {
            toast.error('Failed to fetch academic years');
        }
    };

    const fetchGrades = async () => {
        if (!selectedYearId) return;
        setLoading(true);
        try {
            const res = await gradeService.getAll(selectedYearId);
            setGrades(Array.isArray(res) ? res : (res.data || []));
        } catch (error) {
            toast.error('Failed to fetch grades');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchYears();
    }, []);

    useEffect(() => {
        fetchGrades();
    }, [selectedYearId]);

    const handleAdd = () => {
        setEditingGrade(null);
        reset({ name: '', level: '', academicYearId: selectedYearId });
        setIsModalOpen(true);
    };

    const handleEdit = (grade) => {
        setEditingGrade(grade);
        setValue('name', grade.name);
        setValue('level', grade.level);
        setValue('academicYearId', grade.academicYearId);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this grade?')) {
            try {
                await gradeService.delete(id);
                toast.success('Deleted successfully');
                fetchGrades();
            } catch (error) {
                toast.error(error.message || 'Failed to delete');
            }
        }
    };

    const onSubmit = async (data) => {
        try {
            const payload = {
                ...data,
                level: parseInt(data.level),
                academicYearId: parseInt(data.academicYearId)
            };

            if (editingGrade) {
                await gradeService.update(editingGrade.id, payload);
                toast.success('Updated successfully');
            } else {
                await gradeService.create(payload);
                toast.success('Created successfully');
            }
            setIsModalOpen(false);
            fetchGrades();
        } catch (error) {
            toast.error(error.message || 'Operation failed');
        }
    };

    const columns = [
        { header: 'Khối', accessor: 'name' },
        { header: 'Cấp độ', accessor: 'level', render: (row) => `Lớp ${row.level}` },
        {
            header: 'Năm học',
            accessor: 'academicYear',
            render: (row) => years.find(y => y.id === row.academicYearId)?.name || 'N/A'
        },
        {
            header: 'Hành động',
            accessor: 'actions',
            render: (row) => (
                <div className="flex space-x-2">
                    <Button size="sm" variant="secondary" onClick={() => handleEdit(row)} icon={FaEdit} />
                    <Button size="sm" variant="danger" onClick={() => handleDelete(row.id)} icon={FaTrash} />
                </div>
            )
        }
    ];

    const yearOptions = useMemo(() => 
        years.map(y => ({ value: y.id.toString(), label: y.name })),
    [years]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Quản lý Khối học</h1>
                <Button onClick={handleAdd} icon={FaPlus}>Thêm Khối mới</Button>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center space-x-4">
                <div className="flex items-center text-gray-600">
                    <FaFilter className="mr-2" />
                    <span className="text-sm font-medium">Lọc theo năm học:</span>
                </div>
                <div className="w-64">
                    <Select
                        value={selectedYearId}
                        onChange={(e) => setSelectedYearId(e.target.value)}
                        options={yearOptions}
                    />
                </div>
            </div>

            <Table 
                columns={columns} 
                data={grades} 
                isLoading={loading} 
                keyExtractor={(item) => item.id}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingGrade ? 'Sửa Khối học' : 'Thêm Khối học mới'}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Select
                        label="Năm học"
                        error={errors.academicYearId?.message}
                        options={yearOptions}
                        {...register('academicYearId', { required: 'Vui lòng chọn năm học' })}
                    />
                    <Input
                        label="Tên khối"
                        placeholder="Ví dụ: Khối 10"
                        error={errors.name?.message}
                        {...register('name', { required: 'Tên khối là bắt buộc' })}
                    />
                    <Input
                        label="Cấp độ (Số)"
                        type="number"
                        placeholder="Ví dụ: 10"
                        error={errors.level?.message}
                        {...register('level', { 
                            required: 'Cấp độ là bắt buộc',
                            min: { value: 1, message: 'Cấp độ phải ít nhất là 1' },
                            max: { value: 12, message: 'Cấp độ tối đa là 12' }
                        })}
                    />
                    
                    <div className="flex justify-end space-x-3 mt-6">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Hủy</Button>
                        <Button type="submit">{editingGrade ? 'Cập nhật' : 'Tạo mới'}</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Grades;
