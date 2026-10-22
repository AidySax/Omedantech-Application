import React, { useEffect, useState } from 'react';
import { BookOpen, ClipboardCheck, Plus } from 'lucide-react';
import { TrainingAssignment, TrainingProgram, TrainingSubmission, User } from '../../types';

type ManagerTrainee = Pick<User, 'id' | 'firstName' | 'lastName' | 'email' | 'phone'> & {
  earnedPoints: number;
  possiblePoints: number;
  progressPercent: number;
};

type AssignmentSubmission = TrainingSubmission & { traineeName: string };
type ManagedAssignment = TrainingAssignment & { submissions: AssignmentSubmission[] };
type ProgramTrainingData = { programId: string; trainees: ManagerTrainee[]; assignments: ManagedAssignment[] };
type GradeDraft = { score: string; feedback: string };

interface Props {
  token: string | null;
  role: 'staff' | 'admin';
  fixedProgramId?: string;
}

export const TrainingAssignmentManager: React.FC<Props> = ({ token, role, fixedProgramId }) => {
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [programId, setProgramId] = useState('');
  const [trainingData, setTrainingData] = useState<ProgramTrainingData | null>(null);
  const [title, setTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [maxPoints, setMaxPoints] = useState('100');
  const [gradeDrafts, setGradeDrafts] = useState<Record<string, GradeDraft>>({});
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!token) return;
    let active = true;
    const endpoint = role === 'admin' ? '/api/programs' : '/api/staff/programs';
    fetch(endpoint, { headers: { Authorization: `Bearer ${token}` } })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Unable to load training programs.');
        if (active) {
          setPrograms(data);
          setProgramId((current) => current || fixedProgramId || data[0]?.id || '');
        }
      })
      .catch((err) => active && setError(err instanceof Error ? err.message : 'Unable to load training programs.'));
    return () => { active = false; };
  }, [token, role]);

  useEffect(() => {
    if (fixedProgramId) setProgramId(fixedProgramId);
  }, [fixedProgramId]);

  const loadProgram = async (selectedProgramId: string, active = true) => {
    if (!token || !selectedProgramId) {
      setTrainingData(null);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`/api/training/program/${encodeURIComponent(selectedProgramId)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to load assignments and trainee progress.');
      if (active) {
        setTrainingData(data);
        setError('');
      }
    } catch (err) {
      if (active) setError(err instanceof Error ? err.message : 'Unable to load assignments and trainee progress.');
    } finally {
      if (active) setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    void loadProgram(programId, active);
    return () => { active = false; };
  }, [token, programId]);

  const createAssignment = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token || !programId) return;
    setError('');
    setNotice('');
    setSaving(true);
    try {
      const response = await fetch('/api/training/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ programId, title, instructions, dueDate, maxPoints: Number(maxPoints) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to create this assignment.');
      setTitle('');
      setInstructions('');
      setDueDate('');
      setMaxPoints('100');
      await loadProgram(programId);
      setNotice('Assignment published to enrolled trainees.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create this assignment.');
    } finally {
      setSaving(false);
    }
  };

  const saveGrade = async (submission: AssignmentSubmission) => {
    if (!token) return;
    const draft = gradeDrafts[submission.id] || {
      score: submission.score?.toString() || '',
      feedback: submission.feedback || '',
    };
    setError('');
    setNotice('');
    setSaving(true);
    try {
      const response = await fetch(`/api/training/submissions/${encodeURIComponent(submission.id)}/grade`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ score: Number(draft.score), feedback: draft.feedback }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to save this score.');
      await loadProgram(programId);
      setGradeDrafts((current) => {
        const next = { ...current };
        delete next[submission.id];
        return next;
      });
      setNotice('Score saved and trainee progress updated.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save this score.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-5 rounded-2xl border border-[#D0D5DD] bg-white p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <BookOpen className="mt-0.5 h-5 w-5 text-[#155EEF]" />
        <div>
          <h2 className="font-bold text-gray-900">Training assignments & progress</h2>
          <p className="mt-1 text-xs text-gray-500">Publish program assignments, review trainee submissions, and record scores to update progress.</p>
        </div>
      </div>

      {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {notice && <p role="status" className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">{notice}</p>}

      {fixedProgramId ? (
        <p className="text-sm font-semibold text-gray-700">
          Program: {programs.find((program) => program.id === fixedProgramId)?.title || 'Loading…'}
        </p>
      ) : (
        <label className="block max-w-xl text-xs font-semibold text-gray-700">
          Training program
          <select value={programId} onChange={(event) => setProgramId(event.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm">
            {programs.map((program) => <option key={program.id} value={program.id}>{program.title}</option>)}
          </select>
        </label>
      )}

      {!programs.length ? (
        <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
          {role === 'staff' ? 'No programs are assigned to your account.' : 'No training programs are available.'}
        </p>
      ) : (
        <>
          <form onSubmit={(event) => void createAssignment(event)} className="grid gap-3 rounded-xl border border-blue-100 bg-blue-50/50 p-4 md:grid-cols-2">
            <h3 className="md:col-span-2 flex items-center gap-2 text-sm font-bold text-gray-900">
              <Plus className="h-4 w-4 text-[#155EEF]" /> Create program assignment
            </h3>
            <label className="text-xs font-semibold text-gray-700 md:col-span-2">
              Assignment title
              <input required maxLength={160} value={title} onChange={(event) => setTitle(event.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm" />
            </label>
            <label className="text-xs font-semibold text-gray-700 md:col-span-2">
              Instructions
              <textarea required maxLength={10000} rows={4} value={instructions} onChange={(event) => setInstructions(event.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm" />
            </label>
            <label className="text-xs font-semibold text-gray-700">
              Due date (optional)
              <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm" />
            </label>
            <label className="text-xs font-semibold text-gray-700">
              Maximum points
              <input required type="number" min="1" max="1000" step="1" value={maxPoints} onChange={(event) => setMaxPoints(event.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm" />
            </label>
            <div className="md:col-span-2">
              <button disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-[#155EEF] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">
                <Plus className="h-4 w-4" /> {saving ? 'Publishing…' : 'Publish assignment'}
              </button>
            </div>
          </form>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-900">Enrolled trainees ({trainingData?.trainees.length || 0})</h3>
            {loading && <p className="text-sm text-gray-500">Loading training progress…</p>}
            {!loading && trainingData?.trainees.length === 0 && <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600">No accepted trainees are enrolled in this program yet.</p>}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {trainingData?.trainees.map((trainee) => (
                <article key={trainee.id} className="rounded-xl border border-gray-200 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{trainee.firstName} {trainee.lastName}</h4>
                      <p className="mt-0.5 text-xs text-gray-500">{trainee.email}</p>
                    </div>
                    <span className="text-sm font-extrabold text-[#155EEF]">{trainee.progressPercent}%</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full rounded-full bg-[#155EEF]" style={{ width: `${trainee.progressPercent}%` }} />
                  </div>
                  <p className="mt-2 text-[11px] text-gray-500">{trainee.earnedPoints}/{trainee.possiblePoints} points earned</p>
                </article>
              ))}
            </div>
          </div>

          <div className="space-y-3 border-t border-gray-100 pt-5">
            <h3 className="text-sm font-bold text-gray-900">Assignments & submissions ({trainingData?.assignments.length || 0})</h3>
            {!loading && !trainingData?.assignments.length && <p className="text-sm text-gray-500">No assignments have been published for this program yet.</p>}
            {trainingData?.assignments.map((assignment) => (
              <details key={assignment.id} className="rounded-xl border border-gray-200">
                <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-2 p-4">
                  <span className="text-sm font-bold text-gray-900">{assignment.title}</span>
                  <span className="text-xs text-gray-500">
                    {assignment.submissions.length}/{trainingData.trainees.length} submitted · {assignment.maxPoints} points
                    {assignment.dueDate ? ` · Due ${assignment.dueDate}` : ''}
                  </span>
                </summary>
                <div className="space-y-3 border-t border-gray-100 p-4">
                  <p className="whitespace-pre-wrap text-sm text-gray-700">{assignment.instructions}</p>
                  {trainingData.trainees.map((trainee) => {
                    const submission = assignment.submissions.find((item) => item.traineeId === trainee.id);
                    if (!submission) {
                      return (
                        <div key={trainee.id} className="rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
                          {trainee.firstName} {trainee.lastName} · Not submitted
                        </div>
                      );
                    }
                    const draft = gradeDrafts[submission.id] || {
                      score: submission.score?.toString() || '',
                      feedback: submission.feedback || '',
                    };
                    return (
                      <article key={submission.id} className="space-y-3 rounded-lg border border-gray-200 p-3">
                        <div className="flex flex-wrap justify-between gap-2 text-xs">
                          <strong className="text-gray-900">{submission.traineeName}</strong>
                          <span className="text-gray-500">Submitted {new Date(submission.submittedAt).toLocaleString()}</span>
                        </div>
                        <p className="whitespace-pre-wrap break-words rounded-lg bg-gray-50 p-3 text-sm text-gray-700">{submission.response}</p>
                        <div className="grid gap-3 sm:grid-cols-[10rem_1fr]">
                          <label className="text-xs font-semibold text-gray-700">
                            Score / {assignment.maxPoints}
                            <input type="number" min="0" max={assignment.maxPoints} step="any" value={draft.score} onChange={(event) => setGradeDrafts((current) => ({ ...current, [submission.id]: { ...draft, score: event.target.value } }))} className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm" />
                          </label>
                          <label className="text-xs font-semibold text-gray-700">
                            Feedback (optional)
                            <textarea rows={2} maxLength={5000} value={draft.feedback} onChange={(event) => setGradeDrafts((current) => ({ ...current, [submission.id]: { ...draft, feedback: event.target.value } }))} className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm" />
                          </label>
                        </div>
                        {submission.gradedAt && <p className="text-xs text-emerald-700">Current score: {submission.score}/{assignment.maxPoints} · Progress updated</p>}
                        <button type="button" disabled={saving || draft.score === ''} onClick={() => void saveGrade(submission)} className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-3 py-2 text-xs font-bold text-white disabled:opacity-50">
                          <ClipboardCheck className="h-4 w-4" /> {saving ? 'Saving…' : submission.gradedAt ? 'Update score' : 'Score submission'}
                        </button>
                      </article>
                    );
                  })}
                </div>
              </details>
            ))}
          </div>
        </>
      )}
    </section>
  );
};
