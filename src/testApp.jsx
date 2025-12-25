

import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const FILTERS = {
  ALL: '全て',
  ACTIVE: '未完了',
  COMPLETED: '完了',
};



function TestApp() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("中");
  const [important, setImportant] = useState(false);
  const [filter, setFilter] = useState(FILTERS.ALL);

  function handleAddTask(e) {
    e.preventDefault();
    if (!validateTaskInput(input)) {
      alert("タスク内容を入力してください。");
      return;
    }
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: input.trim(),
        completed: false,
        dueDate: dueDate,
        priority: priority,
        important: important,
      },
    ]);
    setInput("");
    setDueDate("");
    setPriority("中");
    setImportant(false);
  }

  function handleToggleComplete(id) {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }

  function handleDeleteTask(id) {
    setTasks(tasks.filter((task) => task.id !== id));
  }

  function handleFilterChange(newFilter) {
    setFilter(newFilter);
  }

  // --- バリデーションチェック関数（シンプルな実装） ---
  function validateTaskInput(value) {
    return typeof value === "string" && value.trim().length > 0;
  }


  const filteredTasks = tasks.filter((task) => {
    if (filter === FILTERS.ALL) return true;
    if (filter === FILTERS.ACTIVE) return !task.completed;
    if (filter === FILTERS.COMPLETED) return task.completed;
    return true;
  });

  const totalCount = tasks.length;
  const activeCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  // バージョン情報を追加する
  const version = "1.0.1";

  return (
    <div className="container" style={{ maxWidth: 500, marginTop: 40 }}>
      <div className="rounded-top" style={{ background: '#e3f2fd', padding: '24px 24px 12px 24px' }}>
        <h2 className="text-center mb-3">業務用Todo管理アプリ</h2>
        <p className="text-center text-muted" style={{ fontSize: '0.9em' }}>バージョン: {version}</p>
        <form className="row g-2 mb-3" onSubmit={handleAddTask}>
          <div className="col-12 col-md-5">
            <input
              type="text"
              className="form-control"
              placeholder="新しいタスクを入力..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <div className="col-6 col-md-3">
            <label htmlFor="dueDateInput" className="form-label visually-hidden">期日</label>
            <input
              id="dueDateInput"
              type="date"
              className="form-control"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div className="col-6 col-md-2">
            <label htmlFor="prioritySelect" className="form-label visually-hidden">優先度</label>
            <select
              id="prioritySelect"
              className="form-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="高">高</option>
              <option value="中">中</option>
              <option value="低">低</option>
            </select>
          </div>
          <div className="col-6 col-md-1 d-flex align-items-center">
            <input
              type="checkbox"
              className="form-check-input me-1"
              checked={important}
              onChange={(e) => setImportant(e.target.checked)}
              id="importantCheck"
            />
            <label htmlFor="importantCheck" className="form-check-label" title="重要フラグ">⭐</label>
          </div>
          <div className="col-6 col-md-1">
            <button type="submit" className="btn btn-primary w-100">追加</button>
          </div>
        </form>
        <div className="d-flex align-items-center mb-2 gap-2">
          <div className="btn-group me-2" role="group">
            <button type="button" className={`btn btn-outline-primary${filter === FILTERS.ALL ? ' active' : ''}`} onClick={() => handleFilterChange(FILTERS.ALL)}>
              全て <span className="badge bg-secondary ms-1">{totalCount}</span>
            </button>
            <button type="button" className={`btn btn-outline-primary${filter === FILTERS.ACTIVE ? ' active' : ''}`} onClick={() => handleFilterChange(FILTERS.ACTIVE)}>
              未完了 <span className="badge bg-secondary ms-1">{activeCount}</span>
            </button>
            <button type="button" className={`btn btn-outline-primary${filter === FILTERS.COMPLETED ? ' active' : ''}`} onClick={() => handleFilterChange(FILTERS.COMPLETED)}>
              完了 <span className="badge bg-secondary ms-1">{completedCount}</span>
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-bottom shadow-sm p-3" style={{ minHeight: 200 }}>
        <ul className="list-group list-group-flush">
          {filteredTasks.length === 0 && (
            <li className="list-group-item text-center text-muted">タスクはありません</li>
          )}
          {filteredTasks.map((task) => (
            <li key={task.id} className="list-group-item d-flex align-items-center">
              <input
                type="checkbox"
                className="form-check-input me-2"
                checked={task.completed}
                onChange={() => handleToggleComplete(task.id)}
              />
              <span style={{ flex: 2, textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? '#aaa' : '#222', fontWeight: task.important ? 'bold' : 'normal' }}>
                {task.important && <span title="重要" style={{ color: '#e53935', marginRight: 4 }}>⭐</span>}
                {task.text}
                {task.dueDate && (
                  <span className="badge bg-info text-dark ms-2">期日: {task.dueDate}</span>
                )}
                <span className={`badge ms-2 ${task.priority === '高' ? 'bg-danger' : task.priority === '中' ? 'bg-warning text-dark' : 'bg-secondary'}`}>優先度: {task.priority}</span>
              </span>
              <button className="btn btn-sm btn-danger ms-2" onClick={() => handleDeleteTask(task.id)}>
                削除
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TestApp;
