import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import classService from '../../services/classService';
import subjectService from '../../services/subjectService';
import studentService from '../../services/studentService';
import scoreService from '../../services/scoreService';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import { toast } from 'react-toastify';
import { FaSave, FaSearch, FaHistory } from 'react-icons/fa';

const ScoreInput = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scores, setScores] = useState({}); // Map: studentId -> score value

  const { register, watch, handleSubmit } = useForm({
    defaultValues: {
      classId: '',
      subjectId: '',
      semester: '1',
      scoreType: 'REGULAR'
    }
  });

  const selectedClass = watch('classId');
  const selectedSubject = watch('subjectId');
  const selectedSemester = watch('semester');
  const selectedType = watch('scoreType');

  // Load initial metadata
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clsData, subData] = await Promise.all([
          classService.getAll(),
          subjectService.getAll()
        ]);
        setClasses(clsData.data || []);
        setSubjects(subData.data || []);
      } catch (error) {
        toast.error('Failed to load classes or subjects');
      }
    };
    fetchData();
  }, []);

  // Fetch students when class changes
  useEffect(() => {
    if (selectedClass) {
      const fetchStudents = async () => {
        setLoading(true);
        try {
          // Assuming studentService.getAll supports classId filter
          const res = await studentService.getAll({ classId: selectedClass, limit: 100 });
          setStudents(res.data || []);
        } catch (error) {
          toast.error('Failed to load students');
        } finally {
          setLoading(false);
        }
      };
      fetchStudents();
    } else {
      setStudents([]);
    }
  }, [selectedClass]);

  // Handle score input change
  const handleScoreChange = (studentId, value) => {
    setScores(prev => ({
      ...prev,
      [studentId]: value
    }));
  };

  const onSubmit = async () => {
    if (!selectedClass || !selectedSubject) {
      toast.error('Please select Class and Subject');
      return;
    }

    setLoading(true);
    let successCount = 0;
    try {
        // Iterate over scores state and submit valid ones
        const promises = Object.entries(scores).map(async ([studentId, value]) => {
            if (value === '' || value === null) return;
            const payload = {
                studentId: parseInt(studentId),
                classId: parseInt(selectedClass),
                subjectId: parseInt(selectedSubject),
                semester: parseInt(selectedSemester),
                scoreType: selectedType,
                value: parseFloat(value)
            };
            
            // Basic valid range check
            if (payload.value < 0 || payload.value > 10) return;

            await scoreService.create(payload);
            successCount++;
        });

        await Promise.all(promises);
        
        if (successCount > 0) {
            toast.success(`Saved ${successCount} scores successfully!`);
            setScores({}); // Reset inputs or keep them? Maybe keep them for visual confirmation?
            // Ideally we should reload to show them as "saved". 
            // For now, let's just show success.
        } else {
            toast.info('No valid scores to save.');
        }

    } catch (error) {
      console.error(error);
      toast.error('Some scores failed to save. Check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Enter Scores</h1>
        <Button 
            variant="secondary" 
            icon={FaHistory} 
            onClick={() => navigate('/scores')}
        >
            View History
        </Button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Select 
          label="Class"
          options={classes.map(c => ({ value: c.id, label: c.name }))}
          {...register('classId')}
        />
        <Select 
          label="Subject"
          options={subjects.map(s => ({ value: s.id, label: s.name }))}
          {...register('subjectId')}
        />
        <Select 
          label="Semester"
          options={[
            { value: '1', label: 'Semester 1' },
            { value: '2', label: 'Semester 2' }
          ]}
          {...register('semester')}
        />
        <Select 
          label="Type"
          options={[
            { value: 'REGULAR', label: 'Regular (1x)' },
            { value: 'MIDTERM', label: 'Midterm (2x)' },
            { value: 'FINAL', label: 'Final (3x)' }
          ]}
          {...register('scoreType')}
        />
      </div>

      {students.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Full Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Input Score (0-10)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map(student => (
                <tr key={student.id}>
                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.studentCode}</td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.fullName}</td>
                   <td className="px-6 py-4 whitespace-nowrap">
                     <input
                       type="number"
                       min="0"
                       max="10"
                       step="0.1"
                       className="border border-gray-300 rounded px-3 py-1 w-24 focus:ring-blue-500 focus:border-blue-500"
                       placeholder="Enter..."
                       onChange={(e) => handleScoreChange(student.id, e.target.value)}
                     />
                   </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 border-t border-gray-200 flex justify-end">
            <Button onClick={handleSubmit(onSubmit)} isLoading={loading} icon={FaSave}>
              Save All Scores
            </Button>
          </div>
        </div>
      ) : (
         <div className="text-center py-10 text-gray-500">
           {selectedClass ? 'No students found in this class.' : 'Please select a class to start entering scores.'}
         </div>
      )}
    </div>
  );
};

export default ScoreInput;
