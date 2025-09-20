// src/pages/candidates/StageColumn.jsx
import { Droppable, Draggable } from "@hello-pangea/dnd";
import CandidateCard from "../../components/candidates/CandidateCard";

export default function StageColumn({ stage, candidates = [], onUpdate }) {
  return (
    <Droppable droppableId={stage}>
      {(provided, droppableSnapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`bg-gray-50 rounded-lg shadow p-3 flex flex-col max-h-[70vh] ${
            droppableSnapshot.isDraggingOver ? "bg-blue-100" : ""
          } overflow-auto select-none`}
        >
          <h3 className="text-lg font-semibold mb-2 capitalize">
            {stage} ({candidates.length})
          </h3>
          <div className="space-y-2 min-h-[200px] p-1">
            {candidates.length === 0 && (
              <p className="text-sm text-gray-500">No candidates</p>
            )}

            {candidates.map((candidate, index) => (
              <Draggable
                key={candidate.id}
                draggableId={String(candidate.id)}
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="select-none"
                    style={{
                      ...provided.draggableProps.style,
                      boxShadow: snapshot.isDragging
                        ? "0 4px 12px rgba(0,0,0,0.12)"
                        : undefined,
                    }}
                  >
                    <CandidateCard candidate={candidate} onUpdate={onUpdate} />
                  </div>
                )}
              </Draggable>
            ))}

            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
}
