// App.jsx
import Navbar from './components/Navbar';
import { Route, Routes } from "react-router-dom";
import Jobpage from "./pages/jobs/Jobpage";
import Dashboard from './pages/dashboard/dashboard';
import Candidates from './pages/candidates/Candidates';
import Assessment from './pages/assessments/Assessment';
import JobDetail from "./pages/jobs/JobDetail";
import CandidateDetail from "./pages/candidates/candidateDetail";
import KanbanBoard from './components/candidates/KanbanBoard';
import AssessmentForm from '../src/pages/assessments/AssessmentForm';

function App() {
  return (
    <>
      <div>
        <Navbar/>
        <Routes>
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/jobs' element={<Jobpage/>}/>
          <Route path="/jobs/:jobId" element={<JobDetail />} />
          <Route path='/candidates' element={<Candidates/>}/>
          <Route path="/candidates/:candidateId" element={<CandidateDetail />} />
          <Route path='/assessments' element={<Assessment/>}/>
          <Route path="/jobs/:jobId/assessment" element={<Assessment />} />
          <Route path="/candidates/kanban" element={<KanbanBoard />} />
          <Route path="*" element={<Dashboard />} />
          {/* ✅ FIX: Add a new route for the assessment form */}
          <Route path="/assessments/:assessmentId/take" element={<AssessmentForm />} />
        </Routes>
      </div>
    </>
  )
}

export default App;