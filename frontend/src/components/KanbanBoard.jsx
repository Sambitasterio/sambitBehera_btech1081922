import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';

// Mock data for demonstration
const initialTasks = {
  pending: [
    {
      id: '1',
      title: 'Design Landing Page',
      description: 'Create wireframes and mockups for the new landing page design',
      status: 'pending',
      due_date: '2024-12-20T00:00:00Z',
      created_at: '2024-12-10T00:00:00Z'
    },
    {
      id: '2',
      title: 'Write API Documentation',
      description: 'Document all REST API endpoints with examples',
      status: 'pending',
      due_date: '2024-12-25T00:00:00Z',
      created_at: '2024-12-11T00:00:00Z'
    },
    {
      id: '3',
      title: 'Setup CI/CD Pipeline',
      description: 'Configure GitHub Actions for automated testing and deployment',
      status: 'pending',
      due_date: null,
      created_at: '2024-12-12T00:00:00Z'
    }
  ],
  'in-progress': [
    {
      id: '4',
      title: 'Implement User Authentication',
      description: 'Add login and signup functionality with JWT tokens',
      status: 'in-progress',
      due_date: '2024-12-18T00:00:00Z',
      created_at: '2024-12-08T00:00:00Z'
    },
    {
      id: '5',
      title: 'Database Schema Design',
      description: 'Design and implement the database schema for the application',
      status: 'in-progress',
      due_date: '2024-12-22T00:00:00Z',
      created_at: '2024-12-09T00:00:00Z'
    }
  ],
  completed: [
    {
      id: '6',
      title: 'Project Setup',
      description: 'Initialize the project with React and Vite',
      status: 'completed',
      due_date: '2024-12-15T00:00:00Z',
      created_at: '2024-12-01T00:00:00Z'
    },
    {
      id: '7',
      title: 'Install Dependencies',
      description: 'Install and configure all required packages',
      status: 'completed',
      due_date: '2024-12-15T00:00:00Z',
      created_at: '2024-12-02T00:00:00Z'
    }
  ]
};

const KanbanBoard = () => {
  const [tasks, setTasks] = useState(initialTasks);

  const columns = [
    { id: 'pending', title: 'Pending', color: 'yellow' },
    { id: 'in-progress', title: 'In Progress', color: 'blue' },
    { id: 'completed', title: 'Completed', color: 'green' }
  ];

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // If dropped outside a droppable area
    if (!destination) {
      return;
    }

    // If dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Get the task being moved
    const sourceColumn = tasks[source.droppableId];
    const destColumn = tasks[destination.droppableId];
    const task = sourceColumn[source.index];

    // If moving within the same column
    if (source.droppableId === destination.droppableId) {
      const newTasks = Array.from(sourceColumn);
      newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, task);

      setTasks({
        ...tasks,
        [source.droppableId]: newTasks
      });
    } else {
      // Moving to a different column
      const sourceTasks = Array.from(sourceColumn);
      const destTasks = Array.from(destColumn);

      // Remove from source
      sourceTasks.splice(source.index, 1);

      // Update task status
      const updatedTask = {
        ...task,
        status: destination.droppableId === 'pending' ? 'pending' :
                destination.droppableId === 'in-progress' ? 'in-progress' : 'completed'
      };

      // Add to destination
      destTasks.splice(destination.index, 0, updatedTask);

      setTasks({
        ...tasks,
        [source.droppableId]: sourceTasks,
        [destination.droppableId]: destTasks
      });
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 md:mb-8">
        Task Board
      </h1>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {columns.map((column) => (
            <div
              key={column.id}
              className="flex flex-col bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 p-4 md:p-6 min-h-[500px]"
            >
              {/* Column Header */}
              <div className="mb-4 pb-4 border-b border-white/20">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl md:text-2xl font-bold text-white">
                    {column.title}
                  </h2>
                  <span className="bg-white/20 text-white text-sm font-semibold px-3 py-1 rounded-full">
                    {tasks[column.id]?.length || 0}
                  </span>
                </div>
              </div>

              {/* Droppable Area */}
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`
                      flex-1 transition-colors duration-200
                      ${snapshot.isDraggingOver ? 'bg-white/5 rounded-lg' : ''}
                    `}
                  >
                    {tasks[column.id]?.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`
                              ${snapshot.isDragging ? 'opacity-50 rotate-2' : ''}
                            `}
                          >
                            <TaskCard task={task} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;
