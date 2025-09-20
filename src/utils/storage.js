// src/utils/storage.js - FINAL, COMPLETE VERSION
const DB_NAME = 'TalentFlowDB';
const DB_VERSION = 2; 
const STORE_JOBS = 'jobs';
const STORE_CANDIDATES = 'candidates';
const STORE_ASSESSMENTS = 'assessments';
const STORE_ASSESSMENT_RESPONSES = 'assessmentResponses';
const STORE_TIMELINE_EVENTS = 'timelineEvents';

let db = null;

export async function initDB() {
  return new Promise((resolve, reject) => {
    if (db) {
      return resolve(db);
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(new Error('Failed to open database'));
    request.onsuccess = (event) => {
      db = event.target.result;
      resolve(db);
    };
    request.onupgradeneeded = (event) => {
      const database = event.target.result;
      if (!database.objectStoreNames.contains(STORE_JOBS)) {
        database.createObjectStore(STORE_JOBS, { keyPath: 'id' });
      }
      if (!database.objectStoreNames.contains(STORE_CANDIDATES)) {
        database.createObjectStore(STORE_CANDIDATES, { keyPath: 'id' });
      }
      if (!database.objectStoreNames.contains(STORE_ASSESSMENTS)) {
        database.createObjectStore(STORE_ASSESSMENTS, { keyPath: 'jobId' });
      }
      if (!database.objectStoreNames.contains(STORE_ASSESSMENT_RESPONSES)) {
        const store = database.createObjectStore(STORE_ASSESSMENT_RESPONSES, { keyPath: 'id' });
        store.createIndex('assessmentId', 'assessmentId', { unique: false });
        store.createIndex('candidateId', 'candidateId', { unique: false });
      }
      if (!database.objectStoreNames.contains(STORE_TIMELINE_EVENTS)) {
        const store = database.createObjectStore(STORE_TIMELINE_EVENTS, { keyPath: 'id' });
        store.createIndex('candidateId', 'candidateId', { unique: false });
      }
    };
  });
}

async function get(storeName, id) {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(id);
    request.onerror = () => reject(new Error(`Failed to get item from ${storeName}`));
    request.onsuccess = () => resolve(request.result);
  });
}

async function getAll(storeName) {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();
    request.onerror = () => reject(new Error(`Failed to get all from ${storeName}`));
    request.onsuccess = () => resolve(request.result);
  });
}

async function put(storeName, item) {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(item);
    request.onerror = () => reject(new Error(`Failed to update item in ${storeName}`));
    request.onsuccess = () => resolve(item);
  });
}

export const getAllJobs = () => getAll(STORE_JOBS);
export const getJob = (id) => get(STORE_JOBS, id);
export const addJob = (job) => put(STORE_JOBS, job);
export const updateJob = (job) => put(STORE_JOBS, job);
export const saveAllJobs = (jobs) => {
  return new Promise(async (resolve, reject) => {
    const database = await initDB();
    const transaction = database.transaction([STORE_JOBS], 'readwrite');
    const store = transaction.objectStore(STORE_JOBS);
    jobs.forEach(job => store.put(job));
    transaction.oncomplete = () => resolve();
    transaction.onerror = (e) => reject(new Error('Failed to save all jobs: ' + e.target.error));
  });
};

export const getAllCandidates = () => getAll(STORE_CANDIDATES);
export const getCandidate = (id) => get(STORE_CANDIDATES, id);
export const addCandidate = (candidate) => put(STORE_CANDIDATES, candidate);
export const updateCandidate = (candidate) => put(STORE_CANDIDATES, candidate);
export const saveAllCandidates = (candidates) => {
  return new Promise(async (resolve, reject) => {
    const database = await initDB();
    const transaction = database.transaction([STORE_CANDIDATES], 'readwrite');
    const store = transaction.objectStore(STORE_CANDIDATES);
    candidates.forEach(candidate => store.put(candidate));
    transaction.oncomplete = () => resolve();
    transaction.onerror = (e) => reject(new Error('Failed to save all candidates: ' + e.target.error));
  });
};

export async function getAssessmentByJobId(jobId) {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_ASSESSMENTS], 'readonly');
    const store = transaction.objectStore(STORE_ASSESSMENTS);
    const request = store.get(jobId);
    request.onerror = () => reject(new Error('Failed to get assessment'));
    request.onsuccess = () => resolve(request.result);
  });
}
export async function addAssessment(assessment) {
  return put(STORE_ASSESSMENTS, assessment);
}

export async function updateAssessment(assessment) {
  return put(STORE_ASSESSMENTS, assessment);
}

// ✅ FIX: Export the function
export async function addAssessmentResponse(responseData) {
  return put(STORE_ASSESSMENT_RESPONSES, responseData);
}

// ✅ FIX: Export the function
export const getAllAssessmentResponses = () => getAll(STORE_ASSESSMENT_RESPONSES);

export async function addTimelineEvent(event) {
  return put(STORE_TIMELINE_EVENTS, event);
}

export async function getTimelineEventsForCandidate(candidateId) {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_TIMELINE_EVENTS], 'readonly');
    const store = transaction.objectStore(STORE_TIMELINE_EVENTS);
    const index = store.index('candidateId');
    const request = index.getAll(candidateId);
    request.onerror = () => reject(new Error('Failed to get timeline events'));
    request.onsuccess = () => resolve(request.result);
  });
}