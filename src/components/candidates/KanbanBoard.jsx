// src/components/candidates/KanbanBoard.jsx
import { useState, useEffect } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import StageColumn from "./StageColumn"; // Your existing column component

// Define the order and names of your stages
const STAGES = ["applied", "screen", "tech", "offer", "hired", "rejected"];

export default function KanbanBoard() {
  const [candidatesByStage, setCandidatesByStage] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch all candidates and group them by stage
  const fetchAndGroupCandidates = async () => {
    try {
      setLoading(true);
      // Fetch ALL candidates at once, without pagination, for the board view
      const res = await fetch("/api/candidates?pageSize=1000"); 
      if (!res.ok) throw new Error("Failed to fetch candidates");
      const data = await res.json();

      // Initialize an object with empty arrays for each stage
      const grouped = STAGES.reduce((acc, stage) => {
        acc[stage] = [];
        return acc;
      }, {});

      // Populate the groups with candidates from the API
      data.candidates.forEach((candidate) => {
        if (grouped[candidate.stage]) {
          grouped[candidate.stage].push(candidate);
        }
      });
      
      setCandidatesByStage(grouped);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndGroupCandidates();
  }, []);

  // This function is the CORE of the drag-and-drop logic
  const handleOnDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    // 1. Do nothing if the card is dropped outside a valid column
    if (!destination) return;

    // 2. Do nothing if the card is dropped in the same place
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const startStage = source.droppableId;
    const endStage = destination.droppableId;
    const candidateId = draggableId;

    // 3. Optimistic UI Update
    const newCandidatesByStage = { ...candidatesByStage };
    // Remove candidate from the source column
    const sourceCandidates = Array.from(newCandidatesByStage[startStage]);
    const [movedCandidate] = sourceCandidates.splice(source.index, 1);
    newCandidatesByStage[startStage] = sourceCandidates;
    // Add candidate to the destination column
    const destinationCandidates = Array.from(newCandidatesByStage[endStage]);
    destinationCandidates.splice(destination.index, 0, movedCandidate);
    newCandidatesByStage[endStage] = destinationCandidates;
    
    // Update the state immediately for a smooth user experience
    setCandidatesByStage(newCandidatesByStage);

    // 4. Persist the change to the server
    try {
      const res = await fetch(`/api/candidates/${candidateId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: endStage }), // Update the stage
      });

      if (!res.ok) {
        throw new Error("Failed to update candidate stage.");
      }
    } catch (err) {
      console.error(err);
      // If the API call fails, revert the state to prevent UI inconsistency
      // (This is a simple rollback)
      fetchAndGroupCandidates(); 
      alert("Error: Could not move candidate. Reverting changes.");
    }
  };

  if (loading) return <p className="p-4">Loading Kanban board...</p>;
  if (error) return <p className="p-4 text-red-600">Error: {error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Candidate Pipeline</h2>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {STAGES.map((stage) => (
            <StageColumn
              key={stage}
              stage={stage}
              candidates={candidatesByStage[stage] || []}
              onUpdate={fetchAndGroupCandidates} // Pass the fetch function for updates
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}