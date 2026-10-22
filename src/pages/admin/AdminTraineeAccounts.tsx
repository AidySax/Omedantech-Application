import React, { useEffect, useState } from 'react';
import { Eye, KeyRound, Pencil, Trash2, UserRound } from 'lucide-react';

interface TraineeAccount {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: string;
  hasPassportPhoto: boolean;
  applicationCount: number;
}

type EditableTrainee = Pick<TraineeAccount, 'id' | 'firstName' | 'lastName' | 'email' | 'phone'>;

export const AdminTraineeAccounts: React.FC<{ token: string | null }> = ({ token }) => {
  const [trainees, setTrainees] = useState<TraineeAccount[]>([]);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<EditableTrainee | null>(null);
  const [passportUrl, setPassportUrl] = useState('');
  const [temporaryPassword, setTemporaryPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadTrainees = async () => {
    if (!token) return;
    const response = await fetch('/api/admin/trainees', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Unable to load trainee accounts.');
    setTrainees(data);
  };

  useEffect(() => {
    let active = true;
    if (!token) {
      setLoading(false);
      return;
    }
    fetch('/api/admin/trainees', { headers: { Authorization: `Bearer ${token}` } })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Unable to load trainee accounts.');
        if (active) setTrainees(data);
      })
      .catch((err) => active && setError(err instanceof Error ? err.message : 'Unable to load trainee accounts.'))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [token]);

  useEffect(() => {
    if (!passportUrl) return;
    return () => URL.revokeObjectURL(passportUrl);
  }, [passportUrl]);

  const viewPassport = async (trainee: TraineeAccount) => {
    if (!token) return;
    setError('');
    try {
      const response = await fetch(`/api/admin/trainees/${encodeURIComponent(trainee.id)}/passport`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Unable to load the passport photograph.');
      }
      setPassportUrl(URL.createObjectURL(await response.blob()));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load the passport photograph.');
    }
  };

  const saveTrainee = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token || !editing) return;
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch(`/api/admin/trainees/${encodeURIComponent(editing.id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(editing),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to update the trainee account.');
      await loadTrainees();
      setEditing(null);
      setNotice('Trainee details updated. Their application records now use the updated contact information.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update the trainee account.');
    } finally {
      setSaving(false);
    }
  };

  const resetPassword = async (trainee: TraineeAccount) => {
    if (!token || !window.confirm(`Reset the password for ${trainee.firstName} ${trainee.lastName}? The new temporary password will be shown once.`)) return;
    setError('');
    setNotice('');
    setTemporaryPassword('');
    try {
      const response = await fetch(`/api/admin/trainees/${encodeURIComponent(trainee.id)}/reset-password`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to reset the trainee password.');
      setTemporaryPassword(data.temporaryPassword);
      setNotice(`Temporary password generated for ${trainee.firstName} ${trainee.lastName}. Copy and share it securely; it will not be shown again.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to reset the trainee password.');
    }
  };

  const deleteTrainee = async (trainee: TraineeAccount) => {
    if (!token || !window.confirm(
      `Permanently delete ${trainee.firstName} ${trainee.lastName} (${trainee.email}) and all linked applications, passport photo, attendance, performance, and training submissions? This cannot be undone.`
    )) return;
    setError('');
    setNotice('');
    try {
      const response = await fetch(`/api/admin/trainees/${encodeURIComponent(trainee.id)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to delete the trainee account.');
      setTrainees((current) => current.filter((item) => item.id !== trainee.id));
      setNotice(data.message || 'Trainee account deleted.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete the trainee account.');
    }
  };

  const visibleTrainees = trainees.filter((trainee) =>
    `${trainee.firstName} ${trainee.lastName} ${trainee.email} ${trainee.phone}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="space-y-5 rounded-2xl border border-[#D0D5DD] bg-white p-5 sm:p-6">
      <div>
        <h2 className="text-base font-bold text-[#101828]">Trainee accounts</h2>
        <p className="mt-1 text-xs text-gray-500">
          Manage account contact details and passport photos. Passwords are never displayed; admins can issue a one-time temporary password reset.
        </p>
      </div>

      {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {notice && (
        <div role="status" className="space-y-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
          <p>{notice}</p>
          {temporaryPassword && (
            <div>
              <label htmlFor="temporary-trainee-password" className="block text-xs font-semibold">One-time temporary password</label>
              <input
                id="temporary-trainee-password"
                readOnly
                value={temporaryPassword}
                onFocus={(event) => event.currentTarget.select()}
                className="mt-1 w-full rounded border border-green-300 bg-white p-2 font-mono text-sm"
              />
              <p className="mt-1 text-xs">Copy it now and share it privately. This password cannot be retrieved from the system later.</p>
            </div>
          )}
        </div>
      )}

      <label className="block max-w-md text-xs font-semibold text-gray-700">
        Search trainee accounts
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Name, email or phone" className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm" />
      </label>

      {loading ? (
        <p className="py-6 text-center text-sm text-gray-500">Loading trainee accounts…</p>
      ) : !visibleTrainees.length ? (
        <p className="rounded-lg bg-gray-50 p-5 text-center text-sm text-gray-600">
          {trainees.length ? 'No trainee accounts match your search.' : 'No trainee accounts have registered yet.'}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-xs">
            <thead>
              <tr className="border-b bg-gray-50 text-gray-500">
                <th className="p-3">Trainee</th><th className="p-3">Phone</th><th className="p-3">Applications</th><th className="p-3">Passport</th><th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visibleTrainees.map((trainee) => (
                <tr key={trainee.id}>
                  <td className="p-3">
                    <strong className="block text-gray-900">{trainee.firstName} {trainee.lastName}</strong>
                    <span className="text-gray-500">{trainee.email}</span>
                  </td>
                  <td className="p-3 text-gray-700">{trainee.phone || '—'}</td>
                  <td className="p-3 text-gray-700">{trainee.applicationCount}</td>
                  <td className="p-3">
                    {trainee.hasPassportPhoto ? (
                      <button type="button" onClick={() => void viewPassport(trainee)} className="inline-flex items-center gap-1 font-semibold text-[#155EEF] hover:underline">
                        <Eye className="h-3.5 w-3.5" /> View privately
                      </button>
                    ) : <span className="text-amber-700">Not uploaded</span>}
                  </td>
                  <td className="p-3">
                    <div className="flex justify-end gap-1">
                      <button type="button" title="Edit trainee details" aria-label={`Edit ${trainee.firstName} ${trainee.lastName}`} onClick={() => { setTemporaryPassword(''); setEditing({ id: trainee.id, firstName: trainee.firstName, lastName: trainee.lastName, email: trainee.email, phone: trainee.phone }); }} className="rounded p-2 text-blue-700 hover:bg-blue-50">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button type="button" title="Reset trainee password" aria-label={`Reset password for ${trainee.firstName} ${trainee.lastName}`} onClick={() => void resetPassword(trainee)} className="rounded p-2 text-amber-700 hover:bg-amber-50">
                        <KeyRound className="h-4 w-4" />
                      </button>
                      <button type="button" title="Permanently delete trainee" aria-label={`Delete ${trainee.firstName} ${trainee.lastName}`} onClick={() => void deleteTrainee(trainee)} className="rounded p-2 text-red-700 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <form onSubmit={(event) => void saveTrainee(event)} className="w-full max-w-lg space-y-4 rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-2">
              <UserRound className="h-5 w-5 text-[#155EEF]" />
              <h3 className="text-lg font-bold text-gray-900">Edit trainee account</h3>
            </div>
            <p className="text-xs text-gray-500">Updates are reflected in the trainee’s account and application contact details.</p>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs font-semibold text-gray-700">First name
                <input required maxLength={80} value={editing.firstName} onChange={(event) => setEditing({ ...editing, firstName: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm" />
              </label>
              <label className="text-xs font-semibold text-gray-700">Last name
                <input required maxLength={80} value={editing.lastName} onChange={(event) => setEditing({ ...editing, lastName: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm" />
              </label>
            </div>
            <label className="block text-xs font-semibold text-gray-700">Email
              <input required type="email" maxLength={254} value={editing.email} onChange={(event) => setEditing({ ...editing, email: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm" />
            </label>
            <label className="block text-xs font-semibold text-gray-700">Phone
              <input type="tel" value={editing.phone} onChange={(event) => setEditing({ ...editing, phone: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm" />
            </label>
            <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
              <button type="button" disabled={saving} onClick={() => setEditing(null)} className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100">Cancel</button>
              <button type="submit" disabled={saving} className="rounded-lg bg-[#155EEF] px-4 py-2 text-sm font-bold text-white disabled:opacity-50">{saving ? 'Saving…' : 'Save details'}</button>
            </div>
          </form>
        </div>
      )}

      {passportUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setPassportUrl('')}>
          <div role="dialog" aria-modal="true" aria-label="Trainee passport photograph" className="max-h-[90vh] max-w-lg rounded-2xl bg-white p-4" onClick={(event) => event.stopPropagation()}>
            <img src={passportUrl} alt="Trainee passport photograph" className="max-h-[78vh] max-w-full rounded-lg object-contain" />
            <button type="button" onClick={() => setPassportUrl('')} className="mt-3 w-full rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Close</button>
          </div>
        </div>
      )}
    </section>
  );
};
