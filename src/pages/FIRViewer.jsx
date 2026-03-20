import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Download, Printer, FileText } from 'lucide-react';

const detailedFIRs = [
  { 
    id: 'FIR-2026-104', 
    type: 'Theft', 
    date: '2026-03-20', 
    time: '14:30',
    status: 'Pending', 
    statusColor: 'var(--color-status-yellow, #eab308)',
    complainantName: 'Vinay Kumar',
    complainantContact: '+91 9876543210',
    location: 'Sector 14, Main Market, City',
    suspectDetails: 'Unknown male, approx 5\'10", wearing a red jacket.',
    officerInCharge: 'Inspector A. Sharma',
    station: 'Central Police Station',
    description: 'On the evening of the specified date, my mobile phone was stolen from my pocket while I was shopping in Sector 14 market. The device is a black smartphone. Suspect details are unknown, though a person in a red jacket bumped into me shortly before I noticed the phone missing.'
  },
  { 
    id: 'FIR-2026-092', 
    type: 'Assault', 
    date: '2026-03-18', 
    time: '21:15',
    status: 'Under Review', 
    statusColor: 'var(--color-primary, #3b82f6)', 
    complainantName: 'Anita Desai',
    complainantContact: '+91 9123456789',
    location: 'Sector 4 Metro Station',
    suspectDetails: 'Two individuals, verbal altercation turned physical.',
    officerInCharge: 'Sub-Inspector R. Verma',
    station: 'Sector 4 Outpost',
    description: 'Unprovoked physical assault by two unidentified individuals outside the metro station. Sustained minor bruises.'
  },
  { 
    id: 'FIR-2026-077', 
    type: 'Fraud', 
    date: '2026-03-15', 
    time: '09:00',
    status: 'Closed', 
    statusColor: 'var(--color-status-green, #22c55e)', 
    complainantName: 'Rahul Singh',
    complainantContact: '+91 9988776655',
    location: 'Online Transaction',
    suspectDetails: 'Phone number +91 8888888888, fake bank representative.',
    officerInCharge: 'Cyber Cell Team Beta',
    station: 'Cyber Crime Branch',
    description: 'Received a call from someone claiming to be from my bank. Deceived into sharing OTP, resulted in unauthorized deduction of ₹50,000.'
  },
];

export default function FIRViewer() {
  const { t } = useTranslation();
  const [selectedId, setSelectedId] = useState(detailedFIRs[0].id);
  const firRef = useRef(null);

  const selectedFIR = detailedFIRs.find(f => f.id === selectedId);

  const handleDownloadPDF = async () => {
    if (!firRef.current) return;
    try {
      const canvas = await html2canvas(firRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${selectedFIR.id}_Official_Record.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', gap: '24px', height: '100%' }}>
      
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .printable-fir, .printable-fir * {
              visibility: visible;
            }
            .printable-fir {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              margin: 0;
              padding: 20mm;
              box-shadow: none;
              border: none;
            }
            .no-print {
              display: none !important;
            }
          }
        `}
      </style>

      {/* Sidebar List */}
      <div className="no-print" style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h2 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FileText size={24} color="var(--color-primary)" />
          {t('sidebar_fir')}
        </h2>
        {detailedFIRs.map(fir => (
          <div 
            key={fir.id}
            onClick={() => setSelectedId(fir.id)}
            style={{
              padding: '16px', 
              borderRadius: '8px', 
              cursor: 'pointer',
              backgroundColor: selectedId === fir.id ? '#F0FDF4' : 'var(--color-bg-card)',
              border: selectedId === fir.id ? '2px solid #22c55e' : '1px solid #E5E7EB',
              transition: 'all 0.2s',
              boxShadow: selectedId === fir.id ? '0 4px 6px rgba(34,197,94,0.1)' : '0 1px 2px rgba(0,0,0,0.05)'
            }}
          >
            <div style={{ fontWeight: '600', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <span>{fir.id}</span>
              <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', backgroundColor: fir.statusColor, color: 'white', fontWeight: 'bold' }}>
                {fir.status}
              </span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#6B7280', display: 'flex', justifyContent: 'space-between' }}>
              <span>{fir.type}</span>
              <span>{fir.date}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main FIR Document Detail view */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Action Bar */}
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '16px', backgroundColor: 'var(--color-bg-card)', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
          <h3 style={{ margin: 0 }}>Document Viewer</h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', transition: 'background 0.2s' }}>
              <Printer size={18} /> Print FIR
            </button>
            <button onClick={handleDownloadPDF} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', transition: 'opacity 0.2s' }}>
              <Download size={18} /> Download PDF
            </button>
          </div>
        </div>

        {/* The Printable Document Area */}
        {selectedFIR && (
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', justifyContent: 'center', paddingBottom: '40px' }}>
            <div 
              ref={firRef} 
              className="printable-fir card" 
              style={{ 
                width: '210mm',
                minHeight: '297mm',
                backgroundColor: 'white', 
                padding: '25mm 20mm',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                border: '1px solid #E5E7EB',
                fontFamily: '"Times New Roman", Times, serif',
                color: 'black'
              }}
            >
              {/* Header */}
              <div style={{ textAlign: 'center', borderBottom: '2px solid black', paddingBottom: '20px', marginBottom: '30px' }}>
                <h1 style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '24px' }}>First Information Report (FIR)</h1>
                <p style={{ margin: '8px 0 0 0', fontStyle: 'italic', fontSize: '14px' }}>Under Section 154 Cr.P.C.</p>
              </div>

              {/* Meta Information Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', fontWeight: 'bold', fontSize: '15px' }}>
                <p style={{ margin: 0 }}>FIR No: <span style={{ textDecoration: 'underline' }}>{selectedFIR.id}</span></p>
                <p style={{ margin: 0 }}>Date & Time: <span style={{ textDecoration: 'underline' }}>{selectedFIR.date} {selectedFIR.time}</span></p>
              </div>

              {/* Content Body */}
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px', fontSize: '16px' }}>1. Incident Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '10px', marginTop: '10px', fontSize: '15px' }}>
                  <strong>Type of Offence:</strong> <span>{selectedFIR.type}</span>
                  <strong>Place of Occurrence:</strong> <span>{selectedFIR.location}</span>
                  <strong>Police Station:</strong> <span>{selectedFIR.station}</span>
                  <strong>Current Status:</strong> <span style={{ color: selectedFIR.statusColor, fontWeight: 'bold' }}>{selectedFIR.status}</span>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px', fontSize: '16px' }}>2. Complainant Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '10px', marginTop: '10px', fontSize: '15px' }}>
                  <strong>Name:</strong> <span>{selectedFIR.complainantName}</span>
                  <strong>Contact Info:</strong> <span>{selectedFIR.complainantContact}</span>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px', fontSize: '16px' }}>3. Suspect Details</h3>
                <p style={{ marginTop: '10px', fontSize: '15px' }}>{selectedFIR.suspectDetails}</p>
              </div>

              <div style={{ marginBottom: '40px' }}>
                <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px', fontSize: '16px' }}>4. Details of Proceeding (Narrative)</h3>
                <p style={{ marginTop: '10px', textAlign: 'justify', fontSize: '15px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                  {selectedFIR.description}
                </p>
              </div>

              {/* Signatures */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '80px', paddingTop: '20px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '200px', borderBottom: '1px solid black', marginBottom: '5px' }}></div>
                  <p style={{ margin: 0, fontSize: '14px' }}>Signature of Complainant</p>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '200px', borderBottom: '1px solid black', marginBottom: '5px' }}></div>
                  <p style={{ margin: 0, fontSize: '14px' }}>Signature of Officer-in-Charge</p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#555' }}>Name: {selectedFIR.officerInCharge}</p>
                </div>
              </div>

              {/* Footer */}
              <div style={{ marginTop: '60px', textAlign: 'center', fontSize: '12px', color: '#888', borderTop: '1px solid #EEE', paddingTop: '10px' }}>
                <p style={{ margin: '0 0 4px 0' }}>This is a computer-generated official FIR document from the system.</p>
                <p style={{ margin: 0 }}>Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
