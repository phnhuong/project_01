import React, { useState, useEffect } from 'react';
import scoreService from '../../services/scoreService';
import Table from '../../components/common/Table';
import { toast } from 'react-toastify';

const ScoreView = () => {
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchScores();
    }, []);

    const fetchScores = async () => {
        try {
            setLoading(true);
            const res = await scoreService.getScores({ limit: 50 }); // Fetch recent scores
            setScores(res.data || []);
        } catch (error) {
            toast.error('Failed to load scores');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { header: 'Student', accessor: 'studentName', render: (row) => row.student?.fullName || 'N/A' },
        { header: 'Class', accessor: 'className', render: (row) => row.class?.name || 'N/A' },
        { header: 'Subject', accessor: 'subjectName', render: (row) => row.subject?.name || 'N/A' },
        { header: 'Semester', accessor: 'semester' },
        { header: 'Type', accessor: 'scoreType' },
        { header: 'Value', accessor: 'value', className: 'font-bold text-blue-600' },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Score History</h1>
            <Table 
                columns={columns} 
                data={scores} 
                isLoading={loading} 
                keyExtractor={(item) => item.id}
            />
        </div>
    );
};

export default ScoreView;
