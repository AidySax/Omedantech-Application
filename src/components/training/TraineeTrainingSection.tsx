import React, { useEffect, useState } from 'react';
import { BookOpen, CheckCircle2, Clock3 } from 'lucide-react';
import { TrainingSession, TrainingSubmission } from '../../types';

interface Props {
  token: string | null;
}

export const TraineeTrainingSection: React.FC<Props> = ({ token }) => {
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadSessions = async () => {
    if (!token) return;
    const response = await fetch('/api/training/my', { headers: { Authorization: `Bearer ${token}` } });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Unable to load your training progress.');
    setSessions(data);
  };

  useEffect(() => {
    let active = true;
    if (!token) {
      setLoading(false);
      return;
    }
    fetch('/api/training/my', { headers: { Authorization: `Bearer ${token}` } })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Unable to load your training progress.');
        if (active) setSessions(data);
      })
      .catch((err) => active && setError(err instanceof Error ? err.message : 'Unable to load your training progress.'))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [token]);

  const submitAssignment = async (assignmentId: string, responseText: string) => {
    if (!token) return;
    setError('');
    setNotice('');
    setSavingId(assignmentId);
    try {
      const response = await fetch(`/api/training/assignments/${encodeURIComponent(assignmentId)}/submission`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ response: responseText }),
      });
      const data = await response.json() as TrainingSubmission | { error?: string };
      if (!response.ok) throw new Error('error' in data ? data.error || 'Unable to submit your work.' : 'Unable to submit your work.');
      await loadSessions();
      setNotice('Assignment submitted successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to submit your work.');
    } finally {
      setSavingId('');
    }
  };

  return (
    <section className="space-y-5 rounded-2xl border border-[#D0D5DD] bg-white p-6 sm:p-8">
      <div className="flex items-start gap-3">
        <BookOpen className="mt-0.5 h-5 w-5 text-[#155EEF]" />
        <div>
          <h2 className="text-lg font-bold text-[#101828]">My training & progress</h2>
          <p className="mt-1 text-xs text-gray-500">View assignments for your accepted programs, submit your work, and track scores.</p>
        </div>
      </div>
      {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {notice && <p role="status" className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">{notice}</p>}
      {loading ? (
        <p className="py-4 text-sm text-gray-500">Loading your training sessions…</p>
      ) : !sessions.length ? (
        <p className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-5 text-sm text-gray-600">
          Your program training session and assignments will appear here after your application is accepted.
        </p>
      ) : (
        sessions.map((session) => (
          <article key={session.programId} className="space-y-4 rounded-xl border border-gray-200 p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-gray-900">{session.programTitle}</h3>
                <p className="mt-1 text-xs text-gray-500">{session.earnedPoints} of {session.possiblePoints} points earned</p>
              </div>
              <span className="text-xl font-extrabold text-[#155EEF]">{session.progressPercent}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
              <div className="h-full rounded-full bg-[#155EEF] transition-all" style={{ width: `${session.progressPercent}%` }} />
            </div>
            {!session.assignments.length ? (
              <p className="text-sm text-gray-500">Your trainers have not published assignments yet.</p>
            ) : (
              <div className="space-y-3">
                {session.assignments.map((assignment) => (
                  <TraineeAssignment
                    key={assignment.id}
                    assignment={assignment}
                    saving={savingId === assignment.id}
                    onSubmit={submitAssignment}
                  />
                ))}
              </div>
            )}
          </article>
        ))
      )}
    </section>
  );
};

const TraineeAssignment: React.FC<{
  assignment: TrainingSession['assignments'][number];
  saving: boolean;
  onSubmit: (assignmentId: string, response: string) => Promise<void>;
}> = ({ assignment, saving, onSubmit }) => {
  const submission = assignment.submission;
  const [response, setResponse] = useState(submission?.response || '');
  const graded = submission?.score !== undefined;

  return (
    <article className="space-y-3 rounded-xl border border-blue-100 bg-blue-50/30 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h4 className="text-sm font-bold text-gray-900">{assignment.title}</h4>
          <p className="mt-1 text-xs text-gray-500">
            {assignment.maxPoints} points{assignment.dueDate ? ` · Due ${assignment.dueDate}` : ''}
          </p>
        </div>
        {graded ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800">
            <CheckCircle2 className="h-3.5 w-3.5" /> Scored {submission.score}/{assignment.maxPoints}
          </span>
        ) : submission ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">
            <Clock3 className="h-3.5 w-3.5" /> Awaiting score
          </span>
        ) : (
          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-700">Not submitted</span>
        )}
      </div>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">{assignment.instructions}</p>
      {submission?.feedback && (
        <div className="rounded-lg border border-emerald-100 bg-white p-3 text-sm">
          <strong className="text-emerald-800">Trainer feedback</strong>
          <p className="mt-1 whitespace-pre-wrap text-gray-700">{submission.feedback}</p>
        </div>
      )}
      <form onSubmit={(event) => { event.preventDefault(); void onSubmit(assignment.id, response); }} className="space-y-2">
        <label className="block text-xs font-semibold text-gray-700">
          Your response
          <textarea
            required
            minLength={1}
            maxLength={20000}
            rows={5}
            value={response}
            disabled={graded}
            onChange={(event) => setResponse(event.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-3 text-sm disabled:bg-gray-100"
            placeholder="Write your work or explain how you completed the assignment…"
          />
        </label>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] text-gray-500">
            {submission ? `Last submitted ${new Date(submission.submittedAt).toLocaleString()}` : 'Submit your work here.'}
          </span>
          {!graded && (
            <button disabled={saving || !response.trim()} className="rounded-lg bg-[#155EEF] px-4 py-2 text-xs font-bold text-white disabled:opacity-50">
              {saving ? 'Submitting…' : submission ? 'Update submission' : 'Submit assignment'}
            </button>
          )}
        </div>
      </form>
    </article>
  );
};
