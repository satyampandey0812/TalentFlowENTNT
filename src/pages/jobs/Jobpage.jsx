// src/pages/jobs/Jobpage.jsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDebounce } from "../../utils/debounce.js";
import { updateJob, createJob } from "../../utils/api";
import SortableItem from "../../components/common/SortableItem";
import Modal from "../../components/common/Modal";
import JobForm from "../../components/jobs/JobForm";
import Pagination from "../../components/common/Pagination";

const ListSpinner = () => <div className="text-center py-16 text-gray-500">Loading...</div>;

export default function Jobpage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ page, pageSize, search: debouncedSearchTerm, status: statusFilter });
        const res = await fetch(`/api/jobs?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch jobs");
        const data = await res.json();
        setJobs(data.jobs || []);
        setTotal(data.total || 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [page, debouncedSearchTerm, statusFilter, refetchTrigger]);

  const handleCreateJob = async (formData) => {
    // ... (logic for creating a job)
  };

  const toggleArchive = async (id, currentStatus) => {
    e.stopPropagation();
    const newStatus = currentStatus === "active" ? "archived" : "active";
    try {
      await updateJob(id, { status: newStatus });
      setRefetchTrigger(c => c + 1);
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Could not update the job status. Please try again.");
    }
  };

  const handleDragEnd = async (event) => { /* ... */ };

  if (error) {
    return <div className="p-8 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Jobs Board</h2>
          <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
            + Create Job
          </button>
        </div>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by title, company, location..."
            value={searchTerm}
            onChange={(e) => { setPage(1); setSearchTerm(e.target.value); }}
            className="flex-grow border px-3 py-2 rounded-md"
          />
          <select
            value={statusFilter}
            onChange={(e) => { setPage(1); setStatusFilter(e.target.value); }}
            className="border px-3 py-2 rounded-md"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div className="min-h-[400px]">
          {loading ? ( <ListSpinner /> ) : jobs.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow-md"><p>No jobs found.</p></div>
          ) : (
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={jobs.map((j) => j.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                  {jobs.map((job) => (
                    <SortableItem key={job.id} id={job.id}>
                      <Link to={`/jobs/${job.id}`} className="block">
                        <div className="p-4 rounded-lg bg-white shadow-md border border-gray-200 hover:shadow-lg hover:border-blue-500 transition-all duration-200 cursor-pointer">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg text-blue-700">{job.title}</h3>
                              <p className="text-sm text-gray-800 font-medium">{job.company}</p>
                              <div className="flex items-center text-sm text-gray-500 mt-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                <span>{job.location}</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${ job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800' }`}>
                                {job.status}
                              </span>
                              {/* <button 
                                onClick={(e) => toggleArchive(e, job.id, job.status)} 
                                className="text-xs bg-gray-200 hover:bg-gray-300 font-semibold px-3 py-1 rounded-md z-10 relative"
                              >
                                {job.status === "active" ? "Archive" : "Unarchive"}
                              </button> */}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </SortableItem>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
        <div className="mt-8">
          <Pagination currentPage={page} totalPages={Math.ceil(total / pageSize)} onPageChange={setPage} totalItems={total} itemsPerPage={pageSize} />
        </div>
        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)}>
            <JobForm onSubmit={handleCreateJob} onCancel={() => setIsModalOpen(false)} isSaving={isSaving} />
          </Modal>
        )}
      </div>
    </div>
  );
}