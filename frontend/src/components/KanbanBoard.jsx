import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import AddTaskModal from './AddTaskModal';
import api from '../services/api';

// Helper function to organize tasks by status
const organizeTasksByStatus = (tasksArray) => {
  const organized = {
    pending: [],
    'in-progress': [],
    completed: []
  };

  tasksArray.forEach(task => {
    if (organized[task.status]) {
      organized[task.status].push(task);
    }
  });

  return organized;
};

const KanbanBoard = () => {
  const [tasks, setTasks] = useState({
    pending: [],
    'in-progress': [],
    completed: []
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);

  const columns = [
    { id: 'pending', title: 'Pending', color: 'yellow' },
    { id: 'in-progress', title: 'In Progress', color: 'blue' },
    { id: 'completed', title: 'Completed', color: 'green' }
  ];

  // Fetch tasks from API on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setFetchLoading(true);
      setError(null);
      const response = await api.get('/tasks');
      const tasksArray = response.data.tasks || [];
      const organizedTasks = organizeTasksByStatus(tasksArray);
      setTasks(organizedTasks);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      
      // Provide more specific error messages
      if (err.code === 'ECONNREFUSED' || err.message?.includes('Network Error')) {
        setError('Cannot connect to backend server. Please ensure the backend is running on port 3000.');
      } else if (err.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
      } else if (err.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to load tasks. Please check your connection and try again.');
      }
    } finally {
      setFetchLoading(false);
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      setLoading(true);
      // Call backend API to create task
      const response = await api.post('/tasks', taskData);
      const newTask = response.data.task;

      // Update local state to add the new task to the appropriate column
      setTasks(prevTasks => ({
        ...prevTasks,
        [newTask.status]: [...(prevTasks[newTask.status] || []), newTask]
      }));
    } catch (error) {
      console.error('Error creating task:', error);
      throw error; // Re-throw to let modal handle error display
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      return true;
    } catch (error) {
      console.error('Error updating task status:', error);
      return false;
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      // Find the task to get its status (which column it's in)
      let taskStatus = null;
      for (const [status, taskList] of Object.entries(tasks)) {
        if (taskList.find(t => t.id === taskId)) {
          taskStatus = status;
          break;
        }
      }

      if (!taskStatus) {
        console.error('Task not found');
        return;
      }

      // Optimistic update - remove task from UI immediately
      setTasks(prevTasks => ({
        ...prevTasks,
        [taskStatus]: prevTasks[taskStatus].filter(t => t.id !== taskId)
      }));

      // Call API to delete task
      await api.delete(`/tasks/${taskId}`);
    } catch (error) {
      console.error('Error deleting task:', error);
      
      // Revert optimistic update on error
      fetchTasks();
      
      setError('Failed to delete task. Please try again.');
      setTimeout(() => setError(null), 3000);
    }
  };

  const onDragEnd = async (result) => {
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

    // Determine new status based on destination column
    const newStatus = destination.droppableId === 'pending' ? 'pending' :
                      destination.droppableId === 'in-progress' ? 'in-progress' : 'completed';

    // Store previous state for potential revert (deep copy)
    const previousTasks = {
      pending: [...tasks.pending],
      'in-progress': [...tasks['in-progress']],
      completed: [...tasks.completed]
    };

    // If moving within the same column (just reordering)
    if (source.droppableId === destination.droppableId) {
      const newTasks = Array.from(sourceColumn);
      newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, task);

      // Optimistic update
      setTasks({
        ...tasks,
        [source.droppableId]: newTasks
      });
    } else {
      // Moving to a different column (status change)
      const sourceTasks = Array.from(sourceColumn);
      const destTasks = Array.from(destColumn);

      // Remove from source
      sourceTasks.splice(source.index, 1);

      // Update task status
      const updatedTask = {
        ...task,
        status: newStatus
      };

      // Add to destination
      destTasks.splice(destination.index, 0, updatedTask);

      // Optimistic update - immediately update UI
      setTasks({
        ...tasks,
        [source.droppableId]: sourceTasks,
        [destination.droppableId]: destTasks
      });

      // Send API request to update status
      const success = await updateTaskStatus(task.id, newStatus);

      // If API call fails, revert to previous state
      if (!success) {
        setTasks(previousTasks);
        setError('Failed to update task status. Please try again.');
        // Clear error after 3 seconds
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          Task Board
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 md:px-6 md:py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span className="hidden md:inline">Add Task</span>
          <span className="md:hidden">Add</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
          {error}
        </div>
      )}

      {/* Loading State */}
      {fetchLoading && (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-white text-xl">Loading tasks...</div>
        </div>
      )}

      {/* Empty State */}
      {!fetchLoading && !error && 
       tasks.pending.length === 0 && 
       tasks['in-progress'].length === 0 && 
       tasks.completed.length === 0 && (
        <div className="flex flex-col justify-center items-center min-h-[400px] text-center">
          <p className="text-white/80 text-lg mb-4">No tasks found.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200"
          >
            Create Your First Task
          </button>
        </div>
      )}

      {!fetchLoading && (
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
                            <TaskCard task={task} onDelete={handleDeleteTask} />
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
      )}

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTask={handleAddTask}
      />
    </div>
  );
};

export default KanbanBoard;
