// components/assessments/PreviewPane.jsx
import { useState } from 'react';

// Change this from named export to default export
const PreviewPane = ({ assessment }) => {
  const [responses, setResponses] = useState({});

  const handleResponseChange = (questionId, value) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const renderQuestionInput = (question) => {
    // ... (rest of the renderQuestionInput function remains the same)
  };

  return (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="text-xl font-semibold mb-4">{assessment.title || 'Assessment Preview'}</h3>
      
      {assessment.description && (
        <p className="text-gray-600 mb-6">{assessment.description}</p>
      )}

      <div className="space-y-6">
        {assessment.questions.map((question, index) => (
          <div key={question.id} className="border-b pb-4">
            <div className="flex items-start mb-3">
              <span className="font-semibold mr-2">Q{index + 1}.</span>
              <div>
                <p className="font-medium">{question.text || '(No question text)'}</p>
                {question.required && (
                  <span className="text-red-500 text-sm ml-2">* Required</span>
                )}
              </div>
            </div>

            {renderQuestionInput(question)}

            {question.type === 'numeric' && question.min !== null && question.max !== null && (
              <p className="text-sm text-gray-500 mt-1">
                Must be between {question.min} and {question.max}
              </p>
            )}
          </div>
        ))}

        {assessment.questions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No questions to preview. Add questions in the builder tab.
          </div>
        )}
      </div>

      {assessment.questions.length > 0 && (
        <div className="mt-6">
          <button className="bg-green-500 text-white px-6 py-2 rounded">
            Submit Assessment
          </button>
        </div>
      )}
    </div>
  );
};

// Export as default
export default PreviewPane;