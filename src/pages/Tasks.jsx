import React, { useState } from 'react';
import { Plus, X, Search, Pencil, Trash2, Circle, CheckCircle2, AlertCircle, Clock, Printer } from 'lucide-react';
import { format } from 'date-fns';
import Header from '../components/Header';
import DesktopPageHeader from '../components/DesktopPageHeader';
import { useAppStore } from '../store/appStore';
import { openPrintWindow, statsRowHtml, badgeHtml } from '../lib/printReport';

const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];
const STATUSES = ['To Do', 'In Progress', 'Done'];
const PRIORITY_COLORS = {
  Low: 'bg-gray-100 text-gray-600',
  Medium: 'bg-blue-100 text-blue-600',
  High: 'bg-yellow-100 text-yellow-700',
  Urgent: 'bg-red-100 text-red-700',
};
const STATUS_ICONS = {
  'To Do': <Circle size={18} className="text-gray-400" />,
  'In Progress': <Clock size={18} className="text-yellow-500" />,
  'Done': <CheckCircle2 size={18} className="text-green-500" />,
};
const STATUS_COLORS = {
  'To Do': 'text-gray-500',
  'In Progress': 'text-yellow-600 bg-yellow-50',
  'Done': 'text-green-600 bg-green-50',
};

function TaskModal({ task, associates, onClose, onSave }) {
  const today = format(new Date(), 'yyyy-MM-dd');
  const [form, setForm] = useState(task || {
    title: '',
    description: '',
    assignee: '',
    dueDate: today,
    priority: 'Medium',
    status: 'To Do',
  });

  const handleSave = () => {
    if (!form.title.trim()) return alert('Title is required');
    onSave(form);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-t-2xl w-full max-w-[480px] animate-slide-up max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="font-bold text-lg text-gray-800">{task ? 'Edit Task' : 'New Task'}</h2>
          <button onClick={onClose} className="p-2 text-gray-400 rounded-lg"><X size={20} /></button>
        </div>
        <div className="overflow-y-auto flex-1 p-4 space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Title *</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
              placeholder="Task title"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Description</label>
            <textarea
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none"
              rows={3}
              placeholder="Task description..."
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Assignee</label>
              {associates.length > 0 ? (
                <select
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white"
                  value={form.assignee}
                  onChange={e => setForm({ ...form, assignee: e.target.value })}
                >
                  <option value="">Unassigned</option>
                  {associates.map(a => (
                    <option key={a.id} value={a.name}>{a.name}</option>
                  ))}
                </select>
              ) : (
                <input
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
                  placeholder="Assignee"
                  value={form.assignee}
                  onChange={e => setForm({ ...form, assignee: e.target.value })}
                />
              )}
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Due Date</label>
              <input
                type="date"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
                value={form.dueDate}
                onChange={e => setForm({ ...form, dueDate: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Priority</label>
            <div className="flex gap-2">
              {PRIORITIES.map(p => (
                <button
                  key={p}
                  onClick={() => setForm({ ...form, priority: p })}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    form.priority === p
                      ? p === 'Urgent' ? 'bg-red-600 text-white border-red-600'
                        : p === 'High' ? 'bg-yellow-500 text-white border-yellow-500'
                        : p === 'Medium' ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-gray-500 text-white border-gray-500'
                      : 'bg-white text-gray-600 border-gray-200'
                  }`}
                >{p}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Status</label>
            <div className="flex gap-2">
              {STATUSES.map(s => (
                <button
                  key={s}
                  onClick={() => setForm({ ...form, status: s })}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    form.status === s
                      ? s === 'Done' ? 'bg-green-500 text-white border-green-500'
                        : s === 'In Progress' ? 'bg-yellow-500 text-white border-yellow-500'
                        : 'bg-gray-500 text-white border-gray-500'
                      : 'bg-white text-gray-600 border-gray-200'
                  }`}
                >{s}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleSave}
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold text-sm"
          >
            {task ? 'Save Changes' : 'Add Task'}
          </button>
        </div>
      </div>
    </div>
  );
}

function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  return (
    <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
      <div className="flex items-start gap-2">
        <button onClick={() => {
          const next = task.status === 'To Do' ? 'In Progress' :
            task.status === 'In Progress' ? 'Done' : 'To Do';
          onStatusChange(task.id, next);
        }} className="mt-0.5 flex-shrink-0">
          {STATUS_ICONS[task.status]}
        </button>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold ${task.status === 'Done' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
            {task.title}
          </p>
          {task.description && (
            <p className="text-xs text-gray-500 mt-0.5 truncate">{task.description}</p>
          )}
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${PRIORITY_COLORS[task.priority]}`}>
              {task.priority}
            </span>
            {task.assignee && (
              <span className="text-xs text-gray-500">👤 {task.assignee}</span>
            )}
            {task.dueDate && (
              <span className="text-xs text-gray-400">📅 {task.dueDate}</span>
            )}
          </div>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          <button onClick={() => onEdit(task)} className="p-1.5 text-gray-400 hover:text-blue-500 rounded-lg">
            <Pencil size={14} />
          </button>
          <button onClick={() => onDelete(task.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Tasks() {
  const { tasks, addTask, updateTask, deleteTask, associates } = useAppStore();
  const [showAdd, setShowAdd] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [priorityFilter, setPriorityFilter] = useState('All Priority');
  const [collapsed, setCollapsed] = useState({});

  const todo = tasks.filter(t => t.status === 'To Do');
  const inProgress = tasks.filter(t => t.status === 'In Progress');
  const done = tasks.filter(t => t.status === 'Done');
  const urgent = tasks.filter(t => t.priority === 'Urgent');

  const filtered = tasks.filter(t => {
    const matchSearch = t.title?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All Status' || t.status === statusFilter;
    const matchPriority = priorityFilter === 'All Priority' || t.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  const handleDelete = (id) => {
    if (window.confirm('Delete this task?')) deleteTask(id);
  };

  const handlePrint = () => {
    const PRIORITY_COLOR = { Low: 'gray', Medium: 'blue', High: 'yellow', Urgent: 'red' };
    const STATUS_COLOR   = { 'To Do': 'gray', 'In Progress': 'yellow', Done: 'green' };
    const html = `
      ${statsRowHtml([
        { value: todo.length,       label: 'To Do' },
        { value: inProgress.length, label: 'In Progress' },
        { value: done.length,       label: 'Done' },
        { value: urgent.length,     label: 'Urgent' },
      ])}
      <h2 class="section-title">Task List</h2>
      <table>
        <thead><tr>
          <th>Title</th><th>Status</th><th>Priority</th>
          <th>Assignee</th><th>Due Date</th><th>Description</th>
        </tr></thead>
        <tbody>
          ${tasks.map(t => '<tr>' +
            '<td><strong>' + (t.status === 'Done' ? '<s>' + t.title + '</s>' : t.title) + '</strong></td>' +
            '<td>' + badgeHtml(t.status, STATUS_COLOR[t.status] || 'gray') + '</td>' +
            '<td>' + badgeHtml(t.priority, PRIORITY_COLOR[t.priority] || 'gray') + '</td>' +
            '<td>' + (t.assignee || '\u2014') + '</td>' +
            '<td>' + (t.dueDate || '\u2014') + '</td>' +
            '<td style="font-size:10px;color:#555">' + (t.description || '') + '</td>' +
          '</tr>').join('')}
        </tbody>
      </table>`;
    openPrintWindow({ title: 'Tasks & To-Do Report', subtitle: tasks.length + ' tasks total', html });
  };

  const toggleCollapse = (key) => {
    setCollapsed(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const sections = [
    { key: 'todo', label: 'To Do', tasks: filtered.filter(t => t.status === 'To Do'), dot: 'bg-gray-400', headerClass: 'text-gray-700' },
    { key: 'inprogress', label: 'In Progress', tasks: filtered.filter(t => t.status === 'In Progress'), dot: 'bg-yellow-500', headerClass: 'text-yellow-700' },
    { key: 'done', label: 'Done', tasks: filtered.filter(t => t.status === 'Done'), dot: 'bg-green-500', headerClass: 'text-green-700' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header title="Tasks & To-Do" onAdd={() => setShowAdd(true)} />
      <DesktopPageHeader title="Tasks & To-Do" onAdd={() => setShowAdd(true)} addLabel="+ Add Task" onPrint={handlePrint} />

      <div className="desktop-page-content p-4 lg:p-0 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'To Do', count: todo.length, bg: 'bg-gray-100', icon: '⚫' },
            { label: 'In Progress', count: inProgress.length, bg: 'bg-yellow-50', icon: '🟡' },
            { label: 'Done', count: done.length, bg: 'bg-green-50', icon: '✅' },
            { label: 'Urgent', count: urgent.length, bg: 'bg-red-50', icon: '🔴' },
          ].map(({ label, count, bg, icon }) => (
            <div key={label} className={`${bg} rounded-xl p-3 flex items-center gap-3`}>
              <span className="text-xl">{icon}</span>
              <div>
                <div className="text-xl font-bold text-gray-800">{count}</div>
                <div className="text-xs text-gray-500">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white shadow-sm"
              placeholder="Search tasks..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 flex-shrink-0"
          >
            <Printer size={14} /> Print
          </button>
        </div>
        <div className="flex gap-2">
          <select
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white shadow-sm"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option>All Status</option>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
          <select
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white shadow-sm"
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
          >
            <option>All Priority</option>
            {PRIORITIES.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>

        {/* Kanban Sections */}
        {sections.map(section => (
          <div key={section.key} className="space-y-2">
            <button
              onClick={() => toggleCollapse(section.key)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-sm ${STATUS_COLORS[section.label] || 'bg-gray-100 text-gray-700'}`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${section.dot}`} />
                {section.label}
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-white/60 text-gray-600 text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                  {section.tasks.length}
                </span>
                <span className="text-gray-400 text-xs">{collapsed[section.key] ? '▶' : '▼'}</span>
              </div>
            </button>

            {!collapsed[section.key] && (
              <div className="space-y-2">
                {section.tasks.length === 0 ? (
                  <div className="bg-white rounded-xl p-4 text-center text-gray-400">
                    <div className="text-2xl mb-1">📋</div>
                    <p className="text-xs">No tasks here</p>
                  </div>
                ) : (
                  section.tasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={setEditTask}
                      onDelete={handleDelete}
                      onStatusChange={(id, status) => updateTask(id, { status })}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        ))}

        <div className="h-4" />
      </div>

      {showAdd && (
        <TaskModal
          associates={associates}
          onClose={() => setShowAdd(false)}
          onSave={addTask}
        />
      )}
      {editTask && (
        <TaskModal
          task={editTask}
          associates={associates}
          onClose={() => setEditTask(null)}
          onSave={(data) => updateTask(editTask.id, data)}
        />
      )}
    </div>
  );
}
