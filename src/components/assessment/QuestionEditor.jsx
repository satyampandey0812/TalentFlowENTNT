// components/assessments/QuestionEditor.jsx
import { useState } from 'react';

// Change to default export
const QuestionEditor = ({ question, index, onUpdate, onRemove, onMove }) => {
  const [localQuestion, setLocalQuestion] = useState(question);

  const handleChange = (field, value) => {
    const updated = { ...localQuestion, [field]: value };
    setLocalQuestion(updated);
    onUpdate(updated);
  };

  const handleOptionChange = (optionIndex, value) => {
    const newOptions = [...localQuestion.options];
    newOptions[optionIndex] = value;
    handleChange('options', newOptions);
  };

  const addOption = () => {
    handleChange('options', [...localQuestion.options, '']);
  };

  const removeOption = (optionIndex) => {
    const newOptions = localQuestion.options.filter((_, i) => i !== optionIndex);
    handleChange('options', newOptions);
  };

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          <span className="font-semibold">Q{index + 1}</span>
          <span className="text-sm text-gray-500 capitalize">
            ({localQuestion.type.replace('-', ' ')})
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onMove('up')}
            disabled={index === 0}
            className="text-gray-500 hover:text-gray-700 disabled:opacity-30"
            title="Move up"
          >
            ↑
          </button>
          <button
            onClick={() => onMove('down')}
            disabled={index === question.totalQuestions - 1}
            className="text-gray-500 hover:text-gray-700 disabled:opacity-30"
            title="Move down"
          >
            ↓
          </button>
          <button
            onClick={onRemove}
            className="text-red-500 hover:text-red-700"
            title="Remove question"
          >
            ×
          </button>
        </div>
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Question Text</label>
        <input
          type="text"
          value={localQuestion.text}
          onChange={(e) => handleChange('text', e.target.value)}
          placeholder="Enter your question here"
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div className="mb-3">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={localQuestion.required}
            onChange={(e) => handleChange('required', e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm">Required question</span>
        </label>
      </div>

      {(localQuestion.type === 'single-choice' || localQuestion.type === 'multiple-choice') && (
        <div className="mb-3">
          <label className="block text-sm font-medium mb-2">Options</label>
          {localQuestion.options.map((option, optionIndex) => (
            <div key={optionIndex} className="flex items-center mb-2">
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(optionIndex, e.target.value)}
                placeholder={`Option ${optionIndex + 1}`}
                className="flex-1 border rounded px-3 py-1 mr-2"
              />
              {localQuestion.options.length > 2 && (
                <button
                  onClick={() => removeOption(optionIndex)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addOption}
            className="text-sm text-blue-500 hover:text-blue-700"
          >
            + Add Option
          </button>
        </div>
      )}

      {localQuestion.type === 'numeric' && (
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-sm font-medium mb-1">Minimum Value</label>
            <input
              type="number"
              value={localQuestion.min || ''}
              onChange={(e) => handleChange('min', parseInt(e.target.value) || 0)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Maximum Value</label>
            <input
              type="number"
              value={localQuestion.max || ''}
              onChange={(e) => handleChange('max', parseInt(e.target.value) || 100)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>
      )}

      {localQuestion.type === 'file' && (
        <div className="mb-3">
          <p className="text-sm text-gray-600">
            File upload question. Candidates will be able to upload files when taking this assessment.
          </p>
        </div>
      )}
    </div>
  );
};

// Export as default
export default QuestionEditor;