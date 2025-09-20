import { useEffect, useState } from "react";
import CandidateCard from "../../components/candidates/CandidateCard";
import Pagination from "../../components/common/Pagination";
import { useDebounce } from "../../utils/debounce.js";

export default function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [stage, setStage] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCandidates, setTotalCandidates] = useState(0);
  const pageSize = 10;

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchCandidates = async (isFirstLoad = false) => {
    if (isFirstLoad) {
      setLoading(true);
    }
    setError(null);

    try {
      const params = new URLSearchParams({
        page,
        pageSize,
        search: debouncedSearchTerm,
        stage,
      });

      const res = await fetch(`/api/candidates?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch candidates");
      const data = await res.json();

      setCandidates(data.candidates || []);
      setTotalPages(data.totalPages || 1);
      setTotalCandidates(data.total || 0);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      if (isFirstLoad) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchCandidates(true);
  }, []);

  useEffect(() => {
    if (!loading) {
      if (page !== 1) setPage(1);
      fetchCandidates(false);
    }
  }, [debouncedSearchTerm, stage]);
  
  useEffect(() => {
    if (!loading) {
      fetchCandidates(false);
    }
  }, [page]);

  if (loading) return <p className="p-8 text-center text-gray-600">Loading candidates...</p>;
  if (error) return <p className="p-8 text-center text-red-600">Error: {error}</p>;

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen"
    style={{backgroundColor:"#D4F1F4"}}>
      <div className="max-w-6xl mx-auto">
        {/* <h2 className="text-3xl font-bold mb-6 text-gray-800">Candidates</h2> */}

        <div className="bg-white p-6 rounded-2xl shadow-xl mb-8 flex flex-col sm:flex-row gap-4 items-center animate-fade-in">
          <input
            type="text"
            placeholder="Search by name, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow border px-4 py-2 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          />
          <select
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            className="border px-4 py-2 rounded-xl shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          >
            <option value="all">All Stages</option>
            <option value="applied">Applied</option>
            <option value="screen">Screen</option>
            <option value="tech">Tech Interview</option>
            <option value="offer">Offer</option>
            <option value="hired">Hired</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="min-h-[300px]">
          {candidates.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow-md animate-fade-in">
              <p>No candidates found matching your criteria.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {candidates.map((candidate) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  onUpdate={fetchCandidates}
                />
              ))}
            </div>
          )}
        </div>

        <div className="mt-10">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            totalItems={totalCandidates}
            itemsPerPage={pageSize}
          />
        </div>
      </div>
    </div>
  );
}