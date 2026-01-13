import React from 'react';

const TaskCard = ({ task, onDelete }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 border-yellow-500/50';
      case 'in-progress':
        return 'bg-blue-500/20 border-blue-500/50';
      case 'completed':
        return 'bg-green-500/20 border-green-500/50';
      default:
        return 'bg-gray-500/20 border-gray-500/50';
    }
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && task.status !== 'completed';
  };

  const handleDelete = (e) => {
    e.stopPropagation(); // Prevent drag from triggering
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      onDelete(task.id);
    }
  };

  return (
    <div
      className={`
        bg-white/10 backdrop-blur-sm border rounded-lg p-4 mb-3
        hover:bg-white/15 transition-all duration-200 cursor-grab
        active:cursor-grabbing shadow-md relative group
        ${getStatusColor(task.status)}
        ${isOverdue(task.due_date) ? 'ring-2 ring-red-500/50' : ''}
      `}
    >
      {/* Delete Button */}
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1.5 bg-red-500/20 hover:bg-red-500/40 rounded-lg text-red-300 hover:text-red-200"
        title="Delete task"
        type="button"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>

      <h3 className="font-semibold text-white mb-2 text-lg pr-8">
        {task.title}
      </h3>
      
      {task.description && (
        <p className="text-white/70 text-sm mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-white/60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span
            className={`text-xs ${
              isOverdue(task.due_date)
                ? 'text-red-400 font-semibold'
                : 'text-white/60'
            }`}
          >
            {formatDate(task.due_date)}
          </span>
        </div>

        {isOverdue(task.due_date) && (
          <span className="text-xs bg-red-500/30 text-red-200 px-2 py-1 rounded">
            Overdue
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
