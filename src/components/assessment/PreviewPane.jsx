// src/components/assessments/PreviewPane.jsx
import AssessmentForm from '../../pages/assessments/AssessmentForm'; // ✅ FIXED path

export default function PreviewPane({ assessment }) {
  const previewData = {
    ...assessment,
    isReadOnly: true,
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-xl font-bold mb-4">{assessment.title || 'Untitled Assessment'}</h3>
      <p className="text-gray-600 mb-6 whitespace-pre-wrap">{assessment.description}</p>
      
      {assessment.sections?.length > 0 ? (
        <AssessmentForm initialAssessment={previewData} isPreview={true} />
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No sections or questions to preview.</p>
        </div>
      )}
    </div>
  );
}
