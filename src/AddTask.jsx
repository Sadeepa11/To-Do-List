import React, { useState, useEffect } from 'react';
import './AddTasks.css';

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

const AddTask = () => {
  // Load tasks from localStorage if available
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
  });

  // Save tasks to localStorage whenever the tasks array changes
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    const task = {
      ...newTask,
      id: generateId(),
      date: new Date().toISOString(),
      isDone: false,
    };

    // Add new task at the top of the list
    setTasks((prev) => [...prev,task]);
    setNewTask({ title: '', description: '' });
  };

  const handleToggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, isDone: !task.isDone } : task
      )
    );
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const groupTasksByDate = () => {
    const grouped = {};
    tasks.forEach((task) => {
      const dateKey = formatDate(task.date);
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      // Add new tasks at the beginning of the array
      grouped[dateKey].unshift(task); 
    });
    
    // Sort the grouped tasks by date (newest date first)
    return Object.entries(grouped).sort((a, b) => new Date(b[0]) - new Date(a[0]));
  };

  const handleDeleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };
  

  const groupedTasks = groupTasksByDate();

  const Task = ({ task, onToggle, onDelete }) => (
    <div className="bg-secondary text-white p-2 mb-2 rounded">
      <div className="row" style={{ margin: 0 }}>
        <label className="col-5">{task.title}</label>
        <button
          onClick={() => onToggle(task.id)}
          className={`col-3 ${task.isDone ? 'btn btn-success' : 'btn btn-warning'}`}
        >
          {task.isDone ? 'Done' : 'Pending'}
        </button>
        <button
          onClick={() => onDelete(task.id)}  
          className="offset-1 col-3 btn btn-danger mx-2"
        >
          Delete
        </button>
      </div>
      {task.description && (
        <p className="text-sm mt-1 pl-2">{task.description}</p>
      )}
    </div>
  );
  

  return (
    <div className="container col-lg-6 col-md-6 col-sl-6 col-xxl-6 col-sm-12 mt-4">
      <label className=" mb-4 title fw-bold  fs-1 " style={{color:' goldenrod',marginLeft:'35%'}}>Todo List</label>
      <form onSubmit={handleAddTask} className="mb-4">
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            name="title"
            value={newTask.title}
            onChange={handleInputChange}
            placeholder="Task title"
            required
          />
        </div>
        <div className="mb-3">
          <textarea
            className="form-control"
            name="description"
            value={newTask.description}
            onChange={handleInputChange}
            placeholder="Task description (optional)"
            rows={3}
          />
        </div>
        <button type="submit" className="btn  fw-bold w-100" style={{backgroundColor:'goldenrod'}}>
          Add Task
        </button>
      </form>

      <div className="accordion" id="taskAccordion">
        {groupedTasks.map(([date, dateTasks], index) => (
          <div className="accordion-item" key={date}>
            <h2 className="accordion-header">
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#collapse${index}`}
              >
                {date}
              </button>
            </h2>
            <div
              id={`collapse${index}`}
              className="accordion-collapse collapse hide"
              data-bs-parent="#taskAccordion"
            >
              <div className="accordion-body">
                {dateTasks.map((task) => (
                  <Task key={task.id} task={task} onToggle={handleToggleTask}  onDelete={handleDeleteTask}  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddTask;
