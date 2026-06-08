import { useState, useEffect, useCallback } from 'react';
import { Plus, ListTodo, Clock, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const FILTERS = ['all', 'pending', 'completed'];

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // ── Fetch tasks ───────────────────────────────────────────
  const fetchTasks = useCallback(async () => {
    setLoadingTasks(true);
    try {
      const { data } = await api.get('/tasks');
      setTasks(data.tasks);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoadingTasks(false);
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  // ── Derived stats ─────────────────────────────────────────
  const total     = tasks.length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const pending   = tasks.filter((t) => t.status === 'pending').length;

  const filteredTasks = filter === 'all'
    ? tasks
    : tasks.filter((t) => t.status === filter);

  // ── Create / Edit task ────────────────────────────────────
  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (editTask) {
        const { data } = await api.put(`/tasks/${editTask._id}`, formData);
        setTasks((prev) => prev.map((t) => (t._id === editTask._id ? data.task : t)));
        toast.success('Task updated ✨');
      } else {
        const { data } = await api.post('/tasks', formData);
        setTasks((prev) => [data.task, ...prev]);
        toast.success('Task created 🎉');
      }
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Toggle status ─────────────────────────────────────────
  const handleToggle = async (taskId) => {
    try {
      const { data } = await api.patch(`/tasks/${taskId}/toggle`);
      setTasks((prev) => prev.map((t) => (t._id === taskId ? data.task : t)));
    } catch {
      toast.error('Failed to update status');
    }
  };

  // ── Delete task ───────────────────────────────────────────
  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      toast.success('Task deleted');
    } catch {
      toast.error('Failed to delete task');
    }
  };

  // ── Modal helpers ─────────────────────────────────────────
  const openCreate = () => { setEditTask(null); setModalOpen(true); };
  const openEdit   = (task) => { setEditTask(task); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditTask(null); };

  return (
    <>
      <Navbar />

      <main className="dashboard">
        {/* Page Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">
              Good day, <span>{user?.name?.split(' ')[0] ?? 'there'}</span> 👋
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
              Here&apos;s an overview of all your tasks
            </p>
          </div>
          <button
            id="add-task-btn"
            className="btn btn-primary"
            onClick={openCreate}
          >
            <Plus size={17} />
            Add Task
          </button>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card glass-card">
            <div className="stat-icon stat-icon-total">
              <ListTodo size={22} />
            </div>
            <div>
              <div className="stat-value">{total}</div>
              <div className="stat-label">Total Tasks</div>
            </div>
          </div>
          <div className="stat-card glass-card">
            <div className="stat-icon stat-icon-pending">
              <Clock size={22} />
            </div>
            <div>
              <div className="stat-value">{pending}</div>
              <div className="stat-label">Pending</div>
            </div>
          </div>
          <div className="stat-card glass-card">
            <div className="stat-icon stat-icon-done">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <div className="stat-value">{completed}</div>
              <div className="stat-label">Completed</div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="filter-bar" role="tablist" aria-label="Task filters">
          {FILTERS.map((f) => (
            <button
              key={f}
              id={`filter-${f}`}
              role="tab"
              aria-selected={filter === f}
              className={`filter-tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? `All (${total})` : f === 'pending' ? `Pending (${pending})` : `Completed (${completed})`}
            </button>
          ))}
        </div>

        {/* Task List */}
        {loadingTasks ? (
          <div style={{ textAlign: 'center', padding: '64px', color: 'var(--text-muted)' }}>
            <div className="spinner" style={{ width: '36px', height: '36px', margin: '0 auto 12px', borderWidth: '3px' }} />
            <p>Loading your tasks...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <ListTodo size={32} />
            </div>
            <h3>
              {filter === 'all'
                ? 'No tasks yet'
                : filter === 'pending'
                ? 'No pending tasks'
                : 'No completed tasks'}
            </h3>
            <p>
              {filter === 'all'
                ? 'Click "Add Task" to create your first task!'
                : filter === 'pending'
                ? 'Great job — all tasks are done! 🎉'
                : 'Complete some tasks to see them here.'}
            </p>
            {filter === 'all' && (
              <button
                className="btn btn-primary"
                style={{ marginTop: '20px' }}
                onClick={openCreate}
              >
                <Plus size={16} /> Create First Task
              </button>
            )}
          </div>
        ) : (
          <div className="tasks-container">
            {filteredTasks.map((task, i) => (
              <div key={task._id} style={{ animationDelay: `${i * 0.05}s` }}>
                <TaskCard
                  task={task}
                  onToggle={handleToggle}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Task Modal */}
      <TaskModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        editTask={editTask}
        loading={submitting}
      />
    </>
  );
};

export default Dashboard;
