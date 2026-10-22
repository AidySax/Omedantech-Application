import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CalendarCheck, ClipboardList, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AttendanceRecord, AttendanceStatus, PerformanceCategory, PerformanceRecord, TrainingProgram, User } from '../types';
import { TrainingAssignmentManager } from '../components/training/TrainingAssignmentManager';

type EnrolledTrainee = Pick<User, 'id' | 'firstName' | 'lastName' | 'email' | 'phone'>;
type StaffRecords = { attendance: AttendanceRecord[]; performance: PerformanceRecord[] };

const attendanceStatuses: AttendanceStatus[] = ['Present', 'Absent', 'Late', 'Excused'];
const performanceCategories: PerformanceCategory[] = ['Task handled', 'Assignment', 'Class contribution'];

export const StaffDashboardPage: React.FC = () => {
  const { user, token, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [programId, setProgramId] = useState('');
  const [trainees, setTrainees] = useState<EnrolledTrainee[]>([]);
  const [records, setRecords] = useState<StaffRecords>({ attendance: [], performance: [] });
  const [attendanceForm, setAttendanceForm] = useState({
    traineeId: '',
    date: new Date().toISOString().slice(0, 10),
    status: 'Present' as AttendanceStatus,
    notes: '',
  });
  const [performanceForm, setPerformanceForm] = useState({
    traineeId: '',
    category: 'Task handled' as PerformanceCategory,
    title: '',
    details: '',
    score: '',
  });
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) navigate('/login', { replace: true });
    if (user && user.role !== 'staff') {
      navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    }
  }, [isLoading, user, navigate]);

  useEffect(() => {
    if (!token || user?.role !== 'staff') return;
    let active = true;
    fetch('/api/staff/programs', { headers: { Authorization: `Bearer ${token}` } })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Unable to load assigned programs.');
        if (active) {
          setPrograms(data);
          setProgramId((current) => current || data[0]?.id || '');
        }
      })
      .catch((err) => active && setError(err instanceof Error ? err.message : 'Unable to load assigned programs.'));
    return () => { active = false; };
  }, [token, user]);

  useEffect(() => {
    if (!token || !programId || user?.role !== 'staff') return;
    let active = true;
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch(`/api/staff/trainees?programId=${encodeURIComponent(programId)}`, { headers }),
      fetch(`/api/staff/records?programId=${encodeURIComponent(programId)}`, { headers }),
    ])
      .then(async ([traineeResponse, recordResponse]) => {
        const [traineeData, recordData] = await Promise.all([traineeResponse.json(), recordResponse.json()]);
        if (!traineeResponse.ok) throw new Error(traineeData.error || 'Unable to load trainees.');
        if (!recordResponse.ok) throw new Error(recordData.error || 'Unable to load class records.');
        if (active) {
          setTrainees(traineeData);
          setRecords(recordData);
          setAttendanceForm((current) => ({ ...current, traineeId: traineeData[0]?.id || '' }));
          setPerformanceForm((current) => ({ ...current, traineeId: traineeData[0]?.id || '' }));
          setError('');
        }
      })
      .catch((err) => active && setError(err instanceof Error ? err.message : 'Unable to load program records.'));
    return () => { active = false; };
  }, [token, programId, user]);

  const traineeNames = useMemo(
    () => new Map(trainees.map((trainee) => [trainee.id, `${trainee.firstName} ${trainee.lastName}`])),
    [trainees]
  );

  const refreshRecords = async () => {
    if (!token || !programId) return;
    const headers = { Authorization: `Bearer ${token}` };
    const [traineeResponse, recordResponse] = await Promise.all([
      fetch(`/api/staff/trainees?programId=${encodeURIComponent(programId)}`, { headers }),
      fetch(`/api/staff/records?programId=${encodeURIComponent(programId)}`, { headers }),
    ]);
    const [traineeData, recordData] = await Promise.all([traineeResponse.json(), recordResponse.json()]);
    if (!traineeResponse.ok || !recordResponse.ok) {
      throw new Error(traineeData.error || recordData.error || 'Unable to refresh class records.');
    }
    setTrainees(traineeData);
    setRecords(recordData);
  };

  const saveRecord = async (endpoint: '/api/staff/attendance' | '/api/staff/performance', formData: Record<string, unknown>) => {
    if (!token || !programId) return;
    setError('');
    setNotice('');
    setSaving(true);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...formData, programId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to save this class record.');
      await refreshRecords();
      setNotice('Class record saved successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save this class record.');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || !user || user.role !== 'staff') return null;

  return (
    <main className="min-h-screen bg-[#F5F8FF] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col gap-4 rounded-2xl bg-[#101828] p-6 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 inline-flex rounded-full border border-blue-400/30 bg-blue-500/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-200">
              Staff portal{user.position ? ` · ${user.position}` : ''}
            </div>
            <h1 className="text-2xl font-extrabold">Trainee & class management</h1>
            <p className="mt-1 text-sm text-slate-300">Signed in as {user.firstName} {user.lastName}</p>
          </div>
          <div className="flex gap-2">
            <Link to="/" className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm hover:bg-white/15">
              <ArrowLeft className="h-4 w-4" /> Public site
            </Link>
            <button onClick={() => { logout(); navigate('/login'); }} className="inline-flex items-center gap-2 rounded-lg bg-red-700 px-3 py-2 text-sm font-semibold hover:bg-red-600">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </header>

        {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {notice && <p role="status" className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">{notice}</p>}

        <section className="rounded-2xl border border-[#D0D5DD] bg-white p-5">
          <label htmlFor="staff-program" className="mb-2 block text-sm font-semibold text-gray-800">Assigned training program</label>
          {programs.length ? (
            <select id="staff-program" value={programId} onChange={(event) => setProgramId(event.target.value)} className="w-full max-w-xl rounded-lg border border-gray-300 bg-white p-3 text-sm">
              {programs.map((program) => <option key={program.id} value={program.id}>{program.title}</option>)}
            </select>
          ) : (
            <p className="text-sm text-gray-600">No programs are assigned to your account. Contact an administrator to request access.</p>
          )}
        </section>

        {programId && (
          <>
            <div className="grid gap-6 lg:grid-cols-2">
              <form onSubmit={(event) => { event.preventDefault(); void saveRecord('/api/staff/attendance', attendanceForm); }} className="space-y-4 rounded-2xl border border-[#D0D5DD] bg-white p-5">
                <div className="flex items-center gap-2">
                  <CalendarCheck className="h-5 w-5 text-[#155EEF]" />
                  <h2 className="font-bold text-gray-900">Record attendance</h2>
                </div>
                <label className="block text-xs font-semibold text-gray-700">Trainee
                  <select required value={attendanceForm.traineeId} onChange={(event) => setAttendanceForm({ ...attendanceForm, traineeId: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm">
                    {trainees.map((trainee) => <option key={trainee.id} value={trainee.id}>{trainee.firstName} {trainee.lastName}</option>)}
                  </select>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block text-xs font-semibold text-gray-700">Class date
                    <input required type="date" value={attendanceForm.date} onChange={(event) => setAttendanceForm({ ...attendanceForm, date: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm" />
                  </label>
                  <label className="block text-xs font-semibold text-gray-700">Status
                    <select value={attendanceForm.status} onChange={(event) => setAttendanceForm({ ...attendanceForm, status: event.target.value as AttendanceStatus })} className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm">
                      {attendanceStatuses.map((status) => <option key={status}>{status}</option>)}
                    </select>
                  </label>
                </div>
                <textarea rows={2} aria-label="Attendance notes" placeholder="Notes (optional)" value={attendanceForm.notes} onChange={(event) => setAttendanceForm({ ...attendanceForm, notes: event.target.value })} className="w-full rounded-lg border border-gray-300 p-2.5 text-sm" />
                <button disabled={!trainees.length || saving} className="rounded-lg bg-[#155EEF] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">{saving ? 'Saving…' : 'Save attendance'}</button>
              </form>

              <form onSubmit={(event) => {
                event.preventDefault();
                const { score, ...rest } = performanceForm;
                void saveRecord('/api/staff/performance', { ...rest, ...(score !== '' ? { score: Number(score) } : {}) });
              }} className="space-y-4 rounded-2xl border border-[#D0D5DD] bg-white p-5">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-[#155EEF]" />
                  <h2 className="font-bold text-gray-900">Track class performance</h2>
                </div>
                <label className="block text-xs font-semibold text-gray-700">Trainee
                  <select required value={performanceForm.traineeId} onChange={(event) => setPerformanceForm({ ...performanceForm, traineeId: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm">
                    {trainees.map((trainee) => <option key={trainee.id} value={trainee.id}>{trainee.firstName} {trainee.lastName}</option>)}
                  </select>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block text-xs font-semibold text-gray-700">Activity
                    <select value={performanceForm.category} onChange={(event) => setPerformanceForm({ ...performanceForm, category: event.target.value as PerformanceCategory })} className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm">
                      {performanceCategories.map((category) => <option key={category}>{category}</option>)}
                    </select>
                  </label>
                  <label className="block text-xs font-semibold text-gray-700">Score (optional, 0–100)
                    <input type="number" min="0" max="100" value={performanceForm.score} onChange={(event) => setPerformanceForm({ ...performanceForm, score: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm" />
                  </label>
                </div>
                <input required aria-label="Activity title" placeholder="Activity title" value={performanceForm.title} onChange={(event) => setPerformanceForm({ ...performanceForm, title: event.target.value })} className="w-full rounded-lg border border-gray-300 p-2.5 text-sm" />
                <textarea rows={2} aria-label="Activity details" placeholder="Details or feedback" value={performanceForm.details} onChange={(event) => setPerformanceForm({ ...performanceForm, details: event.target.value })} className="w-full rounded-lg border border-gray-300 p-2.5 text-sm" />
                <button disabled={!trainees.length || saving} className="rounded-lg bg-[#155EEF] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">{saving ? 'Saving…' : 'Save performance'}</button>
              </form>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <section className="rounded-2xl border border-[#D0D5DD] bg-white p-5">
                <h2 className="mb-3 font-bold text-gray-900">Attendance history</h2>
                {records.attendance.length ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead><tr className="border-b text-gray-500"><th className="py-2 pr-2">Trainee</th><th className="py-2 pr-2">Date</th><th className="py-2 pr-2">Status</th><th className="py-2">Notes</th></tr></thead>
                      <tbody className="divide-y divide-gray-100">
                        {records.attendance.map((record) => <tr key={record.id}><td className="py-2 pr-2 font-medium">{traineeNames.get(record.traineeId) || 'Trainee'}</td><td className="py-2 pr-2">{record.date}</td><td className="py-2 pr-2">{record.status}</td><td className="py-2">{record.notes || '—'}</td></tr>)}
                      </tbody>
                    </table>
                  </div>
                ) : <p className="text-sm text-gray-500">{trainees.length ? 'No attendance recorded for this program yet.' : 'Accepted trainees appear here when enrolled in this program.'}</p>}
              </section>

              <section className="rounded-2xl border border-[#D0D5DD] bg-white p-5">
                <h2 className="mb-3 font-bold text-gray-900">Performance history</h2>
                {records.performance.length ? (
                  <div className="space-y-3">
                    {records.performance.map((record: PerformanceRecord) => (
                      <article key={record.id} className="rounded-xl border border-gray-100 p-3">
                        <div className="flex flex-wrap justify-between gap-2">
                          <h3 className="text-sm font-semibold text-gray-900">{record.title}</h3>
                          <span className="text-xs font-semibold text-[#155EEF]">{record.category}</span>
                        </div>
                        <p className="mt-1 text-xs text-gray-600">{traineeNames.get(record.traineeId) || 'Trainee'}{record.score !== undefined ? ` · ${record.score}/100` : ''}</p>
                        {record.details && <p className="mt-2 text-sm text-gray-600">{record.details}</p>}
                        <p className="mt-2 text-[11px] text-gray-400">{new Date(record.createdAt).toLocaleString()}</p>
                      </article>
                    ))}
                  </div>
                ) : <p className="text-sm text-gray-500">No task, assignment, or contribution feedback recorded yet.</p>}
              </section>
            </div>
            <TrainingAssignmentManager token={token} role="staff" fixedProgramId={programId} />
          </>
        )}
      </div>
    </main>
  );
};
