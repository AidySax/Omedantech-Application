export type UserRole = 'trainee' | 'staff' | 'admin';

export type StaffPosition =
  | 'Managing Director'
  | 'Full-Stack Developer'
  | 'UI/UX Designer'
  | 'Front Desk'
  | 'Junior Developer'
  | 'Project Manager';

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Excused';

export type PerformanceCategory = 'Task handled' | 'Assignment' | 'Class contribution';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  isEmailVerified: boolean;
  createdAt: string;
  position?: StaffPosition;
  assignedProgramIds?: string[];
}

export interface AttendanceRecord {
  id: string;
  traineeId: string;
  programId: string;
  date: string;
  status: AttendanceStatus;
  notes: string;
  recordedBy: string;
  createdAt: string;
}

export interface PerformanceRecord {
  id: string;
  traineeId: string;
  programId: string;
  category: PerformanceCategory;
  title: string;
  details: string;
  score?: number;
  recordedBy: string;
  createdAt: string;
}

export interface AuthSession {
  token: string;
  user: User;
}

export interface ServiceItem {
  id: string;
  slug: string;
  order: number;
  title: string;
  shortDescription: string;
  fullDescription: string;
  keyOfferings: string[];
  icon: string;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  professionalTitle: string;
  description: string;
  photoUrl: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  order: number;
}

export interface TraineeShowcase {
  id: string;
  name: string;
  programInterest: string;
  learningGoal: string;
  photoUrl: string;
  cohort: string;
  isApproved: boolean;
}

export interface TrainingProgram {
  id: string;
  title: string;
  slug: string;
  category: string;
  format: 'In-Person' | 'Hybrid' | 'Online' | 'Weekend Intensive';
  duration: string;
  startDate: string;
  applicationDeadline: string;
  prerequisites: string;
  description: string;
  curriculum: string[];
  status: 'Open' | 'Closed' | 'Coming Soon' | 'Archived';
  featured?: boolean;
}

export type ApplicationStatus =
  | 'Draft'
  | 'Submitted'
  | 'Under Review'
  | 'Shortlisted'
  | 'Accepted'
  | 'Rejected'
  | 'Withdrawn';

export interface Application {
  id: string;
  referenceNo: string;
  userId: string;
  userEmail: string;
  applicantName: string;
  applicantPhone: string;
  programId: string;
  programTitle: string;
  programSlug: string;
  educationLevel: string;
  experienceLevel: string;
  reasonForApplying: string;
  learningGoals: string;
  availability: string;
  screeningAnswers: {
    priorCodingExperience: string;
    weeklyHoursCommitment: string;
    hasPersonalLaptop: string;
  };
  declarationAccepted: boolean;
  status: ApplicationStatus;
  submissionDate: string;
  updatedAt: string;
  reviewerNotes?: string;
  reviewedBy?: string;
}

export interface ApplicationStatusHistory {
  id: string;
  applicationId: string;
  oldStatus: ApplicationStatus;
  newStatus: ApplicationStatus;
  changedBy: string;
  notes?: string;
  timestamp: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  category: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: string;
}

export interface SiteSettings {
  brandName: string;
  slogan: string;
  marqueeText: string;
  developerCredit: string;
  supportEmail: string;
  phone: string;
  address: string;
  mission: string;
  vision: string;
  coreValues: string[];
}

export interface DashboardStats {
  totalUsers: number;
  totalApplications: number;
  awaitingReview: number;
  openPrograms: number;
  acceptedApplications: number;
  totalServices: number;
}
