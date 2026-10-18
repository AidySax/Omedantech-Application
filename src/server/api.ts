import crypto from 'crypto';
import { Router, Response } from 'express';
import { db, createPasswordRecord, verifyPassword } from './db';
import { authenticate, requireAdmin, generateToken, AuthenticatedRequest } from './auth';
import { ApplicationStatus, AttendanceStatus, PerformanceCategory, StaffPosition } from '../types';

export const apiRouter = Router();

const staffPositions: StaffPosition[] = [
  'Managing Director',
  'Full-Stack Developer',
  'UI/UX Designer',
  'Front Desk',
  'Junior Developer',
  'Project Manager',
];

function staffCanManageProgram(user: NonNullable<AuthenticatedRequest['user']>, programId: string) {
  return user.role === 'admin' || (
    user.role === 'staff' && (user.assignedProgramIds || []).includes(programId)
  );
}

// ================= AUTHENTICATION =================

apiRouter.post('/auth/register', (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, termsAccepted } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'Please provide all required fields.' });
    }

    if (!termsAccepted) {
      return res.status(400).json({ error: 'You must accept the Terms and Conditions to proceed.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters in length.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    const existing = db.getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email address already exists. Please log in.' });
    }

    const { salt, passwordHash } = createPasswordRecord(password);
    const userId = 'usr-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);

    const newUser = {
      id: userId,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: (phone || '').trim(),
      role: 'trainee' as const,
      isEmailVerified: true, // Auto-verified for seamless demonstration or can be toggled
      createdAt: new Date().toISOString(),
      salt,
      passwordHash,
    };

    db.addUser(newUser);
    db.logAction('USER_REGISTERED', `New trainee registered: ${newUser.email}`, newUser.id);

    const token = generateToken(newUser);
    const { salt: _s, passwordHash: _p, ...safeUser } = newUser;

    res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: safeUser,
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal server error during registration.' });
  }
});

apiRouter.post('/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password credentials.' });
    }

    const isValid = verifyPassword(password, user.passwordHash, user.salt);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password credentials.' });
    }

    db.logAction('USER_LOGIN', `User signed in: ${user.email}`, user.id);
    const token = generateToken(user);
    const { salt: _s, passwordHash: _p, ...safeUser } = user;

    res.json({
      message: 'Logged in successfully.',
      token,
      user: safeUser,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error during authentication.' });
  }
});

apiRouter.get('/auth/me', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const { salt: _s, passwordHash: _p, ...safeUser } = req.user as any;
  res.json({ user: safeUser });
});

apiRouter.post('/auth/change-password', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters.' });
  }

  const user = db.getUserById(req.user!.id);
  if (!user || !verifyPassword(currentPassword, (user as any).passwordHash, (user as any).salt)) {
    return res.status(400).json({ error: 'Current password does not match.' });
  }

  db.updatePassword(user.id, newPassword);
  db.logAction('PASSWORD_CHANGED', `User updated password: ${user.email}`, user.id);
  res.json({ message: 'Password updated successfully.' });
});

apiRouter.post('/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required.' });

  const user = db.getUserByEmail(email);
  if (user) {
    db.logAction('PASSWORD_RESET_REQUEST', `Reset requested for ${email}`);
  }
  // Return consistent message for security
  res.json({ message: 'If an account exists with this email, a password reset link has been dispatched.' });
});

// ================= STAFF & TRAINEE OPERATIONS =================

apiRouter.get('/admin/staff', authenticate, requireAdmin, (_req, res) => {
  res.json(db.getStaffUsers().map(({ passwordHash: _hash, salt: _salt, ...user }) => user));
});

apiRouter.post('/admin/staff', authenticate, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { firstName, lastName, email, phone, position, assignedProgramIds, password } = req.body;
  if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !password) {
    return res.status(400).json({ error: 'First name, last name, email, and an initial password are required.' });
  }
  if (!staffPositions.includes(position)) {
    return res.status(400).json({ error: 'Select a valid staff position.' });
  }
  if (typeof password !== 'string' || password.length < 12) {
    return res.status(400).json({ error: 'Staff passwords must contain at least 12 characters.' });
  }
  const normalizedEmail = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return res.status(400).json({ error: 'Enter a valid staff email address.' });
  }
  if (db.getUserByEmail(normalizedEmail)) {
    return res.status(409).json({ error: 'An account with this email address already exists.' });
  }
  if (assignedProgramIds !== undefined && !Array.isArray(assignedProgramIds)) {
    return res.status(400).json({ error: 'Assigned programs must be provided as a list.' });
  }
  const programIds = Array.isArray(assignedProgramIds) ? [...new Set(assignedProgramIds)] : [];
  if (programIds.some((id) => typeof id !== 'string' || !db.getProgramById(id))) {
    return res.status(400).json({ error: 'One or more assigned programs do not exist.' });
  }
  const { salt, passwordHash } = createPasswordRecord(password);
  const staff = db.addUser({
    id: `usr-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: normalizedEmail,
    phone: (phone || '').trim(),
    role: 'staff',
    position,
    assignedProgramIds: programIds,
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
    salt,
    passwordHash,
  });
  db.logAction('STAFF_CREATED', `Staff account created for ${staff.email} (${position})`, req.user!.id);
  const { salt: _salt, passwordHash: _hash, ...safeStaff } = staff;
  res.status(201).json(safeStaff);
});

apiRouter.get('/admin/class-records', authenticate, requireAdmin, (_req, res) => {
  const trainees = new Map(
    db.getUsers()
      .filter((user) => user.role === 'trainee')
      .map((user) => [user.id, `${user.firstName} ${user.lastName}`.trim()])
  );
  const programs = new Map(db.getPrograms().map((program) => [program.id, program.title]));
  res.json({
    attendance: db.getAttendanceRecords().map((record) => ({
      ...record,
      traineeName: trainees.get(record.traineeId) || 'Unknown trainee',
      programTitle: programs.get(record.programId) || 'Unknown program',
    })),
    performance: db.getPerformanceRecords().map((record) => ({
      ...record,
      traineeName: trainees.get(record.traineeId) || 'Unknown trainee',
      programTitle: programs.get(record.programId) || 'Unknown program',
    })),
  });
});

apiRouter.put('/admin/staff/:id', authenticate, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const staff = db.getUserById(req.params.id);
  if (!staff || staff.role !== 'staff') return res.status(404).json({ error: 'Staff account not found.' });
  const { position, assignedProgramIds } = req.body;
  if (position !== undefined && !staffPositions.includes(position)) {
    return res.status(400).json({ error: 'Select a valid staff position.' });
  }
  const programIds = assignedProgramIds === undefined
    ? staff.assignedProgramIds || []
    : Array.isArray(assignedProgramIds) ? [...new Set(assignedProgramIds)] : null;
  if (!programIds || programIds.some((id) => typeof id !== 'string' || !db.getProgramById(id))) {
    return res.status(400).json({ error: 'One or more assigned programs do not exist.' });
  }
  const updated = db.updateUser(staff.id, {
    ...(position !== undefined ? { position } : {}),
    assignedProgramIds: programIds,
  });
  db.logAction('STAFF_UPDATED', `Staff assignments updated for ${staff.email}`, req.user!.id);
  const { salt: _salt, passwordHash: _hash, ...safeStaff } = updated!;
  res.json(safeStaff);
});

apiRouter.get('/staff/programs', authenticate, (req: AuthenticatedRequest, res: Response) => {
  if (req.user!.role !== 'staff') return res.status(403).json({ error: 'Staff access is required.' });
  const assignedIds = new Set(req.user!.assignedProgramIds || []);
  res.json(db.getPrograms().filter((program) => assignedIds.has(program.id)));
});

apiRouter.get('/staff/trainees', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const programId = typeof req.query.programId === 'string' ? req.query.programId : '';
  if (!programId || !staffCanManageProgram(req.user!, programId)) {
    return res.status(403).json({ error: 'You are not assigned to this program.' });
  }
  res.json(db.getEnrolledTrainees(programId));
});

apiRouter.get('/staff/records', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const programId = typeof req.query.programId === 'string' ? req.query.programId : '';
  if (!programId || !staffCanManageProgram(req.user!, programId)) {
    return res.status(403).json({ error: 'You are not assigned to this program.' });
  }
  res.json({
    attendance: db.getAttendanceRecords(programId),
    performance: db.getPerformanceRecords(programId),
  });
});

apiRouter.post('/staff/attendance', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const { traineeId, programId, date, status, notes = '' } = req.body;
  if (!programId || !staffCanManageProgram(req.user!, programId)) {
    return res.status(403).json({ error: 'You are not assigned to this program.' });
  }
  const validStatuses: AttendanceStatus[] = ['Present', 'Absent', 'Late', 'Excused'];
  if (!traineeId || !db.getEnrolledTrainees(programId).some((trainee) => trainee.id === traineeId)) {
    return res.status(400).json({ error: 'Choose a trainee enrolled in this program.' });
  }
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date))) {
    return res.status(400).json({ error: 'Enter a valid attendance date.' });
  }
  if (new Date(`${date}T00:00:00.000Z`).toISOString().slice(0, 10) !== date) {
    return res.status(400).json({ error: 'Enter a valid attendance date.' });
  }
  if (!validStatuses.includes(status)) return res.status(400).json({ error: 'Select a valid attendance status.' });
  const record = db.addAttendanceRecord({
    id: `att-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
    traineeId,
    programId,
    date,
    status,
    notes: typeof notes === 'string' ? notes.trim() : '',
    recordedBy: req.user!.id,
    createdAt: new Date().toISOString(),
  });
  db.logAction('ATTENDANCE_RECORDED', `Attendance recorded for trainee ${traineeId} in ${programId}`, req.user!.id);
  res.status(201).json(record);
});

apiRouter.post('/staff/performance', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const { traineeId, programId, category, title, details = '', score } = req.body;
  if (!programId || !staffCanManageProgram(req.user!, programId)) {
    return res.status(403).json({ error: 'You are not assigned to this program.' });
  }
  const categories: PerformanceCategory[] = ['Task handled', 'Assignment', 'Class contribution'];
  if (!traineeId || !db.getEnrolledTrainees(programId).some((trainee) => trainee.id === traineeId)) {
    return res.status(400).json({ error: 'Choose a trainee enrolled in this program.' });
  }
  if (!categories.includes(category) || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'Select a performance category and enter a title.' });
  }
  if (score !== undefined && (!Number.isFinite(score) || score < 0 || score > 100)) {
    return res.status(400).json({ error: 'Score must be a number from 0 to 100.' });
  }
  const record = db.addPerformanceRecord({
    id: `perf-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
    traineeId,
    programId,
    category,
    title: title.trim(),
    details: typeof details === 'string' ? details.trim() : '',
    ...(score !== undefined ? { score: Number(score) } : {}),
    recordedBy: req.user!.id,
    createdAt: new Date().toISOString(),
  });
  db.logAction('PERFORMANCE_RECORDED', `${category} recorded for trainee ${traineeId} in ${programId}`, req.user!.id);
  res.status(201).json(record);
});

// ================= SITE SETTINGS =================

apiRouter.get('/settings', (_req, res) => {
  res.json(db.getSiteSettings());
});

apiRouter.put('/settings', authenticate, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const updated = db.updateSiteSettings(req.body);
  db.logAction('SETTINGS_UPDATED', 'Site settings were modified by administrator', req.user!.id);
  res.json(updated);
});

// ================= SERVICES =================

apiRouter.get('/services', (_req, res) => {
  res.json(db.getServices());
});

apiRouter.get('/services/:slug', (req, res) => {
  const service = db.getServiceBySlug(req.params.slug);
  if (!service) return res.status(404).json({ error: 'Service not found.' });
  res.json(service);
});

apiRouter.put('/services/:id', authenticate, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const updated = db.updateService(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Service not found.' });
  db.logAction('SERVICE_UPDATED', `Service updated: ${updated.title}`, req.user!.id);
  res.json(updated);
});

// ================= TEAM MEMBERS =================

apiRouter.get('/team', (_req, res) => {
  res.json(db.getTeamMembers());
});

apiRouter.post('/team', authenticate, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { name, position, professionalTitle, description, photoUrl, socialLinks } = req.body;
  if (
    typeof name !== 'string' || !name.trim() ||
    typeof position !== 'string' || !position.trim() ||
    typeof professionalTitle !== 'string' || !professionalTitle.trim()
  ) {
    return res.status(400).json({ error: 'Name, position, and professional title are required.' });
  }
  if (typeof description !== 'string' || !description.trim()) {
    return res.status(400).json({ error: 'A team member description is required.' });
  }
  if (photoUrl !== undefined && typeof photoUrl !== 'string') {
    return res.status(400).json({ error: 'Portrait URL must be text.' });
  }
  const teamMembers = db.getTeamMembers();
  const member = db.addTeamMember({
    id: `tm-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
    name: name.trim(),
    position: position.trim(),
    professionalTitle: professionalTitle.trim(),
    description: description.trim(),
    photoUrl: (photoUrl || '').trim(),
    ...(socialLinks && typeof socialLinks === 'object' ? { socialLinks } : {}),
    order: teamMembers.reduce((highest, current) => Math.max(highest, current.order), 0) + 1,
  });
  db.logAction('TEAM_CREATED', `Team member added: ${member.name}`, req.user!.id);
  res.status(201).json(member);
});

apiRouter.put('/team/:id', authenticate, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const updated = db.updateTeamMember(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Team member not found.' });
  db.logAction('TEAM_UPDATED', `Team member updated: ${updated.name}`, req.user!.id);
  res.json(updated);
});

// ================= TRAINEE SHOWCASE =================

apiRouter.get('/trainees', (req, res) => {
  const all = req.query.all === 'true';
  res.json(db.getTrainees(!all));
});

apiRouter.post('/trainees', authenticate, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { name, programInterest, learningGoal, photoUrl, cohort, isApproved } = req.body;
  if (!name || !programInterest) {
    return res.status(400).json({ error: 'Name and program interest are required.' });
  }

  const trainee = db.addTrainee({
    id: 'tr-' + Date.now(),
    name: name.trim(),
    programInterest: programInterest.trim(),
    learningGoal: (learningGoal || '').trim(),
    photoUrl: photoUrl || '',
    cohort: cohort || 'Cohort 2026',
    isApproved: isApproved !== undefined ? isApproved : true,
  });

  db.logAction('TRAINEE_ADDED', `New trainee spotlight created: ${trainee.name}`, req.user!.id);
  res.status(201).json(trainee);
});

apiRouter.put('/trainees/:id', authenticate, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const updated = db.updateTrainee(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Trainee profile not found.' });
  db.logAction('TRAINEE_UPDATED', `Trainee profile updated: ${updated.name}`, req.user!.id);
  res.json(updated);
});

apiRouter.delete('/trainees/:id', authenticate, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  db.deleteTrainee(req.params.id);
  db.logAction('TRAINEE_DELETED', `Trainee profile removed ID: ${req.params.id}`, req.user!.id);
  res.json({ message: 'Trainee removed successfully.' });
});

// ================= TRAINING PROGRAMS =================

apiRouter.get('/programs', (_req, res) => {
  res.json(db.getPrograms());
});

apiRouter.get('/programs/:slug', (req, res) => {
  const program = db.getProgramBySlug(req.params.slug) || db.getProgramById(req.params.slug);
  if (!program) return res.status(404).json({ error: 'Training program not found.' });
  res.json(program);
});

apiRouter.post('/programs', authenticate, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { title, slug, category, format, duration, startDate, applicationDeadline, prerequisites, description, curriculum, status } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: 'Program title and description are required.' });
  }

  const programSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const newProgram = db.addProgram({
    id: 'prog-' + Date.now(),
    title,
    slug: programSlug,
    category: category || 'Software Engineering',
    format: format || 'Hybrid',
    duration: duration || '8 Weeks',
    startDate: startDate || 'To be confirmed',
    applicationDeadline: applicationDeadline || 'Open Enrollment',
    prerequisites: prerequisites || 'Open to dedicated beginners and practitioners.',
    description,
    curriculum: Array.isArray(curriculum) ? curriculum : [],
    status: status || 'Open',
  });

  db.logAction('PROGRAM_CREATED', `Training program created: ${newProgram.title}`, req.user!.id);
  res.status(201).json(newProgram);
});

apiRouter.put('/programs/:id', authenticate, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const updated = db.updateProgram(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Program not found.' });
  db.logAction('PROGRAM_UPDATED', `Training program updated: ${updated.title}`, req.user!.id);
  res.json(updated);
});

apiRouter.delete('/programs/:id', authenticate, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  db.deleteProgram(req.params.id);
  db.logAction('PROGRAM_DELETED', `Training program deleted ID: ${req.params.id}`, req.user!.id);
  res.json({ message: 'Program deleted successfully.' });
});

// ================= TRAINING APPLICATIONS =================

// Trainee view of own applications
apiRouter.get('/applications/my', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const userApps = db.getApplications(req.user!.id);
  res.json(userApps);
});

// View single application (owner or admin)
apiRouter.get('/applications/:id', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const app = db.getApplicationById(req.params.id);
  if (!app) return res.status(404).json({ error: 'Application not found.' });

  if (app.userId !== req.user!.id && req.user!.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied to this application record.' });
  }

  const history = db.getStatusHistory(app.id);
  res.json({ application: app, history });
});

// SUBMIT APPLICATION (MANDATORY AUTHENTICATION ENFORCED SERVER-SIDE)
apiRouter.post('/applications', authenticate, (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    if (user.role !== 'trainee') {
      return res.status(403).json({ error: 'Only trainee accounts can submit training applications.' });
    }
    const {
      programId,
      educationLevel,
      experienceLevel,
      reasonForApplying,
      learningGoals,
      availability,
      screeningAnswers,
      declarationAccepted,
    } = req.body;

    if (!programId) {
      return res.status(400).json({ error: 'Program ID is required.' });
    }

    const program = db.getProgramById(programId) || db.getProgramBySlug(programId);
    if (!program) {
      return res.status(404).json({ error: 'Selected training program does not exist.' });
    }

    if (program.status !== 'Open') {
      return res.status(400).json({ error: `Applications for ${program.title} are currently ${program.status.toLowerCase()}.` });
    }

    // Check duplicate
    if (db.hasUserApplied(user.id, program.id)) {
      return res.status(409).json({
        error: 'You have already submitted an active application for this training program. View your dashboard for status updates.',
      });
    }

    if (!reasonForApplying || !learningGoals) {
      return res.status(400).json({ error: 'Please provide your reason for applying and your learning goals.' });
    }

    if (!declarationAccepted) {
      return res.status(400).json({ error: 'You must certify the accuracy of your application information.' });
    }

    // Generate reference number: OMD-TRN-2026-XXXXX
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const referenceNo = `OMD-TRN-2026-${randomDigits}`;

    const newApplication = db.addApplication({
      id: 'app-' + Date.now(),
      referenceNo,
      userId: user.id,
      userEmail: user.email,
      applicantName: `${user.firstName} ${user.lastName}`.trim(),
      applicantPhone: user.phone || '',
      programId: program.id,
      programTitle: program.title,
      programSlug: program.slug,
      educationLevel: educationLevel || 'Not Specified',
      experienceLevel: experienceLevel || 'Beginner',
      reasonForApplying: reasonForApplying.trim(),
      learningGoals: learningGoals.trim(),
      availability: availability || 'Flexible',
      screeningAnswers: screeningAnswers || {
        priorCodingExperience: 'None',
        weeklyHoursCommitment: '10+ hours',
        hasPersonalLaptop: 'Yes',
      },
      declarationAccepted: true,
      status: 'Submitted',
      submissionDate: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    db.logAction(
      'APPLICATION_SUBMITTED',
      `Application ${referenceNo} submitted by ${user.email} for ${program.title}`,
      user.id
    );

    res.status(201).json({
      message: 'Application submitted successfully!',
      application: newApplication,
    });
  } catch (err) {
    console.error('Application submission error:', err);
    res.status(500).json({ error: 'Failed to record application. Please try again.' });
  }
});

// Trainee withdraws application
apiRouter.post('/applications/:id/withdraw', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const app = db.getApplicationById(req.params.id);
  if (!app) return res.status(404).json({ error: 'Application not found.' });

  if (app.userId !== req.user!.id && req.user!.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized.' });
  }

  const updated = db.updateApplication(app.id, { status: 'Withdrawn' }, req.user!.email, 'Withdrawn by applicant.');
  res.json({ message: 'Application has been withdrawn.', application: updated });
});

// ================= ADMIN APPLICATION MANAGEMENT =================

apiRouter.get('/admin/applications', authenticate, requireAdmin, (req, res) => {
  const { status, programId, search } = req.query;
  let apps = db.getApplications();

  if (status && typeof status === 'string' && status !== 'all') {
    apps = apps.filter((a) => a.status.toLowerCase() === status.toLowerCase());
  }

  if (programId && typeof programId === 'string' && programId !== 'all') {
    apps = apps.filter((a) => a.programId === programId || a.programSlug === programId);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    apps = apps.filter(
      (a) =>
        a.referenceNo.toLowerCase().includes(q) ||
        a.applicantName.toLowerCase().includes(q) ||
        a.userEmail.toLowerCase().includes(q) ||
        a.programTitle.toLowerCase().includes(q)
    );
  }

  res.json(apps);
});

apiRouter.put('/admin/applications/:id/status', authenticate, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { status, reviewerNotes } = req.body;
  if (!status) return res.status(400).json({ error: 'Status is required.' });

  const validStatuses: ApplicationStatus[] = [
    'Draft',
    'Submitted',
    'Under Review',
    'Shortlisted',
    'Accepted',
    'Rejected',
    'Withdrawn',
  ];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid application status value.' });
  }

  const app = db.getApplicationById(req.params.id);
  if (!app) return res.status(404).json({ error: 'Application not found.' });

  const updated = db.updateApplication(
    app.id,
    {
      status,
      reviewerNotes: reviewerNotes !== undefined ? reviewerNotes : app.reviewerNotes,
      reviewedBy: `${req.user!.firstName} ${req.user!.lastName}`.trim(),
    },
    req.user!.email,
    reviewerNotes || `Status updated to ${status}`
  );

  db.logAction(
    'APPLICATION_STATUS_UPDATED',
    `Application ${app.referenceNo} status changed to ${status} by admin`,
    req.user!.id
  );

  res.json(updated);
});

// CSV Export
apiRouter.get('/admin/applications/export-csv', authenticate, requireAdmin, (_req, res) => {
  const apps = db.getApplications();
  const headers = [
    'Reference No',
    'Applicant Name',
    'Email',
    'Phone',
    'Program',
    'Status',
    'Education',
    'Experience',
    'Submission Date',
  ];

  const rows = apps.map((a) => [
    `"${a.referenceNo}"`,
    `"${a.applicantName.replace(/"/g, '""')}"`,
    `"${a.userEmail}"`,
    `"${a.applicantPhone}"`,
    `"${a.programTitle.replace(/"/g, '""')}"`,
    `"${a.status}"`,
    `"${a.educationLevel.replace(/"/g, '""')}"`,
    `"${a.experienceLevel.replace(/"/g, '""')}"`,
    `"${new Date(a.submissionDate).toLocaleDateString()}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="omedantech-applications-${Date.now()}.csv"`);
  res.send(csvContent);
});

// ================= CONTACT INQUIRIES =================

apiRouter.post('/contact', (req, res) => {
  const { name, email, phone, category, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  const saved = db.addContactMessage({
    name: name.trim(),
    email: email.trim(),
    phone: (phone || '').trim(),
    category: category || 'General Inquiry',
    message: message.trim(),
  });

  db.logAction('CONTACT_RECEIVED', `Inquiry received from ${name} (${email})`);
  res.status(201).json({ message: 'Thank you for reaching out! The OmedanTech team will contact you shortly.', id: saved.id });
});

apiRouter.get('/admin/contact-messages', authenticate, requireAdmin, (_req, res) => {
  res.json(db.getContactMessages());
});

apiRouter.put('/admin/contact-messages/:id', authenticate, requireAdmin, (req, res) => {
  const updated = db.updateContactMessage(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Message not found.' });
  res.json(updated);
});

// ================= STATS & AUDIT LOGS =================

apiRouter.get('/stats', (_req, res) => {
  res.json(db.getStats());
});

apiRouter.get('/admin/audit-logs', authenticate, requireAdmin, (_req, res) => {
  res.json(db.getAuditLogs());
});
