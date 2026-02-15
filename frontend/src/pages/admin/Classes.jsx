import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import classService from '../../services/classService';
import gradeService from '../../services/gradeService';
import academicYearService from '../../services/academicYearService';
import userService from '../../services/userService';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const Classes = () => {
    const [classes, setClasses] = useState([]);
    const [grades, setGrades] = useState([]);
    const [years, setYears] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [selectedYearId, setSelectedYearId] = useState('');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClass, setEditingClass] = useState(null);

    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();
    const watchedYearId = watch('academicYearId');

    // Reset gradeId if year changes
    useEffect(() => {
        if (!editingClass) {
            setValue('gradeId', '');
        }
    }, [watchedYearId, setValue, editingClass]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [clsRes, grdRes, yrRes, tchrRes] = await Promise.all([
                classService.getAll(selectedYearId ? { academicYearId: selectedYearId } : {}),
                gradeService.getAll(),
                academicYearService.getAll(),
                userService.getAll({ limit: 100, role: 'TEACHER' }) 
            ]);
            setClasses(Array.isArray(clsRes) ? clsRes : (clsRes.data || []));
            setGrades(Array.isArray(grdRes) ? grdRes : (grdRes.data || []));
            const yearsData = Array.isArray(yrRes.data) ? yrRes.data : (Array.isArray(yrRes) ? yrRes : []);
            setYears(yearsData);
            setTeachers(Array.isArray(tchrRes.data) ? tchrRes.data : []);

            if (!selectedYearId && yearsData.length > 0) {
                const current = yearsData.find(y => y.isCurrent);
                if (current) setSelectedYearId(current.id.toString());
            }
        } catch (error) {
            toast.error('Failed to fetch data');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedYearId]);

    const handleAdd = () => {
        setEditingClass(null);
        reset({ name: '', gradeId: '', academicYearId: '', homeroomTeacherId: '' });
        setIsModalOpen(true);
    };

    const handleEdit = (cls) => {
        setEditingClass(cls);
        setValue('name', cls.name);
        setValue('gradeId', cls.gradeId);
        setValue('academicYearId', cls.academicYearId);
        setValue('homeroomTeacherId', cls.homeroomTeacherId || '');
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this class?')) {
            try {
                await classService.delete(id);
                toast.success('Deleted successfully');
                fetchData();
            } catch (error) {
                toast.error(error.message || 'Failed to delete');
            }
        }
    };

    const onSubmit = async (data) => {
        // Convert IDs to numbers
        const payload = {
            ...data,
            gradeId: parseInt(data.gradeId),
            academicYearId: parseInt(data.academicYearId),
            homeroomTeacherId: data.homeroomTeacherId ? parseInt(data.homeroomTeacherId) : undefined
        };

        try {
            if (editingClass) {
                await classService.update(editingClass.id, payload);
                toast.success('Updated successfully');
            } else {
                await classService.create(payload);
                toast.success('Created successfully');
            }
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            toast.error(error.message || 'Operation failed');
        }
    };

    const columns = [
        { header: 'Tên lớp', accessor: 'name' },
        { header: 'Khối', accessor: 'grade', render: (row) => row.grade?.name || 'N/A' },
        { header: 'Năm học', accessor: 'academicYear', render: (row) => row.academicYear?.name || 'N/A' },
        { 
            header: 'Giáo viên chủ nhiệm', 
            accessor: 'homeroomTeacher',
            render: (row) => row.homeroomTeacher?.fullName || 'Chưa phân công'
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

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Quản lý Lớp học</h1>
                <Button onClick={handleAdd} icon={FaPlus}>Thêm Lớp học</Button>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center space-x-4">
                <div className="flex items-center text-gray-600 font-medium text-sm">
                    <span className="mr-2">Lọc theo năm học:</span>
                </div>
                <div className="w-64">
                    <Select
                        value={selectedYearId}
                        onChange={(e) => setSelectedYearId(e.target.value)}
                        options={[
                            { value: '', label: '--- Tất cả năm học ---' },
                            ...years.map(y => ({ value: y.id.toString(), label: y.name }))
                        ]}
                    />
                </div>
            </div>

            <Table 
                columns={columns} 
                data={classes} 
                isLoading={loading} 
                keyExtractor={(item) => item.id}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingClass ? 'Edit Class' : 'Add Class'}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Class Name"
                        placeholder="e.g. 10A1"
                        error={errors.name?.message}
                        {...register('name', { required: 'Name is required' })}
                    />
                    
                    <Select
                        label="Năm học"
                        options={years.map(y => ({ value: y.id, label: y.name }))}
                        error={errors.academicYearId?.message}
                        {...register('academicYearId', { required: 'Vui lòng chọn năm học' })}
                    />

                    <Select
                        label="Khối"
                        options={grades
                            .filter(g => !watchedYearId || g.academicYearId === parseInt(watchedYearId))
                            .map(g => ({ value: g.id, label: g.name }))
                        }
                        error={errors.gradeId?.message}
                        {...register('gradeId', { required: 'Vui lòng chọn khối' })}
                        disabled={!watchedYearId}
                    />

                    <Select
                        label="Giáo viên chủ nhiệm"
                        options={[
                            { value: '', label: '--- Chọn giáo viên ---' },
                            ...teachers.map(t => ({ value: t.id, label: t.fullName }))
                        ]}
                        error={errors.homeroomTeacherId?.message}
                        {...register('homeroomTeacherId')}
                    />

                    <div className="flex justify-end space-x-3 mt-6">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit">{editingClass ? 'Update' : 'Create'}</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Classes;
