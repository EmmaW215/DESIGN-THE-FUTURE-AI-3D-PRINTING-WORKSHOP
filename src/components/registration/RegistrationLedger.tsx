
import React from 'react';
import { format } from 'date-fns';
import { FileSpreadsheet, ExternalLink } from 'lucide-react';

interface LedgerProps {
  data: any[];
}

export const RegistrationLedger: React.FC<LedgerProps> = ({ data }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
      <div className="bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-500/10 p-2 rounded-lg"><FileSpreadsheet className="w-5 h-5 text-emerald-500" /></div>
          <div>
            <h4 className="text-sm font-bold text-white leading-tight">Master_Enrollment_2026</h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Live Connection Active</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <a href="https://docs.google.com/spreadsheets/d/15jlxfy2c0PrsOTgtJ0uY9CQR96_5CAB2X2E9Ey2drDU" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-bold text-white transition-colors">
            <ExternalLink className="w-3.5 h-3.5" /> Open Google Sheet
          </a>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/50">
              <th className="px-6 py-3 border-b border-slate-800 text-[9px] font-black text-slate-500 uppercase tracking-widest">Timestamp</th>
              <th className="px-6 py-3 border-b border-slate-800 text-[9px] font-black text-slate-500 uppercase tracking-widest">Student</th>
              <th className="px-6 py-3 border-b border-slate-800 text-[9px] font-black text-slate-500 uppercase tracking-widest">Email</th>
              <th className="px-6 py-3 border-b border-slate-800 text-[9px] font-black text-slate-500 uppercase tracking-widest">Phone</th>
              <th className="px-6 py-3 border-b border-slate-800 text-[9px] font-black text-slate-500 uppercase tracking-widest">Course</th>
              <th className="px-6 py-3 border-b border-slate-800 text-[9px] font-black text-slate-500 uppercase tracking-widest">Start Date</th>
              <th className="px-6 py-3 border-b border-slate-800 text-[9px] font-black text-slate-500 uppercase tracking-widest">Session Time</th>
              <th className="px-6 py-3 border-b border-slate-800 text-[9px] font-black text-slate-500 uppercase tracking-widest">Is Series</th>
              <th className="px-6 py-3 border-b border-slate-800 text-[9px] font-black text-slate-500 uppercase tracking-widest">Payment</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan={9} className="px-6 py-12 text-center text-slate-600 italic font-medium">Waiting for cloud sync...</td></tr>
            ) : (
              data.map((entry, i) => (
                <tr key={i} className="hover:bg-slate-800/30 transition-colors border-b border-slate-800/50">
                  <td className="px-6 py-4 text-[10px] text-slate-500 font-mono">{format(new Date(entry.timestamp), 'MM/dd HH:mm')}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-200">{entry.studentName}</td>
                  <td className="px-6 py-4 text-[11px] text-slate-400 font-mono">{entry.parentEmail}</td>
                  <td className="px-6 py-4 text-[11px] text-slate-400 font-mono">{entry.parentPhone}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter ${
                      entry.course.includes('Level 1') ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                      entry.course.includes('Level 2') ? 'bg-sky-500/10 text-sky-500 border border-sky-500/20' :
                      'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                    }`}>
                      {entry.course}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{entry.sessionDate}</td>
                  <td className="px-6 py-4 text-[10px] font-bold text-slate-400">{entry.sessionTime || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter ${
                      entry.isSeries 
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {entry.isSeries ? 'Yes (3-Week Series)' : 'No (Workshop)'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter ${
                      entry.paymentProcessed === 'Yes'
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                        : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                    }`}>
                      {entry.paymentProcessed || 'No'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
