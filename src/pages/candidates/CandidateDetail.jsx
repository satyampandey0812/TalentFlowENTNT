// pages/candidates/CandidateDetail.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from '../../components/common/Modal'; // Make sure Modal is imported

// ... (SVG Icons remain the same) ...
const BriefcaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>;


export default function CandidateDetail() {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeline, setTimeline] = useState([]);
  
  // 1. Add state to control the image modal
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useEffect(() => {
    loadCandidate();
    loadTimeline();
  }, [candidateId]);

  // ... (loadCandidate and loadTimeline functions are unchanged) ...
  const loadCandidate = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/candidates/${candidateId}`);
      if (!response.ok) throw new Error('Candidate not found');
      const data = await response.json();
      setCandidate(data.candidate);
    } catch (error) {
      console.error('Failed to load candidate:', error);
    } finally {
      setLoading(false);
    }
  };

  // In pages/candidates/CandidateDetail.jsx

  const loadTimeline = async () => {
    try {
      const response = await fetch(`/api/candidates/${candidateId}/timeline`);
      if (!response.ok) {
        throw new Error('Failed to load timeline');
      }
      const data = await response.json();
      setTimeline(data.timeline || []);
    } catch (error) {
      console.error('Failed to load timeline:', error);
      setTimeline([]); // Set to empty array on error
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading candidate details...</div>;
  }

  if (!candidate) {
    return <div className="p-8 text-center text-red-500">Candidate not found</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium"
        >
          &larr; Back to candidates
        </button>

        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="p-6 border-b-2 border-gray-100">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                {/* 2. Make the profile picture clickable */}
                <img
                  src={`https://picsum.photos/seed/${candidateId}/200`}
                  alt={candidate.name}
                  onClick={() => setIsImageModalOpen(true)}
                  className="h-16 w-16 rounded-full object-cover mr-4 border-2 border-white shadow-md cursor-pointer transition-transform hover:scale-105"
                />
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">{candidate.name}</h1>
                  <p className="text-gray-500">Applied on {new Date(candidate.appliedAt).toLocaleDateString()}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${
                candidate.stage === 'hired' ? 'bg-green-100 text-green-800' :
                candidate.stage === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {candidate.stage}
              </span>
            </div>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* ... (Contact and Job info remains the same) ... */}
             <div className="flex items-center">
              <MailIcon />
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="text-gray-800">{candidate.email}</p>
              </div>
            </div>
            <div className="flex items-center">
              <PhoneIcon />
              <div>
                <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                <p className="text-gray-800">{candidate.phone}</p>
              </div>
            </div>
            <div className="flex items-center">
              <BriefcaseIcon />
              <div>
                <h3 className="text-sm font-medium text-gray-500">Applying for</h3>
                <p className="text-gray-800 font-semibold">{candidate.job?.title || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ... (Timeline section remains the same) ... */}
        <h2 className="text-2xl font-bold mb-4 text-gray-700">Activity Timeline</h2>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="relative border-l-2 border-gray-200">
            {timeline.map((event) => (
              <div key={event.id} className="mb-8 ml-6">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white">
                  {event.type === 'stage_change' ? '🔄' : '📝'}
                </span>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-1">
                        <p className="text-sm font-semibold text-gray-800">
                        {event.type === 'stage_change' && `Stage Change`}
                        {event.type === 'note_added' && `Note Added`}
                        </p>
                        <time className="text-xs font-normal text-gray-500">
                        {new Date(event.date).toLocaleString()}
                        </time>
                    </div>
                    <p className="text-gray-700">
                    {event.type === 'stage_change' && (
                        <>Moved from <span className="font-medium capitalize">{event.data.from}</span> to <span className="font-medium capitalize">{event.data.to}</span>.</>
                    )}
                    {event.type === 'note_added' && event.data.content}
                    </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Add the Modal for displaying the large image */}
      {isImageModalOpen && (
        <Modal onClose={() => setIsImageModalOpen(false)}>
          <img
            src={`https://picsum.photos/seed/${candidateId}/800`}
            alt={`${candidate.name} - enlarged`}
            className="max-w-full max-h-[80vh] rounded-lg shadow-xl"
          />
        </Modal>
      )}
    </div>
  );
}