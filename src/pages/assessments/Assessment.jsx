// pages/assessments/Assessment.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AssessmentBuilder from '../../components/assessment/AssessmentBuilder';
import AssessmentForm from '../../pages/assessments/AssessmentForm';
import { fetchAssessment, fetchAllAssessments, deleteAssessment } from '../../utils/api';

const Assessment = () => {
  const { jobId, assessmentId } = useParams();
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [takingTest, setTakingTest] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [showBuilder, setShowBuilder] = useState(false); // NEW

  useEffect(() => {
    const loadAssessments = async () => {
      setLoading(true);
      try {
        const data = await fetchAllAssessments();
        setAssessments(data.assessments);
      } catch (error) {
        console.error("Failed to load assessments:", error);
      } finally {
        setLoading(false);
      }
    };
    loadAssessments();
  }, []);

  const handleTakeAssessment = (assessment) => {
    setSelectedAssessment(assessment);
    setTakingTest(true);
  };

  const handleBackToAssessments = () => {
    setSelectedAssessment(null);
    setTakingTest(false);
  };

  // NEW: Handle assessment creation
  const handleAssessmentCreated = (newAssessment) => {
    setShowBuilder(false);
    setAssessments(prev => [newAssessment, ...prev]);
  };

  // Add delete handler
  const handleDeleteAssessment = async (assessmentId) => {
    if (!window.confirm("Are you sure you want to delete this assessment?")) return;
    try {
      await deleteAssessment(assessmentId);
      setAssessments(prev => prev.filter(a => a.id !== assessmentId));
    } catch (err) {
      alert("Failed to delete assessment.");
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading assessments...</div>;
  }
  
  if (takingTest) {
    return (
      <AssessmentForm 
        initialAssessment={selectedAssessment} 
        onBack={handleBackToAssessments}
      />
    );
  }

  return (
    <div className="p-4" style={{backgroundColor:"#D4F1F4"}}>
      {/* Create New Assessment Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowBuilder(true)}
          className="	bg-[#189AB4] hover:bg-[#75E6DA] text-white font-semibold px-6 py-2 rounded-md shadow transition"
        >
          + Create New Assessment
        </button>
      </div>

      {/* Assessment Builder Modal */}
      {showBuilder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 relative"
            style={{
              maxHeight: "90vh",        // Limit modal height to 90% of viewport
              overflowY: "auto",        // Enable vertical scroll if needed
            }}
          >
            <button
              onClick={() => setShowBuilder(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
              aria-label="Close"
            >
              &times;
            </button>
            <AssessmentBuilder
              onCreated={handleAssessmentCreated}
              onCancel={() => setShowBuilder(false)}
            />
          </div>
        </div>
      )}

      <div className="space-y-4">
        <p className="text-gray-600">
          Select an assessment below to see the questions or take the test.
        </p>
        {assessments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {assessments.map((assessment) => (
              <div
                key={assessment.id}
                className="relative rounded-lg shadow-md overflow-hidden group h-56 flex flex-col justify-end"
                style={{
                  backgroundImage: `url(${assessment.image || "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80"})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Overlay */}
                <div
                  className="absolute inset-0 transition group-hover:bg-opacity-80"
                  style={{
                    backgroundColor: "#75E6DA", opacity:0.5
                  }}
                />
                {/* Card Content */}
                <div className="relative z-10 p-6">
                  <h3 className="text-xl font-bold text-white drop-shadow">{assessment.title}</h3>
                  <p className="text-sm text-gray-200 mb-4 drop-shadow">{assessment.description}</p>
                  <button
                    onClick={() => handleTakeAssessment(assessment)}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors font-semibold shadow mr-2"
                  >
                    Take Assessment
                  </button>
                  <button
                    onClick={() => handleDeleteAssessment(assessment.id)}
                    className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition-colors font-semibold shadow ml-2"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No assessments available. Please create one.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assessment;