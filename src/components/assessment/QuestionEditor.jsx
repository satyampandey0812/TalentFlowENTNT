// src/components/assessments/QuestionEditor.jsx
import { useEffect } from 'react';

export default function QuestionEditor({
  question,
  index,
  onUpdate,
  onRemove,
  conditionalOptions = [],
}) {

  // Update question type on change
  useEffect(() => {
    if (question.type.includes('choice')) {
      onUpdate({ options: question.options.length ? question.options : ['', ''] });
    } else {
      onUpdate({ options: [] });
    }
  }, [question.type]);

  const addOption = () => {
    onUpdate({ options: [...question.options, ''] });
  };

  const updateOption = (optionIndex, value) => {
    const newOptions = [...question.options];
    newOptions[optionIndex] = value;
    onUpdate({ options: newOptions });
  };

  const removeOption = (optionIndex) => {
    const newOptions = question.options.filter((_, i) => i !== optionIndex);
    onUpdate({ options: newOptions });
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h5 className="font-medium text-gray-700">Question {index + 1}</h5>
        <div className="flex space-x-2">
          <button onClick={onRemove} className="text-red-500 hover:text-red-700 text-sm">Remove</button>
        </div>
      </div>
      
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700">Question Text</label>
        <input
          type="text"
          value={question.text}
          onChange={(e) => onUpdate({ text: e.target.value })}
          className="w-full border rounded px-3 py-2 mt-1"
          placeholder="e.g., What is your favorite programming language?"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select
            value={question.type}
            onChange={(e) => onUpdate({ type: e.target.value })}
            className="w-full border rounded px-3 py-2 mt-1"
          >
            {/* Omitted question types for brevity - should be a prop */}
          </select>
        </div>
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mt-1">
            <input
              type="checkbox"
              checked={question.required}
              onChange={(e) => onUpdate({ required: e.target.checked })}
              className="mr-2"
            />
            Required
          </label>
        </div>
      </div>

      {(question.type === 'single-choice' || question.type === 'multiple-choice') && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Options</label>
          {question.options.map((option, i) => (
            <div key={i} className="flex items-center mt-2">
              <input
                type="text"
                value={option}
                onChange={(e) => updateOption(i, e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder={`Option ${i + 1}`}
              />
              <button onClick={() => removeOption(i)} className="ml-2 text-red-500 hover:text-red-700">×</button>
            </div>
          ))}
          <button onClick={addOption} className="mt-2 text-blue-500 hover:underline text-sm">Add Option</button>
        </div>
      )}

      {question.type === 'numeric' && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Min Value</label>
            <input
              type="number"
              value={question.min}
              onChange={(e) => onUpdate({ min: e.target.value })}
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Max Value</label>
            <input
              type="number"
              value={question.max}
              onChange={(e) => onUpdate({ max: e.target.value })}
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>
        </div>
      )}

      {question.type.includes('text') && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Min Length</label>
            <input
              type="number"
              value={question.minLength}
              onChange={(e) => onUpdate({ minLength: parseInt(e.target.value) })}
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Max Length</label>
            <input
              type="number"
              value={question.maxLength}
              onChange={(e) => onUpdate({ maxLength: parseInt(e.target.value) })}
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>
        </div>
      )}

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Conditional Logic (Optional)</label>
        <select
          value={question.dependsOn ? `${question.dependsOn.questionId}:${question.dependsOn.value}` : ''}
          onChange={(e) => {
            const [questionId, value] = e.target.value.split(':');
            onUpdate({ dependsOn: e.target.value ? { questionId, value } : null });
          }}
          className="w-full border rounded px-3 py-2 mt-1"
        >
          <option value="">-- No Condition --</option>
          {conditionalOptions.map(q =>
            q.options.map(opt => (
              <option key={`${q.id}:${opt}`} value={`${q.id}:${opt}`}>
                Show if "{q.text}" is "{opt}"
              </option>
            ))
          )}
        </select>
      </div>
    </div>
  );
}