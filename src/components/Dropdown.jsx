import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Globe, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function Dropdown({ value, options, onChange, variant = 'default', style }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  const getStatusIcon = (statusValue) => {
    switch (statusValue) {
      case 'resolved': return <CheckCircle2 size={16} color="#03543F" />;
      case 'in_progress': return <Clock size={16} color="#1E429F" />;
      case 'pending': return <AlertCircle size={16} color="#92400E" />;
      default: return null;
    }
  };

  const getStatusColorStyle = (statusValue) => {
    switch(statusValue) {
      case 'resolved': return { bg: '#DEF7EC', text: '#03543F', border: '#84E1BC' };
      case 'in_progress': return { bg: '#E1EFFE', text: '#1E429F', border: '#A4CAFE' };
      case 'pending': return { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A' };
      default: return { bg: 'var(--color-bg-card)', text: 'var(--color-text-dark)', border: '#E5E7EB' };
    }
  };

  const isStatus = variant === 'status';
  const customStyle = isStatus ? getStatusColorStyle(value) : null;

  return (
    <div className="custom-dropdown-container" ref={dropdownRef} style={{ position: 'relative', display: 'inline-block', ...style }}>
      <button 
        className="dropdown-trigger"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: isStatus ? '6px 14px' : '8px 12px',
          borderRadius: isStatus ? '20px' : '8px',
          backgroundColor: isStatus ? customStyle.bg : 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(8px)',
          border: `1px solid ${isStatus ? customStyle.border : 'rgba(229, 231, 235, 0.8)'}`,
          color: isStatus ? customStyle.text : 'var(--color-text-dark)',
          fontWeight: 600,
          fontSize: '0.9rem',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
        }}
      >
        {isStatus && getStatusIcon(value)}
        {variant === 'language' && <Globe size={16} opacity={0.7} />}
        <span>{selectedOption?.label}</span>
        <ChevronDown size={16} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease', opacity: 0.6 }} />
      </button>

      {isOpen && (
        <div 
          className="dropdown-menu"
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '8px',
            minWidth: '160px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
            border: '1px solid rgba(229, 231, 235, 0.5)',
            padding: '6px',
            zIndex: 50,
            animation: 'dropdownFade 0.2s ease forwards'
          }}
        >
          {options.map((opt) => (
            <div
              key={opt.value}
              className="dropdown-item"
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: value === opt.value ? 'rgba(37, 99, 235, 0.05)' : 'transparent',
                color: value === opt.value ? 'var(--color-primary)' : 'var(--color-text-dark)',
                fontWeight: value === opt.value ? 600 : 500,
                fontSize: '0.9rem',
                transition: 'background-color 0.15s ease'
              }}
              onMouseEnter={(e) => {
                if (value !== opt.value) e.currentTarget.style.backgroundColor = 'rgba(243, 244, 246, 0.8)';
              }}
              onMouseLeave={(e) => {
                if (value !== opt.value) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {isStatus && getStatusIcon(opt.value)}
              {opt.label}
              {value === opt.value && <ChevronDown size={14} style={{ marginLeft: 'auto', transform: 'rotate(-90deg)', opacity: 0.5 }} />}
            </div>
          ))}
        </div>
      )}
      <style>{`
        @keyframes dropdownFade {
          from { opacity: 0; transform: translateY(-8px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .dropdown-trigger:hover {
          filter: brightness(0.97);
        }
      `}</style>
    </div>
  );
}
