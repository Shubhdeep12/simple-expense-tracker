'use client';

import ExpenseForm from '@/components/ExpenseForm';
import { useState, useEffect } from 'react';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="app-logo">
          <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <rect width="512" height="512" rx="80" fill="#22223b" />
            <circle cx="120" cy="140" r="50" fill="#4a4e69" opacity="0.7" />
            <circle cx="400" cy="380" r="70" fill="#9a8c98" opacity="0.6" />
            <circle cx="256" cy="220" r="120" fill="#f2e9e4" />
            <g transform="translate(256, 220) scale(2.2)">
              <path d="M-30 -20 H30 M-30 0 H30" stroke="#22223b" strokeWidth="6" strokeLinecap="round" />
              <path d="M0 -30 L0 30 M-15 -30 L15 30" stroke="#22223b" strokeWidth="6" strokeLinecap="round" />
            </g>
            <g transform="translate(256, 380)">
              <rect x="-80" y="-50" width="160" height="20" rx="6" fill="#c9ada7" />
              <rect x="-80" y="-20" width="160" height="20" rx="6" fill="#c9ada7" />
              <rect x="-80" y="10" width="160" height="20" rx="6" fill="#c9ada7" />
            </g>
            <circle cx="350" cy="150" r="20" fill="#c9ada7" />
          </svg>
        </div>
        <h1 className="app-title">Expense Tracker</h1>
        <p className="app-subtitle">Track your expenses easily</p>
      </header>
      
      <main>
        <div className="card">
          <ExpenseForm />
        </div>
      </main>
      
      <footer className="footer">
        {mounted && (
          <p>
            {new Date().toLocaleDateString('en-IN', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        )}
      </footer>
    </div>
  );
}
