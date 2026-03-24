import React, { useState, useEffect } from 'react';

const Loader = ({ message = 'Loading...' }) => {
  const [showLongWaitMessage, setShowLongWaitMessage] = useState(false);

  useEffect(() => {
    // If it takes more than 4 seconds, it's likely waking up the backend on Render
    const timer = setTimeout(() => {
      setShowLongWaitMessage(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg-main)' }}>
      <div className="custom-loader-spinner"></div>
      
      <p style={{ 
        marginTop: '1.5rem', 
        color: 'var(--color-text-dark)', 
        fontSize: '1.2rem', 
        fontWeight: 600,
        fontFamily: 'var(--font-family)'
      }}>
        {message}
      </p>
      
      <div style={{ 
        marginTop: '0.75rem', 
        height: '40px', // Reserve space to prevent layout jump
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center'
      }}>
        {showLongWaitMessage && (
          <p style={{ 
             color: 'var(--color-text-light)', 
             fontSize: '0.9rem', 
             maxWidth: '400px', 
             textAlign: 'center', 
             lineHeight: 1.5,
             margin: 0,
             animation: 'fadeIn 0.5s ease-in'
          }}>
            Waking up the server.<br/>This might take up to a minute, please bear with us...
          </p>
        )}
      </div>

      <style>
        {`
          .custom-loader-spinner {
            width: 64px;
            height: 64px;
            border: 4px solid var(--color-bg-card-solid);
            border-top-color: var(--color-primary);
            border-radius: 50%;
            animation: custom-loader-spin 1s linear infinite;
            filter: drop-shadow(0 4px 6px rgba(249, 96, 8, 0.2));
          }

          @keyframes custom-loader-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default Loader;
