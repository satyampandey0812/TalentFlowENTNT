import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { fetchJobs, fetchCandidates, getAllAssessmentResponses } from '../../utils/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const stageLabels = ['Applied', 'Screen', 'Tech Interview', 'Offer', 'Hired', 'Rejected'];

export default function Dashboard() {
  const [data, setData] = useState({
    jobs: 0,
    candidates: 0,
    assessmentResponses: 0,
    stages: {
      applied: 0,
      screen: 0,
      tech: 0,
      offer: 0,
      hired: 0,
      rejected: 0,
    },
    recentCandidates: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all jobs to count active ones
        const jobsResponse = await fetchJobs({ page: 1, pageSize: 1000 });
        const candidatesResponse = await fetchCandidates({ page: 1, pageSize: 1000 });
        const assessmentResponses = await getAllAssessmentResponses();

        const stageCounts = candidatesResponse.candidates.reduce((acc, candidate) => {
          acc[candidate.stage] = (acc[candidate.stage] || 0) + 1;
          return acc;
        }, {});

        // Assuming each job has an 'active' boolean property
        const activeJobsCount = jobsResponse.jobs
          ? jobsResponse.jobs.filter(job => job.status === "active").length
          : 0;

        setData({
          jobs: jobsResponse.total,
          candidates: candidatesResponse.total,
          assessmentResponses: assessmentResponses.length,
          stages: stageCounts,
          recentCandidates: candidatesResponse.candidates.slice(0, 5),
          activeJobs: activeJobsCount,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stageKeyMap = {
    'Applied': 'applied',
    'Screen': 'screen',
    'Tech Interview': 'tech',
    'Offer': 'offer',
    'Hired': 'hired',
    'Rejected': 'rejected',
  };

  const chartData = {
    labels: stageLabels,
    datasets: [
      {
        label: 'Candidates by Stage',
        data: stageLabels.map(label => data.stages[stageKeyMap[label]] || 0),
        backgroundColor: [
          'rgba(59, 130, 246, 0.6)',   // Applied - blue
          'rgba(99, 102, 241, 0.6)',   // Screen - indigo
          'rgba(168, 85, 247, 0.6)',   // Tech Interview - purple
          'rgba(20, 184, 166, 0.6)',   // Offer - teal
          'rgba(34, 197, 94, 0.6)',    // Hired - green
          'rgba(239, 68, 68, 0.6)',    // Rejected - red
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(99, 102, 241, 1)',
          'rgba(168, 85, 247, 1)',
          'rgba(20, 184, 166, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide the legend (removes blue block)
      },
      title: {
        display: true,
        text: 'Candidate Pipeline Status',
      },
    },
  };

  if (loading) {
    return <div className="p-8 text-center">Loading dashboard...</div>;
  }

  return (
    <div className="p-4 md:p-8 space-y-8" style={{backgroundColor:"#D4F1F4"}}>
      {/* <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1> */}
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between transition duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
          {/* Total Jobs */}
          <div>
            <h3 className="text-lg font-medium text-gray-500">Total Jobs</h3>
            <p className="mt-1 text-3xl font-bold text-blue-600">{data.jobs}</p>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between transition duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
          {/* Total Candidates */}
          <div>
            <h3 className="text-lg font-medium text-gray-500">Total Candidates</h3>
            <p className="mt-1 text-3xl font-bold text-purple-600">{data.candidates}</p>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between transition duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
          {/* Assessments Submitted */}
          <div>
            <h3 className="text-lg font-medium text-gray-500">Assessments Submitted</h3>
            <p className="mt-1 text-3xl font-bold text-green-600">{data.assessmentResponses}</p>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M16 16v.01" /></svg>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between transition duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
          {/* Active Jobs */}
          <div>
            <h3 className="text-lg font-medium text-gray-500">Active Jobs</h3>
            <p className="mt-1 text-3xl font-bold text-orange-600">
              {data.activeJobs !== undefined ? data.activeJobs : 0}
            </p>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
      </div>
      
      {/* Pipeline Chart & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Bar data={chartData} options={chartOptions} />
          {/* Color Legend */}
          <div className="flex flex-wrap gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 rounded" style={{background: 'rgba(59, 130, 246, 0.6)'}}></span> Applied
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 rounded" style={{background: 'rgba(99, 102, 241, 0.6)'}}></span> Screen
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 rounded" style={{background: 'rgba(168, 85, 247, 0.6)'}}></span> Tech Interview
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 rounded" style={{background: 'rgba(20, 184, 166, 0.6)'}}></span> Offer
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 rounded" style={{background: 'rgba(34, 197, 94, 0.6)'}}></span> Hired
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 rounded" style={{background: 'rgba(239, 68, 68, 0.6)'}}></span> Rejected
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Recent Candidates</h3>
          <ul className="divide-y divide-gray-200">
            {data.recentCandidates.map(candidate => (
              <li key={candidate.id} className="py-3 flex items-center space-x-4">
                <img src={candidate.avatar} alt={candidate.name} className="h-10 w-10 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{candidate.name}</p>
                  <p className="text-sm text-gray-500 truncate">{candidate.email}</p>
                </div>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
                  candidate.stage === 'applied' ? 'bg-blue-100 text-blue-800' :
                  candidate.stage === 'screen' ? 'bg-indigo-100 text-indigo-800' :
                  candidate.stage === 'tech' ? 'bg-purple-100 text-purple-800' :
                  candidate.stage === 'offer' ? 'bg-teal-100 text-teal-800' :
                  candidate.stage === 'hired' ? 'bg-green-100 text-green-800' :
                  candidate.stage === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {candidate.stage}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}