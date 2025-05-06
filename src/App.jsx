import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <router>
      <div className="app-wrapper d-flex">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <main className={`main-content ${collapsed ? 'collapsed' : ''}`}>
        </main>
      </div>
    </router>
  );
}

export default App;
