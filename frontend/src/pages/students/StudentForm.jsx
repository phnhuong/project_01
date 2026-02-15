import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import studentService from '../../services/studentService';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import { toast } from 'react-toastify';
import { FaSave, FaArrowLeft } from 'react-icons/fa';

const StudentForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    defaultValues: {
      studentCode: '',
      fullName: '',
      dob: '',
      gender: 'Nam',
      phone: '',
      address: '',
      parentId: '' // Currently optional/placeholder
    }
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchStudent = async () => {
        try {
          setLoading(true);
          const data = await studentService.getById(id);
          // Format date for input type="date"
          const formattedData = {
            ...data,
            dob: data.dob ? new Date(data.dob).toISOString().split('T')[0] : ''
          };
          reset(formattedData);
        } catch (error) {
          toast.error('Failed to load student details.');
          navigate('/students');
        } finally {
          setLoading(false);
        }
      };
      fetchStudent();
    }
  }, [id, isEditMode, navigate, reset]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      // Sanitize data
      const payload = { ...data };
      if (!payload.parentId) delete payload.parentId;
      if (!payload.phone) delete payload.phone;

      if (isEditMode) {
        await studentService.update(id, payload);
        toast.success('Student updated successfully!');
      } else {
        await studentService.create(payload);
        toast.success('Student created successfully!');
      }
      navigate('/students');
    } catch (error) {
      toast.error(error.message || 'Operation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" icon={FaArrowLeft} onClick={() => navigate('/students')} />
          <h1 className="text-2xl font-bold text-gray-800">
            {isEditMode ? 'Edit Student' : 'Add New Student'}
          </h1>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Student Code"
              placeholder="e.g. HS001"
              error={errors.studentCode?.message}
              disabled={isEditMode} // Usually code is unique and immutable
              {...register('studentCode', { required: 'Student Code is required' })}
            />
            
            <Input
              label="Full Name"
              placeholder="e.g. Nguyen Van A"
              error={errors.fullName?.message}
              {...register('fullName', { required: 'Full Name is required' })}
            />

            <Input
              label="Date of Birth"
              type="date"
              error={errors.dob?.message}
              {...register('dob', { required: 'Date of Birth is required' })}
            />

            <Select
              label="Gender"
              options={[
                { value: 'Nam', label: 'Nam' },
                { value: 'Nữ', label: 'Nữ' }
              ]}
              error={errors.gender?.message}
              {...register('gender', { required: 'Gender is required' })}
            />

            <Input
              label="Phone Number (Parent)"
              placeholder="e.g. 0912345678"
              error={errors.phone?.message}
              {...register('phone', { 
                pattern: {
                  value: /^[0-9]+$/,
                  message: 'Please enter a valid phone number'
                }
              })}
            />

             <Input
              label="Address"
              placeholder="e.g. 123 Main St"
              className="md:col-span-2"
              error={errors.address?.message}
              {...register('address')}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => navigate('/students')}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              isLoading={loading} 
              icon={FaSave}
            >
              {isEditMode ? 'Update Student' : 'Save Student'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;
