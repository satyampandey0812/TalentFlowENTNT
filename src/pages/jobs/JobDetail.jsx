import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function JobDetail() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ title: "", tags: "" });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/jobs/${jobId}`);
        if (!res.ok) {
          throw new Error("Job not found");
        }
        const data = await res.json();
        if (data.job) {
          setJob(data.job);
          setFormData({
            title: data.job.title,
            tags: data.job.tags ? data.job.tags.join(", ") : "",
          });
        } else {
          throw new Error("Invalid job data received");
        }
      } catch (err) {
        setJob(null);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [jobId]);

  // ✅ ADDED: Function to save edited job details
  const handleSave = async () => {
    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          tags: formData.tags.split(",").map((t) => t.trim()),
        }),
      });
      if (res.ok) {
        // Refetch data to show updates
        await fetchJob();
        setEditMode(false);
      }
    } catch (err) {
      console.error("Failed to update job", err);
    }
  };

  // ✅ ADDED: Function to toggle the job's active/archived status
  const toggleArchive = async () => {
    if (!job) return; // Guard against running if job isn't loaded
    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: job.status === "active" ? "archived" : "active",
        }),
      });
      if (res.ok) {
        // Refetch data to show the new status
        await fetchJob();
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };


  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (!job) return <div className="text-center p-8 text-red-500">Job not found</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center justify-center h-10 w-10 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors mb-6"
          aria-label="Go back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {!editMode ? (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className={`p-6 border-b-2 ${job.status === "archived" ? "bg-gray-100 border-red-500" : "bg-blue-50 border-blue-500"}`}>
              <div className="flex justify-between items-start">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{job.title}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${job.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {job.status.toUpperCase()}
                </span>
              </div>
              <p className="text-gray-600 mt-2">Slug: {job.slug}</p>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {job.tags && job.tags.length > 0 ? (
                    job.tags.map((tag, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 italic">No tags assigned</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 border-t pt-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Salary Range
                  </h3>
                  <p className="text-gray-600">{job.salaryRange}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h._01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Experience
                  </h3>
                  <p className="text-gray-600">{job.experience} {job.experience > 1 ? 'years' : 'year'}</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Edit Details
                </button>
                <button
                  onClick={toggleArchive}
                  className="flex items-center justify-center bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  {job.status === "active" ? "Archive Position" : "Unarchive Position"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Job Details</h2>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Job Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter job title"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Tags <span className="text-gray-500 text-sm">(comma separated)</span>
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="Design, Engineering, Full-time"
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSave}
                className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Save Changes
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="flex items-center justify-center bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}