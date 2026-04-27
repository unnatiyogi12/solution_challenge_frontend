import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Landing.css'; // Importing the standard CSS file

const Landing = () => {
  return (
    <div className="landing-page">
      
      {/* 1. HERO SECTION */}
      <header className="hero-section">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        
        <div className="hero-content">
          <div className="hero-badge">✨ Your Time Can Change a Life</div>
          <h1 className="hero-title">
            Empowering <span>Communities</span> <br /> Together
          </h1>
          <p className="hero-subtitle">
            Welcome to HopeWorks NGO. Our mission is to bridge the gap between people in need and those who have the skills to help. Whether it's teaching, building, or feeding, we make volunteering simple.
          </p>
          <div className="hero-buttons">
            <Link to="/dashboard" className="btn-primary">Explore Dashboard</Link>
            <Link to="/my-tasks" className="btn-secondary">Open My Tasks</Link>
          </div>
        </div>
      </header>

      {/* 2. HOW IT WORKS SECTION */}
      <section className="section how-it-works-section">
        <div className="section-container">
          <div className="section-header">
            <h2>How Our Platform Works</h2>
            <p>A simple, transparent process to get you out into the community and making an impact as quickly as possible.</p>
          </div>
          
          <div className="steps-grid">
            <div className="step-card step-1">
              <div className="step-number">01</div>
              <h3>Find a Need</h3>
              <p>Browse our dashboard for local community needs that match your skills.</p>
            </div>
            <div className="step-card step-2">
              <div className="step-number">02</div>
              <h3>Volunteer</h3>
              <p>Click volunteer to assign the task to yourself and get the details.</p>
            </div>
            <div className="step-card step-3">
              <div className="step-number">03</div>
              <h3>Make an Impact</h3>
              <p>Complete the task, update your status, and change a life.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHAT WE PROVIDE SECTION */}
      <section className="section features-section">
        <div className="section-container">
          <div className="section-header">
            <h2>What We Provide</h2>
            <p>We provide the infrastructure so you can focus entirely on doing good.</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3>Smart Matching</h3>
              <p>Our algorithm matches your specific skills (teaching, medical, labor) with the exact needs of the community.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3>Task Tracking</h3>
              <p>A personalized dashboard to track your ongoing tasks, mark them as complete, and view your volunteer history.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3>Verified Causes</h3>
              <p>Every NGO need posted on our platform is strictly vetted to ensure your time and effort is going to a legitimate cause.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW YOU CAN HELP SECTION */}
      <section className="section categories-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Areas Where You Can Help</h2>
            <p>There is a place for everyone. Choose a category that fits your passion.</p>
          </div>

          <div className="categories-grid">
            <Link to="/dashboard" className="category-card cat-edu">
              <h3>Education</h3>
              <p>Tutor children and adults.</p>
              <span className="category-link">Find Tasks →</span>
            </Link>
            
            <Link to="/dashboard" className="category-card cat-env">
              <h3>Environment</h3>
              <p>Tree planting & cleanups.</p>
              <span className="category-link">Find Tasks →</span>
            </Link>
            
            <Link to="/dashboard" className="category-card cat-health">
              <h3>Healthcare</h3>
              <p>Medical camps & support.</p>
              <span className="category-link">Find Tasks →</span>
            </Link>
            
            <Link to="/dashboard" className="category-card cat-comm">
              <h3>Community</h3>
              <p>Food drives & shelter help.</p>
              <span className="category-link">Find Tasks →</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Landing;