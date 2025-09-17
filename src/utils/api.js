// src/utils/api.js

import {
  updateJob as updateJobInDB,
  addJob as addJobToDB,
  updateCandidate as updateCandidateInDB,
  addCandidate as addCandidateToDB, // Assuming you have this function in storage.js
  getAssessmentByJobId as getAssessmentFromDB,
  addAssessment as addAssessmentToDB,
  updateAssessment as updateAssessmentInDB,
  addAssessmentResponse as addAssessmentResponseToDB,
} from "./storage";

// --- Private Helper Function for API Calls ---
const apiClient = async (endpoint, options = {}) => {
  // Simulate network delay and a 10% chance of a random network error
  const delay = Math.floor(Math.random() * 800) + 200;
  await new Promise((resolve) => setTimeout(resolve, delay));
  if (Math.random() < 0.1) {
    throw new Error("A network error occurred. Please try again.");
  }

  const response = await fetch(endpoint, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    const errorInfo = await response.json().catch(() => ({}));
    throw new Error(errorInfo.error || "API request failed");
  }

  // Handle responses with no content, like a successful DELETE request
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
  // The server now consistently returns { job: ... }
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
  
  // ✅ FIX: The function was incorrectly named 'updateJobInStorage'
  // It has been corrected to 'updateJobInDB' to match the import.
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

// ####################
// ## Candidates API
// ####################

export const fetchCandidates = async (params = {}) => {
  const searchParams = new URLSearchParams(params);
  const response = await apiClient(`/api/candidates?${searchParams}`);
  const candidates = response.candidates || [];

  // Keep the local IndexedDB in sync with the server data
  for (const candidate of candidates) {
    try {
      // This will update the candidate if they exist, or add them if they don't.
      // Assumes your storage function handles "upsert" logic.
      await updateCandidateInDB(candidate);
    } catch (e) {
      console.error(`Failed to sync candidate ${candidate.id}:`, e);
    }
  }

  return response;
};

export const updateCandidateStage = async (id, stage) => {
  const response = await apiClient(`/api/candidates/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ stage }),
  });
  
  // The response from the server is { candidate: { ... } }
  const updatedCandidate = response.candidate;
  
  // Pass the inner candidate object to the database function
  await updateCandidateInDB(updatedCandidate);
  
  return updatedCandidate;
};

// ####################
// ## Assessments API
// ####################

export const fetchAssessment = async (jobId) => {
  try {
    const localAssessment = await getAssessmentFromDB(jobId);
    if (localAssessment) return { assessment: localAssessment };
  } catch (e) {
     console.warn("Could not fetch assessment from local DB, fetching from network.");
  }

  const data = await apiClient(`/api/assessments/${jobId}`);
  if (data.assessment) {
    await addAssessmentToDB(data.assessment);
  }
  return data;
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

  // First, save the response to the local database for a fast UI
  await addAssessmentResponseToDB(responseData);

  // Then, send it to the server
  return apiClient(`/api/assessments/${assessmentId}/submit`, {
    method: "POST",
    body: JSON.stringify(responses),
  });
};