import React, { useState } from 'react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import Table from '../components/common/Table';
import { FaPlus, FaSearch, FaEdit, FaTrash } from 'react-icons/fa';

const TestComponents = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', role: '' });

  const columns = [
    { header: 'ID', accessor: 'id', className: 'w-20' },
    { header: 'Name', accessor: 'name' },
    { header: 'Role', accessor: 'role' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (item) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {item.status}
        </span>
      )
    },
    {
      header: 'Actions',
      render: () => (
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" icon={FaEdit} />
          <Button size="sm" variant="danger" icon={FaTrash} />
        </div>
      )
    }
  ];

  const data = [
    { id: 1, name: 'Nguyen Van A', role: 'Student', status: 'Active' },
    { id: 2, name: 'Tran Thi B', role: 'Teacher', status: 'Active' },
    { id: 3, name: 'Le Van C', role: 'Student', status: 'Inactive' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">Phase 1 Verification</h1>
        <p className="text-gray-600">Testing Core UI Components and Layouts.</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">1. Buttons</h2>
        <Card>
          <div className="flex flex-wrap gap-4 items-center">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="ghost">Ghost</Button>
            <Button disabled>Disabled</Button>
            <Button isLoading>Loading</Button>
            <Button icon={FaPlus}>With Icon</Button>
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
          </div>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">2. Form Controls</h2>
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Full Name" placeholder="Enter name" required />
            <Input label="Email" type="email" placeholder="Enter email" error="Invalid email address" />
            <Input label="Search" icon={FaSearch} placeholder="Search..." />
            <Select 
              label="Role" 
              options={[
                { value: 'admin', label: 'Admin' },
                { value: 'student', label: 'Student' },
                { value: 'teacher', label: 'Teacher' }
              ]} 
            />
          </div>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">3. Table</h2>
        <Table columns={columns} data={data} />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">4. Modal</h2>
        <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          title="Demo Modal"
          footer={
            <>
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={() => setIsModalOpen(false)}>Confirm</Button>
            </>
          }
        >
          <p className="text-gray-700">
            This is a demonstration of the reusable Modal component. 
            It supports different sizes, titles, and footer actions.
          </p>
        </Modal>
      </section>
    </div>
  );
};

export default TestComponents;
