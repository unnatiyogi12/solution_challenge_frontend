import { useEffect, useState } from 'react';
import { getMyTasks, updateTaskStatus, deleteTask } from '../services/api';
import '../styles/MyTasks.css';

const GUEST_TASKS_KEY = 'hopeworks_guest_tasks';

const readGuestTasks = () => {
  try { return JSON.parse(localStorage.getItem(GUEST_TASKS_KEY) || '[]'); } 
  catch { return []; }
};

const writeGuestTasks = (tasks) => {
  localStorage.setItem(GUEST_TASKS_KEY, JSON.stringify(tasks));
};

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modeMessage, setModeMessage] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const hasToken = !!localStorage.getItem('token');

    if (!hasToken) {
      setTasks(readGuestTasks());
      setModeMessage('Guest mode: showing locally saved tasks.');
      setLoading(false);
      return;
    }

    try {
      const { data } = await getMyTasks();
      setTasks(Array.isArray(data) ? data : []);
      setModeMessage('');
    } catch (err) {
      console.error(err);
      setTasks(readGuestTasks());
      setModeMessage('Backend unavailable: showing locally saved tasks.');
    } finally {
      setLoading(false);
    }
  };

  const updateGuestStatus = (taskId, newStatus) => {
    const next = tasks.map((task) => (task._id === taskId ? { ...task, status: newStatus } : task));
    setTasks(next);
    writeGuestTasks(next);
  };

  const handleStatusChange = async (taskId, newStatus) => {
    const hasToken = !!localStorage.getItem('token');
    if (!hasToken) {
      updateGuestStatus(taskId, newStatus);
      return;
    }

    try {
      await updateTaskStatus(taskId, newStatus);
      fetchTasks();
    } catch (err) {
      updateGuestStatus(taskId, newStatus);
      setModeMessage('Saved status locally because backend update failed.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to drop this assignment?")) return;
    
    const hasToken = !!localStorage.getItem('token');
    if (!hasToken) {
      const next = tasks.filter((t) => t._id !== taskId);
      setTasks(next);
      writeGuestTasks(next);
      return;
    }

    try {
      await deleteTask(taskId);
      fetchTasks();
    } catch (err) {
      console.error(err);
      alert('Failed to drop task. Please try again.');
    }
  };

  if (loading) return <div style={{textAlign: 'center', marginTop: '3rem', fontSize: '1.2rem', color: '#0d9488'}}>Loading your tasks...</div>;

  const activeTasks = tasks.filter(t => t.status?.toLowerCase() !== 'completed');
  const completedTasks = tasks.filter(t => t.status?.toLowerCase() === 'completed');
  const completedCount = completedTasks.length;

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return new Date().toLocaleDateString();
    return new Date(dateString).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="my-tasks-page">
      <div className="tasks-container">
        
        {/* HEADER */}
        <header className="tasks-header">
          <h1>My Volunteer Tasks</h1>
          <p>Track your commitments and update your progress.</p>
        </header>

        {modeMessage && (
          <div className="mode-banner">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
            {modeMessage}
          </div>
        )}

        {/* SECTION 1: ACTIVE TASKS */}
        <h2 className="section-title">Active Assignments</h2>
        {activeTasks.length === 0 ? (
          <div className="empty-tasks">
            <p>You have no active assignments. Head over to the Dashboard to find a cause!</p>
          </div>
        ) : (
          <div className="tasks-grid">
            {activeTasks.map((task) => {
              const currentStatus = task.status?.toLowerCase() || 'pending';
              const badgeClass = `status-badge status-${currentStatus}`;
              const title = task.need?.category ? task.need.category.charAt(0).toUpperCase() + task.need.category.slice(1) + ' Support' : 'NGO Help Task';

              return (
                <div key={task._id} className="task-card">
                  <div className="task-card-header">
                    <h3 className="task-title">{title}</h3>
                    <span className={badgeClass}>{currentStatus}</span>
                  </div>

                  <div className="task-details">
                    <div className="task-detail-row">
                      <svg className="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      {task.need?.location || 'Unknown Location'}, {task.need?.state || ''}
                    </div>
                    {task.need?.description && (
                      <div className="task-detail-row description-row">
                         {task.need.description}
                      </div>
                    )}
                  </div>

                  <div className="advanced-timeline">
                    <div className="timeline-step completed-step">
                      <div className="timeline-dot"></div>
                      <div className="timeline-text">
                        <span className="step-title">Assigned</span>
                        <span className="step-date">{formatDate(task.createdAt)}</span>
                      </div>
                    </div>
                    <div className="timeline-line"></div>
                    <div className="timeline-step active-step">
                      <div className="timeline-dot"></div>
                      <div className="timeline-text">
                        <span className="step-title">In Progress</span>
                        <span className="step-date">Current</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="task-actions">
                    <label>Update Status:</label>
                    <select
                      className="status-select"
                      value={currentStatus}
                      onChange={(e) => handleStatusChange(task._id, e.target.value)}
                    >
                      <option value="pending">⏳ Pending / In Progress</option>
                      <option value="completed">✅ Mark Completed</option>
                    </select>
                    <button 
                      className="btn-delete" 
                      onClick={() => handleDeleteTask(task._id)}
                    >
                      Drop Assignment
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* SECTION 1.5: COMPLETED TASKS */}
        {completedTasks.length > 0 && (
          <>
            <h2 className="section-title completed-title">Completed Impact</h2>
            <div className="tasks-grid">
              {completedTasks.map((task) => {
                const title = task.need?.category ? task.need.category.charAt(0).toUpperCase() + task.need.category.slice(1) + ' Support' : 'NGO Help Task';
                
                return (
                  <div key={task._id} className="task-card task-card-completed">
                    <div className="task-card-header">
                      <h3 className="task-title">{title}</h3>
                      <span className="status-badge status-completed">COMPLETED</span>
                    </div>

                    <div className="task-details">
                      <div className="task-detail-row">
                        <svg className="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        {task.need?.location || 'Unknown Location'}, {task.need?.state || ''}
                      </div>
                    </div>

                    <div className="advanced-timeline">
                      <div className="timeline-step completed-step">
                        <div className="timeline-dot"></div>
                        <div className="timeline-text">
                          <span className="step-title">Assigned</span>
                          <span className="step-date">{formatDate(task.createdAt)}</span>
                        </div>
                      </div>
                      <div className="timeline-line completed-line"></div>
                      <div className="timeline-step completed-step">
                        <div className="timeline-dot"></div>
                        <div className="timeline-text">
                          <span className="step-title">Done</span>
                          <span className="step-date">Mission Accomplished</span>
                        </div>
                      </div>
                    </div>

                    <div className="task-actions completed-actions">
                      <button 
                        className="btn-undo"
                        onClick={() => handleStatusChange(task._id, 'pending')}
                      >
                         Reopen Task
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* SECTION 2: IMPACT SUMMARY (WITH IMAGE) */}
        <div className="impact-section">
          <div className="impact-content">
            <h2>Your Impact Profile</h2>
            {completedCount > 0 ? (
              <p>Incredible work! You have successfully completed <strong>{completedCount}</strong> task(s). Every action you take creates a ripple effect of positivity in the community. Thank you for your dedication to making the world a better place.</p>
            ) : (
              <p>You have taken the first step by joining us. Complete your pending tasks to start building your volunteer impact history. Even the smallest act of kindness can change a life!</p>
            )}
          </div>
          <img 
            src="https://images.unsplash.com/photo-1593113563332-e147ce1009ca?auto=format&fit=crop&q=80&w=800 " 
            alt="Volunteers helping together" 
            className="impact-image"
          />
        </div>

        {/* SECTION 3: INSPIRATION */}
        <h2 className="section-title">Other Ways to Help</h2>
        <div className="suggestions-grid">
          <div className="suggestion-card">
            <svg className="suggestion-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
            <h3>Educational Support</h3>
            <p>If you have a talent for teaching, consider tutoring children or hosting adult literacy workshops.</p>
          </div>
          <div className="suggestion-card">
            <svg className="suggestion-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            <h3>Medical & Healthcare</h3>
            <p>Licensed professionals can assist at blood drives, health checkup camps, and mental health seminars.</p>
          </div>
        </div>

        {/* SECTION 4: COMMUNITY GALLERY */}
        <h2 className="section-title">Community in Action</h2>
        <div className="gallery-grid">
          <img src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80&w=600" alt="Planting trees" className="gallery-img" />
          <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=600" alt="Teaching kids" className="gallery-img" />
          <img src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=600" alt="Food drive" className="gallery-img" />
          <img src="https://images.unsplash.com/photo-1559825481-12a05cc00344?auto=format&fit=crop&q=80&w=600" alt="Medical help" className="gallery-img" />
        </div>

        {/* SECTION 5: STORIES OF CHANGE */}
        <h2 className="section-title">Stories of Change</h2>
        <div className="stories-grid">
          <div className="story-card">
            <p className="story-text">"Volunteering to teach kids on the weekends completely changed my perspective on life. It's the most fulfilling thing I do."</p>
            <div className="story-author">
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Priya S." className="author-img" />
              <div className="author-info">
                <h4>Priya S.</h4>
                <p>Education Volunteer</p>
              </div>
            </div>
          </div>
          <div className="story-card">
            <p className="story-text">"I started helping with the food drives last year. The smiles and gratitude you receive are worth more than any paycheck."</p>
            <div className="story-author">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Rahul M." className="author-img" />
              <div className="author-info">
                <h4>Rahul M.</h4>
                <p>Community Support</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MyTasks;