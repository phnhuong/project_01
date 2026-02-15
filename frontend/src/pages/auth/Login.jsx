import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { FaUser, FaLock } from 'react-icons/fa';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Redirect if already logged in
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setLoginError('');
    try {
      const result = await login(data);
      if (result) {
          navigate('/');
      }
    } catch (error) {
      setLoginError(error.message || 'Invalid username or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Đăng Nhập</h2>
      
      {loginError && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
          {loginError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Tên đăng nhập"
          placeholder="Nhập tên đăng nhập"
          icon={FaUser}
          error={errors.username?.message}
          {...register('username', { required: 'Vui lòng nhập tên đăng nhập' })}
        />

        <Input
          label="Mật khẩu"
          type="password"
          placeholder="Nhập mật khẩu"
          icon={FaLock}
          error={errors.password?.message}
          {...register('password', { required: 'Vui lòng nhập mật khẩu' })}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input type="checkbox" className="rounded text-blue-500 focus:ring-blue-500" />
            <span className="ml-2 text-sm text-gray-600">Ghi nhớ đăng nhập</span>
          </label>
          <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
            Quên mật khẩu?
          </a>
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          isLoading={isSubmitting}
        >
          Đăng Nhập
        </Button>
      </form>
    </div>
  );
};

export default Login;
