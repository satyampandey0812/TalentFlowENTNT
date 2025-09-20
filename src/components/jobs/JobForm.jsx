import { useState } from 'react';

export default function JobForm({ initialData = {}, onSubmit, onCancel, isSaving = false }) {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    department: initialData.department || '',
    location: initialData.location || '',
    description: initialData.description || '',
    // ✅ ADDED: State for the new salary field
    salaryRange: initialData.salaryRange || '',
    tagsInput: initialData.tags ? initialData.tags.join(', ') : '',
  });

  const isEditMode = !!initialData.id;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Job title is required.');
      return;
    }
    const finalData = {
      ...formData,
      tags: formData.tagsInput.split(',').map(tag => tag.trim()).filter(Boolean),
    };
    onSubmit(finalData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg mx-auto" style={{backgroundColor:"#D4F1F4"}}>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {isEditMode ? 'Edit Job Details' : 'Create New Job'}
      </h2>

      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Department</label>
        <input
          type="text"
          id="department"
          name="department"
          value={formData.department}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      
      {/* ✅ ADDED: Salary Range input field */}
      <div className="mb-4">
        <label htmlFor="salaryRange" className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
        <input
          type="text"
          id="salaryRange"
          name="salaryRange"
          value={formData.salaryRange}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="$80k - $120k"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        ></textarea>
      </div>
      <div className="mb-6">
        <label htmlFor="tagsInput" className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
        <input
          type="text"
          id="tagsInput"
          name="tagsInput"
          value={formData.tagsInput}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
        >
          {isSaving ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Create Job')}
        </button>
      </div>
    </form>
  );
}