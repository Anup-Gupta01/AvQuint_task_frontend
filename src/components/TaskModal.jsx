import { useState, useEffect } from 'react';
import { X, CheckSquare } from 'lucide-react';

const INITIAL_FORM = { title: '', description: '', status: 'pending' };

const TaskModal = ({ isOpen, onClose, onSubmit, editTask, loading }) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  // Populate form when editing an existing task
  useEffect(() => {
    if (editTask) {
      setForm({
        title: editTask.title || '',
        description: editTask.description || '',
        status: editTask.status || 'pending',
      });
    } else {
      setForm(INITIAL_FORM);
    }
    setErrors({});
  }, [editTask, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Task title is required';
    else if (form.title.trim().length > 100) newErrors.title = 'Title cannot exceed 100 characters';
    if (form.description.length > 500) newErrors.description = 'Description cannot exceed 500 characters';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit(form);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title" id="modal-title">
            {editTask ? '✏️ Edit Task' : '✨ New Task'}
          </h2>
          <button
            id="close-modal-btn"
            className="btn-icon"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Title */}
            <div className="form-group">
              <label className="form-label" htmlFor="task-title">
                Title <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                id="task-title"
                name="title"
                type="text"
                className={`form-input ${errors.title ? 'error' : ''}`}
                placeholder="What needs to be done?"
                value={form.title}
                onChange={handleChange}
                autoFocus
                maxLength={100}
              />
              {errors.title && <span className="form-error">{errors.title}</span>}
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label" htmlFor="task-description">
                Description
                <span style={{ color: 'var(--text-muted)', fontWeight: 400, marginLeft: '6px' }}>
                  (optional)
                </span>
              </label>
              <textarea
                id="task-description"
                name="description"
                className={`form-input ${errors.description ? 'error' : ''}`}
                placeholder="Add more details about this task..."
                value={form.description}
                onChange={handleChange}
                maxLength={500}
                rows={3}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {errors.description && (
                  <span className="form-error">{errors.description}</span>
                )}
                <span
                  style={{
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    marginLeft: 'auto',
                  }}
                >
                  {form.description.length}/500
                </span>
              </div>
            </div>

            {/* Status — only when editing */}
            {editTask && (
              <div className="form-group">
                <label className="form-label" htmlFor="task-status">
                  Status
                </label>
                <select
                  id="task-status"
                  name="status"
                  className="form-input"
                  value={form.status}
                  onChange={handleChange}
                  style={{ cursor: 'pointer' }}
                >
                  <option value="pending">⏳ Pending</option>
                  <option value="completed">✅ Completed</option>
                </select>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
              <button
                id="cancel-task-btn"
                type="button"
                className="btn btn-ghost"
                style={{ flex: 1 }}
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                id="submit-task-btn"
                type="submit"
                className="btn btn-primary"
                style={{ flex: 1 }}
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner" />
                ) : (
                  <>
                    <CheckSquare size={15} />
                    {editTask ? 'Save Changes' : 'Create Task'}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
