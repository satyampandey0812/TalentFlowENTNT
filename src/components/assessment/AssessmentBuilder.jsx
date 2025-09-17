// components/assessments/AssessmentBuilder.jsx
import { useState } from 'react';
import QuestionEditor from './QuestionEditor';
import PreviewPane from './PreviewPane';
import { saveAssessment } from '../../utils/api';

const QUESTION_TYPES = [
  { value: 'single-choice', label: 'Single Choice' },
  { value: 'multiple-choice', label: 'Multiple Choice' },
  { value: 'text-short', label: 'Short Text' },
  { value: 'text-long', label: 'Long Text' },
  { value: 'numeric', label: 'Numeric' },
  { value: 'file', label: 'File Upload' },
];

export default function AssessmentBuilder({ jobId, initialAssessment }) {
  const [assessment, setAssessment] = useState(
    initialAssessment || {
      title: '',
      description: '',
      questions: [],
    }
  );
  const [activeTab, setActiveTab] = useState('builder');
  const [saving, setSaving] = useState(false);

  const addQuestion = (type) => {
    const newQuestion = {
      id: Date.now().toString(),
      type,
      text: '',
      required: false,
      options: type.includes('choice') ? ['', ''] : [],
      min: type === 'numeric' ? 0 : null,
      max: type === 'numeric' ? 100 : null,
    };
    
    setAssessment(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
  };

  const updateQuestion = (questionId, updates) => {
    setAssessment(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId ? { ...q, ...updates } : q
      ),
    }));
  };

  const removeQuestion = (questionId) => {
    setAssessment(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId),
    }));
  };

  const moveQuestion = (questionId, direction) => {
    const index = assessment.questions.findIndex(q => q.id === questionId);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === assessment.questions.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newQuestions = [...assessment.questions];
    [newQuestions[index], newQuestions[newIndex]] = [newQuestions[newIndex], newQuestions[index]];
    
    setAssessment(prev => ({ ...prev, questions: newQuestions }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await saveAssessment(jobId, assessment);
      alert('Assessment saved successfully!');
    } catch (error) {
      console.error('Failed to save assessment:', error);
      alert('Failed to save assessment. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Assessment Details</h3>
        <input
          type="text"
          placeholder="Assessment Title"
          value={assessment.title}
          onChange={(e) => setAssessment(prev => ({ ...prev, title: e.target.value }))}
          className="w-full border rounded px-3 py-2 mb-2"
        />
        <textarea
          placeholder="Assessment Description"
          value={assessment.description}
          onChange={(e) => setAssessment(prev => ({ ...prev, description: e.target.value }))}
          className="w-full border rounded px-3 py-2 h-20"
        />
      </div>

      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 ${activeTab === 'builder' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('builder')}
        >
          Builder
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'preview' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('preview')}
        >
          Preview
        </button>
      </div>

      {activeTab === 'builder' && (
        <div>
          <div className="mb-6">
            <h4 className="font-semibold mb-3">Add Question</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {QUESTION_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => addQuestion(type.value)}
                  className="border rounded px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {assessment.questions.map((question, index) => (
              <QuestionEditor
                key={question.id}
                question={question}
                index={index}
                onUpdate={(updates) => updateQuestion(question.id, updates)}
                onRemove={() => removeQuestion(question.id)}
                onMove={(direction) => moveQuestion(question.id, direction)}
              />
            ))}

            {assessment.questions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No questions added yet.</p>
                <p className="text-sm">Click on a question type above to get started.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'preview' && (
        <PreviewPane assessment={assessment} />
      )}

      <div className="mt-6 flex justify-end space-x-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Assessment'}
        </button>
      </div>
    </div>
  );
}