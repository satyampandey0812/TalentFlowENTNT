



// pages/assessment/Assessment.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AssessmentBuilder from '../../components/assessment/AssessmentBuilder';

export default function Assessment() {
  const { jobId } = useParams();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (jobId) {
      loadAssessment();
    }
  }, [jobId]);

  const loadAssessment = async () => {
    try {
      const response = await fetch(`/api/assessments/${jobId}`);
      if (response.ok) {
        const data = await response.json();
        setAssessment(data.assessment);
      }
    } catch (error) {
      console.error('Failed to load assessment:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-4">Loading assessment...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Assessment Builder</h2>
      {jobId ? (
        <AssessmentBuilder 
          jobId={jobId} 
          initialAssessment={assessment} 
        />
      ) : (
        <div className="bg-white rounded-lg p-6 shadow-md">
          <p className="text-gray-600">
            Please select a job to create or edit an assessment.
          </p>
        </div>
      )}
    </div>
  );
}