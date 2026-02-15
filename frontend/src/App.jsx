import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Components
import PrivateRoute from './components/common/PrivateRoute';

// Pages
import Login from './pages/auth/Login';
import NotFound from './pages/NotFound';
import TestComponents from './pages/TestComponents';

import StudentList from './pages/students/StudentList';
import StudentForm from './pages/students/StudentForm';
import StudentDetail from './pages/students/StudentDetail';

import ScoreInput from './pages/scores/ScoreInput';
import ScoreView from './pages/scores/ScoreView';

import Dashboard from './pages/Dashboard';
import AcademicYears from './pages/admin/AcademicYears';
import Classes from './pages/admin/Classes';
import Subjects from './pages/admin/Subjects';
import Users from './pages/admin/Users';
import Parents from './pages/admin/Parents';
import Grades from './pages/admin/Grades';
import HierarchyExplorer from './pages/reports/HierarchyExplorer';
import ReportBuilder from './pages/reports/ReportBuilder';

// Placeholder Pages (To be implemented)
// const Dashboard = () => <div>Dashboard Content</div>;
const Scores = () => <div>Scores Input</div>;
const Settings = () => <div>Settings Page</div>;

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/students" element={<StudentList />} />
              <Route path="/students/new" element={<StudentForm />} />
              <Route path="/students/edit/:id" element={<StudentForm />} />
              <Route path="/students/:id" element={<StudentDetail />} />
              <Route path="/scores" element={<ScoreView />} />
              <Route path="/scores/input" element={<ScoreInput />} />
              <Route path="/admin/academic-years" element={<AcademicYears />} />
              <Route path="/admin/classes" element={<Classes />} />
              <Route path="/admin/subjects" element={<Subjects />} />
              <Route path="/admin/users" element={<Users />} />
              <Route path="/admin/parents" element={<Parents />} />
              <Route path="/admin/grades" element={<Grades />} />
              <Route path="/explorer" element={<HierarchyExplorer />} />
              <Route path="/reports" element={<ReportBuilder />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/test-components" element={<TestComponents />} />
            </Route>
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
