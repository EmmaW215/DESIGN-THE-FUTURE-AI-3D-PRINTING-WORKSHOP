import React, { useMemo, useState } from 'react';
import { Filter, TrendingUp } from 'lucide-react';

interface PivotRow {
  course: string;
  sessionDate: string;
  sessionTime: string;
  count: number;
}

interface PivotTableProps {
  data: any[];
}

export const RegistrationPivotTable: React.FC<PivotTableProps> = ({ data }) => {
  const [filterCourse, setFilterCourse] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('all');
  const [filterTime, setFilterTime] = useState<string>('all');

  // Generate pivot data from registration details
  const pivotData = useMemo(() => {
    const pivotMap = new Map<string, number>();

    data.forEach((entry) => {
      if (!entry.course || !entry.sessionDate || !entry.sessionTime) return;

      const key = `${entry.course}|${entry.sessionDate}|${entry.sessionTime}`;
      pivotMap.set(key, (pivotMap.get(key) || 0) + 1);
    });

    const pivotRows: PivotRow[] = Array.from(pivotMap.entries()).map(([key, count]) => {
      const [course, sessionDate, sessionTime] = key.split('|');
      return { course, sessionDate, sessionTime, count };
    });

    // Sort by date, then time
    return pivotRows.sort((a, b) => {
      if (a.sessionDate !== b.sessionDate) {
        return a.sessionDate.localeCompare(b.sessionDate);
      }
      if (a.sessionTime !== b.sessionTime) {
        return a.sessionTime.localeCompare(b.sessionTime);
      }
      return a.course.localeCompare(b.course);
    });
  }, [data]);

  // Get unique values for filters
  const uniqueCourses = useMemo(() => {
    return Array.from(new Set(pivotData.map(row => row.course))).sort();
  }, [pivotData]);

  const uniqueDates = useMemo(() => {
    return Array.from(new Set(pivotData.map(row => row.sessionDate))).sort();
  }, [pivotData]);

  const uniqueTimes = useMemo(() => {
    return Array.from(new Set(pivotData.map(row => row.sessionTime))).sort();
  }, [pivotData]);

  // Apply filters
  const filteredData = useMemo(() => {
    return pivotData.filter(row => {
      if (filterCourse !== 'all' && row.course !== filterCourse) return false;
      if (filterDate !== 'all' && row.sessionDate !== filterDate) return false;
      if (filterTime !== 'all' && row.sessionTime !== filterTime) return false;
      return true;
    });
  }, [pivotData, filterCourse, filterDate, filterTime]);

  // Calculate total registrations
  const totalRegistrations = useMemo(() => {
    return filteredData.reduce((sum, row) => sum + row.count, 0);
  }, [filteredData]);

  const getCourseColor = (course: string) => {
    if (course.includes('Level 1')) return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
    if (course.includes('Level 2')) return 'bg-sky-500/10 text-sky-500 border border-sky-500/20';
    if (course.includes('Level 3') && !course.includes('Workshop')) return 'bg-rose-500/10 text-rose-500 border border-rose-500/20';
    return 'bg-rose-600/10 text-rose-400 border border-rose-600/20';
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
      <div className="bg-slate-900 border-b border-slate-800 p-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-sm font-bold text-white uppercase tracking-tighter">
            Total: {totalRegistrations} registrations
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-950/50 border-b border-slate-800 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Filters</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Course Filter */}
          <div>
            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">
              Course
            </label>
            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="all">All Courses</option>
              {uniqueCourses.map(course => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">
              Date
            </label>
            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="all">All Dates</option>
              {uniqueDates.map(date => (
                <option key={date} value={date}>{date}</option>
              ))}
            </select>
          </div>

          {/* Time Filter */}
          <div>
            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">
              Time
            </label>
            <select
              value={filterTime}
              onChange={(e) => setFilterTime(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="all">All Times</option>
              {uniqueTimes.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Pivot Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/50">
              <th className="px-6 py-3 border-b border-slate-800 text-[9px] font-black text-slate-500 uppercase tracking-widest">Course</th>
              <th className="px-6 py-3 border-b border-slate-800 text-[9px] font-black text-slate-500 uppercase tracking-widest">Session Date</th>
              <th className="px-6 py-3 border-b border-slate-800 text-[9px] font-black text-slate-500 uppercase tracking-widest">Session Time</th>
              <th className="px-6 py-3 border-b border-slate-800 text-[9px] font-black text-slate-500 uppercase tracking-widest text-right">Registrations</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-600 italic font-medium">
                  No registrations found. {data.length === 0 ? 'Waiting for registrations...' : 'Try adjusting filters.'}
                </td>
              </tr>
            ) : (
              filteredData.map((row, i) => (
                <tr key={i} className="hover:bg-slate-800/30 transition-colors border-b border-slate-800/50">
                  <td className="px-6 py-4">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter ${getCourseColor(row.course)}`}>
                      {row.course}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {row.sessionDate}
                  </td>
                  <td className="px-6 py-4 text-[10px] font-bold text-slate-400">
                    {row.sessionTime}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 font-black text-sm border border-indigo-500/20">
                      {row.count}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      {filteredData.length > 0 && (
        <div className="bg-slate-950/50 border-t border-slate-800 px-6 py-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-bold uppercase tracking-widest">
              Showing {filteredData.length} unique session{filteredData.length !== 1 ? 's' : ''}
            </span>
            <span className="text-white font-black">
              Total: <span className="text-indigo-400">{totalRegistrations}</span> registration{totalRegistrations !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
