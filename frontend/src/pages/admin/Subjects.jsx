import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import subjectService from '../../services/subjectService';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const Subjects = () => {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSubject, setEditingSubject] = useState(null);

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

    const fetchSubjects = async () => {
        setLoading(true);
        try {
            const res = await subjectService.getAll();
            setSubjects(Array.isArray(res) ? res : (res.data || []));
        } catch (error) {
            toast.error('Failed to fetch subjects');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, []);

    const handleAdd = () => {
        setEditingSubject(null);
        reset({ code: '', name: '', description: '', credits: '' });
        setIsModalOpen(true);
    };

    const handleEdit = (subject) => {
        setEditingSubject(subject);
        setValue('code', subject.code);
        setValue('name', subject.name);
        setValue('description', subject.description);
        setValue('credits', subject.credits);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this subject?')) {
            try {
                await subjectService.delete(id);
                toast.success('Deleted successfully');
                fetchSubjects();
            } catch (error) {
                toast.error(error.message || 'Failed to delete');
            }
        }
    };

    const onSubmit = async (data) => {
        const payload = {
            ...data,
            credits: data.credits ? parseInt(data.credits) : undefined
        };
        try {
            if (editingSubject) {
                await subjectService.update(editingSubject.id, payload);
                toast.success('Updated successfully');
            } else {
                await subjectService.create(payload);
                toast.success('Created successfully');
            }
            setIsModalOpen(false);
            fetchSubjects();
        } catch (error) {
            toast.error(error.message || 'Operation failed');
        }
    };

    const columns = [
        { header: 'Code', accessor: 'code' },
        { header: 'Name', accessor: 'name' },
        { header: 'Credits', accessor: 'credits' },
        { 
            header: 'Description', 
            accessor: 'description',
            render: (row) => <span className="text-gray-500 text-sm truncate max-w-xs block">{row.description}</span>
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
                <h1 className="text-2xl font-bold text-gray-800">Subjects Management</h1>
                <Button onClick={handleAdd} icon={FaPlus}>Add Subject</Button>
            </div>

            <Table 
                columns={columns} 
                data={subjects} 
                isLoading={loading} 
                keyExtractor={(item) => item.id}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingSubject ? 'Edit Subject' : 'Add Subject'}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Subject Code"
                        placeholder="e.g. MATH10"
                        error={errors.code?.message}
                        {...register('code', { required: 'Code is required' })}
                    />
                    <Input
                        label="Subject Name"
                        placeholder="e.g. Mathematics 10"
                        error={errors.name?.message}
                        {...register('name', { required: 'Name is required' })}
                    />
                     <Input
                        label="Credits (Opt)"
                        type="number"
                        placeholder="e.g. 3"
                        {...register('credits')}
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            rows="3"
                            {...register('description')}
                        ></textarea>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit">{editingSubject ? 'Update' : 'Create'}</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Subjects;
