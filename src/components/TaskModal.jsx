import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const EMPTY = { title: '', description: '', status: 'pending' };

const TaskModal = ({ isOpen, onClose, onSubmit, editTask, loading }) => {
  const [form, setForm]     = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setForm(editTask ? { title: editTask.title || '', description: editTask.description || '', status: editTask.status || 'pending' } : EMPTY);
      setErrors({});
    }
  }, [isOpen, editTask]);

  if (!isOpen) return null;

  const validate = () => {
    const e = {};
    if (!form.title.trim())            e.title = 'Task title is required';
    else if (form.title.length > 100)  e.title = 'Title cannot exceed 100 characters';
    if (form.description.length > 500) e.description = 'Description cannot exceed 500 characters';
    return e;
  };

  const handleChange = ({ target: { name, value } }) => {
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSubmit(form);
  };

  const handleOverlayClick = (e) => { if (e.target === e.currentTarget) onClose(); };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-box" role="dialog" aria-modal="true" aria-labelledby="modal-title">

        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title" id="modal-title">
            {editTask ? 'Edit task' : 'New task'}
          </h2>
          <button id="close-modal-btn" className="btn-icon" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            {/* Title */}
            <div className="form-group">
              <label className="form-label" htmlFor="task-title">
                Title <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                id="task-title"
                name="title"
                type="text"
                className={`form-input${errors.title ? ' has-error' : ''}`}
                placeholder="What needs to be done?"
                value={form.title}
                onChange={handleChange}
                maxLength={100}
                autoFocus
              />
              {errors.title && <p className="form-error">{errors.title}</p>}
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label" htmlFor="task-description">
                Description
                <span style={{ color: 'var(--text-muted)', fontWeight: 400, marginLeft: '5px', fontSize: '12px' }}>optional</span>
              </label>
              <textarea
                id="task-description"
                name="description"
                className={`form-input${errors.description ? ' has-error' : ''}`}
                placeholder="Add any extra details..."
                value={form.description}
                onChange={handleChange}
                maxLength={500}
                rows={3}
              />
              <p className="form-hint">{form.description.length}/500</p>
              {errors.description && <p className="form-error">{errors.description}</p>}
            </div>

            {/* Status — only when editing */}
            {editTask && (
              <div className="form-group">
                <label className="form-label" htmlFor="task-status">Status</label>
                <select
                  id="task-status"
                  name="status"
                  className="form-input"
                  value={form.status}
                  onChange={handleChange}
                  style={{ cursor: 'pointer' }}
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button
              id="cancel-task-btn"
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              id="submit-task-btn"
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? <span className="spinner" /> : editTask ? 'Save changes' : 'Create task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
