import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Upload, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

function LocationMarker({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position && position[0] && position[1]) {
      map.flyTo(position, map.getZoom());
    }
  }, [position, map]);

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

export default function Form() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  
  const prefilled = location.state?.extractedDetails || {};
  const confidence = location.state?.confidence || null;

  const [type, setType] = useState(prefilled.type || '');
  const [date, setDate] = useState(prefilled.date || '');
  const [description, setDescription] = useState(prefilled.description || '');
  const [suspect, setSuspect] = useState(prefilled.suspect || '');
  const [address, setAddress] = useState(prefilled.location || '');
  const [position, setPosition] = useState([20.5937, 78.9629]); // Default India center
  const [files, setFiles] = useState([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAutoGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    
    setAddress('Locating nearest coordinates...');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);

        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          setAddress(data.display_name || `Lat: ${latitude}, Lng: ${longitude}`);
        } catch (error) {
          console.error('Error fetching string address:', error);
          setAddress(`Lat: ${latitude}, Lng: ${longitude}`);
        }
      },
      (err) => {
        console.error('GPS error:', err);
        setAddress(prefilled.location || '');
        alert('Failed to retrieve location hardware permissions.');
      }
    );
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
        handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (newFiles) => {
    const filePrevs = newFiles.map(file => ({
      file,
      url: URL.createObjectURL(file), 
      name: file.name
    }));
    setFiles(prev => [...prev, ...filePrevs]);
  };

  const removeFile = (index) => {
    setFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].url);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!type || !date || !address || !description) {
      alert("Please ensure all required fields (marked in yellow) are filled out.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Convert single object position to the expected object
      const locationObj = { lat: position[0], lng: position[1] };
      
      const payload = {
        type,
        date,
        address,
        location: locationObj,
        description,
        suspect,
        evidence: files.map(f => f.name) // Currently just passing names as placeholders for file uploads
      };

      const token = localStorage.getItem('token');
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/complaints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      navigate('/history');
    } catch (err) {
      console.error('Submission failed', err);
      alert('Failed to submit complaint. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ paddingBottom: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
        {t('sidebar_form')}
        {confidence && (
          <span className="status-badge green">AI Auto-filled ({confidence}% Confidence)</span>
        )}
      </h2>
      
      <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontWeight: 600 }}>{t('form_incident_type')}</label>
            <input 
              type="text" 
              value={type} 
              onChange={(e) => setType(e.target.value)}
              style={{ padding: '10px', borderRadius: '6px', border: type ? '1px solid #E5E7EB' : '2px solid #FACC15', backgroundColor: type ? 'white' : '#FEF9C3' }} 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontWeight: 600 }}>{t('form_date')}</label>
            <input 
              type="text" 
              value={date} 
              onChange={(e) => setDate(e.target.value)}
              style={{ padding: '10px', borderRadius: '6px', border: date ? '1px solid #E5E7EB' : '2px solid #FACC15', backgroundColor: date ? 'white' : '#FEF9C3' }} 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: '1 / -1' }}>
            <label style={{ fontWeight: 600 }}>{t('form_location')}</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="text" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={{ flex: 1, padding: '10px', borderRadius: '6px', border: address ? '1px solid #E5E7EB' : '2px solid #FACC15', backgroundColor: address ? 'white' : '#FEF9C3' }} 
              />
              <button type="button" onClick={handleAutoGPS} style={{ padding: '10px', backgroundColor: '#F3F4F6', color: 'var(--color-text-dark)', border: 'none', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s' }}>
                <MapPin size={20} />
              </button>
            </div>
            
            {/* Interactive Leaflet Map */}
            <div style={{ height: '300px', borderRadius: '8px', overflow: 'hidden', marginTop: '10px', border: '1px solid #E5E7EB', zIndex: 0 }}>
              <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%', zIndex: 1 }}>
                <TileLayer
                  attribution='&copy; OSM'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker position={position} />
              </MapContainer>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: '1 / -1' }}>
            <label style={{ fontWeight: 600 }}>{t('form_description')}</label>
            <textarea 
              rows="4" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ padding: '10px', borderRadius: '6px', border: description ? '1px solid #E5E7EB' : '2px solid #FACC15', backgroundColor: description ? 'white' : '#FEF9C3' }} 
            ></textarea>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: '1 / -1' }}>
            <label style={{ fontWeight: 600 }}>{t('form_suspect')}</label>
            <textarea 
              rows="2" 
              value={suspect}
              onChange={(e) => setSuspect(e.target.value)}
              style={{ padding: '10px', borderRadius: '6px', border: suspect ? '1px solid #E5E7EB' : '2px solid #FACC15', backgroundColor: suspect ? 'white' : '#FEF9C3' }} 
            ></textarea>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: '1 / -1' }}>
            <label style={{ fontWeight: 600 }}>{t('form_evidence')}</label>
            
            <div 
              onDrop={handleFileDrop}
              onDragOver={(e) => e.preventDefault()}
              style={{ border: '2px dashed #E5E7EB', padding: '30px', borderRadius: '8px', textAlign: 'center', backgroundColor: '#F9FAFB' }}
            >
              <Upload size={24} color="var(--color-text-light)" style={{ margin: '0 auto 10px auto' }} />
              <p style={{ color: 'var(--color-text-light)', marginBottom: '10px' }}>Drag & drop files or click to upload</p>
              
              <label style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>
                Browse Files
                <input type="file" multiple style={{ display: 'none' }} onChange={handleFileSelect} />
              </label>
            </div>

            {/* File Previews */}
            {files.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                {files.map((fileInfo, index) => (
                   <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', backgroundColor: '#F3F4F6', borderRadius: '6px' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                       {fileInfo.file.type.startsWith('image/') ? (
                         <img src={fileInfo.url} alt="Preview" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                       ) : (
                         <div style={{ width: '40px', height: '40px', backgroundColor: '#E5E7EB', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📄</div>
                       )}
                       <span style={{ fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '400px' }}>{fileInfo.name}</span>
                     </div>
                     <button type="button" onClick={() => removeFile(index)} style={{ padding: '6px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-status-red)' }}>
                       <X size={18} />
                     </button>
                   </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '8px', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" disabled={isSubmitting} style={{ padding: '12px 24px', backgroundColor: isSubmitting ? '#9CA3AF' : 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: isSubmitting ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}>
              {isSubmitting ? 'Submitting...' : t('button_submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
