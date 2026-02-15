import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import userService from '../../services/userService';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaKey, FaFilter } from 'react-icons/fa';

// Role configuration with labels and colors
const ROLES = [
    { value: 'admin', label: 'Admin', color: 'bg-purple-100 text-purple-800' },
    { value: 'it_admin', label: 'IT Admin', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'principal', label: 'Principal', color: 'bg-red-100 text-red-800' },
    { value: 'homeroom_teacher', label: 'Homeroom Teacher', color: 'bg-blue-100 text-blue-800' },
    { value: 'subject_teacher', label: 'Subject Teacher', color: 'bg-green-100 text-green-800' },
    { value: 'teacher', label: 'Teacher', color: 'bg-teal-100 text-teal-800' },
    { value: 'staff', label: 'Staff', color: 'bg-gray-100 text-gray-800' }
];

const getRoleConfig = (roleValue) => {
    return ROLES.find(r => r.value === roleValue) || ROLES[ROLES.length - 1]; // Default to staff
};

const Users = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [selectedUserForPassword, setSelectedUserForPassword] = useState(null);
    const [roleFilter, setRoleFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
    const { 
        register: registerPassword, 
        handleSubmit: handleSubmitPassword, 
        reset: resetPassword, 
        formState: { errors: passwordErrors } 
    } = useForm();

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await userService.getAll();
            const userData = Array.isArray(res) ? res : (res.data || []);
            setUsers(userData);
            setFilteredUsers(userData);
        } catch (error) {
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Apply filters whenever users, roleFilter, or searchTerm changes
    useEffect(() => {
        let filtered = [...users];

        // Role filter
        if (roleFilter !== 'all') {
            filtered = filtered.filter(user => user.role === roleFilter);
        }

        // Search filter
        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            filtered = filtered.filter(user =>
                user.username?.toLowerCase().includes(search) ||
                user.fullName?.toLowerCase().includes(search) ||
                user.email?.toLowerCase().includes(search)
            );
        }

        setFilteredUsers(filtered);
    }, [users, roleFilter, searchTerm]);

    const handleAdd = () => {
        setEditingUser(null);
        reset({ username: '', fullName: '', email: '', role: 'teacher', password: '' });
        setIsModalOpen(true);
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setValue('username', user.username);
        setValue('fullName', user.fullName);
        setValue('email', user.email);
        setValue('role', user.role);
        setIsModalOpen(true);
    };

    const handleChangePassword = (user) => {
        setSelectedUserForPassword(user);
        resetPassword({ newPassword: '' });
        setIsPasswordModalOpen(true);
    }

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await userService.delete(id);
                toast.success('Deleted successfully');
                fetchUsers();
            } catch (error) {
                toast.error(error.message || 'Failed to delete');
            }
        }
    };

    const onSubmit = async (data) => {
        try {
            if (editingUser) {
                const { password, ...updateData } = data;
                await userService.update(editingUser.id, updateData);
                toast.success('Updated successfully');
            } else {
                await userService.create(data);
                toast.success('Created successfully');
            }
            setIsModalOpen(false);
            fetchUsers();
        } catch (error) {
            toast.error(error.message || 'Operation failed');
        }
    };

    const onSubmitPassword = async (data) => {
        if (!selectedUserForPassword) return;
        try {
            await userService.changePassword(selectedUserForPassword.id, { password: data.newPassword });
            toast.success('Password changed successfully');
            setIsPasswordModalOpen(false);
        } catch (error) {
            toast.error(error.message || 'Failed to change password');
        }
    }

    const columns = [
        { header: 'Username', accessor: 'username' },
        { header: 'Full Name', accessor: 'fullName' },
        { header: 'Email', accessor: 'email' },
        { 
            header: 'Role', 
            accessor: 'role',
            render: (row) => {
                const roleConfig = getRoleConfig(row.role);
                return (
                    <span className={`px-2 py-1 rounded text-xs font-bold ${roleConfig.color}`}>
                        {roleConfig.label.toUpperCase()}
                    </span>
                );
            }
        },
        {
            header: 'Actions',
            accessor: 'actions',
            render: (row) => (
                <div className="flex space-x-2">
                    <Button size="sm" variant="secondary" onClick={() => handleEdit(row)} icon={FaEdit} />
                    <Button size="sm" variant="warning" onClick={() => handleChangePassword(row)} icon={FaKey} title="Change Password" />
                    <Button size="sm" variant="danger" onClick={() => handleDelete(row.id)} icon={FaTrash} />
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
                <Button onClick={handleAdd} icon={FaPlus}>Add User</Button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center space-x-2 mb-3">
                    <FaFilter className="text-gray-600" />
                    <h3 className="font-semibold text-gray-700">Filters</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Search Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                        <input
                            type="text"
                            placeholder="Search by username, name, or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Role Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All Roles</option>
                            {ROLES.map(role => (
                                <option key={role.value} value={role.value}>{role.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Active Filters Display */}
                {(roleFilter !== 'all' || searchTerm) && (
                    <div className="mt-3 flex items-center space-x-2 text-sm text-gray-600">
                        <span>Active filters:</span>
                        {roleFilter !== 'all' && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                                Role: {getRoleConfig(roleFilter).label}
                                <button
                                    onClick={() => setRoleFilter('all')}
                                    className="ml-1 text-blue-600 hover:text-blue-800"
                                >
                                    ×
                                </button>
                            </span>
                        )}
                        {searchTerm && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                                Search: "{searchTerm}"
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="ml-1 text-blue-600 hover:text-blue-800"
                                >
                                    ×
                                </button>
                            </span>
                        )}
                        <button
                            onClick={() => {
                                setRoleFilter('all');
                                setSearchTerm('');
                            }}
                            className="text-blue-600 hover:text-blue-800 underline"
                        >
                            Clear all
                        </button>
                    </div>
                )}
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-600">
                Showing {filteredUsers.length} of {users.length} users
            </div>

            <Table 
                columns={columns} 
                data={filteredUsers} 
                isLoading={loading} 
                keyExtractor={(item) => item.id}
            />

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingUser ? 'Edit User' : 'Add User'}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Username"
                        placeholder="e.g. teacher01"
                        error={errors.username?.message}
                        disabled={!!editingUser}
                        {...register('username', { required: 'Username is required' })}
                    />
                    <Input
                        label="Full Name"
                        placeholder="e.g. Nguyen Van A"
                        error={errors.fullName?.message}
                        {...register('fullName', { required: 'Full Name is required' })}
                    />
                    <Input
                        label="Email"
                        type="email"
                        placeholder="e.g. email@example.com"
                        error={errors.email?.message}
                        {...register('email')}
                    />
                    <Select
                        label="Role"
                        options={ROLES.map(role => ({ value: role.value, label: role.label }))}
                        {...register('role')}
                    />
                    
                    {!editingUser && (
                         <Input
                            label="Initial Password"
                            type="password"
                            placeholder="******"
                            error={errors.password?.message}
                            {...register('password', { required: 'Password is required for new users', minLength: { value: 6, message: 'Min 6 chars'} })}
                        />
                    )}

                    <div className="flex justify-end space-x-3 mt-6">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit">{editingUser ? 'Update' : 'Create'}</Button>
                    </div>
                </form>
            </Modal>

             {/* Change Password Modal */}
             <Modal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                title={`Change Password for ${selectedUserForPassword?.username}`}
            >
                <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-4">
                    <Input
                        label="New Password"
                        type="password"
                        placeholder="******"
                        error={passwordErrors.newPassword?.message}
                        {...registerPassword('newPassword', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 chars'} })}
                    />
                    <div className="flex justify-end space-x-3 mt-6">
                        <Button type="button" variant="ghost" onClick={() => setIsPasswordModalOpen(false)}>Cancel</Button>
                        <Button type="submit">Change Password</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Users;
