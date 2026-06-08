import { Check, Pencil, Trash2 } from 'lucide-react';

const TaskCard = ({ task, onToggle, onEdit, onDelete }) => {
  const isCompleted = task.status === 'completed';

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className={`task-card glass-card ${isCompleted ? 'completed' : ''}`}>
      {/* Status toggle checkbox */}
      <button
        id={`toggle-task-${task._id}`}
        className={`task-checkbox ${isCompleted ? 'checked' : ''}`}
        onClick={() => onToggle(task._id)}
        title={isCompleted ? 'Mark as pending' : 'Mark as completed'}
        aria-label={`Toggle task: ${task.title}`}
      >
        {isCompleted && <Check size={12} color="#fff" strokeWidth={3} />}
      </button>

      {/* Content */}
      <div className="task-body">
        <h3 className="task-title">{task.title}</h3>
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}
        <div className="task-meta">
          <span className={`badge badge-${task.status}`}>
            {task.status}
          </span>
          <span className="task-date">Created {formatDate(task.createdAt)}</span>
          {task.updatedAt !== task.createdAt && (
            <span className="task-date">· Updated {formatDate(task.updatedAt)}</span>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="task-actions">
        <button
          id={`edit-task-${task._id}`}
          className="btn-icon"
          onClick={() => onEdit(task)}
          title="Edit task"
          aria-label={`Edit task: ${task.title}`}
        >
          <Pencil size={15} />
        </button>
        <button
          id={`delete-task-${task._id}`}
          className="btn-icon"
          onClick={() => onDelete(task._id)}
          title="Delete task"
          aria-label={`Delete task: ${task.title}`}
          style={{ color: 'var(--danger)' }}
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
