// src/components/assessments/SectionEditor.jsx
import QuestionEditor from './QuestionEditor';

export default function SectionEditor({
  section,
  allSections,
  questionTypes,
  onUpdate,
  onRemove,
  onAddQuestion,
  onUpdateQuestion,
  onRemoveQuestion,
  onAddTenMCQs,
}) {
  const getConditionalQuestionOptions = () => {
    let options = [];
    allSections.forEach(s => {
      s.questions.forEach(q => {
        if (q.type === 'single-choice' || q.type === 'multiple-choice') {
          options.push(q);
        }
      });
    });
    return options;
  };

  return (
    <div className="border rounded-lg p-4 bg-gray-50 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Section Title"
          value={section.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="text-lg font-semibold w-full bg-transparent focus:outline-none"
        />
        <button onClick={onRemove} className="text-red-500 hover:text-red-700">
          Remove
        </button>
      </div>
      <textarea
        placeholder="Section Description (Optional)"
        value={section.description}
        onChange={(e) => onUpdate({ description: e.target.value })}
        className="w-full border rounded px-3 py-2 text-sm h-16"
      />

      <div className="my-4">
        <h4 className="font-semibold mb-2">Add Question to Section</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {questionTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => onAddQuestion(type.value)}
              className="border rounded px-3 py-2 text-sm hover:bg-gray-100 transition-colors"
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <div className="my-4">
        <button
          type="button"
          className="mb-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          onClick={onAddTenMCQs}
        >
          Add 10 Sample MCQ Questions
        </button>
      </div>

      <div className="space-y-4">
        {section.questions.map((question, index) => (
          <QuestionEditor
            key={question.id}
            question={question}
            index={index}
            onUpdate={(updates) => onUpdateQuestion(question.id, updates)}
            onRemove={() => onRemoveQuestion(question.id)}
            conditionalOptions={getConditionalQuestionOptions()}
          />
        ))}
      </div>
    </div>
  );
}