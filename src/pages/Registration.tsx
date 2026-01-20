
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from '../components/registration/Calendar';
import { PaymentSection } from '../components/registration/PaymentSection';
import { RegistrationPivotTable } from '../components/registration/RegistrationPivotTable';
import { ChevronLeft, Cloud, CloudCheck } from 'lucide-react';

export default function Registration() {
  const [globalRegistrations, setGlobalRegistrations] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load initial data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dtf_registrations');
    if (saved) {
      setGlobalRegistrations(JSON.parse(saved));
    }
  }, []);

  // Google Sheets API URL from environment variable
  const GOOGLE_SHEETS_API_URL = import.meta.env.VITE_GOOGLE_SHEETS_API_URL || '';

  const handleNewRegistration = async (data: any) => {
    setIsSyncing(true);
    
    try {
      // 1. Save to localStorage first (as backup)
      const updated = [data, ...globalRegistrations];
      setGlobalRegistrations(updated);
      localStorage.setItem('dtf_registrations', JSON.stringify(updated));
      
      // 2. Sync to Google Sheets if API URL is configured
      if (GOOGLE_SHEETS_API_URL) {
        try {
          const response = await fetch(GOOGLE_SHEETS_API_URL, {
            method: 'POST',
            mode: 'no-cors', // Required for Google Apps Script Web App
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });
          
          // Note: With no-cors mode, we can't read the response
          // but the data should still be sent successfully
          console.log('✅ Registration data sent to Google Sheets');
        } catch (error) {
          console.error('❌ Failed to sync to Google Sheets:', error);
          // Data is still saved in localStorage, so no data loss
        }
      } else {
        console.warn('⚠️ Google Sheets API URL not configured. Data saved to localStorage only.');
      }
      
      setIsSyncing(false);
    } catch (error) {
      console.error('❌ Error processing registration:', error);
      setIsSyncing(false);
      // Even if sync fails, data is saved to localStorage
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-indigo-500/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <Link 
          to="/"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Link>
        <div className="flex flex-col items-center">
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            DESIGN THE FUTURE
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            {isSyncing ? (
              <Cloud className="w-3 h-3 text-amber-400 animate-pulse" />
            ) : (
              <CloudCheck className="w-3 h-3 text-emerald-400" />
            )}
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
              {isSyncing ? 'Syncing to Google Drive...' : 'Google Drive Connected'}
            </span>
          </div>
        </div>
        <div className="w-24"></div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent uppercase tracking-tighter">
            Course Registration
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Select sessions from the calendar. Registration data is synced in real-time to the official 
            <span className="text-indigo-400 font-medium"> Design The Future </span> Cloud Database.
          </p>
        </div>

        {/* Calendar Section */}
        <section className="mb-20">
          <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="w-2 h-8 bg-indigo-500 rounded-full"></span>
              Interactive Schedule
            </h2>
            <div className="flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 rounded-full border border-slate-800"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Level 1</div>
              <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 rounded-full border border-slate-800"><div className="w-2 h-2 rounded-full bg-sky-500"></div> Level 2</div>
              <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 rounded-full border border-slate-800"><div className="w-2 h-2 rounded-full bg-rose-500"></div> Level 3</div>
            </div>
          </div>
          <Calendar onRegistrationComplete={handleNewRegistration} />
        </section>

        {/* Registration Summary - Pivot Table */}
        <section className="mb-20">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <span className="w-2 h-8 bg-indigo-500 rounded-full"></span>
                Registration Summary
              </h2>
              <p className="text-sm text-slate-500 mt-1">Pivot table showing registration counts by Course, Date, Time, and Is Series</p>
            </div>
            <a 
              href="https://docs.google.com/spreadsheets/d/15jlxfy2c0PrsOTgtJ0uY9CQR96_5CAB2X2E9Ey2drDU" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-bold text-white transition-colors"
            >
              Open Google Sheet
            </a>
          </div>
          <RegistrationPivotTable data={globalRegistrations} />
        </section>

        {/* Payment Section */}
        <section id="payment" className="scroll-mt-24 pb-20">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-black mb-2 uppercase italic tracking-tighter">Secure Your Spot</h2>
            <p className="text-slate-500 font-medium">Select a package to complete your enrollment</p>
          </div>
          <PaymentSection />
        </section>

        <footer className="mt-20 pt-8 border-t border-slate-800 text-center text-slate-600 text-[10px] font-bold uppercase tracking-[0.2em] pb-12">
          <p>© 2026 DESIGN THE FUTURE AI & 3D PRINTING • TORONTO, CANADA</p>
        </footer>
      </main>
    </div>
  );
}
