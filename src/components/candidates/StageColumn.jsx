// src/pages/candidates/StageColumn.jsx
import { Droppable, Draggable } from "@hello-pangea/dnd";
import CandidateCard from "../../components/candidates/CandidateCard";

export default function StageColumn({ stage, candidates = [], onUpdate }) {
  return (
    <div className="bg-gray-50 rounded-lg shadow p-3 flex flex-col max-h-[70vh]">
      <h3 className="text-lg font-semibold mb-2 capitalize">
        {stage} ({candidates.length})
      </h3>

      <Droppable droppableId={stage}>
        {(provided, droppableSnapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`space-y-2 min-h-[200px] overflow-auto p-1 ${
              droppableSnapshot.isDraggingOver ? "bg-blue-50" : ""
            }`}
          >
            {candidates.length === 0 && (
              <p className="text-sm text-gray-500">No candidates</p>
            )}

            {candidates.map((candidate, index) => (
              <Draggable
                key={candidate.id}
                draggableId={String(candidate.id)} // <-- required to be a string
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    // MUST pass provided.draggableProps.style
                    style={{
                      ...provided.draggableProps.style,
                      // optional: elevate while dragging
                      boxShadow: snapshot.isDragging ? "0 4px 12px rgba(0,0,0,0.12)" : undefined,
                    }}
                  >
                    <div className="flex gap-2 items-start">
                      {/* Drag handle: small button users can grab */}
                      <button
                        type="button"
                        {...provided.dragHandleProps}
                        className="p-2 rounded hover:bg-gray-200 cursor-grab active:cursor-grabbing"
                        aria-label="Drag"
                        title="Drag"
                      >
                        {/* simple icon */}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10 6h4M10 12h4M10 18h4" />
                        </svg>
                      </button>

                      {/* The actual card */}
                      <div className="flex-1">
                        <CandidateCard candidate={candidate} onUpdate={onUpdate} />
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
