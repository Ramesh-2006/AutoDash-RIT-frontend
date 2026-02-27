import React, { useState, useEffect, useRef } from 'react';
import Plot from 'react-plotly.js';

const BACKEND_URL = "http://127.0.0.1:8000";

// --- STYLES ---
const AppStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
  @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');

  :root {
    --primary-bg: #0A071E;
    --secondary-bg: #1a183c;
    --text-primary: #ffffff;
    --text-secondary: #b0b0d1;
    --accent-purple: #8a2be2;
    --accent-pink: #c837c8;
    --accent-green: #00ff9b;
    --accent-blue: #3b82f6;
    --accent-orange: #ff6b35;
    --border-color: #3a3863;
  }

  body {
    margin: 0;
    font-family: 'Roboto', sans-serif;
    background-color: var(--primary-bg);
    color: var(--text-primary);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .app-container {
    min-height: 100vh;
    width: 100%;
    background: radial-gradient(ellipse 50% 50% at top left, rgba(42, 34, 107, 0.8), transparent),
                radial-gradient(ellipse 40% 50% at bottom right, rgba(108, 38, 186, 0.5), transparent),
                #0A071E;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }
  
  .main-content {
    width: 100%;
    max-width: 1400px;
    padding: 8rem 2rem 2rem 2rem;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
  }
    .page-wrapper {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* The metrics grid at the top should also be full width */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin: 1.5rem 0;
  width: 100%;
  box-sizing: border-box;
}

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 5vw;
    width: 100%;
    box-sizing: border-box;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
  }

  .logo {
    font-size: 2rem;
    font-weight: bold;
    color: var(--text-primary);
    cursor: pointer;
  }

  .nav {
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  .nav a {
    color: var(--text-secondary);
    text-decoration: none;
    font-size: 1.1rem;
    transition: color 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .nav a:hover {
    color: var(--text-primary);
  }

  .btn {
    padding: 0.8rem 2rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .btn-gradient {
    background: linear-gradient(90deg, var(--accent-purple), var(--accent-pink));
    color: white;
  }
  
  .btn-gradient:hover {
    box-shadow: 0 0 15px var(--accent-pink);
    transform: translateY(-2px);
  }

  .btn-secondary {
    background-color: var(--accent-blue);
    color: white;
  }

  .btn-secondary:hover {
    box-shadow: 0 0 15px var(--accent-blue);
    transform: translateY(-2px);
  }
  
  .btn-green {
      background-color: var(--accent-green);
      color: #0c0a24;
  }

  .btn-green:hover {
      box-shadow: 0 0 15px var(--accent-green);
      transform: translateY(-2px);
  }

  .btn-outline {
    background: transparent;
    border: 2px solid var(--border-color);
    color: var(--text-primary);
  }

  .btn-outline:hover {
    border-color: var(--accent-purple);
    box-shadow: 0 0 10px rgba(138, 43, 226, 0.3);
  }

  .btn-danger {
    background-color: var(--accent-orange);
    color: white;
  }

  .btn-danger:hover {
    box-shadow: 0 0 15px var(--accent-orange);
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    color: var(--text-secondary);
    text-decoration: none;
    position: fixed;
    top: 6rem;
    left: 5vw;
    z-index: 10;
    font-size: 1rem;
    gap: 0.5rem;
  }

  .back-link:hover {
    color: var(--text-primary);
  }

  .gradient-text {
    background: linear-gradient(90deg, #3416DD, #D418D4);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* Role Selection */
  .role-selector {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin: 2rem 0;
  }

  .role-btn {
    padding: 1rem 2rem;
    border: 2px solid var(--border-color);
    background: transparent;
    color: var(--text-primary);
    border-radius: 12px;
    cursor: pointer;
    font-size: 1.1rem;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    min-width: 120px;
  }

  .role-btn i {
    font-size: 2rem;
  }

  .role-btn:hover {
    border-color: var(--accent-purple);
    transform: translateY(-2px);
  }

  .role-btn.active {
    background: linear-gradient(135deg, rgba(138, 43, 226, 0.2), rgba(200, 55, 200, 0.2));
    border-color: var(--accent-purple);
    box-shadow: 0 0 20px rgba(138, 43, 226, 0.3);
  }

  /* Upload Section */
  .upload-section {
    text-align: center;
    width: 100%;
  }
  
  .upload-box {
    background-color: rgba(12, 10, 36, 0.5);
    border: 2px dashed var(--border-color);
    border-radius: 16px;
    padding: 4rem 2rem;
    cursor: pointer;
    transition: all 0.3s ease;
    max-width: 600px;
    margin: 2rem auto;
  }

  .upload-box:hover {
    background-color: rgba(26, 24, 60, 0.7);
    border-color: var(--accent-purple);
  }
  
  .upload-box i {
    font-size: 3rem;
    color: var(--accent-purple);
    margin-bottom: 1rem;
  }

  .upload-box.dragover {
    border-color: var(--accent-green);
    background: rgba(0, 255, 155, 0.1);
  }
  
  .file-display {
    background-color: var(--secondary-bg);
    padding: 1.5rem;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 600px;
    margin: 2rem auto;
  }
  
  .file-display i {
    color: var(--accent-green);
    font-size: 1.5rem;
    margin-right: 1rem;
  }

  /* Dashboard Tabs */
  .dashboard-tabs, .data-explorer-tabs {
    display: flex;
    gap: 0.5rem;
    margin: 2rem 0;
    background-color: var(--secondary-bg);
    padding: 0.5rem;
    border-radius: 12px;
    flex-wrap: wrap;
  }

  .tab {
    padding: 0.8rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    color: var(--text-secondary);
    font-weight: 500;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border: none;
    background: transparent;
    white-space: nowrap;
  }

  .tab:hover {
    color: var(--text-primary);
    background: rgba(255, 255, 255, 0.05);
  }

  .tab.active {
    background-color: var(--primary-bg);
    color: var(--text-primary);
    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
  }

  /* Cards */
  .dashboard-card {
    background-color: var(--secondary-bg);
    padding: 2rem;
    border-radius: 12px;
    margin-bottom: 2rem;
    width: 100%;
    box-sizing: border-box;
    border: 1px solid var(--border-color);
    transition: all 0.3s ease;
  }

  .dashboard-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.3);
  }

  .dashboard-card h3 {
    margin-top: 0;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 1rem;
    margin-bottom: 1.5rem;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  /* Analysis Grid */
  .analysis-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    margin: 1.5rem 0;
  }

  .analysis-card {
    background: linear-gradient(135deg, rgba(138, 43, 226, 0.1), rgba(200, 55, 200, 0.05));
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .analysis-card:hover {
    transform: translateY(-2px);
    border-color: var(--accent-purple);
    box-shadow: 0 5px 20px rgba(138, 43, 226, 0.2);
  }

  .analysis-card h4 {
    margin-top: 0;
    color: var(--accent-purple);
    text-transform: capitalize;
  }

  .analysis-card p {
    color: var(--text-secondary);
    margin-bottom: 1rem;
    font-size: 0.95rem;
    line-height: 1.5;
  }

  .analysis-card .columns {
    background: rgba(0, 0, 0, 0.3);
    padding: 0.8rem;
    border-radius: 6px;
    font-size: 0.9rem;
    color: var(--accent-green);
    margin-bottom: 1rem;
  }

  /* Metrics */
  .metrics-grid, .streamlit-metrics {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin: 1.5rem 0;
  }

  .metric-card, .streamlit-metric {
    background: linear-gradient(135deg, rgba(138, 43, 226, 0.1), rgba(200, 55, 200, 0.05));
    padding: 1.5rem;
    border-radius: 12px;
    text-align: center;
    border: 1px solid var(--border-color);
  }

  .metric-value, .streamlit-metric-value {
    font-size: 2.5rem;
    font-weight: bold;
    color: var(--accent-purple);
    margin-bottom: 0.5rem;
  }

  .metric-label, .streamlit-metric-label {
    color: var(--text-secondary);
    font-size: 1rem;
  }

// Replace the existing .viz-grid, .chart-grid with:
.viz-grid, .chart-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
  margin: 1.5rem 0;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

// Replace the existing .chart-container with:
.chart-container {
  background: var(--secondary-bg);
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid var(--border-color);
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

// Replace the existing .plotly-chart with:
.plotly-chart {
  width: 100%;
  height: 350px; /* Reduced from 400px */
  background-color: var(--secondary-bg);
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.plotly-chart.full-height {
  height: 450px; /* Reduced from 500px */
}

// Add these new styles for better Plotly responsiveness:
.plotly-chart .js-plotly-plot,
.plotly-chart .plotly {
  width: 100% !important;
  height: 100% !important;
}

.plotly-chart .main-svg {
  width: 100% !important;
  height: 100% !important;
}

  .chart-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
    color: var(--text-secondary);
    gap: 1rem;
  }

  .chart-error {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 300px;
    color: #ef4444;
    text-align: center;
    padding: 1rem;
    gap: 1rem;
  }

  /* Export Options */
  .export-options {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .export-btn {
    padding: 1rem 2rem;
    background: transparent;
    border: 2px solid var(--border-color);
    color: var(--text-primary);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .export-btn:hover {
    border-color: var(--accent-purple);
    background: rgba(138, 43, 226, 0.1);
  }

  /* Chat Interface */
  .chat-container, .streamlit-chat-container {
    background: var(--secondary-bg);
    border-radius: 12px;
    padding: 1.5rem;
    height: 500px;
    display: flex;
    flex-direction: column;
  }

  .chat-messages, .streamlit-chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    background: var(--primary-bg);
    border-radius: 8px;
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }

  .message, .streamlit-message {
    max-width: 80%;
    padding: 1rem;
    border-radius: 12px;
    word-wrap: break-word;
  }

  .message.user, .streamlit-user-message {
    background: var(--accent-purple);
    align-self: flex-end;
  }

  .message.bot, .streamlit-bot-message {
    background: var(--secondary-bg);
    align-self: flex-start;
    border: 1px solid var(--border-color);
  }

  .chat-input-area {
    display: flex;
    gap: 0.5rem;
  }

  .chat-input-area input {
    flex: 1;
    padding: 1rem;
    background: var(--primary-bg);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    color: var(--text-primary);
    font-size: 1rem;
  }

  .chat-input-area input:focus {
    outline: none;
    border-color: var(--accent-purple);
  }

  /* Student Performance */
  .subjects-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin: 2rem 0;
  }

  .subject-card {
    background: linear-gradient(135deg, rgba(138, 43, 226, 0.1), rgba(200, 55, 200, 0.05));
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 1.5rem;
  }

  .subject-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .subject-header h4 {
    margin: 0;
    color: var(--accent-purple);
  }

  .subject-inputs {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .input-group label {
    color: var(--text-secondary);
    font-size: 0.9rem;
  }

  .input-group input,
  .input-group select {
    padding: 0.8rem;
    background: var(--primary-bg);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    color: var(--text-primary);
    font-size: 1rem;
  }

  .input-group input:focus,
  .input-group select:focus {
    outline: none;
    border-color: var(--accent-purple);
  }

  .extracurricular-section {
    background: var(--secondary-bg);
    border-radius: 12px;
    padding: 1.5rem;
    margin: 2rem 0;
    border: 1px solid var(--border-color);
  }

  .radio-group {
    display: flex;
    gap: 2rem;
    margin: 1rem 0;
  }

  .radio-group label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }

  .ratings-result {
    background: linear-gradient(135deg, rgba(0, 255, 155, 0.1), rgba(59, 130, 246, 0.05));
    border-radius: 12px;
    padding: 2rem;
    margin-top: 2rem;
    border: 1px solid var(--accent-green);
  }

  .ratings-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    margin: 2rem 0;
  }

  .rating-card {
    text-align: center;
    padding: 1.5rem;
    background: var(--primary-bg);
    border-radius: 8px;
  }

  .rating-value {
    font-size: 2.5rem;
    font-weight: bold;
    color: var(--accent-green);
  }

  .overall-rating {
    text-align: center;
    margin: 2rem 0;
  }

  .overall-value {
    font-size: 4rem;
    font-weight: bold;
    background: linear-gradient(135deg, var(--accent-green), var(--accent-blue));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .report-content {
    background: var(--primary-bg);
    padding: 2rem;
    border-radius: 12px;
    margin: 2rem 0;
    white-space: pre-line;
    line-height: 1.8;
  }

  /* Loading */
  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .spinner {
    width: 50px;
    height: 50px;
    border: 3px solid var(--border-color);
    border-top-color: var(--accent-purple);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Table Styles */
  .table-container {
    overflow-x: auto;
    background: var(--secondary-bg);
    border-radius: 12px;
    padding: 1rem;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid var(--border-color);
  }

  th {
    color: var(--text-secondary);
    font-weight: 500;
    text-transform: capitalize;
  }

  td {
    color: var(--text-primary);
  }

  /* Data Explorer Specific Styles */
  .structure-card {
    background-color: var(--secondary-bg);
    padding: 1.5rem;
    border-radius: 12px;
    margin-bottom: 1.5rem;
    border: 1px solid var(--border-color);
  }
  
  .dist-cards {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 2rem;
    flex-wrap: wrap;
  }
  
  .dist-card {
    padding: 1.5rem;
    border-radius: 12px;
    text-align: center;
    flex-grow: 1;
    min-width: 150px;
  }

  .dist-card.numeric { background: linear-gradient(135deg, #3b82f6, #2563eb); }
  .dist-card.text { background: linear-gradient(135deg, #16a34a, #15803d); }
  .dist-card.date { background: linear-gradient(135deg, #c026d3, #a21caf); }
  
  .missing-data-card {
    background-color: var(--secondary-bg);
    padding: 3rem;
    border-radius: 16px;
    text-align: center;
    border: 1px solid var(--border-color);
  }
  
  .missing-data-card i {
    font-size: 4rem;
    color: var(--accent-green);
    margin-bottom: 1rem;
  }

  .dataset-info-container {
    background-color: var(--secondary-bg);
    padding: 2rem;
    border-radius: 16px;
    margin: 2rem 0;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    gap: 2rem;
  }

  .info-item {
    text-align: center;
  }

  .info-item .value {
    font-size: 2.5rem;
    font-weight: bold;
    color: var(--accent-pink);
  }

  .info-item .label {
    color: var(--text-secondary);
    margin-top: 0.5rem;
  }
  
  .explore-options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1.5rem;
    margin: 2rem 0;
  }

  .explore-card {
    background-color: var(--secondary-bg);
    padding: 2rem;
    border-radius: 16px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 1px solid var(--border-color);
  }
  
  .explore-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 20px rgba(138, 43, 226, 0.3);
    border-color: var(--accent-purple);
  }
  
  .explore-card i {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: var(--text-primary);
  }

  .explore-card p {
    color: var(--text-primary);
    margin: 0;
    font-weight: 500;
  }

  /* Analysis Runner Specific Styles */
  .analysis-runner-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
    gap: 2rem;
    width: 100%;
  }

  .analysis-runner-card {
    background: var(--secondary-bg);
    padding: 1.5rem;
    border-radius: 12px;
    border: 1px solid var(--border-color);
    word-wrap: break-word;
    overflow-wrap: break-word;
  }

  .analysis-runner-card.full-width {
    grid-column: 1 / -1;
  }

  .analysis-runner-card h3 {
    margin-top: 0;
    margin-bottom: 1.2rem;
    color: var(--text-primary);
    font-size: 1.2rem;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 0.8rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .analysis-runner-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 2rem;
    flex-wrap: wrap;
  }

  /* Warning Container for Missing Columns */
  .warning-container {
    background-color: rgba(255, 193, 7, 0.1);
    border: 1px solid rgba(255, 193, 7, 0.3);
    border-left: 4px solid #ffc107;
    border-radius: 8px;
    padding: 15px;
    margin: 15px 0;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .warning-header {
    color: #ffc107;
    font-weight: bold;
    font-size: 1.1em;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .warning-message {
    color: #ffc107;
    margin-bottom: 10px;
    line-height: 1.4;
  }

  .missing-columns-list {
    background-color: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 193, 7, 0.2);
    border-radius: 4px;
    padding: 10px;
    margin: 10px 0;
  }

  .missing-column-item {
    padding: 8px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .missing-column-item:last-child {
    border-bottom: none;
  }

  .missing-column-name {
    font-weight: bold;
    color: #ff6b6b;
  }

  .missing-column-match {
    font-style: italic;
    color: var(--text-secondary);
    font-size: 0.9em;
  }

  .fallback-notice {
    background-color: rgba(13, 110, 253, 0.1);
    border: 1px solid rgba(13, 110, 253, 0.3);
    border-radius: 4px;
    padding: 10px;
    margin-top: 10px;
    color: #0dcaf0;
    font-size: 0.9em;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .analysis-fallback-notice {
    background: rgba(255, 165, 0, 0.1);
    border: 1px solid #ffa500;
    border-left: 4px solid #ffa500;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .analysis-fallback-notice i {
    color: #ffa500;
  }

  .insight-item {
    padding: 1rem;
    background: rgba(138, 43, 226, 0.1);
    border-radius: 8px;
    border-left: 4px solid var(--accent-purple);
    margin-bottom: 0.8rem;
    transition: all 0.3s ease;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }

  .insight-item:hover {
    background: rgba(138, 43, 226, 0.15);
    transform: translateX(4px);
  }

  .insight-item p {
    margin: 0;
    line-height: 1.5;
    font-size: 0.95rem;
    color: var(--text-primary);
  }

  .recommendation-item {
    display: flex;
    align-items: flex-start;
    gap: 0.8rem;
    padding: 1rem;
    background: rgba(0, 255, 155, 0.08);
    border-radius: 8px;
    border-left: 3px solid var(--accent-green);
    margin-bottom: 0.8rem;
    transition: all 0.3s ease;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }

  .recommendation-item:hover {
    background: rgba(0, 255, 155, 0.12);
    transform: translateX(4px);
  }

  .recommendation-item i {
    color: var(--accent-green);
    font-size: 1rem;
    margin-top: 0.1rem;
    flex-shrink: 0;
  }

  .recommendation-text {
    color: var(--text-primary);
    line-height: 1.5;
    font-size: 0.95rem;
    margin: 0;
    flex: 1;
  }

  .scrollable-content {
    max-height: 400px;
    max-width: 100%;
    overflow-y: auto;
    padding-right: 0.5rem;
  }

  .scrollable-content::-webkit-scrollbar {
    width: 6px;
  }

  .scrollable-content::-webkit-scrollbar-track {
    background: var(--primary-bg);
    border-radius: 3px;
  }

  .scrollable-content::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 3px;
  }

  .scrollable-content::-webkit-scrollbar-thumb:hover {
    background: var(--accent-purple);
  }

  .full-width-chart {
    grid-column: 1 / -1;
    width: 100%;
  }

  /* Pulse animation for bot */
  .pulse-dot {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 8px;
    height: 8px;
    background-color: var(--accent-green);
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(0, 255, 155, 0.7);
    }
    
    70% {
        transform: scale(1);
        box-shadow: 0 0 0 10px rgba(0, 255, 155, 0);
    }
    
    100% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(0, 255, 155, 0);
    }
  }

  /* Responsive */
  @media (max-width: 1200px) {
    .analysis-runner-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .header {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }

    .nav {
      gap: 1rem;
    }

    .role-selector {
      flex-direction: column;
      align-items: center;
    }

    .role-btn {
      width: 100%;
      max-width: 200px;
    }

    .dashboard-tabs, .data-explorer-tabs {
      overflow-x: auto;
      padding: 0.5rem;
    }

    .tab {
      padding: 0.6rem 1rem;
      font-size: 0.9rem;
    }

    .analysis-grid {
      grid-template-columns: 1fr;
    }

    .viz-grid, .chart-grid {
      grid-template-columns: 1fr;
    }

    .plotly-chart {
      height: 300px;
    }
  }

  @media (max-width: 480px) {
    .main-content {
      padding: 7rem 1rem 1rem 1rem;
    }

    .back-link {
      top: 5rem;
      left: 1rem;
    }

    .upload-box {
      padding: 2rem 1rem;
    }

    .dashboard-card {
      padding: 1rem;
    }

    .missing-column-item {
      flex-direction: column;
      align-items: flex-start;
    }
      // Responsive adjustments for smaller screens
@media (max-width: 1200px) {
  .viz-grid, .chart-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .plotly-chart {
    height: 300px;
  }
}

@media (max-width: 768px) {
  .viz-grid, .chart-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .plotly-chart {
    height: 280px;
  }
  
  .dashboard-card {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .plotly-chart {
    height: 250px;
  }
  
  .chart-title {
    font-size: 0.9rem;
  }
}
  // Add these styles to your AppStyles constant

// Main content area - ensure consistent width
.main-content {
  width: 100%;
  max-width: 1400px;
  padding: 8rem 2rem 2rem 2rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  margin: 0 auto; /* Center the content */
}

// Dashboard cards - consistent width across all tabs
.dashboard-card {
  background-color: var(--secondary-bg);
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

// Tab content container - full width
.tab-content {
  width: 100%;
  max-width: 100%;
}

// For Relationship tab specifically - ensure it matches Overview
.relationship-content {
  width: 100%;
  max-width: 100%;
}

// For Time Series tab
.time-series-content {
  width: 100%;
  max-width: 100%;
}

// Ensure all tab containers have same width
.dashboard-tabs + .tab-content {
  width: 100%;
}

// Make sure the grid layouts don't constrain width
.viz-grid, .chart-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin: 1.5rem 0;
  width: 100%;
}
  }
`;

// --- DATA ANALYSIS HELPERS ---

const calculateStats = (data, columnName, type) => {
  if (!data || data.length === 0) return { stats: 'No data', details: '' };
  
  const values = data.map(row => row[columnName]).filter(val => val !== null && val !== undefined && val !== '');
  
  if (values.length === 0) return { stats: 'All values missing', details: '' };
  
  if (type === 'Numeric') {
    const numericValues = values.map(val => parseFloat(val)).filter(val => !isNaN(val));
    if (numericValues.length === 0) return { stats: 'No numeric values', details: '' };
    
    const min = Math.min(...numericValues);
    const max = Math.max(...numericValues);
    const sum = numericValues.reduce((a, b) => a + b, 0);
    const mean = sum / numericValues.length;
    const sorted = [...numericValues].sort((a, b) => a - b);
    const median = sorted.length % 2 === 0 
      ? (sorted[sorted.length/2 - 1] + sorted[sorted.length/2]) / 2 
      : sorted[Math.floor(sorted.length/2)];
    
    return {
      stats: `Min: ${min.toFixed(2)}, Max: ${max.toFixed(2)}`,
      details: `Mean: ${mean.toFixed(2)}, Median: ${median.toFixed(2)}`
    };
  } else {
    const valueCounts = {};
    values.forEach(val => {
      valueCounts[val] = (valueCounts[val] || 0) + 1;
    });
    
    const uniqueValues = Object.keys(valueCounts).length;
    const mostCommon = Object.entries(valueCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([val, count]) => `${val} (${count})`)
      .join(', ');
    
    return {
      stats: `${uniqueValues} unique values`,
      details: `Most common: ${mostCommon || 'N/A'}`
    };
  }
};

// --- COMPONENTS ---

const LoadingOverlay = ({ message = "Processing..." }) => (
  <div className="loading-overlay">
    <div className="spinner"></div>
    <p>{message}</p>
  </div>
);

const BackButton = ({ onClick, text = "Back" }) => (
  <a href="#back" onClick={(e) => { e.preventDefault(); onClick(); }} className="back-link">
    <i className="fas fa-arrow-left"></i> {text}
  </a>
);

const Header = ({ setPage, currentRole, setCurrentRole }) => {
  return (
    <header className="header">
      <div className="logo gradient-text" onClick={() => setPage('home')}>
        AutoDash RIT
      </div>
      <nav className="nav">
        <a href="#home" onClick={(e) => { e.preventDefault(); setPage('home'); }}>
          <i className="fas fa-home"></i> Home
        </a>
        {currentRole && (
          <span style={{ color: 'var(--accent-green)' }}>
            <i className="fas fa-user-graduate"></i> {currentRole}
          </span>
        )}
      </nav>
    </header>
  );
};

// --- ROLE SELECTION PAGE ---
const RoleSelectionPage = ({ setPage, setCurrentRole }) => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = async (role) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/select_role`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        setCurrentRole(role);
        setSelectedRole(role);
      } else {
        alert('Error selecting role: ' + data.message);
      }
    } catch (error) {
      console.error('Error selecting role:', error);
      alert('Failed to select role. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    if (selectedRole) {
      setPage('upload');
    }
  };

  return (
    <div className="page-wrapper">
      <BackButton onClick={() => setPage('home')} />
      
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <h1>Select Your Role</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Choose your role to get personalized analysis and insights
        </p>

        <div className="role-selector">
          <button
            className={`role-btn ${selectedRole === 'student' ? 'active' : ''}`}
            onClick={() => handleRoleSelect('student')}
            disabled={isLoading}
          >
            <i className="fas fa-user-graduate"></i>
            <span>Student</span>
            <small style={{ color: 'var(--text-secondary)' }}>20 analysis functions</small>
          </button>

          <button
            className={`role-btn ${selectedRole === 'faculty' ? 'active' : ''}`}
            onClick={() => handleRoleSelect('faculty')}
            disabled={isLoading}
          >
            <i className="fas fa-chalkboard-teacher"></i>
            <span>Faculty</span>
            <small style={{ color: 'var(--text-secondary)' }}>20 analysis functions</small>
          </button>

          <button
            className={`role-btn ${selectedRole === 'admin' ? 'active' : ''}`}
            onClick={() => handleRoleSelect('admin')}
            disabled={isLoading}
          >
            <i className="fas fa-user-tie"></i>
            <span>Admin</span>
            <small style={{ color: 'var(--text-secondary)' }}>20 analysis functions</small>
          </button>
        </div>

        {selectedRole && (
          <button
            className="btn btn-gradient"
            onClick={handleContinue}
            style={{ marginTop: '2rem' }}
          >
            Continue to Upload <i className="fas fa-arrow-right"></i>
          </button>
        )}
      </div>

      {isLoading && <LoadingOverlay message="Setting up your role..." />}
    </div>
  );
};

// --- UPLOAD PAGE ---
const UploadPage = ({ setPage, currentRole, setDataset, setFile }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (file) => {
    if (!file) return;

    setSelectedFile(file);
    setIsLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${BACKEND_URL}/api/upload?role=${currentRole}`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.status === 'success') {
        setDataset(data);
        setFile(file);
        setPage('datasetLoaded');
      } else {
        alert('Error uploading file: ' + (data.detail || 'Unknown error'));
      }
    } catch (error) {
      console.error('Upload error:', error);
      if (error.message.includes('Failed to fetch')) {
        alert('Error: Cannot connect to backend server. Please make sure it\'s running on port 8000');
      } else {
        alert('Error uploading file: ' + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="page-wrapper">
      <BackButton onClick={() => setPage('role')} />
      
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept=".csv,.xlsx,.xls"
      />

      <div className="upload-section">
        <h1>Upload Your Dataset</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Role: <span style={{ color: 'var(--accent-green)', textTransform: 'capitalize' }}>{currentRole}</span>
        </p>

        <div
          className={`upload-box ${isDragging ? 'dragover' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleButtonClick}
        >
          <i className="fas fa-cloud-upload-alt"></i>
          <h3>Drag and drop your file here</h3>
          <p style={{ color: 'var(--text-secondary)' }}>or click to browse</p>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Supported formats: CSV, Excel (.xlsx, .xls)
          </p>
        </div>

        {selectedFile && (
          <div className="file-display">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <i className="fas fa-file-excel"></i>
              <span>{selectedFile.name}</span>
            </div>
            <span style={{ color: 'var(--accent-green)' }}>Processing...</span>
          </div>
        )}

        <div className="info-box" style={{ marginTop: '2rem' }}>
          <i className="fas fa-info-circle"></i>
          <p>Your data will be securely processed. We support files up to 100MB.</p>
        </div>
      </div>

      {isLoading && <LoadingOverlay message="Processing your dataset..." />}
    </div>
  );
};

// --- DATASET LOADED PAGE ---
const DatasetLoadedPage = ({ setPage, dataset, currentRole, }) => {
  return (
    <div className="page-wrapper">
      <BackButton onClick={() => setPage('upload')} />
      <div className="text-center" style={{maxWidth: '800px', margin: 'auto'}}>
        <i className="fas fa-check-circle" style={{fontSize: '3rem', color: 'var(--accent-green)', marginBottom: '1rem'}}></i>
        <h1 style={{color: 'var(--accent-pink)'}}>Dataset Loaded Successfully!</h1>
        <p style={{color: 'var(--text-secondary)'}}>Your data has been processed and is ready for intelligent analysis.</p>
        
        <div className="dataset-info-container">
          <div className="info-item">
            <div className="value">{dataset.rows}</div>
            <div className="label">Total rows</div>
          </div>
          <div className="info-item">
            <div className="value">{dataset.columns}</div>
            <div className="label">Columns</div>
          </div>
        </div>

        <h2 style={{marginTop: '3rem'}}>Explore Your Data</h2>
        <div className="explore-options">
          <div className="explore-card" onClick={() => setPage('dataExplorer/preview')}>
            <i className="fas fa-eye"></i>
            <p>Preview</p>
          </div>
          <div className="explore-card" onClick={() => setPage('dataExplorer/structure')}>
            <i className="fas fa-sitemap"></i>
            <p>Structure</p>
          </div>
          <div className="explore-card" onClick={() => setPage('dataExplorer/missing')}>
            <i className="fas fa-question-circle"></i>
            <p>Missing Data</p>
          </div>
          <div className="explore-card" onClick={() => setPage('dashboard')}>
            <i className="fas fa-chart-line"></i>
            <p>Dashboard</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- DATA EXPLORER PAGE ---
const DataExplorerPage = ({ setPage, dataset, initialTab }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  const renderContent = () => {
    switch(activeTab) {
      case 'preview': return <DataPreview dataset={dataset} />;
      case 'structure': return <DataStructure dataset={dataset} />;
      case 'missing': return <MissingData dataset={dataset} />;
      default: return <DataPreview dataset={dataset} />;
    }
  };
  
  return (
    <div className="page-wrapper" style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
      <BackButton onClick={() => setPage('datasetLoaded')} text="Back"/>
      <div style={{width: '100%'}}>
        <h1>Data Explorer</h1>
        <p style={{color: 'var(--text-secondary)'}}>Comprehensive analysis of your dataset structure and quality</p>
      </div>

      <div className="data-explorer-tabs">
        <button className={`tab ${activeTab === 'preview' ? 'active' : ''}`} onClick={() => setActiveTab('preview')}>
          <i className="fas fa-eye"></i> Preview
        </button>
        <button className={`tab ${activeTab === 'structure' ? 'active' : ''}`} onClick={() => setActiveTab('structure')}>
          <i className="fas fa-sitemap"></i> Structure
        </button>
        <button className={`tab ${activeTab === 'missing' ? 'active' : ''}`} onClick={() => setActiveTab('missing')}>
          <i className="fas fa-question-circle"></i> Missing Data
        </button>
      </div>
      
      <div className="content" style={{width: '100%'}}>
        {renderContent()}
      </div>
    </div>
  );
};

// --- DATA PREVIEW COMPONENT ---
const DataPreview = ({ dataset }) => (
  <div className="dashboard-card">
    <h3>
      <i className="fas fa-eye" style={{ color: 'var(--accent-blue)' }}></i>
      Data Preview
    </h3>
    <p style={{color: 'var(--text-secondary)', marginBottom: '1.5rem'}}>
      First 5 rows of your dataset displayed in table format
    </p>
    <div className="table-container">
      <table>
        <thead>
          <tr>{dataset.preview.length > 0 && Object.keys(dataset.preview[0]).map(key => <th key={key}>{key}</th>)}</tr>
        </thead>
        <tbody>
          {dataset.preview.map((row, index) => (
            <tr key={index}>
              {Object.values(row).map((val, i) => <td key={i}>{val}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// --- DATA STRUCTURE COMPONENT ---
const DataStructure = ({ dataset }) => {
  // Calculate statistics for each column
  const structure = dataset.columns_info.map(col => {
    const stats = calculateStats(dataset.preview, col.name, 
      col.dtype.includes('int') || col.dtype.includes('float') ? 'Numeric' : 'Text');
    
    return {
      name: col.name,
      type: col.dtype.includes('int') || col.dtype.includes('float') ? 'Numeric' : 
            col.dtype.includes('datetime') ? 'Date' : 'Text',
      description: `Column with ${col.dtype} data type`,
      stats: stats.stats,
      details: stats.details
    };
  });

  // Count data types
  const typeCounts = {
    Numeric: structure.filter(col => col.type === 'Numeric').length,
    Text: structure.filter(col => col.type === 'Text').length,
    Date: structure.filter(col => col.type === 'Date').length
  };

  return (
    <div className="dashboard-card">
      <h3>
        <i className="fas fa-sitemap" style={{ color: 'var(--accent-purple)' }}></i>
        Data Structure Analysis
      </h3>
      <p style={{color: 'var(--text-secondary)', marginBottom: '1.5rem'}}>
        Column information, data types, and statistical overview
      </p>

      {structure.map(col => (
        <div key={col.name} className="structure-card">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem'}}>
            <div>
              <h4 style={{margin: 0}}>{col.name} <span style={{fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 'normal'}}>({col.type})</span></h4>
              <p style={{color: 'var(--text-secondary)', margin: '0.2rem 0 0 0'}}>{col.description}</p>
            </div>
            <div style={{textAlign: 'right'}}>
              <p style={{margin: 0, color: 'var(--accent-green)'}}>{col.stats}</p>
              <p style={{margin: 0, color: 'var(--text-secondary)'}}>{col.details}</p>
            </div>
          </div>
        </div>
      ))}
      
      <div className="structure-card">
        <h3>Data Type Distribution</h3>
        <div className="dist-cards">
          <div className="dist-card numeric">
            <h1 style={{margin: 0}}>{typeCounts.Numeric}</h1>
            <p style={{margin: 0}}>Numeric Columns</p>
          </div>
          <div className="dist-card text">
            <h1 style={{margin: 0}}>{typeCounts.Text}</h1>
            <p style={{margin: 0}}>Text Columns</p>
          </div>
          <div className="dist-card date">
            <h1 style={{margin: 0}}>{typeCounts.Date}</h1>
            <p style={{margin: 0}}>Date Columns</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MISSING DATA COMPONENT ---
const MissingData = ({ dataset }) => {
  // Calculate missing data
  const missingData = {};
  let totalMissing = 0;
  let totalCells = dataset.rows * dataset.columns;
  
  dataset.columns_info.forEach(col => {
    const missingValues = dataset.preview.filter(row => 
      row[col.name] === null || row[col.name] === undefined || row[col.name] === '').length;
    missingData[col.name] = missingValues;
    totalMissing += missingValues;
  });
  
  const completeness = ((totalCells - totalMissing) / totalCells) * 100;
  
  return (
    <div className="dashboard-card">
      <h3>
        <i className="fas fa-question-circle" style={{ color: 'var(--accent-orange)' }}></i>
        Missing Data Analysis
      </h3>
      <p style={{color: 'var(--text-secondary)', marginBottom: '1.5rem'}}>
        Comprehensive analysis of missing values across all columns
      </p>

      <div className="missing-data-card">
        <i className="fas fa-chart-line"></i>
        <h2 style={{color: totalMissing === 0 ? 'var(--accent-green)' : 'var(--accent-orange)'}}>
          {totalMissing === 0 ? 'Excellent Data Quality!' : 'Data Quality Check'}
        </h2>
        <p style={{color: 'var(--text-secondary)'}}>Your dataset has {totalMissing} missing values across all {dataset.columns} columns.</p>
        <div style={{display: 'flex', justifyContent: 'space-around', marginTop: '2rem', flexWrap: 'wrap', gap: '2rem'}}>
          <div>
            <h1 style={{margin: 0, color: 'var(--accent-green)'}}>{completeness.toFixed(1)}%</h1>
            <p style={{margin: 0, color: 'var(--text-secondary)'}}>Data Completeness</p>
          </div>
          <div>
            <h1 style={{margin: 0, color: 'var(--accent-orange)'}}>{totalMissing}</h1>
            <p style={{margin: 0, color: 'var(--text-secondary)'}}>Missing Values</p>
          </div>
        </div>
      </div>
      
      <div className="structure-card">
        <h3>Missing Values by Column</h3>
        {Object.entries(missingData).map(([colName, missingCount]) => (
          <div key={colName} style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)'}}>
            <span style={{color: 'var(--text-primary)'}}>{colName}</span>
            <span style={{color: missingCount > 0 ? 'var(--accent-orange)' : 'var(--accent-green)'}}>
              {missingCount} missing ({((missingCount / dataset.rows) * 100).toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- DASHBOARD PAGE ---
const DashboardPage = ({ setPage, dataset, currentRole }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [visualizations, setVisualizations] = useState(null);
  const [isLoadingViz, setIsLoadingViz] = useState(false);
  const [aiInsights, setAiInsights] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  // Load AI recommendations on mount
  useEffect(() => {
    analyzeWithAI();
    generateVisualizations();
    getAIInsights();
  }, [dataset]);

  const analyzeWithAI = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/analyze_with_ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preview: dataset.preview,
          role: currentRole
        })
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        setAnalysisResult(data.analysis_result);
      }
    } catch (error) {
      console.error('Error analyzing with AI:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateVisualizations = async () => {
    setIsLoadingViz(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/generate_visualizations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preview: dataset.preview,
          theme: {
            bg: "#0A071E",
            text: "#ffffff",
            primary: "#8a2be2",
            secondary: "#1a183c",
            chart_bg: "#1a183c"
          }
        })
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        setVisualizations(data.visualizations);
      }
    } catch (error) {
      console.error('Error generating visualizations:', error);
    } finally {
      setIsLoadingViz(false);
    }
  };

  const getAIInsights = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/get_ai_insights`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preview: dataset.preview,
          role: currentRole
        })
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        setAiInsights(data.insights);
      }
    } catch (error) {
      console.error('Error getting AI insights:', error);
    }
  };

  const runAnalysis = async (analysisName) => {
    setPage(`analysisRunner/${analysisName}`);
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = { role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');

    try {
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: chatInput,
          preview: dataset.preview,
          role: currentRole,
          history: chatMessages
        })
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        setChatMessages(prev => [...prev, { role: 'bot', content: data.response }]);
      } else {
        setChatMessages(prev => [...prev, { role: 'bot', content: 'Error: ' + data.message }]);
      }
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'bot', content: 'Error: ' + error.message }]);
    }
  };

  const exportReport = async (format) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/export_dashboard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preview: dataset.preview,
          format: format,
          insights: aiInsights,
          role: currentRole
        })
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `autodash_rit_report.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export error:', error);
      alert('Error exporting report: ' + error.message);
    }
  };

  const renderVisualization = (vizData, title) => {
    if (!vizData) return null;

    try {
      const plotlyData = typeof vizData === 'string' ? JSON.parse(vizData) : vizData;
      
      return (
        <div className="chart-container">
          <div className="chart-title">{title}</div>
          <div className="plotly-chart">
            <Plot
              data={plotlyData.data}
              layout={{
                ...plotlyData.layout,
                height: 400,
                autosize: true,
                paper_bgcolor: '#1a183c',
                plot_bgcolor: '#1a183c',
                font: { color: '#ffffff' }
              }}
              config={{
                displayModeBar: true,
                displaylogo: false,
                responsive: true
              }}
              useResizeHandler={true}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </div>
      );
    } catch (error) {
      console.error('Error rendering visualization:', error);
      return null;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div>
            {/* Overview Section 1: Analysis Functions */}
            <div className="dashboard-card">
              <h3>
                <i className="fas fa-robot" style={{ color: 'var(--accent-purple)' }}></i>
                Recommended Analyses
              </h3>
              
              {isAnalyzing ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
                  <p>AI is analyzing your data...</p>
                </div>
              ) : analysisResult?.analysis_recommendations ? (
                <div className="analysis-grid">
                  {analysisResult.analysis_recommendations.map((rec, index) => (
                    <div
                      key={index}
                      className="analysis-card"
                      onClick={() => runAnalysis(rec.name)}
                    >
                      <h4>{rec.name.replace(/_/g, ' ')}</h4>
                      <p>{rec.description}</p>
                      <div className="columns">
                        <small>Recommended columns: {rec.columns.join(', ')}</small>
                      </div>
                      <button className="btn btn-small btn-gradient">
                        Run Analysis <i className="fas fa-arrow-right"></i>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <p>Click "Run Analysis" to get AI recommendations</p>
                </div>
              )}
              
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <button className="btn btn-outline" onClick={analyzeWithAI}>
                  <i className="fas fa-sync-alt"></i> Refresh Recommendations
                </button>
              </div>
            </div>

            {/* Overview Section 2: Visualizations */}
            <div className="dashboard-card">
              <h3>
                <i className="fas fa-chart-line" style={{ color: 'var(--accent-green)' }}></i>
                Visualizations
              </h3>
              
              {isLoadingViz ? (
                <div className="chart-loading">
                  <i className="fas fa-spinner fa-spin"></i>
                  <p>Generating visualizations...</p>
                </div>
              ) : visualizations ? (
                <div className="viz-grid">
                  {Object.entries(visualizations).map(([key, viz]) => (
                    key.includes('histogram') || key.includes('boxplot') || key.includes('barchart') || key === 'correlation_matrix' ? (
                      <div key={key}>
                        {renderVisualization(viz, key.replace(/_/g, ' '))}
                      </div>
                    ) : null
                  ))}
                </div>
              ) : (
                <div className="chart-error">
                  <i className="fas fa-chart-bar" style={{ fontSize: '2rem' }}></i>
                  <p>No visualizations available</p>
                </div>
              )}
            </div>

            {/* Overview Section 3: Export */}
            <div className="dashboard-card">
              <h3>
                <i className="fas fa-download" style={{ color: 'var(--accent-blue)' }}></i>
                Export Report
              </h3>
              
              <div className="export-options">
                <button className="export-btn" onClick={() => exportReport('pdf')}>
                  <i className="fas fa-file-pdf"></i> PDF
                </button>
                <button className="export-btn" onClick={() => exportReport('excel')}>
                  <i className="fas fa-file-excel"></i> Excel
                </button>
                <button className="export-btn" onClick={() => exportReport('html')}>
                  <i className="fas fa-file-code"></i> HTML
                </button>
              </div>
            </div>
          </div>
        );

    case 'relationship':
      return (
        <div className= "relationship-content" style={{ width: '100%' }}>
        <div className="tab-content relationship-content" style={{ width: '100%' }}>
          <div className="dashboard-card" style={{ width: '100%' }}>
            <h3>Relationship Analysis</h3>
            {visualizations?.correlation_matrix ? (
              renderVisualization(visualizations.correlation_matrix, 'Correlation Matrix')
            ) : (
              <p>No relationship data available</p>
            )}
            {visualizations?.scatter_matrix && (
              renderVisualization(visualizations.scatter_matrix, 'Scatter Plot Matrix')
            )}
          </div>
        </div>
        </div>
      );

    case 'timeseries':
      return (
        <div className="tab-content timeseries-content" style={{ width: '100%' }}>
          <TimeSeriesTab
            dataset={dataset}
            renderVisualization={renderVisualization}
          />
        </div>
      );

    case 'insights':
      return (
        <div className="tab-content insights-content" style={{ width: '100%' }}>
          <div className="dashboard-card">
            <h3>AI Insights</h3>
            {aiInsights ? (
              <div style={{
                background: 'var(--primary-bg)',
                padding: '2rem',
                borderRadius: '8px',
                whiteSpace: 'pre-line',
                lineHeight: '1.8'
              }}>
                {aiInsights}
              </div>
            ) : (
              <p>Loading insights...</p>
            )}
          </div>
        </div>
      );

    case 'chat':
      return (
        <div className="tab-content chat-content" style={{ width: '100%' }}>
          <div className="dashboard-card">
            <h3>
              <i className="fas fa-robot" style={{ color: 'var(--accent-purple)' }}></i>
              AI Chat Assistant
            </h3>
            
            <div className="chat-container">
              <div className="chat-messages">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`message ${msg.role}`}>
                    <div className="message-content">{msg.content}</div>
                  </div>
                ))}
              </div>
              
              <div className="chat-input-area">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                  placeholder="Ask about your data..."
                />
                <button className="btn btn-gradient" onClick={sendChatMessage}>
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      );

    case 'performance':
      return (
        <div className="tab-content performance-content" style={{ width: '100%' }}>
          <StudentPerformanceTab
            setPage={setPage}
            dataset={dataset}
            currentRole={currentRole}
          />
        </div>
      );

    default:
      return null;
  }
  };

  return (
    <div className="page-wrapper">
      <BackButton onClick={() => setPage('datasetLoaded')} />
      
      <div style={{ width: '100%' }}>
        <h1>Data Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Dataset: {dataset.filename} ({dataset.rows} rows, {dataset.columns} columns)
        </p>

        {/* Metrics Overview */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-value">{dataset.rows}</div>
            <div className="metric-label">Total Rows</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">{dataset.columns}</div>
            <div className="metric-label">Total Columns</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">{dataset.numeric_columns?.length || 0}</div>
            <div className="metric-label">Numeric Columns</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">{dataset.categorical_columns?.length || 0}</div>
            <div className="metric-label">Categorical Columns</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="dashboard-tabs">
          <button className={`tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            <i className="fas fa-eye"></i> Overview
          </button>
          <button className={`tab ${activeTab === 'relationship' ? 'active' : ''}`} onClick={() => setActiveTab('relationship')}>
            <i className="fas fa-project-diagram"></i> Relationship
          </button>
          <button className={`tab ${activeTab === 'timeseries' ? 'active' : ''}`} onClick={() => setActiveTab('timeseries')}>
            <i className="fas fa-chart-line"></i> Time Series
          </button>
          <button className={`tab ${activeTab === 'insights' ? 'active' : ''}`} onClick={() => setActiveTab('insights')}>
            <i className="fas fa-lightbulb"></i> AI Insights
          </button>
          <button className={`tab ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>
            <i className="fas fa-comments"></i> AI Chat
          </button>
          {(currentRole === 'student' || currentRole === 'faculty') && (
            <button className={`tab ${activeTab === 'performance' ? 'active' : ''}`} onClick={() => setActiveTab('performance')}>
              <i className="fas fa-star"></i> Performance
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

// --- TIME SERIES TAB ---
const TimeSeriesTab = ({ dataset, renderVisualization }) => {
  const [dateCols, setDateCols] = useState([]);
  const [numCols, setNumCols] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedNum, setSelectedNum] = useState('');
  const [period, setPeriod] = useState(30);
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTimeSeriesColumns();
  }, [dataset]);

  const fetchTimeSeriesColumns = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/get_time_series_data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preview: dataset.preview })
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        setDateCols(data.date_cols || []);
        setNumCols(data.numeric_cols || []);
        if (data.date_cols?.length > 0) setSelectedDate(data.date_cols[0]);
        if (data.numeric_cols?.length > 0) setSelectedNum(data.numeric_cols[0]);
      }
    } catch (error) {
      console.error('Error fetching time series columns:', error);
    }
  };

  const runAnalysis = async () => {
    if (!selectedDate || !selectedNum) {
      alert('Please select both date and numeric columns');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/get_time_series_data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preview: dataset.preview,
          date_col: selectedDate,
          num_col: selectedNum,
          period: period
        })
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        setResults(data.results);
      }
    } catch (error) {
      console.error('Error running time series analysis:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard-card">
      <h3>Time Series Analysis</h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div className="input-group">
          <label>Date Column</label>
          <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
            <option value="">Select Date Column</option>
            {dateCols.map(col => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label>Numeric Column</label>
          <select value={selectedNum} onChange={(e) => setSelectedNum(e.target.value)}>
            <option value="">Select Numeric Column</option>
            {numCols.map(col => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label>Period (days)</label>
          <input
            type="number"
            min="2"
            max="365"
            value={period}
            onChange={(e) => setPeriod(Number(e.target.value))}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button
            className="btn btn-gradient"
            onClick={runAnalysis}
            disabled={isLoading || !selectedDate || !selectedNum}
            style={{ width: '100%' }}
          >
            {isLoading ? <i className="fas fa-spinner fa-spin"></i> : 'Run Analysis'}
          </button>
        </div>
      </div>

      {results && (
        <div className="viz-grid">
          {results.line_chart && renderVisualization(results.line_chart, 'Time Series Plot')}
          {results.decomposition && renderVisualization(results.decomposition, 'Seasonal Decomposition')}
        </div>
      )}
    </div>
  );
};

// --- STUDENT PERFORMANCE TAB ---
const StudentPerformanceTab = ({ setPage, dataset, currentRole }) => {
  const [numSubjects, setNumSubjects] = useState(3);
  const [subjects, setSubjects] = useState([]);
  const [extracurricular, setExtracurricular] = useState('no');
  const [activity, setActivity] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    generateSubjectInputs(numSubjects);
  }, []);

  const generateSubjectInputs = (count) => {
    const newSubjects = [];
    for (let i = 1; i <= count; i++) {
      newSubjects.push({
        name: `Subject ${i}`,
        inputs: {
          Attendance: 75,
          Extracurricular_Activities: extracurricular,
          Previous_Scores_1: 70,
          previous_Score_2: 70,
          Assignment_Score: 75,
          Previous_Semester_CGPA: 7.5
        }
      });
    }
    setSubjects(newSubjects);
  };

  const updateSubject = (index, field, value) => {
    const newSubjects = [...subjects];
    if (field === 'name') {
      newSubjects[index].name = value;
    } else {
      newSubjects[index].inputs[field] = value;
    }
    setSubjects(newSubjects);
  };

  const calculateRatings = async () => {
    if (currentRole !== 'student' && currentRole !== 'faculty') {
      alert('This feature is only available for students and faculty');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/student_performance_rating`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          num_subjects: subjects.length,
          subjects: subjects,
          extracurricular: extracurricular,
          extracurricular_activity: extracurricular === 'yes' ? activity : null
        })
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        setResult(data);
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error calculating ratings:', error);
      alert('Failed to calculate ratings: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadReport = async () => {
    if (!result) return;

    try {
      const response = await fetch(`${BACKEND_URL}/api/export_student_report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject_ratings: result.subject_ratings,
          overall_rating: result.overall_rating,
          report: result.report,
          extracurricular_activity: extracurricular === 'yes' ? activity : null
        })
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `student_performance_report.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Failed to download report: ' + error.message);
    }
  };

  return (
    <div className="dashboard-card">
      <h3>
        <i className="fas fa-star" style={{ color: 'var(--accent-green)' }}></i>
        Student Performance Rating
      </h3>

      <div style={{ marginBottom: '2rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Number of Subjects</label>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input
            type="number"
            min="1"
            max="10"
            value={numSubjects}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              setNumSubjects(val);
              generateSubjectInputs(val);
            }}
            style={{ width: '100px' }}
          />
          <button className="btn btn-secondary" onClick={() => generateSubjectInputs(numSubjects)}>
            Set
          </button>
        </div>
      </div>

      <div className="subjects-container">
        {subjects.map((subject, idx) => (
          <div key={idx} className="subject-card">
            <div className="subject-header">
              <h4>
                <input
                  type="text"
                  value={subject.name}
                  onChange={(e) => updateSubject(idx, 'name', e.target.value)}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    width: '200px'
                  }}
                />
              </h4>
            </div>

            <div className="subject-inputs">
              <div className="input-group">
                <label>Attendance (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={subject.inputs.Attendance}
                  onChange={(e) => updateSubject(idx, 'Attendance', e.target.value)}
                />
              </div>
              <div className="input-group">
                <label>Previous Score 1</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={subject.inputs.Previous_Scores_1}
                  onChange={(e) => updateSubject(idx, 'Previous_Scores_1', e.target.value)}
                />
              </div>
              <div className="input-group">
                <label>Previous Score 2</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={subject.inputs.previous_Score_2}
                  onChange={(e) => updateSubject(idx, 'previous_Score_2', e.target.value)}
                />
              </div>
              <div className="input-group">
                <label>Assignment Score</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={subject.inputs.Assignment_Score}
                  onChange={(e) => updateSubject(idx, 'Assignment_Score', e.target.value)}
                />
              </div>
              <div className="input-group">
                <label>Previous CGPA</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={subject.inputs.Previous_Semester_CGPA}
                  onChange={(e) => updateSubject(idx, 'Previous_Semester_CGPA', e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="extracurricular-section">
        <h4>Extracurricular Activities</h4>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              value="yes"
              checked={extracurricular === 'yes'}
              onChange={(e) => setExtracurricular('yes')}
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              value="no"
              checked={extracurricular === 'no'}
              onChange={(e) => setExtracurricular('no')}
            />
            No
          </label>
        </div>

        {extracurricular === 'yes' && (
          <div className="input-group" style={{ marginTop: '1rem' }}>
            <label>Specify Activity</label>
            <input
              type="text"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              placeholder="e.g., Sports, Music, Debate"
            />
          </div>
        )}
      </div>

      <div style={{ textAlign: 'center' }}>
        <button
          className="btn btn-green"
          onClick={calculateRatings}
          disabled={isLoading}
          style={{ padding: '1rem 3rem', fontSize: '1.2rem' }}
        >
          {isLoading ? <i className="fas fa-spinner fa-spin"></i> : 'Calculate Performance Ratings'}
        </button>
      </div>

      {result && (
        <div className="ratings-result">
          <h3>Performance Ratings</h3>
          
          <div className="ratings-grid">
            {result.subject_ratings.map((subject, idx) => (
              <div key={idx} className="rating-card">
                <h4>{subject.name}</h4>
                <div className="rating-value">{subject.rating.toFixed(1)}</div>
                <small>/10</small>
              </div>
            ))}
          </div>

          <div className="overall-rating">
            <h4>Overall Rating</h4>
            <div className="overall-value">{result.overall_rating.toFixed(1)}/10</div>
          </div>

          <div className="report-content">
            <h4>AI Analysis Report</h4>
            <p>{result.report}</p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button className="btn btn-secondary" onClick={downloadReport}>
              <i className="fas fa-download"></i> Download PDF Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- ANALYSIS RUNNER PAGE (UPDATED) ---
const AnalysisRunnerPage = ({ setPage, dataset, analysisName }) => {
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    runAnalysis();
  }, [analysisName]);

  const runAnalysis = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`Running analysis: ${analysisName}`);
      
      const response = await fetch(`${BACKEND_URL}/api/run_analysis_function`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preview: dataset.preview,
          analysis_name: analysisName,
          role: 'student' // or pass currentRole
        }),
      });

      const data = await response.json();
      console.log('Analysis response:', data);
      
      if (data.status === 'success' || data.status === 'fallback') {
        setAnalysisData(data);
      } else {
        await runGeneralAnalysis();
      }
    } catch (error) {
      console.error('Error running analysis:', error);
      setError('Failed to run analysis: ' + error.message);
      await runGeneralAnalysis();
    } finally {
      setIsLoading(false);
    }
  };

  const runGeneralAnalysis = async () => {
    try {
      console.log('Running general analysis as fallback...');
      
      const response = await fetch(`${BACKEND_URL}/api/run_analysis_function`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preview: dataset.preview,
          analysis_name: 'general_insights_analysis',
          role: 'student'
        }),
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        setAnalysisData({
          ...data,
          analysis_name: 'general_insights_analysis',
          is_fallback: true
        });
      } else {
        setError('Both specific and general analysis failed');
      }
    } catch (error) {
      setError('All analysis attempts failed: ' + error.message);
    }
  };

  const renderMissingColumnsWarning = () => {
    if (!analysisData || !analysisData.missing_columns || analysisData.missing_columns.length === 0) {
      return null;
    }

    return (
      <div className="warning-container">
        <div className="warning-header">
          <i className="fas fa-exclamation-triangle"></i>
          Required Columns Not Found
        </div>
        <div className="warning-message">
          The following columns are needed for this analysis but weren't found in your data:
        </div>
        <div className="missing-columns-list">
          {analysisData.missing_columns.map(col => (
            <div key={col} className="missing-column-item">
              <span className="missing-column-name">{col}</span>
              {analysisData.matched_columns && analysisData.matched_columns[col] ? 
                <span className="missing-column-match">(best match: {analysisData.matched_columns[col]})</span> : 
                <span className="missing-column-match">(no close match found)</span>
              }
            </div>
          ))}
        </div>
        <div className="fallback-notice">
          <i className="fas fa-info-circle"></i>
          Showing General Analysis instead of the requested specific analysis.
        </div>
      </div>
    );
  };

  const renderVisualization = (vizData, title, height = 400) => {
    if (!vizData) {
      return (
        <div className="chart-container">
          <div className="chart-title">{title}</div>
          <div className="chart-error">
            <i className="fas fa-exclamation-triangle"></i>
            <p>No visualization data available</p>
          </div>
        </div>
      );
    }
    
    try {
      const plotlyData = typeof vizData === 'string' ? JSON.parse(vizData) : vizData;
      
      if (!plotlyData.data || !plotlyData.layout) {
        console.warn('Invalid plotly data structure:', plotlyData);
        return (
          <div className="chart-container">
            <div className="chart-title">{title}</div>
            <div className="chart-error">
              <i className="fas fa-exclamation-triangle"></i>
              <p>Invalid chart data structure</p>
            </div>
          </div>
        );
      }

      return (
        <div className="chart-container">
          <div className="chart-title">{title}</div>
          <div className="plotly-chart">
            <Plot
              data={plotlyData.data}
              layout={{
                ...plotlyData.layout,
                height: height,
                autosize: true,
                paper_bgcolor: '#1a183c',
                plot_bgcolor: '#1a183c',
                font: { color: '#ffffff' },
                margin: { t: 60, r: 40, b: 60, l: 60 }
              }}
              config={{
                displayModeBar: true,
                displaylogo: false,
                responsive: true,
                modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d']
              }}
              useResizeHandler={true}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </div>
      );
    } catch (error) {
      console.error('Error rendering visualization:', error, vizData);
      return (
        <div className="chart-container">
          <div className="chart-title">{title}</div>
          <div className="chart-error">
            <i className="fas fa-exclamation-triangle"></i>
            <p>Error rendering chart: {error.message}</p>
          </div>
        </div>
      );
    }
  };

  const formatMetrics = (metrics) => {
    if (!metrics) return [];
    
    const simpleMetrics = {};
    
    Object.entries(metrics).forEach(([key, value]) => {
      if (value !== null && 
          value !== undefined && 
          typeof value !== 'object' &&
          !Array.isArray(value)) {
        simpleMetrics[key] = value;
      }
    });
    
    return Object.entries(simpleMetrics).map(([key, value]) => ({
      label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value: typeof value === 'number' ? 
        (value % 1 === 0 ? value.toLocaleString() : value.toFixed(2)) : 
        String(value)
    }));
  };

  if (isLoading) {
    return <LoadingOverlay message={`Running ${analysisName.replace(/_/g, ' ')}...`} />;
  }

  if (error) {
    return (
      <div className="page-wrapper">
        <BackButton onClick={() => setPage('dashboard')} />
        <div className="dashboard-card" style={{ textAlign: 'center', padding: '4rem' }}>
          <i className="fas fa-exclamation-triangle" style={{ fontSize: '3rem', color: 'var(--accent-orange)' }}></i>
          <h2>Analysis Failed</h2>
          <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
          <button className="btn btn-gradient" onClick={() => setPage('dashboard')}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <BackButton onClick={() => setPage('dashboard')} />
      
      <div style={{width: '100%', marginBottom: '2rem'}}>
        <h1 style={{marginBottom: '0.5rem'}}>
          {analysisData?.is_fallback ? 'General Data Analysis' : analysisName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </h1>
        
        {renderMissingColumnsWarning()}
        
        {analysisData?.is_fallback && !analysisData?.missing_columns && (
          <div className="analysis-fallback-notice">
            <i className="fas fa-info-circle"></i>
            <span>Showing general analysis (specific analysis unavailable)</span>
          </div>
        )}
        <p style={{color: 'var(--text-secondary)', marginBottom: '0'}}>
          Complete analysis results with visualizations and insights
        </p>
      </div>

      {analysisData && (analysisData.result || analysisData.insights) && (
        <div className="analysis-runner-grid">
          {/* Key Metrics */}
          {(analysisData.result?.metrics || analysisData.result?.key_metrics || analysisData.metrics) && (
            <div className="analysis-runner-card full-width-chart">
              <h3>
                <i className="fas fa-chart-bar"></i> Key Metrics
              </h3>
              <div className="streamlit-metrics">
                {formatMetrics(analysisData.result?.metrics || analysisData.result?.key_metrics || analysisData.metrics).map((metric, index) => (
                  <div key={index} className="streamlit-metric">
                    <div className="streamlit-metric-value">{metric.value}</div>
                    <div className="streamlit-metric-label">{metric.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Insights Card */}
          <div className="analysis-runner-card">
            <h3>
              <i className="fas fa-lightbulb"></i> Insights
            </h3>
            {(analysisData.result?.insights && analysisData.result.insights.length > 0) || (analysisData.insights && analysisData.insights.length > 0) ? (
              <div className="scrollable-content">
                {(analysisData.result?.insights || analysisData.insights).map((insight, index) => (
                  <div key={index} className="insight-item">
                    <p>{insight}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="chart-error">
                <i className="fas fa-info-circle"></i>
                <p>No insights available for this analysis</p>
              </div>
            )}
          </div>

          {/* Recommendations Card */}
          {analysisData.result?.recommendations && analysisData.result.recommendations.length > 0 && (
            <div className="analysis-runner-card">
              <h3>
                <i className="fas fa-tasks"></i> Recommendations
              </h3>
              <div className="scrollable-content">
                {analysisData.result.recommendations.map((rec, index) => (
                  <div key={index} className="recommendation-item">
                    <i className="fas fa-check-circle"></i>
                    <p className="recommendation-text">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analysis Details */}
          <div className="analysis-runner-card">
            <h3>
              <i className="fas fa-info-circle"></i> Analysis Details
            </h3>
            <div style={{ color: 'var(--text-secondary)' }}>
              <div className="detail-row">
                <span><strong>Analysis Type:</strong></span>
                <span style={{color: 'var(--text-primary)'}}>
                  {analysisData.analysis_type || analysisData.analysis_name || analysisName}
                </span>
              </div>
              <div className="detail-row">
                <span><strong>Dataset:</strong></span>
                <span style={{color: 'var(--text-primary)'}}>
                  {dataset.filename}
                </span>
              </div>
              <div className="detail-row">
                <span><strong>Rows:</strong></span>
                <span style={{color: 'var(--text-primary)'}}>
                  {dataset.rows.toLocaleString()}
                </span>
              </div>
              <div className="detail-row">
                <span><strong>Columns:</strong></span>
                <span style={{color: 'var(--text-primary)'}}>
                  {dataset.columns}
                </span>
              </div>
              {(analysisData.is_fallback || analysisData.status === 'fallback') && (
                <div className="fallback-notice">
                  <p><strong>Note:</strong> {analysisData.message || 'Using general analysis fallback'}</p>
                </div>
              )}
            </div>
          </div>

          {/* Visualizations */}
          {(analysisData.result?.visualizations && Object.keys(analysisData.result.visualizations).length > 0) || (analysisData.visualizations && Object.keys(analysisData.visualizations).length > 0) ? (
            <div className="analysis-runner-card full-width-chart">
              <h3>
                <i className="fas fa-chart-line"></i> Visualizations
              </h3>
              <div className="chart-grid">
                {Object.entries(analysisData.result?.visualizations || analysisData.visualizations).map(([key, vizData]) => (
                  <div key={key}>
                    {renderVisualization(vizData, key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()))}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="analysis-runner-card full-width-chart">
              <h3>
                <i className="fas fa-chart-line"></i> Visualizations
              </h3>
              <div className="chart-error">
                <i className="fas fa-chart-bar" style={{fontSize: '2rem'}}></i>
                <p>No visualizations available for this analysis</p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="analysis-runner-actions">
        <button 
          className="btn btn-outline"
          onClick={() => setPage('dashboard')}
        >
          <i className="fas fa-arrow-left"></i> Back to Dashboard
        </button>
        <button 
          className="btn btn-gradient"
          onClick={runAnalysis}
        >
          <i className="fas fa-redo"></i> Run Again
        </button>
      </div>
    </div>
  );
};

// --- HOME PAGE ---
const HomePage = ({ setPage }) => {
  return (
    <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
        <span style={{ color: 'var(--text-primary)' }}>AutoDash </span>
        <span className="gradient-text">RIT</span>
      </h1>
      <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Intelligent Data Analysis Platform for Educational Institutions
      </p>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>
        Upload your dataset and get AI-powered insights tailored to your role
      </p>
      <button onClick={() => setPage('role')} className="btn btn-gradient" style={{ fontSize: '1.2rem', padding: '1rem 3rem' }}>
        Start Analysis <i className="fas fa-arrow-right"></i>
      </button>
    </div>
  );
};

// --- BOT FAB ---
const BotFab = ({ setPage, currentPage, dataset }) => {
  const handleClick = () => {
    const hasDataset = dataset && dataset.preview && dataset.preview.length > 0;
    
    if (hasDataset) {
      setPage('dashboard/chat');
    } else if (currentPage === 'upload' || currentPage === 'home') {
      if (window.confirm('Please upload a dataset first to use the AI Assistant. Go to upload page?')) {
        setPage('upload');
      }
    } else {
      setPage('dashboard/chat');
    }
  };
  
  return (
    <div className="bot-fab" onClick={handleClick} title="AI Data Assistant">
      <i className="fas fa-robot"></i>
      <div className="pulse-dot"></div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
function App() {
  const [page, setPage] = useState('home');
  const [currentRole, setCurrentRole] = useState(null);
  const [dataset, setDataset] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = AppStyles;
    document.head.appendChild(styleElement);
    return () => {
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

  const renderPage = () => {
    // Handle analysis runner pages
    const analysisMatch = page.match(/^analysisRunner\/(.*)$/);
    if (analysisMatch && dataset) {
      return (
        <AnalysisRunnerPage
          setPage={setPage}
          dataset={dataset}
          analysisName={analysisMatch[1]}
        />
      );
    }

    // Handle data explorer pages
    const explorerMatch = page.match(/^dataExplorer\/(.*)$/);
    if (explorerMatch && dataset) {
      return (
        <DataExplorerPage
          setPage={setPage}
          dataset={dataset}
          initialTab={explorerMatch[1]}
        />
      );
    }

    switch (page) {
      case 'home':
        return <HomePage setPage={setPage} />;
      case 'role':
        return <RoleSelectionPage setPage={setPage} setCurrentRole={setCurrentRole} />;
      case 'upload':
        return (
          <UploadPage
            setPage={setPage}
            currentRole={currentRole}
            setDataset={setDataset}
            setFile={setFile}
          />
        );
      case 'datasetLoaded':
        return (
          <DatasetLoadedPage
            setPage={setPage}
            dataset={dataset}
          />
        );
      case 'dashboard':
        return (
          <DashboardPage
            setPage={setPage}
            dataset={dataset}
            currentRole={currentRole}
          />
        );
      default:
        return <HomePage setPage={setPage} />;
    }
  };

  return (
    <div className="app-container">
      <Header setPage={setPage} currentRole={currentRole} setCurrentRole={setCurrentRole} />
      <main className="main-content">
        {renderPage()}
      </main>
      <BotFab setPage={setPage} currentPage={page} dataset={dataset} />
    </div>
  );
}

export default App;