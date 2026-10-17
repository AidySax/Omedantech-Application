import React, { useEffect, useState } from 'react';
import { Plus, Save, Users } from 'lucide-react';
import { StaffPosition, TrainingProgram, User } from '../../types';

const positions: StaffPosition[] = [
  'Managing Director',
  'Full-Stack Developer',
  'UI/UX Designer',
  'Front Desk',
  'Junior Developer',
  'Project Manager',
];

type StaffUser = User & { position: StaffPosition };

export const AdminStaffManagement: React.FC<{ token: string | null }> = ({ token }) => {
  const [staff, setStaff] = useState<StaffUser[]>([]);
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: positions[0],
    password: '',
    assignedProgramIds: [] as string[],
  });
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (!token) return;
    try {
      const [staffResponse, programsResponse] = await Promise.all([
        fetch('/api/admin/staff', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/programs'),
      ]);
      const staffData = await staffResponse.json();
      const programData = await programsResponse.json();
      if (!staffResponse.ok) throw new Error(staffData.error || 'Unable to load staff accounts.');
      if (!programsResponse.ok) throw new Error(programData.error || 'Unable to load training programs.');
      setStaff(staffData);
      setPrograms(programData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load staff management data.');
    }
  };

  useEffect(() => {
    void load();
  }, [token]);

  const toggleProgram = (programId: string) => {
    setForm((current) => ({
      ...current,
      assignedProgramIds: current.assignedProgramIds.includes(programId)
        ? current.assignedProgramIds.filter((id) => id !== programId)
        : [...current.assignedProgramIds, programId],
    }));
  };

  const createStaff = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token) return;
    setError('');
    setNotice('');
    setLoading(true);
    try {
      const response = await fetch('/api/admin/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to create the staff account.');
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        position: positions[0],
        password: '',
        assignedProgramIds: [],
      });
      setNotice(`Staff account created for ${data.email}.`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create staff account.');
    } finally {
      setLoading(false);
    }
  };

  const saveStaff = async (member: StaffUser) => {
    if (!token) return;
    setError('');
    setNotice('');
    try {
      const response = await fetch(`/api/admin/staff/${member.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          position: member.position,
          assignedProgramIds: member.assignedProgramIds || [],
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to update staff assignments.');
      setStaff((current) => current.map((entry) => entry.id === data.id ? data : entry));
      setNotice(`Assignments saved for ${member.email}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update staff assignments.');
    }
  };

  return (
    <section className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-[#D0D5DD] space-y-4">
        <div>
          <h3 className="text-base font-bold text-[#101828]">Create a staff login</h3>
          <p className="text-xs text-gray-500 mt-1">
            Staff accounts are private. Assign each staff member the programs they are responsible for.
          </p>
        </div>
        {error && <p role="alert" className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</p>}
        {notice && <p role="status" className="rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-700">{notice}</p>}
        <form onSubmit={createStaff} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <input required aria-label="First name" placeholder="First name" value={form.firstName} onChange={(event) => setForm({ ...form, firstName: event.target.value })} className="rounded-lg border border-gray-300 p-2.5 text-sm" />
            <input required aria-label="Last name" placeholder="Last name" value={form.lastName} onChange={(event) => setForm({ ...form, lastName: event.target.value })} className="rounded-lg border border-gray-300 p-2.5 text-sm" />
            <input required type="email" aria-label="Staff email" placeholder="Work email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="rounded-lg border border-gray-300 p-2.5 text-sm" />
            <input aria-label="Phone number" placeholder="Phone (optional)" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} className="rounded-lg border border-gray-300 p-2.5 text-sm" />
            <select aria-label="Staff position" value={form.position} onChange={(event) => setForm({ ...form, position: event.target.value as StaffPosition })} className="rounded-lg border border-gray-300 bg-white p-2.5 text-sm">
              {positions.map((position) => <option key={position}>{position}</option>)}
            </select>
            <input required type="password" minLength={12} aria-label="Initial password" placeholder="Initial password (12+ characters)" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="rounded-lg border border-gray-300 p-2.5 text-sm" />
          </div>
          <fieldset>
            <legend className="text-xs font-semibold text-gray-700 mb-2">Assigned programs</legend>
            {programs.length === 0 ? (
              <p className="text-xs text-gray-500">Create a training program before assigning staff.</p>
            ) : (
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {programs.map((program) => (
                  <label key={program.id} className="inline-flex items-center gap-2 text-xs text-gray-700">
                    <input type="checkbox" checked={form.assignedProgramIds.includes(program.id)} onChange={() => toggleProgram(program.id)} />
                    {program.title}
                  </label>
                ))}
              </div>
            )}
          </fieldset>
          <button disabled={loading} className="inline-flex items-center gap-2 rounded-lg bg-[#155EEF] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60">
            <Plus className="h-4 w-4" /> {loading ? 'Creating…' : 'Create staff account'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-[#D0D5DD] space-y-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-[#155EEF]" />
          <h3 className="text-base font-bold text-[#101828]">Staff and program access</h3>
        </div>
        {staff.length === 0 ? <p className="text-sm text-gray-500">No staff accounts have been created yet.</p> : (
          <div className="space-y-3">
            {staff.map((member) => (
              <div key={member.id} className="rounded-xl border border-gray-200 p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{member.firstName} {member.lastName}</p>
                    <p className="text-xs text-gray-500">{member.email}</p>
                  </div>
                  <select aria-label={`Position for ${member.email}`} value={member.position || positions[0]} onChange={(event) => setStaff((current) => current.map((entry) => entry.id === member.id ? { ...entry, position: event.target.value as StaffPosition } : entry))} className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs">
                    {positions.map((position) => <option key={position}>{position}</option>)}
                  </select>
                </div>
                <div className="flex flex-wrap gap-x-5 gap-y-2">
                  {programs.map((program) => (
                    <label key={program.id} className="inline-flex items-center gap-2 text-xs text-gray-700">
                      <input
                        type="checkbox"
                        checked={(member.assignedProgramIds || []).includes(program.id)}
                        onChange={() => setStaff((current) => current.map((entry) => {
                          if (entry.id !== member.id) return entry;
                          const ids = entry.assignedProgramIds || [];
                          return { ...entry, assignedProgramIds: ids.includes(program.id) ? ids.filter((id) => id !== program.id) : [...ids, program.id] };
                        }))}
                      />
                      {program.title}
                    </label>
                  ))}
                </div>
                <div className="flex justify-end">
                  <button onClick={() => void saveStaff(member)} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50">
                    <Save className="h-3.5 w-3.5" /> Save access
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
