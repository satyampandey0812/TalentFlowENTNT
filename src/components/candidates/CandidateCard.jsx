import { Link } from 'react-router-dom';
import { useState } from 'react';
import { updateCandidateStage } from '../../utils/api';

const stageColors = {
  applied: 'bg-blue-50 text-blue-600 border border-blue-200',
  screen: 'bg-indigo-50 text-indigo-600 border border-indigo-200',
  tech: 'bg-purple-50 text-purple-600 border border-purple-200',
  offer: 'bg-teal-50 text-teal-600 border border-teal-200',
  hired: 'bg-green-50 text-green-600 border border-green-200',
  rejected: 'bg-red-50 text-red-600 border border-red-200',
};

export default function CandidateCard({ candidate, onUpdate }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentStage, setCurrentStage] = useState(candidate.stage);

  const handleStageChange = async (e) => {
    const newStage = e.target.value;
    if (newStage === currentStage) {
      return;
    }

    setIsUpdating(true);
    try {
      await updateCandidateStage(candidate.id, newStage);
      setCurrentStage(newStage);
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to update candidate stage:', error);
      alert('Failed to update stage. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.01] p-6 flex flex-col sm:flex-row items-center sm:justify-between space-y-4 sm:space-y-0">
      <div className="flex items-center space-x-4 w-full sm:w-auto">
        <img
          src={`https://picsum.photos/seed/${candidate.id}/100`}
          alt={candidate.name}
          className="h-14 w-14 rounded-full object-cover border-2 border-white shadow-md"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-gray-900">
            <Link to={`/candidates/${candidate.id}`} className="hover:underline hover:text-blue-600 transition-colors">{candidate.name}</Link>
          </h3>
          <p className="text-gray-500 text-sm truncate mt-1">{candidate.email}</p>
        </div>
      </div>
      <div className="flex items-center space-x-4 w-full sm:w-auto justify-end">
        <div className="relative">
          <select
            value={currentStage}
            onChange={handleStageChange}
            disabled={isUpdating}
            className={`
              appearance-none px-4 py-2 pr-10 rounded-full text-sm font-semibold capitalize
              ${stageColors[currentStage]}
              ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              transition-all duration-200
            `}
          >
            <option value="applied">Applied</option>
            <option value="screen">Screen</option>
            <option value="tech">Tech Interview</option>
            <option value="offer">Offer</option>
            <option value="hired">Hired</option>
            <option value="rejected">Rejected</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9z" />
            </svg>
          </div>
        </div>
        <Link 
          to={`/candidates/${candidate.id}`}
          className="px-6 py-2 font-medium text-white rounded-full transition-colors duration-200 
                     	bg-[#189AB4]
                     hover:from-bg-[#189AB4] hover:to-bg-[#75E6DA]shadow-lg"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}