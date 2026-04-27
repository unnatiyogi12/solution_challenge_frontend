import { useEffect, useMemo, useState } from 'react';
import { getNeeds, assignTask } from '../services/api';
import '../styles/Dashboard.css'; // Import the custom styles

const TABS = ['all', 'high', 'medium', 'low'];
const GUEST_TASKS_KEY = 'hopeworks_guest_tasks';

const DEMO_NEEDS = [
  {
    _id: '64a2f1b4c3e80f2d93e5bd11',
    title: 'Community Nutrition Drive',
    category: 'health',
    urgency: 'high',
    description: 'Help distribute nutrition kits to families with children in need.',
    location: 'Sadar Bazar',
    state: 'Delhi',
    requiredSkill: 'coordination'
  },
  {
    _id: '64a2f1b4c3e80f2d93e5bd12',
    title: 'Girls Education Mentoring',
    category: 'education',
    urgency: 'medium',
    description: 'Volunteer as a weekend mentor for grade 8-10 students.',
    location: 'Lucknow Central',
    state: 'Uttar Pradesh',
    requiredSkill: 'teaching'
  },
  {
    _id: '64a2f1b4c3e80f2d93e5bd13',
    title: 'Clean Water Awareness Camp',
    category: 'community',
    urgency: 'low',
    description: 'Assist local teams in running awareness sessions and registration desks.',
    location: 'Indore East',
    state: 'Madhya Pradesh',
    requiredSkill: 'communication'
  }
];

const readGuestTasks = () => {
  try {
    return JSON.parse(localStorage.getItem(GUEST_TASKS_KEY) || '[]');
  } catch {
    return [];
  }
};

const writeGuestTasks = (tasks) => {
  localStorage.setItem(GUEST_TASKS_KEY, JSON.stringify(tasks));
};

const Dashboard = () => {
  const [needs, setNeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    const fetchNeeds = async () => {
      try {
        const { data } = await getNeeds();
        setNeeds(Array.isArray(data) && data.length > 0 ? data : DEMO_NEEDS);
      } catch (err) {
        console.error('Error fetching needs, using demo data:', err);
        setNeeds(DEMO_NEEDS);
      } finally {
        setLoading(false);
      }
    };

    fetchNeeds();
  }, []);

  const filteredNeeds = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    return needs
      .filter((need) => (activeTab === 'all' ? true : String(need.urgency || '').toLowerCase() === activeTab))
      .filter((need) => {
        if (!q) return true;
        const haystack = [need.title, need.category, need.state, need.location, need.description]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return haystack.includes(q);
      });
  }, [activeTab, needs, searchTerm]);

  const saveGuestTask = (need) => {
    const current = readGuestTasks();
    const alreadyExists = current.some((task) => task.need?._id === need._id);
    if (alreadyExists) {
      return false;
    }

    const next = [
      ...current,
      {
        _id: `guest-${need._id}`,
        status: 'pending',
        need: {
          _id: need._id,
          title: need.title || need.category || 'NGO Need'
        }
      }
    ];

    writeGuestTasks(next);
    return true;
  };

  const handleVolunteer = async (need) => {
    const hasToken = !!localStorage.getItem('token');

    if (!hasToken) {
      const created = saveGuestTask(need);
      setMessage(created ? 'Saved to My Tasks (guest mode).' : 'Already saved in your guest tasks.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    try {
      await assignTask(need._id);
      setMessage('Successfully volunteered for this task!');
    } catch (err) {
      const created = saveGuestTask(need);
      setMessage(created ? 'Backend not available. Saved locally to My Tasks.' : 'Task already exists locally.');
    }

    setTimeout(() => setMessage(''), 3000);
  };

  if (loading) return <div className="text-center mt-10" style={{fontSize: '1.2rem', color: '#0d9488'}}>Loading needs...</div>;

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        
        <header className="dashboard-header">
          <h1>Open NGO Needs</h1>
          <p>Discover tasks and volunteer where your help matters most.</p>
        </header>

        {!localStorage.getItem('token') && (
          <div className="guest-banner">
            <svg className="detail-icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
            Guest mode is ON. You can browse and save tasks without signing in.
          </div>
        )}

        {message && <div className="message-banner">{message}</div>}

        <div className="controls-card">
          <button onClick={() => setShowControls((v) => !v)} className="controls-toggle">
            <span>Filters & Search</span>
            <span>{showControls ? '▲ Hide' : '▼ Show'}</span>
          </button>

          {showControls && (
            <div className="controls-body">
              <div className="tabs-container">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by location, state, category, or description..."
                className="search-input"
              />
            </div>
          )}
        </div>

        <p className="results-count">Showing {filteredNeeds.length} needs</p>

        {filteredNeeds.length === 0 ? (
          <div className="no-results">
            <p>No needs found matching your filters. Try adjusting your search!</p>
          </div>
        ) : (
          <div className="needs-grid">
            {filteredNeeds.slice(0, 120).map((need) => {
              // Determine urgency class for the badge
              const urgencyLevel = need.urgency ? need.urgency.toLowerCase() : 'normal';
              const badgeClass = `urgency-badge urgency-${urgencyLevel}`;

              return (
                <div key={need._id} className="need-card">
                  <div className="card-header">
                    <span className={badgeClass}>{urgencyLevel} urgency</span>
                    <h3 className="need-title">{need.title || need.category || 'NGO Need'}</h3>
                  </div>
                  
                  <p className="need-desc">{need.description || 'No description available.'}</p>
                  
                  <div className="need-details">
                    <div className="detail-item">
                      <svg className="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      {need.location || 'N/A'}, {need.state || 'N/A'}
                    </div>
                    <div className="detail-item">
                      <svg className="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                      Skill: {need.requiredSkill || need.category || 'general'}
                    </div>
                  </div>

                  <button onClick={() => handleVolunteer(need)} className="btn-volunteer">
                    Volunteer Now
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;