
import React, { useState } from 'react';
import { 
  format, 
  endOfMonth, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isBefore,
  startOfDay,
  addMonths, 
  getDay,
  getDate
} from 'date-fns';
import startOfMonth from 'date-fns/startOfMonth';
import startOfWeek from 'date-fns/startOfWeek';
import subMonths from 'date-fns/subMonths';

import { ChevronLeft, ChevronRight, X, User, Mail, Phone, Link as LinkIcon, Users } from 'lucide-react';
import { CourseSession } from '../../types/registration';
import { COLORS } from '../../constants/registration';

interface CalendarProps {
  onRegistrationComplete: (data: any) => void;
}

export const Calendar: React.FC<CalendarProps> = ({ onRegistrationComplete }) => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1)); // Feb 2026
  const [selectedSession, setSelectedSession] = useState<CourseSession & { weekIndex: number } | null>(null);
  const [formData, setFormData] = useState({ studentName: '', parentEmail: '', parentPhone: '' });
  
  // State stores arrays of students per key: Record<seriesKey | sessionID, Array<{studentName...}>>
  const [localRegistrations, setLocalRegistrations] = useState<Record<string, any[]>>({});

  const today = startOfDay(new Date());
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const MAX_CAPACITY = 4;

  const getSessionsForDay = (date: Date): (CourseSession & { weekIndex: number })[] => {
    if (!isSameMonth(date, monthStart)) return [];
    const dayOfWeek = getDay(date);
    const dayOfMonth = getDate(date);
    const weekIndex = Math.floor((dayOfMonth - 1) / 7); 
    const isWorkshopWeek = weekIndex >= 3; 
    
    const sessions: (CourseSession & { weekIndex: number })[] = [];
    const dateStr = format(date, 'yyyy-MM-dd');
    const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
    const isSaturday = dayOfWeek === 6;

    if (!isWorkshopWeek) {
      if (isWeekday) {
        sessions.push({ id: `${dateStr}-l1`, level: 'Level 1', date, startTime: '4:00 PM', endTime: '5:30 PM', color: COLORS.LEVEL_1, weekIndex });
        sessions.push({ id: `${dateStr}-l2`, level: 'Level 2', date, startTime: '6:00 PM', endTime: '7:30 PM', color: COLORS.LEVEL_2, weekIndex });
        sessions.push({ id: `${dateStr}-l3`, level: 'Level 3', date, startTime: '8:00 PM', endTime: '9:30 PM', color: COLORS.LEVEL_3, weekIndex });
      } else if (isSaturday) {
        sessions.push({ id: `${dateStr}-l1-sat`, level: 'Level 1', date, startTime: '1:00 PM', endTime: '2:30 PM', color: COLORS.LEVEL_1, weekIndex });
        sessions.push({ id: `${dateStr}-l2-sat`, level: 'Level 2', date, startTime: '3:00 PM', endTime: '4:30 PM', color: COLORS.LEVEL_2, weekIndex });
        sessions.push({ id: `${dateStr}-l3-sat`, level: 'Level 3', date, startTime: '5:00 PM', endTime: '6:30 PM', color: COLORS.LEVEL_3, weekIndex });
      }
    } else if (weekIndex === 3) {
      if (isWeekday) sessions.push({ id: `${dateStr}-l3-adv`, level: 'Level 3 Advanced Workshop', date, startTime: '8:00 PM', endTime: '9:30 PM', color: COLORS.WORKSHOP, isWorkshop: true, weekIndex });
      else if (isSaturday) sessions.push({ id: `${dateStr}-l3-adv-sat`, level: 'Level 3 Advanced Workshop', date, startTime: '5:00 PM', endTime: '6:30 PM', color: COLORS.WORKSHOP, isWorkshop: true, weekIndex });
    }
    return sessions;
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSession) return;
    
    const seriesKey = `${format(selectedSession.date, 'yyyy-MM')}-${selectedSession.level}-${format(selectedSession.date, 'EEEE')}`;
    const key = selectedSession.isWorkshop ? selectedSession.id : seriesKey;

    const currentRegistrations = localRegistrations[key] || [];
    if (currentRegistrations.length >= MAX_CAPACITY) return;

    const newStudent = { ...formData, timestamp: new Date().toISOString() };
    const updatedList = [...currentRegistrations, newStudent];

    const registrationEntry = {
      ...newStudent,
      sessionDate: format(selectedSession.date, 'yyyy-MM-dd'),
      sessionTime: selectedSession.startTime,
      course: selectedSession.level,
      isSeries: !selectedSession.isWorkshop,
      paymentProcessed: 'No' // Default to 'No', will be updated when payment is completed
    };

    setLocalRegistrations(prev => ({ ...prev, [key]: updatedList }));
    onRegistrationComplete(registrationEntry);
    setFormData({ studentName: '', parentEmail: '', parentPhone: '' });
    setSelectedSession(null);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      <div className="p-6 bg-slate-900/50 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-4">
          <h3 className="text-2xl font-bold">{format(currentDate, 'MMMM yyyy')}</h3>
          <div className="flex items-center bg-slate-800/50 rounded-xl p-1 border border-slate-700/50">
            <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2 hover:bg-slate-700 rounded-lg transition-colors"><ChevronLeft className="w-5 h-5" /></button>
            <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-2 hover:bg-slate-700 rounded-lg transition-colors"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setCurrentDate(new Date(2026, 1, 1))} className="text-xs font-bold uppercase tracking-widest text-indigo-400 hover:text-indigo-300 px-4 py-2 border border-indigo-500/20 rounded-lg transition-colors italic">Jump to Feb '26</button>
        </div>
      </div>

      <div className="grid grid-cols-7 bg-slate-900/30 border-b border-slate-800">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="py-4 text-center text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 auto-rows-[220px]">
        {calendarDays.map((day, idx) => {
          const sessions = getSessionsForDay(day);
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isToday = isSameDay(day, new Date());
          const isPast = isBefore(day, today);
          
          return (
            <div key={idx} className={`border-r border-b border-slate-800 p-2 relative transition-colors ${!isCurrentMonth ? 'bg-slate-950/40 text-slate-700' : 'bg-slate-900/10'}`}>
              <div className="flex justify-between items-start mb-1">
                <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-md ${isToday ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500'} ${!isCurrentMonth ? 'opacity-10' : 'opacity-100'}`}>
                  {getDate(day)}
                </span>
              </div>
              
              <div className="flex flex-col gap-1 overflow-y-auto max-h-[180px] scrollbar-hide">
                {sessions.map((session) => {
                  const seriesKey = `${format(session.date, 'yyyy-MM')}-${session.level}-${format(session.date, 'EEEE')}`;
                  const key = session.isWorkshop ? session.id : seriesKey;
                  const registrants = localRegistrations[key] || [];
                  const isFull = registrants.length >= MAX_CAPACITY;
                  
                  const isRegisterable = (session.weekIndex === 0 || session.isWorkshop) && !isPast && !isFull;
                  const isLinked = session.weekIndex > 0 && session.weekIndex < 3 && !session.isWorkshop;

                  return (
                    <button
                      key={session.id}
                      disabled={!isRegisterable || isPast}
                      onClick={() => setSelectedSession(session)}
                      className={`text-[9px] leading-tight p-2 rounded-lg border text-left transition-all flex flex-col group relative
                        ${(isPast || (isFull && !isLinked)) ? 'grayscale opacity-30 cursor-not-allowed bg-slate-800' : session.color}
                        ${!isRegisterable && !isPast && !isFull ? 'opacity-60 cursor-default grayscale-[0.5]' : ''}
                        ${isRegisterable && 'hover:scale-[1.03] hover:shadow-lg active:scale-95'}
                        ${isFull ? 'border-dashed border-slate-600' : ''}
                      `}
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-bold truncate">{session.isWorkshop ? 'Level 3 Workshop' : session.level}</span>
                        {isFull && <span className="text-[7px] bg-slate-800 px-1 rounded text-white font-black">FULL</span>}
                        {isLinked && registrants.length > 0 && <LinkIcon className="w-2 h-2 opacity-40" />}
                      </div>
                      
                      <span className="opacity-70 font-semibold">{session.startTime}</span>
                      
                      {registrants.length > 0 && (
                        <div className="mt-1 border-t border-current/10 pt-1 flex flex-col gap-0.5">
                          {registrants.map((r, i) => (
                            <span key={i} className="font-black truncate uppercase tracking-tighter text-[7px] leading-tight">
                              • {r.studentName}
                            </span>
                          ))}
                        </div>
                      )}

                      {isFull && <div className="absolute inset-0 bg-slate-950/10 rounded-lg pointer-events-none"></div>}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {selectedSession && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <div className={`h-2 w-full ${selectedSession.color.split(' ')[0]}`}></div>
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="text-xl font-bold mb-1 uppercase italic tracking-tighter">Enroll Student</h4>
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                    <Users className="w-3 h-3 text-indigo-400" />
                    Spot { (localRegistrations[selectedSession.isWorkshop ? selectedSession.id : `${format(selectedSession.date, 'yyyy-MM')}-${selectedSession.level}-${format(selectedSession.date, 'EEEE')}`]?.length || 0) + 1 } of {MAX_CAPACITY}
                  </div>
                </div>
                <button onClick={() => setSelectedSession(null)} className="p-2 hover:bg-slate-800 rounded-full transition-colors"><X className="w-5 h-5 text-slate-500" /></button>
              </div>

              <div className={`mb-6 p-5 rounded-2xl border ${selectedSession.color} shadow-inner`}>
                <div className="font-black text-lg uppercase tracking-tight">{selectedSession.isWorkshop ? 'Level 3 Workshop' : selectedSession.level}</div>
                <div className="text-xs font-bold opacity-70 uppercase tracking-widest">
                  {!selectedSession.isWorkshop ? 'Covers Weeks 1, 2, and 3' : 'Intensive Week 4 Session'}
                </div>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Student Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input required type="text" placeholder="Alex Chen" value={formData.studentName} onChange={(e) => setFormData(p => ({ ...p, studentName: e.target.value }))} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm font-medium" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Parent Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input required type="email" placeholder="parent@example.com" value={formData.parentEmail} onChange={(e) => setFormData(p => ({ ...p, parentEmail: e.target.value }))} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm font-medium" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Parent Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input required type="tel" placeholder="(555) 000-0000" value={formData.parentPhone} onChange={(e) => setFormData(p => ({ ...p, parentPhone: e.target.value }))} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm font-medium" />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setSelectedSession(null)} className="flex-1 px-4 py-3 rounded-xl border border-slate-800 font-bold text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-colors">Cancel</button>
                  <button type="submit" className="flex-[1.5] px-4 py-3 rounded-xl bg-indigo-600 font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 active:scale-95">Enroll & Sync</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
