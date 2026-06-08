import { Check, Pencil, Trash2 } from 'lucide-react';

const TaskCard = ({ task, onToggle, onEdit, onDelete }) => {
  const done = task.status === 'completed';

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className={`task-card card ${task.status}`}>
      {/* Checkbox toggle */}
      <button
        id={`toggle-${task._id}`}
        className={`task-checkbox ${done ? 'checked' : ''}`}
        onClick={() => onToggle(task._id)}
        title={done ? 'Mark as pending' : 'Mark as completed'}
        aria-label={`Toggle: ${task.title}`}
      >
        {done && <Check size={11} color="#fff" strokeWidth={3} />}
      </button>

      {/* Content */}
      <div className="task-body">
        <h3 className="task-title">{task.title}</h3>
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}
        <div className="task-meta">
          <span className={`badge badge-${task.status}`}>{task.status}</span>
          <span className="task-date">{formatDate(task.createdAt)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="task-actions">
        <button
          id={`edit-${task._id}`}
          className="btn-icon"
          onClick={() => onEdit(task)}
          title="Edit task"
        >
          <Pencil size={14} />
        </button>
        <button
          id={`delete-${task._id}`}
          className="btn-icon danger"
          onClick={() => onDelete(task._id)}
          title="Delete task"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
