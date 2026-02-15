import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import parentService from '../../services/parentService';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaKey, FaUsers } from 'react-icons/fa';

const Parents = () => {
    const [parents, setParents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isChildrenModalOpen, setIsChildrenModalOpen] = useState(false);
    const [editingParent, setEditingParent] = useState(null);
    const [selectedParentForPassword, setSelectedParentForPassword] = useState(null);
    const [selectedParentChildren, setSelectedParentChildren] = useState([]);
    const [loadingChildren, setLoadingChildren] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState(null);

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
    const { 
        register: registerPassword, 
        handleSubmit: handleSubmitPassword, 
        reset: resetPassword, 
        formState: { errors: passwordErrors } 
    } = useForm();

    const fetchParents = async (page = 1) => {
        setLoading(true);
        try {
            const res = await parentService.getAll({ page, limit: 10 });
            setParents(res.data || []);
            setPagination(res.pagination);
            setCurrentPage(page);
        } catch (error) {
            toast.error('Failed to fetch parents');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchParents();
    }, []);

    const handleAdd = () => {
        setEditingParent(null);
        reset({ fullName: '', phone: '', password: '', isActive: true });
        setIsModalOpen(true);
    };

    const handleEdit = (parent) => {
        setEditingParent(parent);
        setValue('fullName', parent.fullName);
        setValue('phone', parent.phone);
        setValue('isActive', parent.isActive);
        setIsModalOpen(true);
    };

    const handleChangePassword = (parent) => {
        setSelectedParentForPassword(parent);
        resetPassword({ newPassword: '' });
        setIsPasswordModalOpen(true);
    };

    const handleViewChildren = async (parent) => {
        setSelectedParentChildren([]);
        setIsChildrenModalOpen(true);
        setLoadingChildren(true);
        try {
            const children = await parentService.getChildren(parent.id);
            setSelectedParentChildren(children);
        } catch (error) {
            toast.error('Failed to load children');
        } finally {
            setLoadingChildren(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this parent?')) {
            try {
                await parentService.delete(id);
                toast.success('Deleted successfully');
                fetchParents(currentPage);
            } catch (error) {
                toast.error(error.message || 'Failed to delete');
            }
        }
    };

    const onSubmit = async (data) => {
        try {
            if (editingParent) {
                await parentService.update(editingParent.id, {
                    fullName: data.fullName,
                    phone: data.phone,
                    isActive: data.isActive
                });
                toast.success('Updated successfully');
            } else {
                await parentService.create(data);
                toast.success('Created successfully');
            }
            setIsModalOpen(false);
            fetchParents(currentPage);
        } catch (error) {
            toast.error(error.message || 'Operation failed');
        }
    };

    const onSubmitPassword = async (data) => {
        if (!selectedParentForPassword) return;
        try {
            await parentService.resetPassword(selectedParentForPassword.id, data.newPassword);
            toast.success('Password reset successfully');
            setIsPasswordModalOpen(false);
        } catch (error) {
            toast.error(error.message || 'Failed to reset password');
        }
    };

    const columns = [
        { header: 'ID', accessor: 'id' },
        { header: 'Full Name', accessor: 'fullName' },
        { header: 'Phone', accessor: 'phone' },
        { 
            header: 'Status', 
            accessor: 'isActive',
            render: (row) => (
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                    row.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                    {row.isActive ? 'ACTIVE' : 'INACTIVE'}
                </span>
            )
        },
        {
            header: 'Children',
            accessor: 'students',
            render: (row) => (
                <span className="text-blue-600 font-semibold">
                    {row.students?.length || 0}
                </span>
            )
        },
        {
            header: 'Actions',
            accessor: 'actions',
            render: (row) => (
                <div className="flex space-x-2">
                    <Button size="sm" variant="secondary" onClick={() => handleEdit(row)} icon={FaEdit} title="Edit" />
                    <Button size="sm" variant="info" onClick={() => handleViewChildren(row)} icon={FaUsers} title="View Children" />
                    <Button size="sm" variant="warning" onClick={() => handleChangePassword(row)} icon={FaKey} title="Reset Password" />
                    <Button size="sm" variant="danger" onClick={() => handleDelete(row.id)} icon={FaTrash} title="Delete" />
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Parent Management</h1>
                <Button onClick={handleAdd} icon={FaPlus}>Add Parent</Button>
            </div>

            <Table 
                columns={columns} 
                data={parents} 
                isLoading={loading} 
                keyExtractor={(item) => item.id}
            />

            {/* Pagination */}
            {pagination && (
                <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-gray-600">
                        Showing {parents.length} of {pagination.total} parents
                    </div>
                    <div className="flex space-x-2">
                        <Button 
                            variant="secondary" 
                            size="sm" 
                            onClick={() => fetchParents(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        <span className="px-4 py-2 text-sm">
                            Page {currentPage} of {pagination.totalPages}
                        </span>
                        <Button 
                            variant="secondary" 
                            size="sm" 
                            onClick={() => fetchParents(currentPage + 1)}
                            disabled={currentPage === pagination.totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingParent ? 'Edit Parent' : 'Add Parent'}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Full Name"
                        placeholder="e.g. Nguyen Van A"
                        error={errors.fullName?.message}
                        {...register('fullName', { required: 'Full Name is required' })}
                    />
                    <Input
                        label="Phone Number"
                        placeholder="e.g. 0901234567"
                        error={errors.phone?.message}
                        {...register('phone', { 
                            required: 'Phone is required',
                            pattern: {
                                value: /^[0-9]{10,11}$/,
                                message: 'Please enter a valid phone number (10-11 digits)'
                            }
                        })}
                    />
                    
                    {!editingParent && (
                        <Input
                            label="Initial Password"
                            type="password"
                            placeholder="******"
                            error={errors.password?.message}
                            {...register('password', { 
                                required: 'Password is required for new parents', 
                                minLength: { value: 6, message: 'Min 6 chars'} 
                            })}
                        />
                    )}

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="isActive"
                            className="w-4 h-4 text-blue-600 rounded"
                            {...register('isActive')}
                        />
                        <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                            Active Account
                        </label>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit">{editingParent ? 'Update' : 'Create'}</Button>
                    </div>
                </form>
            </Modal>

            {/* Change Password Modal */}
            <Modal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                title={`Reset Password for ${selectedParentForPassword?.fullName}`}
            >
                <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-4">
                    <Input
                        label="New Password"
                        type="password"
                        placeholder="******"
                        error={passwordErrors.newPassword?.message}
                        {...registerPassword('newPassword', { 
                            required: 'Password is required', 
                            minLength: { value: 6, message: 'Min 6 chars'} 
                        })}
                    />
                    <div className="flex justify-end space-x-3 mt-6">
                        <Button type="button" variant="ghost" onClick={() => setIsPasswordModalOpen(false)}>Cancel</Button>
                        <Button type="submit">Reset Password</Button>
                    </div>
                </form>
            </Modal>

            {/* View Children Modal */}
            <Modal
                isOpen={isChildrenModalOpen}
                onClose={() => setIsChildrenModalOpen(false)}
                title="Children"
            >
                <div className="space-y-3">
                    {loadingChildren ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-2 text-gray-600">Loading children...</p>
                        </div>
                    ) : selectedParentChildren.length === 0 ? (
                        <p className="text-gray-600 text-center py-8">No children found</p>
                    ) : (
                        <div className="space-y-3">
                            {selectedParentChildren.map((child, index) => (
                                <div key={child.id} className="border rounded-lg p-4 hover:bg-gray-50">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{child.fullName}</h3>
                                            <p className="text-sm text-gray-600">Student Code: {child.studentCode}</p>
                                            <p className="text-sm text-gray-600">
                                                Gender: {child.gender} | DOB: {new Date(child.dob).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    {child.enrollments && child.enrollments.length > 0 && (
                                        <div className="mt-2 pt-2 border-t">
                                            <p className="text-xs font-semibold text-gray-700">Current Classes:</p>
                                            {child.enrollments.map((enrollment) => (
                                                <div key={enrollment.id} className="text-xs text-gray-600 ml-2">
                                                    • {enrollment.class?.name} - Grade {enrollment.class?.grade?.level} 
                                                    ({enrollment.class?.academicYear?.name})
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="mt-6 flex justify-end">
                    <Button variant="ghost" onClick={() => setIsChildrenModalOpen(false)}>Close</Button>
                </div>
            </Modal>
        </div>
    );
};

export default Parents;
