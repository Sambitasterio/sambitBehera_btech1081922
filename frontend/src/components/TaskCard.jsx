import React from 'react';

const TaskCard = ({ task }) => {
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

  return (
    <div
      className={`
        bg-white/10 backdrop-blur-sm border rounded-lg p-4 mb-3
        hover:bg-white/15 transition-all duration-200 cursor-grab
        active:cursor-grabbing shadow-md
        ${getStatusColor(task.status)}
        ${isOverdue(task.due_date) ? 'ring-2 ring-red-500/50' : ''}
      `}
    >
      <h3 className="font-semibold text-white mb-2 text-lg">
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
