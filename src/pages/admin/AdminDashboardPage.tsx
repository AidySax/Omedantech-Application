import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  FileText,
  Clock,
  BookOpen,
  Search,
  Download,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Trash2,
  Plus,
  ShieldAlert,
  ArrowLeft,
  Mail,
  History,
  Check,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  Application,
  ApplicationStatus,
  DashboardStats,
  TrainingProgram,
  TeamMember,
  TraineeShowcase,
  ContactMessage,
} from '../../types';
import { AdminStaffManagement } from './AdminStaffManagement';
import { AdminClassRecords } from './AdminClassRecords';
import { AdminTraineeAccounts } from './AdminTraineeAccounts';
import { TrainingAssignmentManager } from '../../components/training/TrainingAssignmentManager';

type ExportFormat = 'csv' | 'excel' | 'pdf';

const applicationExportHeaders = [
  'Reference No',
  'Applicant Name',
  'Email',
  'Phone',
  'Program',
  'Status',
  'Education',
  'Experience',
  'Submission Date',
  'Reviewer Notes',
];

function getApplicationExportRows(applications: Application[]) {
  return applications.map((application) => [
    application.referenceNo,
    application.applicantName,
    application.userEmail,
    application.applicantPhone,
    application.programTitle,
    application.status,
    application.educationLevel,
    application.experienceLevel,
    new Date(application.submissionDate).toLocaleDateString(),
    application.reviewerNotes || '',
  ].map((value) => {
    const text = String(value ?? '');
    return /^[\s]*[=+\-@\t\r]/.test(text) ? `'${text}` : text;
  }));
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function getExcelColumnName(index: number) {
  let value = index + 1;
  let name = '';
  while (value > 0) {
    const remainder = (value - 1) % 26;
    name = String.fromCharCode(65 + remainder) + name;
    value = Math.floor((value - 1) / 26);
  }
  return name;
}

export const AdminDashboardPage: React.FC = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<
    'applications' | 'programs' | 'team' | 'trainees' | 'messages' | 'audit' | 'staff' | 'class-records' | 'training' | 'trainee-accounts'
  >('applications');

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [trainees, setTrainees] = useState<TraineeShowcase[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Filter state for applications
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('excel');
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState('');

  // Selected application for review modal
  const [reviewApp, setReviewApp] = useState<Application | null>(null);
  const [newStatus, setNewStatus] = useState<ApplicationStatus>('Under Review');
  const [reviewerNotes, setReviewerNotes] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [editingApplicantDetails, setEditingApplicantDetails] = useState(false);
  const [savingApplicantDetails, setSavingApplicantDetails] = useState(false);
  const [applicantDetailsError, setApplicantDetailsError] = useState('');

  // Edit Team Member Modal
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null);
  const [savingTeamMember, setSavingTeamMember] = useState(false);
  const [teamMemberError, setTeamMemberError] = useState('');

  // Add/Edit Trainee Modal
  const [editingTrainee, setEditingTrainee] = useState<Partial<TraineeShowcase> | null>(null);

  // Add/Edit Program Modal
  const [editingProgram, setEditingProgram] = useState<Partial<TrainingProgram> | null>(null);

  // Guard: Admin Check
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const fetchStats = () => {
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error(err));
  };

  const fetchApplications = () => {
    if (!token) return;
    const url = `/api/admin/applications?status=${statusFilter}&search=${encodeURIComponent(searchQuery)}`;
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setApplications(data);
      })
      .catch((err) => console.error(err));
  };

  const fetchPrograms = () => {
    fetch('/api/programs')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPrograms(data);
      });
  };

  const fetchTeam = () => {
    fetch('/api/team')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setTeamMembers(data);
      });
  };

  const fetchTrainees = () => {
    if (!token) return;
    fetch('/api/trainees?all=true', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setTrainees(data);
      });
  };

  const fetchMessages = () => {
    if (!token) return;
    fetch('/api/admin/contact-messages', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setMessages(data);
      });
  };

  const fetchAuditLogs = () => {
    if (!token) return;
    fetch('/api/admin/audit-logs', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAuditLogs(data);
      });
  };

  useEffect(() => {
    fetchStats();
    fetchApplications();
    fetchPrograms();
    fetchTeam();
    fetchTrainees();
    fetchMessages();
    fetchAuditLogs();
  }, [token, statusFilter, searchQuery]);

  // Review Application status update
  const handleUpdateAppStatus = async () => {
    if (!reviewApp || !token) return;
    setUpdatingStatus(true);

    try {
      const res = await fetch(`/api/admin/applications/${reviewApp.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
          reviewerNotes,
        }),
      });

      if (res.ok) {
        fetchApplications();
        fetchStats();
        setReviewApp(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSaveApplicantDetails = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!reviewApp || !token) return;
    setSavingApplicantDetails(true);
    setApplicantDetailsError('');
    try {
      const nameParts = reviewApp.applicantName.trim().split(/\s+/);
      const firstName = reviewApp.applicantFirstName || nameParts[0] || '';
      const lastName = reviewApp.applicantLastName || nameParts.slice(1).join(' ');
      const response = await fetch(`/api/admin/applications/${encodeURIComponent(reviewApp.id)}/details`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          firstName,
          lastName,
          email: reviewApp.userEmail,
          phone: reviewApp.applicantPhone || '',
          educationLevel: reviewApp.educationLevel,
          experienceLevel: reviewApp.experienceLevel,
          reasonForApplying: reviewApp.reasonForApplying,
          learningGoals: reviewApp.learningGoals,
          availability: reviewApp.availability,
          screeningAnswers: reviewApp.screeningAnswers,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to update applicant details.');
      setReviewApp(data);
      setApplications((current) => current.map((application) => application.id === data.id ? data : application));
      setEditingApplicantDetails(false);
    } catch (err) {
      setApplicantDetailsError(err instanceof Error ? err.message : 'Unable to update applicant details.');
    } finally {
      setSavingApplicantDetails(false);
    }
  };

  const handleExportApplications = async () => {
    if (!token) {
      setExportError('Your session has expired. Sign in again to export applications.');
      return;
    }

    setIsExporting(true);
    setExportError('');
    try {
      const query = new URLSearchParams({ status: statusFilter, search: searchQuery });
      const response = await fetch(`/api/admin/applications?${query.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Unable to export applications.');
      }
      if (!Array.isArray(data)) {
        throw new Error('The server returned an invalid applications export.');
      }

      const rows = getApplicationExportRows(data as Application[]);
      const filename = `omedantech-applications-${new Date().toISOString().slice(0, 10)}`;
      let file: Blob;
      let extension: string;

      if (exportFormat === 'csv') {
        const csv = [applicationExportHeaders, ...rows]
          .map((row) => row.map((value) => `"${value.replace(/"/g, '""')}"`).join(','))
          .join('\r\n');
        file = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' });
        extension = 'csv';
      } else if (exportFormat === 'excel') {
        const { strToU8, zipSync } = await import('fflate');
        const table = [applicationExportHeaders, ...rows];
        const columnCount = applicationExportHeaders.length;
        const lastColumn = getExcelColumnName(columnCount - 1);
        const sheetRows = table.map((row, rowIndex) => {
          const cells = row.map((value, columnIndex) => {
            const reference = `${getExcelColumnName(columnIndex)}${rowIndex + 1}`;
            return `<c r="${reference}" t="inlineStr"><is><t xml:space="preserve">${escapeXml(value)}</t></is></c>`;
          }).join('');
          return `<row r="${rowIndex + 1}">${cells}</row>`;
        }).join('');
        const columns = applicationExportHeaders.map((header, index) => {
          const width = Math.min(Math.max(header.length + 2, 14), 28);
          return `<col min="${index + 1}" max="${index + 1}" width="${width}" customWidth="1"/>`;
        }).join('');
        const xmlHeader = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
        const workbookFiles = {
          '[Content_Types].xml': strToU8(
            `${xmlHeader}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>`
          ),
          '_rels/.rels': strToU8(
            `${xmlHeader}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`
          ),
          'xl/workbook.xml': strToU8(
            `${xmlHeader}<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Applications" sheetId="1" r:id="rId1"/></sheets></workbook>`
          ),
          'xl/_rels/workbook.xml.rels': strToU8(
            `${xmlHeader}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>`
          ),
          'xl/worksheets/sheet1.xml': strToU8(
            `${xmlHeader}<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><dimension ref="A1:${lastColumn}${table.length}"/><sheetViews><sheetView workbookViewId="0"/></sheetViews><sheetFormatPr defaultRowHeight="15"/><cols>${columns}</cols><sheetData>${sheetRows}</sheetData><autoFilter ref="A1:${lastColumn}${table.length}"/><pageMargins left="0.7" right="0.7" top="0.75" bottom="0.75" header="0.3" footer="0.3"/></worksheet>`
          ),
        };
        const workbookData = zipSync(workbookFiles);
        file = new Blob([workbookData], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        extension = 'xlsx';
      } else {
        const [{ jsPDF }, { default: autoTable }] = await Promise.all([
          import('jspdf'),
          import('jspdf-autotable'),
        ]);
        const pdfDocument = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
        pdfDocument.setFontSize(16);
        pdfDocument.text('OmedanTech Applications', 36, 32);
        pdfDocument.setFontSize(9);
        pdfDocument.text(`Exported ${new Date().toLocaleString()} · ${rows.length} applications`, 36, 48);
        autoTable(pdfDocument, {
          head: [applicationExportHeaders],
          body: rows,
          startY: 62,
          styles: { fontSize: 7, cellPadding: 4, overflow: 'linebreak' },
          headStyles: { fillColor: [21, 94, 239] },
          horizontalPageBreak: true,
          horizontalPageBreakRepeat: [0, 1],
        });
        file = pdfDocument.output('blob');
        extension = 'pdf';
      }

      const downloadUrl = URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${filename}.${extension}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
    } catch (err) {
      setExportError(err instanceof Error ? err.message : 'Unable to export applications. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Update Team Member
  const handleSaveTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeamMember || !token) return;

    setSavingTeamMember(true);
    setTeamMemberError('');
    try {
      const isNew = !editingTeamMember.id;
      const res = await fetch(isNew ? '/api/team' : `/api/team/${editingTeamMember.id}`, {
        method: isNew ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingTeamMember),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unable to save the team member.');
      setTeamMembers((current) => {
        const updated = isNew
          ? [...current, data as TeamMember]
          : current.map((member) => member.id === data.id ? data as TeamMember : member);
        return updated.sort((first, second) => first.order - second.order);
      });
      setEditingTeamMember(null);
    } catch (err) {
      setTeamMemberError(err instanceof Error ? err.message : 'Unable to save the team member.');
    } finally {
      setSavingTeamMember(false);
    }
  };

  // Save Trainee (Create or Update)
  const handleSaveTrainee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTrainee || !token) return;

    try {
      const isNew = !editingTrainee.id;
      const url = isNew ? '/api/trainees' : `/api/trainees/${editingTrainee.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingTrainee),
      });

      if (res.ok) {
        fetchTrainees();
        setEditingTrainee(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTrainee = async (id: string) => {
    if (!confirm('Remove this trainee spotlight?')) return;
    try {
      await fetch(`/api/trainees/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTrainees();
    } catch (err) {
      console.error(err);
    }
  };

  // Save Program
  const handleSaveProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProgram || !token) return;

    try {
      const isNew = !editingProgram.id;
      const url = isNew ? '/api/programs' : `/api/programs/${editingProgram.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingProgram),
      });

      if (res.ok) {
        fetchPrograms();
        fetchStats();
        setEditingProgram(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#F5F8FF] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl border border-red-200 text-center max-w-sm">
          <ShieldAlert className="w-12 h-12 text-[#E63946] mx-auto mb-3" />
          <h2 className="text-lg font-bold text-gray-900">Access Denied</h2>
          <p className="text-xs text-gray-600 mt-2">Administrator privileges required to access this portal.</p>
          <Link to="/login" className="mt-4 inline-block px-4 py-2 text-xs font-bold text-white bg-[#155EEF] rounded-lg">
            Sign in as Admin
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F8FF] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#101828] text-white p-6 sm:p-8 rounded-2xl border border-[#155EEF]/30 shadow-md">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/60 text-[#E63946] border border-red-800 text-xs font-bold uppercase tracking-wider mb-2">
              Administrator Master Console
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">OmedanTech Admin Dashboard</h1>
            <p className="text-xs text-gray-400 mt-1">
              Signed in as: <strong className="text-white">{user.email}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-300 hover:text-white bg-white/10 hover:bg-white/15 rounded-lg border border-white/10 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Public Site</span>
            </Link>
            <button
              onClick={logout}
              className="px-3.5 py-2 text-xs font-semibold text-red-300 hover:text-white bg-red-900/40 hover:bg-red-800 rounded-lg border border-red-800 transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>

        {/* 4 Key Real Database Metric Cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-[#D0D5DD] shadow-2xs">
              <div className="flex items-center justify-between text-gray-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Trainees</span>
                <Users className="w-4 h-4 text-[#155EEF]" />
              </div>
              <div className="text-2xl font-extrabold text-[#101828] font-mono tabular-nums">
                {stats.totalUsers}
              </div>
              <span className="text-[11px] text-gray-400">Trainee accounts</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#D0D5DD] shadow-2xs">
              <div className="flex items-center justify-between text-gray-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Applications</span>
                <FileText className="w-4 h-4 text-[#E63946]" />
              </div>
              <div className="text-2xl font-extrabold text-[#101828] font-mono tabular-nums">
                {stats.totalApplications}
              </div>
              <span className="text-[11px] text-gray-400">Recorded submissions</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#D0D5DD] shadow-2xs">
              <div className="flex items-center justify-between text-gray-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Awaiting Review</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-extrabold text-amber-600 font-mono tabular-nums">
                {stats.awaitingReview}
              </div>
              <span className="text-[11px] text-gray-400">Pending review action</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#D0D5DD] shadow-2xs">
              <div className="flex items-center justify-between text-gray-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Active Programs</span>
                <BookOpen className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-extrabold text-emerald-600 font-mono tabular-nums">
                {stats.openPrograms}
              </div>
              <span className="text-[11px] text-gray-400">Open for enrollment</span>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white p-1 rounded-xl border border-[#D0D5DD] flex flex-wrap gap-1">
          <button
            onClick={() => setActiveTab('applications')}
            className={`py-2 px-4 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'applications'
                ? 'bg-[#155EEF] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Applications ({applications.length})
          </button>
          <button
            onClick={() => setActiveTab('programs')}
            className={`py-2 px-4 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'programs'
                ? 'bg-[#155EEF] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Training Programs ({programs.length})
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`py-2 px-4 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'team'
                ? 'bg-[#155EEF] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Management Team ({teamMembers.length})
          </button>
          <button
            onClick={() => setActiveTab('trainees')}
            className={`py-2 px-4 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'trainees'
                ? 'bg-[#155EEF] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Trainee Showcase ({trainees.length})
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`py-2 px-4 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'messages'
                ? 'bg-[#155EEF] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Contact Messages ({messages.length})
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`py-2 px-4 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'audit'
                ? 'bg-[#155EEF] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Audit Logs
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            className={`py-2 px-4 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'staff'
                ? 'bg-[#155EEF] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Staff & Access
          </button>
          <button
            onClick={() => setActiveTab('class-records')}
            className={`py-2 px-4 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'class-records'
                ? 'bg-[#155EEF] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Class Records
          </button>
          <button
            onClick={() => setActiveTab('training')}
            className={`py-2 px-4 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'training'
                ? 'bg-[#155EEF] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Training Progress
          </button>
          <button
            onClick={() => setActiveTab('trainee-accounts')}
            className={`py-2 px-4 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'trainee-accounts'
                ? 'bg-[#155EEF] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Trainee Accounts
          </button>
        </div>

        {activeTab === 'staff' && <AdminStaffManagement token={token} />}
        {activeTab === 'class-records' && <AdminClassRecords token={token} />}
        {activeTab === 'training' && <TrainingAssignmentManager token={token} role="admin" />}
        {activeTab === 'trainee-accounts' && <AdminTraineeAccounts token={token} />}

        {/* TAB 1: APPLICATIONS */}
        {activeTab === 'applications' && (
          <div className="bg-white rounded-2xl p-6 border border-[#D0D5DD] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search reference, applicant or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchApplications()}
                    className="pl-9 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg w-64"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="py-1.5 px-3 text-xs border border-gray-300 rounded-lg bg-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Withdrawn">Withdrawn</option>
                </select>

                <button
                  onClick={fetchApplications}
                  className="py-1.5 px-3 text-xs font-semibold text-white bg-[#155EEF] rounded-lg"
                >
                  Filter
                </button>
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="application-export-format" className="sr-only">Export format</label>
                <select
                  id="application-export-format"
                  value={exportFormat}
                  onChange={(event) => setExportFormat(event.target.value as ExportFormat)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700"
                >
                  <option value="excel">Excel (.xlsx)</option>
                  <option value="pdf">PDF (.pdf)</option>
                  <option value="csv">CSV (.csv)</option>
                </select>
                <button
                  type="button"
                  onClick={() => void handleExportApplications()}
                  disabled={isExporting || !token}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#155EEF] bg-[#155EEF] px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>{isExporting ? 'Preparing…' : 'Download export'}</span>
                </button>
              </div>
            </div>
            {exportError && (
              <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                {exportError}
              </p>
            )}

            {/* Applications Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Reference No</th>
                    <th className="py-3 px-4">Applicant</th>
                    <th className="py-3 px-4">Program Track</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-blue-50/40">
                      <td className="py-3 px-4 font-mono font-bold text-[#155EEF]">
                        {app.referenceNo}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-gray-900">{app.applicantName}</div>
                        <div className="text-[11px] text-gray-500">{app.userEmail}</div>
                      </td>
                      <td className="py-3 px-4 text-gray-800 font-medium">
                        {app.programTitle}
                      </td>
                      <td className="py-3 px-4 text-gray-500 font-mono tabular-nums">
                        {new Date(app.submissionDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          app.status === 'Accepted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : app.status === 'Under Review'
                            ? 'bg-amber-100 text-amber-800'
                            : app.status === 'Shortlisted'
                            ? 'bg-purple-100 text-purple-800'
                            : app.status === 'Rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setReviewApp(app);
                            setNewStatus(app.status);
                            setReviewerNotes(app.reviewerNotes || '');
                          }}
                          className="py-1 px-3 text-xs font-bold text-[#155EEF] hover:bg-blue-100 rounded-lg"
                        >
                          Review & Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {applications.length === 0 && (
                <div className="text-center py-8 text-gray-500 text-xs">
                  No applications found matching the selected filter.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: TRAINING PROGRAMS */}
        {activeTab === 'programs' && (
          <div className="bg-white rounded-2xl p-6 border border-[#D0D5DD] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#101828]">Training Program Catalog</h3>
                <p className="text-xs text-gray-500">Add, edit curriculum, and manage enrollment statuses.</p>
              </div>
              <button
                onClick={() =>
                  setEditingProgram({
                    title: '',
                    slug: '',
                    category: 'Software Engineering',
                    format: 'Hybrid',
                    duration: '8 Weeks',
                    startDate: 'To be confirmed',
                    applicationDeadline: 'Open Enrollment',
                    prerequisites: '',
                    description: '',
                    curriculum: [],
                    status: 'Open',
                  })
                }
                className="inline-flex items-center gap-1.5 py-2 px-3 text-xs font-bold text-white bg-[#155EEF] rounded-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Create Program</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {programs.map((prog) => (
                <div
                  key={prog.id}
                  className="p-4 rounded-xl border border-gray-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold text-[#155EEF] uppercase">
                        {prog.category}
                      </span>
                      <span className={`text-[11px] font-bold ${
                        prog.status === 'Open' ? 'text-emerald-600' : 'text-amber-600'
                      }`}>
                        {prog.status}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-gray-900">{prog.title}</h4>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{prog.description}</p>
                    <div className="text-[11px] text-gray-400 mt-2">
                      Duration: {prog.duration} &bull; Format: {prog.format}
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-gray-100 flex justify-end gap-2">
                    <button
                      onClick={() => setEditingProgram(prog)}
                      className="px-2.5 py-1 text-xs text-gray-700 hover:bg-gray-100 rounded border border-gray-200"
                    >
                      Edit Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: MANAGEMENT TEAM */}
        {activeTab === 'team' && (
          <div className="bg-white rounded-2xl p-6 border border-[#D0D5DD] shadow-xs space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-base font-bold text-[#101828]">Management Team Profiles</h3>
                <p className="text-xs text-gray-500">
                  Official portraits and credentials can be updated dynamically without editing source code.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setTeamMemberError('');
                  setEditingTeamMember({
                    id: '',
                    name: '',
                    position: '',
                    professionalTitle: '',
                    description: '',
                    photoUrl: '',
                    order: teamMembers.length + 1,
                  });
                }}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#155EEF] px-3 py-2 text-xs font-bold text-white hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                Add Team Member
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="border border-gray-200 rounded-xl overflow-hidden p-4 flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={member.photoUrl}
                      alt={member.name}
                      className="w-16 h-16 rounded-xl object-cover bg-gray-100 shrink-0"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{member.name}</h4>
                      <p className="text-xs text-[#155EEF] font-semibold">{member.position}</p>
                      <p className="text-[11px] text-[#E63946]">{member.professionalTitle}</p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 mt-3 line-clamp-2">{member.description}</p>

                  <div className="pt-3 mt-3 border-t border-gray-100 flex justify-end">
                    <button
                      onClick={() => {
                        setTeamMemberError('');
                        setEditingTeamMember(member);
                      }}
                      className="px-3 py-1 text-xs font-semibold text-[#155EEF] bg-blue-50 hover:bg-blue-100 rounded-md"
                    >
                      Update Portrait & Bio
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: TRAINEE SHOWCASE */}
        {activeTab === 'trainees' && (
          <div className="bg-white rounded-2xl p-6 border border-[#D0D5DD] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#101828]">Trainee Showcase Entries</h3>
                <p className="text-xs text-gray-500">
                  Manage candidate spotlights, verify privacy authorizations, and add prospective cohorts.
                </p>
              </div>
              <button
                onClick={() =>
                  setEditingTrainee({
                    name: '',
                    programInterest: 'Full-Stack Web Development',
                    learningGoal: '',
                    photoUrl: '',
                    cohort: 'Cohort 2026',
                    isApproved: true,
                  })
                }
                className="inline-flex items-center gap-1.5 py-2 px-3 text-xs font-bold text-white bg-[#155EEF] rounded-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Add Trainee Entry</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {trainees.map((t) => (
                <div key={t.id} className="p-4 rounded-xl border border-gray-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-gray-900">{t.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        t.isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {t.isApproved ? 'Published' : t.applicantUserId ? 'Pending approval' : 'Hidden'}
                      </span>
                    </div>
                    {t.photoUrl && (
                      <img src={t.photoUrl} alt={`${t.name} showcase preview`} className="mb-2 h-16 w-16 rounded-full object-cover" />
                    )}
                    <span className="text-xs text-[#155EEF] font-semibold block">{t.programInterest}</span>
                    <p className="text-xs text-gray-600 italic mt-2 line-clamp-2">&ldquo;{t.learningGoal}&rdquo;</p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] text-gray-400">{t.cohort}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingTrainee(t)}
                        className="p-1 text-gray-500 hover:text-blue-600"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTrainee(t.id)}
                        className="p-1 text-gray-500 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: CONTACT MESSAGES */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-2xl p-6 border border-[#D0D5DD] shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#101828]">Contact Inquiries & Visitors</h3>
            <div className="space-y-3">
              {messages.map((m) => (
                <div key={m.id} className="p-4 rounded-xl border border-gray-200 bg-[#F5F8FF]/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 text-xs">{m.name} ({m.email})</span>
                    <span className="text-[11px] text-gray-500">{new Date(m.createdAt).toLocaleString()}</span>
                  </div>
                  <span className="text-xs font-semibold text-[#155EEF]">{m.category}</span>
                  <p className="text-xs text-gray-700 bg-white p-3 rounded border border-gray-200">{m.message}</p>
                </div>
              ))}
              {messages.length === 0 && (
                <div className="text-center py-6 text-gray-400 text-xs">No inquiries logged.</div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: AUDIT LOGS */}
        {activeTab === 'audit' && (
          <div className="bg-white rounded-2xl p-6 border border-[#D0D5DD] shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#101828]">System Audit Trail</h3>
            <div className="space-y-2">
              {auditLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 text-xs">
                  <div className="flex items-center gap-3">
                    <History className="w-4 h-4 text-gray-400" />
                    <div>
                      <span className="font-mono font-bold text-[#101828]">{log.action}</span>
                      <p className="text-gray-600">{log.details}</p>
                    </div>
                  </div>
                  <span className="text-gray-400 font-mono text-[11px]">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Review Application Modal */}
        {reviewApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 relative shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between pb-3 border-b border-gray-100">
                <div>
                  <span className="font-mono text-xs font-bold text-[#155EEF]">
                    {reviewApp.referenceNo}
                  </span>
                  <h3 className="text-lg font-bold text-[#101828]">
                    Review Applicant: {reviewApp.applicantName}
                  </h3>
                  <p className="text-xs text-gray-500">{reviewApp.programTitle}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (editingApplicantDetails) {
                        const savedApplication = applications.find((application) => application.id === reviewApp.id);
                        if (savedApplication) setReviewApp(savedApplication);
                      }
                      setEditingApplicantDetails((current) => !current);
                      setApplicantDetailsError('');
                    }}
                    className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-[#155EEF] hover:bg-blue-100"
                  >
                    {editingApplicantDetails ? 'Cancel Edit' : 'Edit Applicant Details'}
                  </button>
                  <button onClick={() => { setReviewApp(null); setEditingApplicantDetails(false); }} className="p-1 text-gray-400 hover:text-gray-700">
                    &times;
                  </button>
                </div>
              </div>

              <div className="py-4 space-y-4 text-xs">
                {editingApplicantDetails ? (
                  <form onSubmit={(event) => void handleSaveApplicantDetails(event)} className="space-y-3 rounded-lg border border-blue-100 bg-blue-50/40 p-3">
                    {applicantDetailsError && <p role="alert" className="rounded border border-red-200 bg-red-50 p-2 text-red-700">{applicantDetailsError}</p>}
                    <div className="grid grid-cols-2 gap-3">
                      <label className="font-semibold text-gray-800">First name
                        <input required maxLength={80} value={reviewApp.applicantFirstName || ''} onChange={(event) => setReviewApp({ ...reviewApp, applicantFirstName: event.target.value, applicantName: `${event.target.value} ${reviewApp.applicantLastName || ''}`.trim() })} className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-2" />
                      </label>
                      <label className="font-semibold text-gray-800">Last name
                        <input required maxLength={80} value={reviewApp.applicantLastName || ''} onChange={(event) => setReviewApp({ ...reviewApp, applicantLastName: event.target.value, applicantName: `${reviewApp.applicantFirstName || ''} ${event.target.value}`.trim() })} className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-2" />
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="font-semibold text-gray-800">Email
                        <input required type="email" maxLength={254} value={reviewApp.userEmail} onChange={(event) => setReviewApp({ ...reviewApp, userEmail: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-2" />
                      </label>
                      <label className="font-semibold text-gray-800">Phone
                        <input maxLength={40} value={reviewApp.applicantPhone} onChange={(event) => setReviewApp({ ...reviewApp, applicantPhone: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-2" />
                      </label>
                      <label className="font-semibold text-gray-800">Education
                        <input required maxLength={160} value={reviewApp.educationLevel} onChange={(event) => setReviewApp({ ...reviewApp, educationLevel: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-2" />
                      </label>
                      <label className="font-semibold text-gray-800">Experience level
                        <input required maxLength={160} value={reviewApp.experienceLevel} onChange={(event) => setReviewApp({ ...reviewApp, experienceLevel: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-2" />
                      </label>
                      <label className="font-semibold text-gray-800">Availability
                        <input required maxLength={500} value={reviewApp.availability} onChange={(event) => setReviewApp({ ...reviewApp, availability: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-2" />
                      </label>
                      <label className="font-semibold text-gray-800">Weekly commitment
                        <input required maxLength={500} value={reviewApp.screeningAnswers?.weeklyHoursCommitment || ''} onChange={(event) => setReviewApp({ ...reviewApp, screeningAnswers: { ...reviewApp.screeningAnswers, weeklyHoursCommitment: event.target.value } })} className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-2" />
                      </label>
                    </div>
                    <label className="block font-semibold text-gray-800">Prior coding experience
                      <input required maxLength={500} value={reviewApp.screeningAnswers?.priorCodingExperience || ''} onChange={(event) => setReviewApp({ ...reviewApp, screeningAnswers: { ...reviewApp.screeningAnswers, priorCodingExperience: event.target.value } })} className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-2" />
                    </label>
                    <label className="block font-semibold text-gray-800">Personal laptop
                      <input required maxLength={500} value={reviewApp.screeningAnswers?.hasPersonalLaptop || ''} onChange={(event) => setReviewApp({ ...reviewApp, screeningAnswers: { ...reviewApp.screeningAnswers, hasPersonalLaptop: event.target.value } })} className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-2" />
                    </label>
                    <label className="block font-semibold text-gray-800">Motivation statement
                      <textarea required maxLength={5000} rows={3} value={reviewApp.reasonForApplying} onChange={(event) => setReviewApp({ ...reviewApp, reasonForApplying: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-2" />
                    </label>
                    <label className="block font-semibold text-gray-800">Learning goals
                      <textarea required maxLength={5000} rows={3} value={reviewApp.learningGoals} onChange={(event) => setReviewApp({ ...reviewApp, learningGoals: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-2" />
                    </label>
                    <button type="submit" disabled={savingApplicantDetails} className="rounded-lg bg-[#155EEF] px-4 py-2 font-bold text-white disabled:opacity-50">
                      {savingApplicantDetails ? 'Saving details…' : 'Save Applicant Details'}
                    </button>
                  </form>
                ) : (
                  <>
                    <div className="p-3 bg-gray-50 rounded-lg space-y-1">
                      <div><strong>Email:</strong> {reviewApp.userEmail}</div>
                      <div><strong>Phone:</strong> {reviewApp.applicantPhone || 'N/A'}</div>
                      <div><strong>Education:</strong> {reviewApp.educationLevel}</div>
                      <div><strong>Skill Level:</strong> {reviewApp.experienceLevel}</div>
                      <div><strong>Availability:</strong> {reviewApp.availability}</div>
                      <div><strong>Prior Coding Experience:</strong> {reviewApp.screeningAnswers?.priorCodingExperience}</div>
                      <div><strong>Weekly Commitment:</strong> {reviewApp.screeningAnswers?.weeklyHoursCommitment}</div>
                      <div><strong>Personal Laptop:</strong> {reviewApp.screeningAnswers?.hasPersonalLaptop}</div>
                    </div>

                    <div>
                      <strong className="text-gray-800 block mb-1">Motivation Statement:</strong>
                      <p className="whitespace-pre-wrap bg-white p-2.5 rounded border border-gray-200 text-gray-700">{reviewApp.reasonForApplying}</p>
                    </div>

                    <div>
                      <strong className="text-gray-800 block mb-1">Learning Goals:</strong>
                      <p className="whitespace-pre-wrap bg-white p-2.5 rounded border border-gray-200 text-gray-700">{reviewApp.learningGoals}</p>
                    </div>
                  </>
                )}

                <div className="pt-3 border-t border-gray-100 space-y-3">
                  <div>
                    <label className="block font-semibold text-gray-800 mb-1">Update Admissions Status</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as ApplicationStatus)}
                      className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                    >
                      <option value="Submitted">Submitted</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Accepted">Accepted (Admitted to Cohort)</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Withdrawn">Withdrawn</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-800 mb-1">Internal Reviewer Notes / Decision Feedback</label>
                    <textarea
                      rows={3}
                      value={reviewerNotes}
                      onChange={(e) => setReviewerNotes(e.target.value)}
                      placeholder="Add internal feedback or admission instructions for applicant..."
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  onClick={() => setReviewApp(null)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  disabled={updatingStatus}
                  onClick={handleUpdateAppStatus}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#155EEF] hover:bg-blue-700 rounded-lg flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{updatingStatus ? 'Updating...' : 'Save Decision'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add or edit team member modal */}
        {editingTeamMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative shadow-2xl border border-gray-200">
              <h3 className="text-lg font-bold text-[#101828] mb-4">
                {editingTeamMember.id ? `Update Team Member: ${editingTeamMember.name}` : 'Add Team Member'}
              </h3>

              <form onSubmit={handleSaveTeamMember} className="space-y-3 text-xs">
                {teamMemberError && (
                  <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {teamMemberError}
                  </p>
                )}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Name</label>
                  <input
                    required
                    type="text"
                    maxLength={120}
                    value={editingTeamMember.name}
                    onChange={(e) => setEditingTeamMember({ ...editingTeamMember, name: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="Team member's full name"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Official Portrait URL</label>
                  <input
                    type="text"
                    value={editingTeamMember.photoUrl}
                    onChange={(e) => setEditingTeamMember({ ...editingTeamMember, photoUrl: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="e.g. /src/assets/images/... or https://..."
                  />
                  <span className="text-[11px] text-gray-400 mt-0.5 block">
                    Upload or paste the new official photograph path to replace without modifying source code.
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Position / Office</label>
                  <input
                    type="text"
                    required
                    value={editingTeamMember.position}
                    onChange={(e) => setEditingTeamMember({ ...editingTeamMember, position: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Professional Title</label>
                  <input
                    type="text"
                    required
                    value={editingTeamMember.professionalTitle}
                    onChange={(e) => setEditingTeamMember({ ...editingTeamMember, professionalTitle: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Bio / Role Description</label>
                  <textarea
                    rows={3}
                    required
                    value={editingTeamMember.description}
                    onChange={(e) => setEditingTeamMember({ ...editingTeamMember, description: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end gap-2">
                  <button
                    type="button"
                    disabled={savingTeamMember}
                    onClick={() => setEditingTeamMember(null)}
                    className="px-4 py-2 font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingTeamMember}
                    className="px-4 py-2 font-bold text-white bg-[#155EEF] rounded-lg disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {savingTeamMember ? 'Saving...' : editingTeamMember.id ? 'Save Changes' : 'Add Team Member'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add/Edit Trainee Modal */}
        {editingTrainee && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative shadow-2xl border border-gray-200">
              <h3 className="text-lg font-bold text-[#101828] mb-4">
                {editingTrainee.id ? 'Edit Trainee Showcase' : 'Add New Trainee Showcase'}
              </h3>

              <form onSubmit={handleSaveTrainee} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Display Name</label>
                  <input
                    type="text"
                    required
                    value={editingTrainee.name || ''}
                    onChange={(e) => setEditingTrainee({ ...editingTrainee, name: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Program of Interest</label>
                  <input
                    type="text"
                    required
                    value={editingTrainee.programInterest || ''}
                    onChange={(e) => setEditingTrainee({ ...editingTrainee, programInterest: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Learning Goal / Aspiration</label>
                  <textarea
                    rows={2}
                    value={editingTrainee.learningGoal || ''}
                    onChange={(e) => setEditingTrainee({ ...editingTrainee, learningGoal: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Cohort Badge</label>
                    <input
                      type="text"
                      value={editingTrainee.cohort || ''}
                      onChange={(e) => setEditingTrainee({ ...editingTrainee, cohort: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Visibility Status</label>
                    <select
                      value={editingTrainee.isApproved ? 'true' : 'false'}
                      onChange={(e) => setEditingTrainee({ ...editingTrainee, isApproved: e.target.value === 'true' })}
                      className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                    >
                      <option value="true">Approved & Published</option>
                      <option value="false">Hidden / Draft</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingTrainee(null)}
                    className="px-4 py-2 font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 font-bold text-white bg-[#155EEF] rounded-lg"
                  >
                    Save Trainee
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add/Edit Program Modal */}
        {editingProgram && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 relative shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-bold text-[#101828] mb-4">
                {editingProgram.id ? 'Edit Training Program' : 'Create New Training Program'}
              </h3>

              <form onSubmit={handleSaveProgram} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Program Title</label>
                  <input
                    type="text"
                    required
                    value={editingProgram.title || ''}
                    onChange={(e) => setEditingProgram({ ...editingProgram, title: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Category</label>
                    <input
                      type="text"
                      value={editingProgram.category || ''}
                      onChange={(e) => setEditingProgram({ ...editingProgram, category: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Status</label>
                    <select
                      value={editingProgram.status || 'Open'}
                      onChange={(e) => setEditingProgram({ ...editingProgram, status: e.target.value as any })}
                      className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                    >
                      <option value="Open">Open</option>
                      <option value="Closed">Closed</option>
                      <option value="Coming Soon">Coming Soon</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Duration</label>
                    <input
                      type="text"
                      value={editingProgram.duration || ''}
                      onChange={(e) => setEditingProgram({ ...editingProgram, duration: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Format</label>
                    <select
                      value={editingProgram.format || 'Hybrid'}
                      onChange={(e) => setEditingProgram({ ...editingProgram, format: e.target.value as any })}
                      className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                    >
                      <option value="Hybrid">Hybrid</option>
                      <option value="In-Person">In-Person</option>
                      <option value="Online">Online</option>
                      <option value="Weekend Intensive">Weekend Intensive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    required
                    value={editingProgram.description || ''}
                    onChange={(e) => setEditingProgram({ ...editingProgram, description: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingProgram(null)}
                    className="px-4 py-2 font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 font-bold text-white bg-[#155EEF] rounded-lg"
                  >
                    Save Program
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
