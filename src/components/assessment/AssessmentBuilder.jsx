// src/components/assessments/AssessmentBuilder.jsx
import { useState } from 'react';
import SectionEditor from './SectionEditor';
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
      sections: [],
    }
  );
  const [activeTab, setActiveTab] = useState('builder');
  const [saving, setSaving] = useState(false);

  // ✅ Section handlers
  const addSection = () => {
    const newSection = {
      id: Date.now().toString(),
      title: '',
      description: '',
      questions: [],
    };
    setAssessment(prev => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
  };

  const updateSection = (sectionId, updates) => {
    setAssessment(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === sectionId ? { ...s, ...updates } : s
      ),
    }));
  };

  const removeSection = (sectionId) => {
    setAssessment(prev => ({
      ...prev,
      sections: prev.sections.filter(s => s.id !== sectionId),
    }));
  };

  // ✅ Question handlers
  const addQuestion = (sectionId, type) => {
    const newQuestion = {
      id: Date.now().toString(),
      type,
      text: '',
      required: false,
      options: type.includes('choice') ? ['', ''] : [],
      min: type === 'numeric' ? 0 : null,
      max: type === 'numeric' ? 100 : null,
      dependsOn: null,
      minLength: type.includes('text') ? 0 : null,
      maxLength: type.includes('text') ? 255 : null,
    };
    setAssessment(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === sectionId
          ? { ...s, questions: [...s.questions, newQuestion] }
          : s
      ),
    }));
  };

  const updateQuestion = (sectionId, questionId, updates) => {
    setAssessment(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === sectionId
          ? {
              ...s,
              questions: s.questions.map(q =>
                q.id === questionId ? { ...q, ...updates } : q
              ),
            }
          : s
      ),
    }));
  };

  const removeQuestion = (sectionId, questionId) => {
    setAssessment(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === sectionId
          ? { ...s, questions: s.questions.filter(q => q.id !== questionId) }
          : s
      ),
    }));
  };

  // ✅ Save handler
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
    <div className="bg-white rounded-lg shadow-md p-6" style={{backgroundColor:"#D4F1F4"}}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Assessment Details</h3>
        <input
          type="text"
          placeholder="Assessment Title"
          value={assessment.title}
          onChange={(e) =>
            setAssessment(prev => ({ ...prev, title: e.target.value }))
          }
          className="w-full border rounded px-3 py-2 mb-2"
        />
        <textarea
          placeholder="Assessment Description"
          value={assessment.description}
          onChange={(e) =>
            setAssessment(prev => ({ ...prev, description: e.target.value }))
          }
          className="w-full border rounded px-3 py-2 h-20"
        />
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 ${
            activeTab === 'builder'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600'
          }`}
          onClick={() => setActiveTab('builder')}
        >
          Builder
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === 'preview'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600'
          }`}
          onClick={() => setActiveTab('preview')}
        >
          Preview
        </button>
      </div>

      {/* Builder */}
      {activeTab === 'builder' && (
        <div>
          <button
            onClick={addSection}
            className="mb-4 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            Add Section
          </button>
          <div className="space-y-6">
            {assessment.sections.map((section) => (
              <SectionEditor
                key={section.id}
                section={section}
                allSections={assessment.sections}
                questionTypes={QUESTION_TYPES}
                onAddQuestion={(type) => addQuestion(section.id, type)}
                onUpdate={(updates) => updateSection(section.id, updates)}
                onRemove={() => removeSection(section.id)}
                onUpdateQuestion={(questionId, updates) =>
                  updateQuestion(section.id, questionId, updates)
                }
                onRemoveQuestion={(questionId) =>
                  removeQuestion(section.id, questionId)
                }
              />
            ))}
            {assessment.sections.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No sections added yet.</p>
                <p className="text-sm">
                  Click the "Add Section" button to get started.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Preview */}
      {activeTab === 'preview' && <PreviewPane assessment={assessment} />}

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
