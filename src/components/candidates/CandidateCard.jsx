import { useState } from 'react';
import { Link } from 'react-router-dom';
import { updateCandidateStage } from '../../utils/api';

export default function CandidateCard({ candidate, onUpdate }) {
  const [isUpdating, setIsUpdating] = useState(false);

  const getStageBadgeColor = (stage) => {
    switch (stage) {
      case 'hired': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'offer': return 'bg-purple-100 text-purple-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  // In src/components/candidates/CandidateCard.jsx

 // In src/components/candidates/CandidateCard.jsx

  const handleStageChange = async (newStage) => {
    console.log("--- STARTING UPDATE ---");
    console.log("1. Setting isUpdating to true.");
    setIsUpdating(true);
    
    try {
      console.log("2. Calling API to update stage...");
      await updateCandidateStage(candidate.id, newStage);
      console.log("3. API call successful.");

      console.log("4. Calling onUpdate to refresh parent list...");
      onUpdate();
      console.log("5. onUpdate function finished.");

    } catch (error) {
      console.error("--- ERROR --- Failed to update stage:", error);
      alert("Error: Could not update candidate stage.");
    } finally {
      console.log("6. Entering 'finally' block, setting isUpdating to false.");
      setIsUpdating(false);
    }
  };
  return (
    <div className="flex justify-between items-center p-4 rounded-lg bg-white shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex-1">
        <Link to={`/candidates/${candidate.id}`} className="block">
          <h3 className="font-semibold text-lg text-blue-700 hover:underline">{candidate.name}</h3>
          <p className="text-sm text-gray-600">{candidate.email}</p>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <select
          value={candidate.stage}
          onChange={(e) => handleStageChange(e.target.value)}
          disabled={isUpdating}
          className={`px-3 py-2 rounded-full text-xs font-semibold capitalize border-none outline-none appearance-none cursor-pointer transition-colors ${getStageBadgeColor(candidate.stage)} disabled:opacity-50 disabled:cursor-not-allowed`}
          style={{ backgroundImage: 'none' }}
        >
          {isUpdating ? (
            <option>{`Updating...`}</option>
          ) : (
            <>
              <option value="applied">Applied</option>
              <option value="screen">Screen</option>
              <option value="tech">Tech Interview</option>
              <option value="offer">Offer</option>
              <option value="hired">Hired</option>
              <option value="rejected">Rejected</option>
            </>
          )}
        </select>
        
        <Link
          to={`/candidates/${candidate.id}`}
          className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-3 py-2 rounded-md transition-colors"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}
