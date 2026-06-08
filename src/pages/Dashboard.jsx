import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Plus, ListTodo, Clock, CheckCircle2,
  Search, X, ChevronLeft, ChevronRight,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const TASKS_PER_PAGE = 6;
const FILTERS        = ['all', 'pending', 'completed'];

const Dashboard = () => {
  const { user } = useAuth();

  // ── Data state ────────────────────────────────────────────
  const [tasks,        setTasks]        = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  // ── UI state ──────────────────────────────────────────────
  const [filter,       setFilter]       = useState('all');
  const [search,       setSearch]       = useState('');
  const [currentPage,  setCurrentPage]  = useState(1);
  const [modalOpen,    setModalOpen]    = useState(false);
  const [editTask,     setEditTask]     = useState(null);
  const [submitting,   setSubmitting]   = useState(false);

  // ── Fetch ─────────────────────────────────────────────────
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

  // ── Stats ─────────────────────────────────────────────────
  const total     = tasks.length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const pending   = tasks.filter((t) => t.status === 'pending').length;

  // ── Filtered + searched list ──────────────────────────────
  const filteredTasks = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tasks
      .filter((t) => filter === 'all' || t.status === filter)
      .filter((t) =>
        !q ||
        t.title.toLowerCase().includes(q) ||
        (t.description || '').toLowerCase().includes(q)
      );
  }, [tasks, filter, search]);

  // ── Pagination ────────────────────────────────────────────
  const totalPages  = Math.max(1, Math.ceil(filteredTasks.length / TASKS_PER_PAGE));
  const safePage    = Math.min(currentPage, totalPages);
  const startIdx    = (safePage - 1) * TASKS_PER_PAGE;
  const paginated   = filteredTasks.slice(startIdx, startIdx + TASKS_PER_PAGE);

  // Reset to page 1 when filter or search changes
  useEffect(() => { setCurrentPage(1); }, [filter, search]);

  const goToPage = (p) => setCurrentPage(Math.max(1, Math.min(p, totalPages)));

  // Page numbers to show (max 5 visible pills)
  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (safePage <= 3)   return [1, 2, 3, 4, 5];
    if (safePage >= totalPages - 2) return [totalPages-4, totalPages-3, totalPages-2, totalPages-1, totalPages];
    return [safePage-2, safePage-1, safePage, safePage+1, safePage+2];
  }, [totalPages, safePage]);

  // ── CRUD handlers ─────────────────────────────────────────
  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (editTask) {
        const { data } = await api.put(`/tasks/${editTask._id}`, formData);
        setTasks((prev) => prev.map((t) => (t._id === editTask._id ? data.task : t)));
        toast.success('Task updated');
      } else {
        const { data } = await api.post('/tasks', formData);
        setTasks((prev) => [data.task, ...prev]);
        toast.success('Task created');
      }
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (taskId) => {
    try {
      const { data } = await api.patch(`/tasks/${taskId}/toggle`);
      setTasks((prev) => prev.map((t) => (t._id === taskId ? data.task : t)));
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      toast.success('Task deleted');
    } catch {
      toast.error('Failed to delete task');
    }
  };

  const openCreate = () => { setEditTask(null); setModalOpen(true); };
  const openEdit   = (task) => { setEditTask(task); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditTask(null); };

  // ── First name ────────────────────────────────────────────
  const firstName = user?.name?.split(' ')[0] ?? 'there';

  return (
    <>
      <Navbar />

      <main className="dashboard-page">
        {/* Page header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">My Tasks</h1>
            <p className="dashboard-subtitle">Good to see you, {firstName}. Here's what's on your list.</p>
          </div>
          <button id="add-task-btn" className="btn btn-primary" onClick={openCreate}>
            <Plus size={16} strokeWidth={2.5} />
            Add task
          </button>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          {[
            { label: 'Total tasks',  value: total,     icon: <ListTodo size={20} />,     cls: 'stat-icon-total' },
            { label: 'Pending',      value: pending,   icon: <Clock size={20} />,         cls: 'stat-icon-pending' },
            { label: 'Completed',    value: completed, icon: <CheckCircle2 size={20} />,  cls: 'stat-icon-done' },
          ].map((s, i) => (
            <div key={i} className="stat-card card" style={{ animationDelay: `${i * 0.07}s` }}>
              <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
              <div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar: Search + Filter */}
        <div className="toolbar">
          {/* Search */}
          <div className="search-wrap">
            <span className="search-icon"><Search size={15} /></span>
            <input
              id="search-input"
              type="text"
              className="search-input"
              placeholder="Search tasks by title or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search tasks"
            />
            {search && (
              <button
                className="search-clear"
                onClick={() => setSearch('')}
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter tabs */}
          <div className="filter-tabs" role="tablist">
            {FILTERS.map((f) => (
              <button
                key={f}
                id={`filter-${f}`}
                role="tab"
                aria-selected={filter === f}
                className={`filter-tab${filter === f ? ' active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* List header */}
        {!loadingTasks && (
          <div className="list-meta">
            <span className="list-count">
              {filteredTasks.length === 0
                ? 'No tasks found'
                : filteredTasks.length === 1
                ? '1 task'
                : `${filteredTasks.length} tasks`}
              {search && ` for "${search}"`}
            </span>
            {filteredTasks.length > 0 && totalPages > 1 && (
              <span>
                Page {safePage} of {totalPages}
              </span>
            )}
          </div>
        )}

        {/* Task list */}
        {loadingTasks ? (
          <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--text-muted)' }}>
            <div className="spinner spinner-muted" style={{ width: 28, height: 28, margin: '0 auto 12px' }} />
            <p style={{ fontSize: 14 }}>Loading tasks...</p>
          </div>
        ) : paginated.length === 0 ? (
          <div className="empty-state card">
            <div className="empty-icon">
              {search ? <Search size={26} /> : <ListTodo size={26} />}
            </div>
            <h3>
              {search
                ? `No results for "${search}"`
                : filter === 'pending'
                ? 'No pending tasks'
                : filter === 'completed'
                ? 'No completed tasks yet'
                : 'No tasks yet'}
            </h3>
            <p>
              {search
                ? 'Try a different search term or clear the search.'
                : filter === 'all'
                ? 'Click "Add task" to get started.'
                : filter === 'pending'
                ? 'All tasks are done — great work! '
                : 'Complete a task to see it here.'}
            </p>
            {!search && filter === 'all' && (
              <button
                className="btn btn-primary btn-sm"
                style={{ marginTop: '16px' }}
                onClick={openCreate}
              >
                <Plus size={14} /> Create first task
              </button>
            )}
          </div>
        ) : (
          <div className="tasks-list">
            {paginated.map((task, i) => (
              <div key={task._id} style={{ animationDelay: `${i * 0.04}s` }}>
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

        {/* Pagination */}
        {!loadingTasks && filteredTasks.length > TASKS_PER_PAGE && (
          <div className="pagination">
            <span className="pagination-info">
              Showing {startIdx + 1}–{Math.min(startIdx + TASKS_PER_PAGE, filteredTasks.length)} of {filteredTasks.length} tasks
            </span>
            <div className="pagination-controls">
              <button
                id="page-prev"
                className="page-btn"
                onClick={() => goToPage(safePage - 1)}
                disabled={safePage === 1}
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>

              {pageNumbers.map((n) => (
                <button
                  key={n}
                  id={`page-${n}`}
                  className={`page-btn${n === safePage ? ' active' : ''}`}
                  onClick={() => goToPage(n)}
                  aria-label={`Page ${n}`}
                  aria-current={n === safePage ? 'page' : undefined}
                >
                  {n}
                </button>
              ))}

              <button
                id="page-next"
                className="page-btn"
                onClick={() => goToPage(safePage + 1)}
                disabled={safePage === totalPages}
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </main>

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
