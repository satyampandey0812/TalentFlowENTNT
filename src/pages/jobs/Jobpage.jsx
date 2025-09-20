import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import JobForm from '../../components/jobs/JobForm';
import Pagination from '../../components/common/Pagination';
import { fetchJobs, createJob } from '../../utils/api';
import React from 'react';

const statusColors = {
  active: 'bg-green-100 text-green-800',
  archived: 'bg-gray-100 text-gray-800',
};

export default function JobsPage() {
  const [showForm, setShowForm] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const pageSize = 10;

  useEffect(() => {
    const getJobs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params = { page, pageSize };
        if (statusFilter !== 'all') params.status = statusFilter;
        if (debouncedSearch) params.search = debouncedSearch;
        const data = await fetchJobs(params);
        setJobs(data.jobs);
        setTotalPages(data.totalPages);
        setTotalItems(data.total);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    getJobs();
    // eslint-disable-next-line
  }, [page, statusFilter, debouncedSearch]);

  // For error retry
  const retryJobs = () => {
    setError(null);
    setIsLoading(true);
    setPage(1); // Optionally reset to first page
    // The useEffect will re-run due to state change
  };

  const handleCreateJob = async (jobData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newJob = await createJob(jobData);
      setJobs(prevJobs => [...prevJobs, newJob]);
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-600">Loading jobs...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-600 font-bold text-lg mb-4">
          Error: {error}
        </div>
        <button
          onClick={retryJobs}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* Stylish Search Bar */}
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search jobs by title, department, or location..."
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />
      </div>

      {/* Status Filter */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded ${statusFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} font-medium transition-colors`}
            onClick={() => { setStatusFilter('all'); setPage(1); }}
             style={{ backgroundColor: "#189AB4" }}
          >
            All
          </button>
          <button
            className={`px-4 py-2 rounded ${statusFilter === 'active' ? 'bg-[#189AB4] text-white' : 'bg-gray-200 text-gray-700'} font-medium transition-colors`}
            onClick={() => { setStatusFilter('active'); setPage(1);  }}
          >
            Active
          </button>
          <button
            className={`px-4 py-2 rounded ${statusFilter === 'archived' ? 'bg-[#189AB4] text-white' : 'bg-gray-200 text-gray-700'} font-medium transition-colors`}
            onClick={() => { setStatusFilter('archived'); setPage(1); }}
          >
            Archived
          </button>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors"
           style={{ backgroundColor: "#189AB4" }}
        >
          Create New Job
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <JobForm 
            onSubmit={handleCreateJob}
            onCancel={() => setShowForm(false)} 
            isSaving={isLoading}
          />
        </div>
      )}

      <div className="bg-gray-100 p-6 rounded-lg shadow-inner" style={{ backgroundColor: "#D4F1F4" }}>
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Available Jobs ({jobs.length})
          {isLoading && <span className="ml-4 text-sm text-blue-500 animate-pulse">Loading...</span>}
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.length > 0 ? (
            jobs.map(job => (
              <li key={job.id} className="bg-white p-5 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                <Link to={`/jobs/${job.id}`} className="block">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColors[job.status]}`}>
                      {job.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{job.department} - {job.location}</p>
                  {job.salaryRange && <p className="text-sm font-medium text-green-700">Salary: {job.salaryRange}</p>}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {job.tags.map(tag => (
                      <span key={tag} className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              </li>
            ))
          ) : (
            !isLoading && (
              <p className="text-gray-500 col-span-full text-center py-10">
                No jobs found. Click "Create New Job" to add one.
              </p>
            )
          )}
        </ul>
        
        {jobs.length > 0 && (
          <div className="mt-8 flex justify-center">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              totalItems={totalItems}
              itemsPerPage={pageSize}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}