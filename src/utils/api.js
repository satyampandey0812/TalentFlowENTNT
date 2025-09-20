// src/utils/api.js

import {
  updateJob as updateJobInDB,
  addJob as addJobToDB,
  updateCandidate as updateCandidateInDB,
  addCandidate as addCandidateToDB,
  getAssessmentByJobId as getAssessmentFromDB,
  addAssessment as addAssessmentToDB,
  updateAssessment as updateAssessmentInDB,
  addAssessmentResponse as addAssessmentResponseToDB,
  addTimelineEvent,
  getTimelineEventsForCandidate,
  getCandidate, 
  getAllAssessmentResponses as getAllAssessmentResponsesFromDB,
} from "./storage";

// --- Private Helper Function for API Calls ---
const apiClient = async (endpoint, options = {}) => {
  const delay = Math.floor(Math.random() * 800) + 200;
  await new Promise((resolve) => setTimeout(resolve, delay));

  const response = await fetch(endpoint, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    const errorInfo = await response.json().catch(() => ({}));
    throw new Error(errorInfo.error || "API request failed");
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

// ####################
// ## Jobs API
// ####################

export const fetchJobs = (params = {}) => {
  const searchParams = new URLSearchParams(params);
  return apiClient(`/api/jobs?${searchParams}`);
};

export const createJob = async (jobData) => {
  const newJobResponse = await apiClient("/api/jobs", {
    method: "POST",
    body: JSON.stringify(jobData),
  });
  await addJobToDB(newJobResponse.job);
  return newJobResponse.job;
};

export const updateJob = async (id, updates) => {
  const response = await fetch(`/api/jobs/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error('Failed to update job on server');
  }

  const data = await response.json();
  await updateJobInDB(data.job);

  return data;
};

export const reorderJob = async (id, orderData) => {
  const response = await apiClient(`/api/jobs/${id}/reorder`, {
    method: "PATCH",
    body: JSON.stringify(orderData),
  });
  await updateJobInDB(response.job);
  return response.job;
};

export const fetchJob = async (id) => {
  const response = await apiClient(`/api/jobs/${id}`);
  if (!response.ok) throw new Error('Job not found');
  return response.json();
};

// ####################
// ## Candidates API
// ####################

export const fetchCandidates = async (params = {}) => {
  const searchParams = new URLSearchParams(params);
  const response = await apiClient(`/api/candidates?${searchParams}`);
  const candidates = response.candidates || [];

  for (const candidate of candidates) {
    try {
      await updateCandidateInDB(candidate);
    } catch (e) {
      console.error(`Failed to sync candidate ${candidate.id}:`, e);
    }
  }

  return response;
};

export const updateCandidateStage = async (id, stage) => {
  const prevCandidate = await getCandidate(id); 

  const response = await apiClient(`/api/candidates/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ stage }),
  });

  const updatedCandidate = response.candidate;

  const timelineEvent = {
    id: `stage_change-${updatedCandidate.id}-${Date.now()}`,
    type: 'stage_change',
    candidateId: updatedCandidate.id,
    date: new Date().toISOString(),
    data: {
      from: prevCandidate?.stage, 
      to: updatedCandidate.stage,
    }
  };
  await addTimelineEvent(timelineEvent);

  await updateCandidateInDB(updatedCandidate);

  return updatedCandidate;
};

// ####################
// ## Assessments API
// ####################

// ✅ FIX: Export the getAllAssessmentResponses function from here
export const getAllAssessmentResponses = () => {
  // Since we don't have a backend route for this, we'll fetch from local storage
  return getAllAssessmentResponsesFromDB();
};

export const fetchAllAssessments = () => {
  return apiClient('/api/assessments');
};

export const fetchAssessment = async (jobId) => {
  try {
    const localAssessment = await getAssessmentFromDB(jobId);
    if (localAssessment) return localAssessment;
  } catch (e) {
    console.warn("Could not fetch assessment from local DB, fetching from network.");
  }
  try {
    const data = await apiClient(`/api/assessments/${jobId}`);
    if (data?.assessment) {
      await addAssessmentToDB(data.assessment);
      return data.assessment;
    }
  } catch (error) {
    if (error.message.includes("API request failed")) {
      return null;
    }
    throw error;
  }
  return null;
};

export const saveAssessment = async (jobId, assessmentData) => {
  const response = await apiClient(`/api/assessments/${jobId}`, {
    method: "PUT",
    body: JSON.stringify(assessmentData),
  });
  await updateAssessmentInDB(response.assessment);
  return response.assessment;
};

export const submitAssessmentResponse = async (assessmentId, responses) => {
  const responseData = {
    id: `${assessmentId}-${Date.now()}`,
    assessmentId,
    responses,
    submittedAt: new Date().toISOString(),
  };

  await addAssessmentResponseToDB(responseData);

  return apiClient(`/api/assessments/${assessmentId}/submit`, {
    method: "POST",
    body: JSON.stringify(responses),
  });
};

export const deleteAssessment = async (id) => {
  const res = await fetch(`/api/assessments/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete assessment');
  return await res.json();
};