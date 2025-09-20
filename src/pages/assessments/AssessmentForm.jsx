import { useState } from 'react';
import { submitAssessmentResponse } from '../../utils/api';
import { useParams } from 'react-router-dom';

export default function AssessmentForm({ initialAssessment, onBack }) {
  // Get all questions from all sections
  const questions = initialAssessment?.sections?.flatMap(section =>
    section.questions.map(q => ({
      ...q,
      sectionTitle: section.title
    }))
  ) || [];

  const [formData, setFormData] = useState({});
  const [score, setScore] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { assessmentId } = useParams();

  const handleChange = (questionId, value) => {
    setFormData(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    let calculatedScore = 0;
    questions.forEach(q => {
      if (formData[q.id] === q.answer) {
        calculatedScore += 1;
      }
    });

    setScore(calculatedScore);
    setIsSubmitted(true);
    setIsSubmitting(false);

    // ✅ Submit the score and answers to the API
    try {
      await submitAssessmentResponse(assessmentId, { score: calculatedScore, answers: formData });
    } catch (error) {
      console.error('Failed to submit assessment results:', error);
      alert('Failed to submit assessment. Please try again.');
    }
  };

  const handleFinishTest = () => {
    onBack();
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl relative">
      {/* Leave Assessment Button */}
      <button
        type="button"
        onClick={onBack}
        className="absolute top-4 right-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        Leave Assessment
      </button>

      <h2 className="text-2xl font-bold mb-4">MCQ Assessment</h2>
      {isSubmitted ? (
        <div className="text-center">
          <h3 className="text-3xl font-bold text-blue-600">Test Complete!</h3>
          <p className="text-lg mt-4">Your score is: <span className="font-bold">{score} / {questions.length}</span></p>
          <button
            onClick={handleFinishTest}
            className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors"
          >
            Finish Test
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {questions.map((q, index) => (
            <div key={q.id} className="p-4 border border-gray-200 rounded-lg">
              {q.sectionTitle && (
                <div className="text-xs text-gray-500 mb-1">{q.sectionTitle}</div>
              )}
              <p className="font-medium mb-2">{index + 1}. {q.text}</p>
              {/* Render based on question type */}
              {q.type === 'single-choice' && q.options && (
                <div className="space-y-2">
                  {q.options.map(option => (
                    <label key={option} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={q.id}
                        value={option}
                        checked={formData[q.id] === option}
                        onChange={() => handleChange(q.id, option)}
                        className="form-radio"
                        required={q.required}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}
              {q.type === 'multiple-choice' && q.options && (
                <div className="space-y-2">
                  {q.options.map(option => (
                    <label key={option} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name={`${q.id}-${option}`}
                        value={option}
                        checked={Array.isArray(formData[q.id]) && formData[q.id].includes(option)}
                        onChange={e => {
                          const prev = Array.isArray(formData[q.id]) ? formData[q.id] : [];
                          if (e.target.checked) {
                            handleChange(q.id, [...prev, option]);
                          } else {
                            handleChange(q.id, prev.filter(o => o !== option));
                          }
                        }}
                        className="form-checkbox"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}
              {q.type === 'text-short' && (
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={formData[q.id] || ''}
                  onChange={e => handleChange(q.id, e.target.value)}
                  required={q.required}
                />
              )}
              {q.type === 'text-long' && (
                <textarea
                  className="w-full border rounded px-3 py-2"
                  value={formData[q.id] || ''}
                  onChange={e => handleChange(q.id, e.target.value)}
                  rows={4}
                  required={q.required}
                />
              )}
              {/* Add more types as needed */}
            </div>
          ))}
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Test'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}