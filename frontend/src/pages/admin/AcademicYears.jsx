import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import academicYearService from '../../services/academicYearService';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const AcademicYears = () => {
    const [years, setYears] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingYear, setEditingYear] = useState(null);

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

    const fetchYears = async () => {
        setLoading(true);
        try {
            const res = await academicYearService.getAll();
            setYears(Array.isArray(res) ? res : (res.data || []));
        } catch (error) {
            toast.error('Failed to fetch academic years');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchYears();
    }, []);

    const handleAdd = () => {
        setEditingYear(null);
        reset({ code: '', name: '', status: 'ACTIVE', startDate: '', endDate: '' });
        setIsModalOpen(true);
    };

    const handleEdit = (year) => {
        setEditingYear(year);
        // Format dates for input type="date"
        const formatDate = (dateString) => {
            if (!dateString) return '';
            return new Date(dateString).toISOString().split('T')[0];
        };

        setValue('code', year.code);
        setValue('name', year.name);
        setValue('status', year.status);
        setValue('startDate', formatDate(year.startDate));
        setValue('endDate', formatDate(year.endDate));
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this academic year?')) {
            try {
                await academicYearService.delete(id);
                toast.success('Deleted successfully');
                fetchYears();
            } catch (error) {
                toast.error(error.message || 'Failed to delete');
            }
        }
    };

    const onSubmit = async (data) => {
        try {
            if (editingYear) {
                await academicYearService.update(editingYear.id, data);
                toast.success('Updated successfully');
            } else {
                await academicYearService.create(data);
                toast.success('Created successfully');
            }
            setIsModalOpen(false);
            fetchYears();
        } catch (error) {
            toast.error(error.message || 'Operation failed');
        }
    };

    const columns = [
        { header: 'Code', accessor: 'code' },
        { header: 'Name', accessor: 'name' },
        { 
            header: 'Start Date', 
            accessor: 'startDate', 
            render: (row) => row.startDate ? new Date(row.startDate).toLocaleDateString() : 'N/A' 
        },
        { 
            header: 'End Date', 
            accessor: 'endDate', 
             render: (row) => row.endDate ? new Date(row.endDate).toLocaleDateString() : 'N/A'
        },
        { 
            header: 'Status', 
            accessor: 'status',
            render: (row) => (
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                    row.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
                    row.status === 'FINISHED' ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                    {row.status}
                </span>
            )
        },
        {
            header: 'Actions',
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
                <h1 className="text-2xl font-bold text-gray-800">Academic Years</h1>
                <Button onClick={handleAdd} icon={FaPlus}>Add New Year</Button>
            </div>

            <Table 
                columns={columns} 
                data={years} 
                isLoading={loading} 
                keyExtractor={(item) => item.id}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingYear ? 'Edit Academic Year' : 'Add Academic Year'}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Code"
                        placeholder="e.g. 2023-2024"
                        error={errors.code?.message}
                        {...register('code', { required: 'Code is required' })}
                    />
                    <Input
                        label="Name"
                        placeholder="e.g. Year 2023-2024"
                        error={errors.name?.message}
                        {...register('name', { required: 'Name is required' })}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Start Date"
                            type="date"
                            error={errors.startDate?.message}
                            {...register('startDate', { required: 'Start Date is required' })}
                        />
                        <Input
                            label="End Date"
                            type="date"
                            error={errors.endDate?.message}
                            {...register('endDate', { required: 'End Date is required' })}
                        />
                    </div>
                    <Select
                        label="Status"
                        options={[
                            { value: 'UPCOMING', label: 'Upcoming' },
                            { value: 'ACTIVE', label: 'Active' },
                            { value: 'FINISHED', label: 'Finished' }
                        ]}
                        {...register('status')}
                    />
                    <div className="flex justify-end space-x-3 mt-6">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit">{editingYear ? 'Update' : 'Create'}</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default AcademicYears;
