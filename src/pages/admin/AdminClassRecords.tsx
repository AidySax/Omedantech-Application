import React, { useEffect, useState } from 'react';
import { AttendanceRecord, PerformanceRecord, TrainingProgram } from '../../types';

type AttendanceView = AttendanceRecord & { traineeName: string; programTitle: string };
type PerformanceView = PerformanceRecord & { traineeName: string; programTitle: string };

export const AdminClassRecords: React.FC<{ token: string | null }> = ({ token }) => {
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [attendance, setAttendance] = useState<AttendanceView[]>([]);
  const [performance, setPerformance] = useState<PerformanceView[]>([]);
  const [programId, setProgramId] = useState('all');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    let active = true;
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch('/api/programs'),
      fetch('/api/admin/class-records', { headers }),
    ])
      .then(async ([programResponse, recordResponse]) => {
        const [programData, recordData] = await Promise.all([programResponse.json(), recordResponse.json()]);
        if (!programResponse.ok) throw new Error(programData.error || 'Unable to load programs.');
        if (!recordResponse.ok) throw new Error(recordData.error || 'Unable to load class records.');
        if (active) {
          setPrograms(programData);
          setAttendance(recordData.attendance);
          setPerformance(recordData.performance);
        }
      })
      .catch((err) => active && setError(err instanceof Error ? err.message : 'Unable to load class records.'));
    return () => { active = false; };
  }, [token]);

  const visibleAttendance = attendance.filter((record) => programId === 'all' || record.programId === programId);
  const visiblePerformance = performance.filter((record) => programId === 'all' || record.programId === programId);

  return (
    <section className="space-y-5 rounded-2xl border border-[#D0D5DD] bg-white p-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-base font-bold text-[#101828]">Trainee class records</h2>
          <p className="mt-1 text-xs text-gray-500">System-wide attendance and class performance across assigned programs.</p>
        </div>
        <label className="text-xs font-semibold text-gray-700">Filter program
          <select value={programId} onChange={(event) => setProgramId(event.target.value)} className="mt-1 block min-w-56 rounded-lg border border-gray-300 bg-white p-2.5 text-sm">
            <option value="all">All programs</option>
            {programs.map((program) => <option key={program.id} value={program.id}>{program.title}</option>)}
          </select>
        </label>
      </div>
      {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div className="space-y-3">
        <h3 className="font-semibold text-sm text-gray-900">Attendance ({visibleAttendance.length})</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead><tr className="border-b bg-gray-50 text-gray-500"><th className="p-2">Trainee</th><th className="p-2">Program</th><th className="p-2">Date</th><th className="p-2">Status</th><th className="p-2">Notes</th></tr></thead>
            <tbody className="divide-y divide-gray-100">
              {visibleAttendance.map((record) => (
                <tr key={record.id}>
                  <td className="p-2 font-medium text-gray-900">{record.traineeName}</td>
                  <td className="p-2">{record.programTitle}</td>
                  <td className="p-2">{record.date}</td>
                  <td className="p-2">{record.status}</td>
                  <td className="p-2">{record.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!visibleAttendance.length && <p className="py-4 text-center text-xs text-gray-500">No attendance records for this filter.</p>}
        </div>
      </div>

      <div className="space-y-3 border-t border-gray-100 pt-5">
        <h3 className="font-semibold text-sm text-gray-900">Performance ({visiblePerformance.length})</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead><tr className="border-b bg-gray-50 text-gray-500"><th className="p-2">Trainee</th><th className="p-2">Program</th><th className="p-2">Category</th><th className="p-2">Activity</th><th className="p-2">Score</th><th className="p-2">Details</th></tr></thead>
            <tbody className="divide-y divide-gray-100">
              {visiblePerformance.map((record) => (
                <tr key={record.id}>
                  <td className="p-2 font-medium text-gray-900">{record.traineeName}</td>
                  <td className="p-2">{record.programTitle}</td>
                  <td className="p-2">{record.category}</td>
                  <td className="p-2">{record.title}</td>
                  <td className="p-2">{record.score === undefined ? '—' : `${record.score}/100`}</td>
                  <td className="p-2">{record.details || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!visiblePerformance.length && <p className="py-4 text-center text-xs text-gray-500">No performance records for this filter.</p>}
        </div>
      </div>
    </section>
  );
};
