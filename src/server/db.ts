import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  User,
  ServiceItem,
  TeamMember,
  TraineeShowcase,
  TrainingProgram,
  Application,
  ApplicationStatusHistory,
  ContactMessage,
  SiteSettings,
  AttendanceRecord,
  PerformanceRecord,
  StaffPosition,
} from '../types';

interface DatabaseSchema {
  users: (User & { passwordHash: string; salt: string })[];
  services: ServiceItem[];
  teamMembers: TeamMember[];
  trainees: TraineeShowcase[];
  programs: TrainingProgram[];
  applications: Application[];
  statusHistory: ApplicationStatusHistory[];
  contactMessages: ContactMessage[];
  siteSettings: SiteSettings;
  auditLogs: { id: string; action: string; userId?: string; details: string; timestamp: string }[];
  attendanceRecords: AttendanceRecord[];
  performanceRecords: PerformanceRecord[];
}

const DB_FILE = path.resolve(process.cwd(), 'data', 'database.json');

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

function getBootstrapAdmin() {
  const email = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;
  if (!email && !password) return null;
  if (!email || !password || password.length < 12 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Set a valid BOOTSTRAP_ADMIN_EMAIL and a BOOTSTRAP_ADMIN_PASSWORD of at least 12 characters.');
  }
  const { salt, passwordHash } = createPasswordRecord(password);
  return {
    id: 'usr-admin-bootstrap',
    firstName: 'System',
    lastName: 'Administrator',
    email,
    phone: '',
    role: 'admin' as const,
    assignedProgramIds: [],
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
    salt,
    passwordHash,
  };
}

function normalizeUsers(users: DatabaseSchema['users']) {
  return users.map((user) => ({
    ...user,
    assignedProgramIds: user.assignedProgramIds || [],
  }));
}

export function createPasswordRecord(password: string) {
  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword(password, salt);
  return { salt, passwordHash };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  return hashPassword(password, salt) === hash;
}

const initialServices: ServiceItem[] = [
  {
    id: 'srv-1',
    slug: 'product-discovery-strategy',
    order: 1,
    title: 'Product Discovery & Strategy',
    shortDescription: 'We help transform early ideas into validated product opportunities through market research, customer insights, and strategic planning.',
    fullDescription: 'Our discovery process bridges the gap between vision and market realities. We validate core assumptions, prioritize features, and define a clear roadmap to ensure your software development investment delivers high-impact results.',
    keyOfferings: [
      'Market-fit analysis',
      'Customer experience (CX) research',
      'User research and discovery',
      'Product roadmaps & MVP planning',
    ],
    icon: 'Compass',
  },
  {
    id: 'srv-2',
    slug: 'software-app-development',
    order: 2,
    title: 'Software & App Development',
    shortDescription: 'We design, develop, and maintain custom digital products that solve real-world problems and support business growth.',
    fullDescription: 'From high-performance web platforms to native-quality mobile solutions and scalable microservices, our engineering team constructs maintainable, performant, and resilient applications.',
    keyOfferings: [
      'Custom software & MVP creation',
      'Web & mobile application engineering',
      'API integration & database design',
      'Software testing and long-term maintenance',
    ],
    icon: 'Code2',
  },
  {
    id: 'srv-3',
    slug: 'ai-prompting',
    order: 3,
    title: 'AI Prompting',
    shortDescription: 'Learn how to guide powerful AI assistants with clear instructions, relevant context, structured prompts, and effective evaluation.',
    fullDescription: 'Prompt engineering is the systematic discipline of instructing existing artificial intelligence models to produce more relevant, accurate, and high-value outputs across commercial workflows.',
    keyOfferings: [
      'Prompt engineering fundamentals',
      'LLM interaction & context design',
      'Structured output generation',
      'AI workflow optimization & prompt testing',
    ],
    icon: 'Sparkles',
  },
  {
    id: 'srv-4',
    slug: 'ai-development',
    order: 4,
    title: 'AI Development',
    shortDescription: 'We engineer intelligent software systems using machine learning, AI models, data processing, and modern software development practices.',
    fullDescription: 'We build proprietary AI-driven features, retrieval-augmented generation (RAG) pipelines, intelligent recommendation engines, and automated data processing tools that give modern enterprises a strategic advantage.',
    keyOfferings: [
      'AI-powered business applications',
      'Machine learning & predictive modeling',
      'Retrieval-Augmented Generation (RAG)',
      'Model evaluation, automation & deployment',
    ],
    icon: 'BrainCircuit',
  },
  {
    id: 'srv-5',
    slug: 'cloud-infrastructure',
    order: 5,
    title: 'Cloud & Infrastructure',
    shortDescription: 'We design and manage scalable infrastructure that supports reliable applications, efficient deployment, and business continuity.',
    fullDescription: 'Modern applications require bulletproof uptime and rapid deployment pipelines. We implement containerization, automated CI/CD, cloud architecture, and proactive telemetry.',
    keyOfferings: [
      'Cloud architecture & server configuration',
      'Automated CI/CD pipelines',
      'Infrastructure monitoring & scalability planning',
      'Disaster recovery & technical debt management',
    ],
    icon: 'Cloud',
  },
  {
    id: 'srv-6',
    slug: 'cybersecurity-compliance',
    order: 6,
    title: 'Cybersecurity & Compliance',
    shortDescription: 'We help organizations identify security risks, strengthen digital systems, protect data, and improve compliance readiness.',
    fullDescription: 'Security is integral to engineering. We conduct authorized vulnerability assessments, establish robust data protection architectures, configure secure access controls, and train teams on security best practices.',
    keyOfferings: [
      'Authorized vulnerability assessments',
      'Secure software development lifecycles',
      'Data protection & access control reviews',
      'Security awareness & incident response planning',
    ],
    icon: 'ShieldCheck',
  },
  {
    id: 'srv-7',
    slug: 'it-staff-augmentation',
    order: 7,
    title: 'IT Staff Augmentation',
    shortDescription: 'We help organizations scale their technical capabilities by providing dedicated professionals who support software delivery, design, and product management.',
    fullDescription: 'Augment your development velocity with vetted engineers, designers, and product leaders trained to integrate seamlessly into your existing sprints, repositories, and culture.',
    keyOfferings: [
      'Dedicated software developers & full-stack engineers',
      'UI/UX designers & product managers',
      'Quality assurance & testing specialists',
      'AI, data, and technical project support',
    ],
    icon: 'Users',
  },
];

const initialTeam: TeamMember[] = [
  {
    id: 'tm-1',
    name: 'Comrade Idara Udofia',
    position: 'Managing Director',
    professionalTitle: 'Software Engineer',
    description: "Leads the company's strategic direction, innovation initiatives, and overall technology operations.",
    photoUrl: '/src/assets/images/team_director_idara_1792132762948.jpg',
    order: 1,
    socialLinks: {
      linkedin: 'https://linkedin.com',
    },
  },
  {
    id: 'tm-2',
    name: 'Comrade Imoh Ben',
    position: 'Full-Stack Developer',
    professionalTitle: 'Senior Engineer',
    description: 'Supports the design and development of end-to-end software applications, backend services, and modern web solutions.',
    photoUrl: '/src/assets/images/team_senior_dev_imoh_1792132763338.jpg',
    order: 2,
    socialLinks: {
      github: 'https://github.com',
    },
  },
  {
    id: 'tm-3',
    name: 'Miss Comfort Iwah',
    position: 'Front Desk Officer',
    professionalTitle: 'Customer Care',
    description: "Supports inquiries, communicates with visitors, and helps applicants navigate the firm's services and training opportunities.",
    photoUrl: '/src/assets/images/team_frontdesk_comfort_1792132765176.jpg',
    order: 3,
  },
  {
    id: 'tm-4',
    name: 'Miss Theresa',
    position: 'UI/UX Designer',
    professionalTitle: 'Designer',
    description: 'Creates intuitive user experiences, attractive interfaces, and consistent visual designs for digital products.',
    photoUrl: '/src/assets/images/team_designer_theresa_1792132779604.jpg',
    order: 4,
  },
  {
    id: 'tm-5',
    name: 'Temple Matthew',
    position: 'Junior Developer',
    professionalTitle: 'Junior Developer',
    description: 'Contributes to software development, feature implementation, testing, and ongoing product improvement.',
    photoUrl: '/src/assets/images/team_junior_temple_1792132780658.jpg',
    order: 5,
  },
];

const initialTrainees: TraineeShowcase[] = [
  {
    id: 'tr-1',
    name: 'Sarah Akpan',
    programInterest: 'AI Prompting & LLM Interaction',
    learningGoal: 'Mastering prompt architecture and structured agent prompting to automate research and enterprise documentation.',
    photoUrl: '/src/assets/images/trainee_showcase_sarah_1792132779792.jpg',
    cohort: 'Cohort 2026-A (Applicant Spotlight)',
    isApproved: true,
  },
  {
    id: 'tr-2',
    name: 'Emmanuel Bassey',
    programInterest: 'Full-Stack Web Development',
    learningGoal: 'Building scalable cloud-native web applications with React, TypeScript, and Node.js for emerging African startups.',
    photoUrl: '',
    cohort: 'Cohort 2026-A',
    isApproved: true,
  },
  {
    id: 'tr-3',
    name: 'Blessing Ekong',
    programInterest: 'UI/UX Design',
    learningGoal: 'Developing design systems and accessible user experiences for mobile banking and fintech applications.',
    photoUrl: '',
    cohort: 'Cohort 2026-A',
    isApproved: true,
  },
  {
    id: 'tr-4',
    name: 'David Okon',
    programInterest: 'AI Development & Machine Learning',
    learningGoal: 'Training predictive machine learning models and engineering RAG architectures for local language accessibility.',
    photoUrl: '',
    cohort: 'Cohort 2026-B (Prospective)',
    isApproved: true,
  },
  {
    id: 'tr-5',
    name: 'Grace Udoh',
    programInterest: 'Cybersecurity & Compliance',
    learningGoal: 'Deepening knowledge in vulnerability management, network security audits, and data protection regulations.',
    photoUrl: '',
    cohort: 'Cohort 2026-B (Prospective)',
    isApproved: true,
  },
  {
    id: 'tr-6',
    name: 'Victor Nsikak',
    programInterest: 'Cloud Computing & DevOps',
    learningGoal: 'Designing high-availability Kubernetes clusters, automated CI/CD pipelines, and cloud migration strategies.',
    photoUrl: '',
    cohort: 'Cohort 2026-A',
    isApproved: true,
  },
];

const initialPrograms: TrainingProgram[] = [
  {
    id: 'prog-1',
    title: 'AI Prompting & LLM Interaction',
    slug: 'ai-prompting',
    category: 'AI & Prompt Engineering',
    format: 'Hybrid',
    duration: '6 Weeks',
    startDate: 'November 10, 2026',
    applicationDeadline: 'November 3, 2026',
    prerequisites: 'Basic computer literacy and curiosity about modern artificial intelligence tools.',
    description: 'Master the art and science of prompt engineering. Learn how to guide leading AI models with structured instructions, contextual anchors, system framing, and output schema evaluation.',
    curriculum: [
      'Module 1: Principles of Generative AI and Token Economics',
      'Module 2: Zero-Shot, Few-Shot, and Chain-of-Thought Prompting',
      'Module 3: Structured Data Extraction & Schema Enforcement',
      'Module 4: Enterprise Workflow Automation & Prompt Testing',
      'Module 5: Responsible AI, Bias Mitigation & Capstone Project',
    ],
    status: 'Open',
    featured: true,
  },
  {
    id: 'prog-2',
    title: 'AI Development & Machine Learning',
    slug: 'ai-development',
    category: 'Artificial Intelligence',
    format: 'In-Person',
    duration: '12 Weeks',
    startDate: 'November 17, 2026',
    applicationDeadline: 'November 8, 2026',
    prerequisites: 'Foundational programming knowledge in Python or JavaScript.',
    description: 'A comprehensive immersion into training, fine-tuning, and integrating modern AI architectures. Build retrieval-augmented generation (RAG) engines, embedding search pipelines, and predictive algorithms.',
    curriculum: [
      'Module 1: Python for Data Science and Machine Learning',
      'Module 2: Neural Networks & Deep Learning Foundations',
      'Module 3: Embeddings, Vector Stores, and RAG Architecture',
      'Module 4: API Integration with Gemini and Open-Source Models',
      'Module 5: Production Deployment and Scalable Model Serving',
    ],
    status: 'Open',
    featured: true,
  },
  {
    id: 'prog-3',
    title: 'Full-Stack Web Development',
    slug: 'full-stack-web-development',
    category: 'Software Engineering',
    format: 'Hybrid',
    duration: '16 Weeks',
    startDate: 'November 10, 2026',
    applicationDeadline: 'November 3, 2026',
    prerequisites: 'Commitment to 12+ hours weekly. Prior coding interest encouraged but not required.',
    description: 'Learn modern software engineering from first principles to full deployment. Build production-grade web applications using React, TypeScript, Node.js, REST APIs, and relational databases.',
    curriculum: [
      'Module 1: Modern JavaScript & TypeScript Engineering',
      'Module 2: Component Architecture with React & Tailwind CSS',
      'Module 3: Server Architecture, REST APIs & Express.js',
      'Module 4: Relational Databases, SQL & Authentication Systems',
      'Module 5: Git Workflows, Testing, CI/CD & Cloud Deployment',
    ],
    status: 'Open',
    featured: true,
  },
  {
    id: 'prog-4',
    title: 'Mobile App Development',
    slug: 'mobile-app-development',
    category: 'Mobile Engineering',
    format: 'Hybrid',
    duration: '12 Weeks',
    startDate: 'November 24, 2026',
    applicationDeadline: 'November 15, 2026',
    prerequisites: 'Basic JavaScript/TypeScript or programming fundamentals.',
    description: 'Craft beautiful, high-performance cross-platform mobile apps for iOS and Android. Cover state management, camera/sensor hardware integration, offline caching, and app store deployment.',
    curriculum: [
      'Module 1: React Native & Expo Fundamentals',
      'Module 2: Mobile UI/UX Patterns & Touch Navigation',
      'Module 3: Local Storage, SQLite & Offline First Architecture',
      'Module 4: Push Notifications & Backend Integration',
      'Module 5: Performance Optimization & App Store Packaging',
    ],
    status: 'Open',
  },
  {
    id: 'prog-5',
    title: 'UI/UX Design & Product Interface',
    slug: 'ui-ux-design',
    category: 'Design & Experience',
    format: 'In-Person',
    duration: '8 Weeks',
    startDate: 'November 10, 2026',
    applicationDeadline: 'November 3, 2026',
    prerequisites: 'Interest in visual aesthetics, empathy, and product usability.',
    description: 'Develop the skills needed to design intuitive, accessible digital products. Master Figma, wireframing, high-fidelity prototypes, user research interviews, and responsive design systems.',
    curriculum: [
      'Module 1: Design Thinking & User Research Methods',
      'Module 2: Information Architecture & Wireframing',
      'Module 3: Visual Hierarchy, Typography & Color Systems in Figma',
      'Module 4: Interactive Prototyping & Usability Testing',
      'Module 5: Developer Handoff & Design System Maintenance',
    ],
    status: 'Open',
  },
  {
    id: 'prog-6',
    title: 'Cloud Computing & DevOps Architecture',
    slug: 'cloud-computing-devops',
    category: 'Cloud & Infrastructure',
    format: 'Hybrid',
    duration: '10 Weeks',
    startDate: 'December 1, 2026',
    applicationDeadline: 'November 20, 2026',
    prerequisites: 'Familiarity with terminal/command line and basic networking concepts.',
    description: 'Master modern infrastructure operations, containerization with Docker, Kubernetes orchestration, Infrastructure as Code, and automated deployment pipelines on major cloud providers.',
    curriculum: [
      'Module 1: Linux Administration & Cloud Networking Fundamentals',
      'Module 2: Containerization with Docker & Multi-stage Builds',
      'Module 3: CI/CD Automation with GitHub Actions',
      'Module 4: Kubernetes Cluster Architecture & Monitoring',
      'Module 5: Security Hardening & Zero-Downtime Deployment',
    ],
    status: 'Open',
  },
  {
    id: 'prog-7',
    title: 'Cybersecurity & Compliance Fundamentals',
    slug: 'cybersecurity-compliance',
    category: 'Cybersecurity',
    format: 'In-Person',
    duration: '10 Weeks',
    startDate: 'November 24, 2026',
    applicationDeadline: 'November 15, 2026',
    prerequisites: 'Basic understanding of computer networks and operating systems.',
    description: 'Learn foundational defensive security, vulnerability analysis within authorized scope, identity and access management, encryption protocols, and compliance framework readiness.',
    curriculum: [
      'Module 1: Security Principles, Threat Modeling & Ethics',
      'Module 2: Network Defense, Firewalls & Traffic Inspection',
      'Module 3: Authorized Web Application Vulnerability Assessment',
      'Module 4: Cryptography & Identity Access Management (IAM)',
      'Module 5: Incident Triage & Data Privacy Compliance',
    ],
    status: 'Open',
  },
  {
    id: 'prog-8',
    title: 'Product Discovery & Tech Strategy',
    slug: 'product-discovery-strategy',
    category: 'Product Strategy',
    format: 'Weekend Intensive',
    duration: '6 Weeks',
    startDate: 'November 14, 2026',
    applicationDeadline: 'November 7, 2026',
    prerequisites: 'Aspiring product managers, startup founders, or business analysts.',
    description: 'Learn how to de-risk technology investments before writing code. Formulate customer hypotheses, validate market demand, prioritize features, and draft crisp technical roadmaps.',
    curriculum: [
      'Module 1: Problem Space Definition & Customer Discovery',
      'Module 2: Competitor Landscape & Market Opportunity Sizing',
      'Module 3: MVP Scoping & Feature Prioritization Matrices',
      'Module 4: Metrics That Matter: Product Analytics & KPIs',
      'Module 5: Pitching to Engineering Teams & Stakeholder Alignment',
    ],
    status: 'Open',
  },
];

const initialSiteSettings: SiteSettings = {
  brandName: 'OmedanTech',
  slogan: 'Innovate. Build. Scale.',
  marqueeText: 'Innovation and Creativity in Tech',
  developerCredit: 'Developed by OmedanTech Team 2026.',
  supportEmail: 'info@omedantech.com',
  phone: '+234 802 000 0626',
  address: 'OmedanTech Starthub, Innovation Way, Tech Hub District',
  mission: 'To empower individuals and businesses through technology innovation, practical training, and reliable digital solutions.',
  vision: 'To become a trusted technology solution center for software engineering, AI innovation, and digital skills development.',
  coreValues: [
    'Innovation',
    'Creativity',
    'Excellence',
    'Integrity',
    'Collaboration',
    'Continuous Learning',
  ],
};

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    try {
      const dataDir = path.dirname(DB_FILE);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw) as Partial<DatabaseSchema>;
        // Ensure required fields exist in case of schema update
        if (parsed.users && parsed.services && parsed.programs) {
          const users = normalizeUsers(parsed.users);
          const demoUserIds = new Set<string>();
          for (const user of users) {
            if (
              (user.id === 'usr-admin-1' && user.email.toLowerCase() === 'admin@omedantech.com') ||
              (user.id === 'usr-applicant-1' && user.email.toLowerCase() === 'applicant@omedantech.com')
            ) {
              demoUserIds.add(user.id);
            }
          }
          const filteredUsers = users.filter((user) => !demoUserIds.has(user.id));
          const applications = (parsed.applications || []).filter(
            (application) => !(application.id === 'app-seed-1' && demoUserIds.has(application.userId))
          );
          const statusHistory = (parsed.statusHistory || []).filter(
            (history) => history.applicationId !== 'app-seed-1'
          );
          const bootstrapAdmin = getBootstrapAdmin();
          if (bootstrapAdmin && !filteredUsers.some((user) => user.role === 'admin')) filteredUsers.push(bootstrapAdmin);
          const migrated: DatabaseSchema = {
            ...parsed,
            users: filteredUsers,
            applications,
            statusHistory,
            attendanceRecords: parsed.attendanceRecords || [],
            performanceRecords: parsed.performanceRecords || [],
            auditLogs: parsed.auditLogs || [],
          } as DatabaseSchema;
          if (filteredUsers.some((user) => user.role === 'admin')) {
            this.saveDatabase(migrated);
            return migrated;
          }
        }
      }
    } catch (e) {
      console.warn('Error reading db.json, generating fresh schema', e);
    }

    // Admin accounts are provisioned with server-side bootstrap credentials or by an administrator.
    const bootstrapAdmin = getBootstrapAdmin();

    const schema: DatabaseSchema = {
      users: bootstrapAdmin ? [bootstrapAdmin] : [],
      services: initialServices,
      teamMembers: initialTeam,
      trainees: initialTrainees,
      programs: initialPrograms,
      applications: [],
      statusHistory: [],
      contactMessages: [
        {
          id: 'msg-1',
          name: 'Aniebiet James',
          email: 'aniebiet@gmail.com',
          phone: '+234 803 111 2233',
          category: 'Training Inquiries',
          message: 'Hello OmedanTech team, I would like to inquire if there is any financial aid or flexible installment option for the Full-Stack Web Development cohort?',
          status: 'new',
          createdAt: '2026-10-12T09:15:00.000Z',
        },
      ],
      siteSettings: initialSiteSettings,
      auditLogs: [
        {
          id: 'log-1',
          action: 'SYSTEM_BOOT',
          details: 'OmedanTech Starthub core database initialized.',
          timestamp: new Date().toISOString(),
        },
      ],
      attendanceRecords: [],
      performanceRecords: [],
    };

    if (!schema.users.some((user) => user.role === 'admin')) {
      throw new Error('No administrator account exists. Configure BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD.');
    }
    this.saveDatabase(schema);
    return schema;
  }

  private saveDatabase(dataToSave?: DatabaseSchema) {
    try {
      const dataDir = path.dirname(DB_FILE);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave || this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to write db.json', e);
    }
  }

  // Users
  getUsers() {
    return this.data.users;
  }

  getUserById(id: string) {
    return this.data.users.find((u) => u.id === id);
  }

  getUserByEmail(email: string) {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  addUser(user: User & { passwordHash: string; salt: string }) {
    this.data.users.push(user);
    this.saveDatabase();
    return user;
  }

  getStaffUsers() {
    return this.data.users.filter((user) => user.role === 'staff');
  }

  getEnrolledTrainees(programId: string) {
    const userIds = new Set(
      this.data.applications
        .filter((application) => application.programId === programId && application.status === 'Accepted')
        .map((application) => application.userId)
    );
    return this.data.users
      .filter((user) => user.role === 'trainee' && userIds.has(user.id))
      .map(({ id, firstName, lastName, email, phone }) => ({ id, firstName, lastName, email, phone }));
  }

  getAttendanceRecords(programId?: string) {
    return this.data.attendanceRecords
      .filter((record) => !programId || record.programId === programId)
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  addAttendanceRecord(record: AttendanceRecord) {
    this.data.attendanceRecords.push(record);
    this.saveDatabase();
    return record;
  }

  getPerformanceRecords(programId?: string) {
    return this.data.performanceRecords
      .filter((record) => !programId || record.programId === programId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  addPerformanceRecord(record: PerformanceRecord) {
    this.data.performanceRecords.push(record);
    this.saveDatabase();
    return record;
  }

  updateUser(id: string, partial: Partial<User>) {
    const idx = this.data.users.findIndex((u) => u.id === id);
    if (idx !== -1) {
      this.data.users[idx] = { ...this.data.users[idx], ...partial };
      this.saveDatabase();
      return this.data.users[idx];
    }
    return null;
  }

  updatePassword(userId: string, newPassword: string) {
    const idx = this.data.users.findIndex((u) => u.id === userId);
    if (idx !== -1) {
      const pass = createPasswordRecord(newPassword);
      this.data.users[idx].salt = pass.salt;
      this.data.users[idx].passwordHash = pass.passwordHash;
      this.saveDatabase();
      return true;
    }
    return false;
  }

  // Services
  getServices() {
    return [...this.data.services].sort((a, b) => a.order - b.order);
  }

  getServiceBySlug(slug: string) {
    return this.data.services.find((s) => s.slug === slug);
  }

  updateService(id: string, update: Partial<ServiceItem>) {
    const idx = this.data.services.findIndex((s) => s.id === id);
    if (idx !== -1) {
      this.data.services[idx] = { ...this.data.services[idx], ...update };
      this.saveDatabase();
      return this.data.services[idx];
    }
    return null;
  }

  // Team
  getTeamMembers() {
    return [...this.data.teamMembers].sort((a, b) => a.order - b.order);
  }

  addTeamMember(member: TeamMember) {
    this.data.teamMembers.push(member);
    this.saveDatabase();
    return member;
  }

  updateTeamMember(id: string, update: Partial<TeamMember>) {
    const idx = this.data.teamMembers.findIndex((m) => m.id === id);
    if (idx !== -1) {
      this.data.teamMembers[idx] = { ...this.data.teamMembers[idx], ...update };
      this.saveDatabase();
      return this.data.teamMembers[idx];
    }
    return null;
  }

  // Trainees
  getTrainees(onlyApproved = false) {
    if (onlyApproved) {
      return this.data.trainees.filter((t) => t.isApproved);
    }
    return this.data.trainees;
  }

  addTrainee(trainee: TraineeShowcase) {
    this.data.trainees.push(trainee);
    this.saveDatabase();
    return trainee;
  }

  updateTrainee(id: string, update: Partial<TraineeShowcase>) {
    const idx = this.data.trainees.findIndex((t) => t.id === id);
    if (idx !== -1) {
      this.data.trainees[idx] = { ...this.data.trainees[idx], ...update };
      this.saveDatabase();
      return this.data.trainees[idx];
    }
    return null;
  }

  deleteTrainee(id: string) {
    this.data.trainees = this.data.trainees.filter((t) => t.id !== id);
    this.saveDatabase();
  }

  // Programs
  getPrograms() {
    return this.data.programs;
  }

  getProgramBySlug(slug: string) {
    return this.data.programs.find((p) => p.slug === slug);
  }

  getProgramById(id: string) {
    return this.data.programs.find((p) => p.id === id);
  }

  addProgram(program: TrainingProgram) {
    this.data.programs.push(program);
    this.saveDatabase();
    return program;
  }

  updateProgram(id: string, update: Partial<TrainingProgram>) {
    const idx = this.data.programs.findIndex((p) => p.id === id);
    if (idx !== -1) {
      this.data.programs[idx] = { ...this.data.programs[idx], ...update };
      this.saveDatabase();
      return this.data.programs[idx];
    }
    return null;
  }

  deleteProgram(id: string) {
    this.data.programs = this.data.programs.filter((p) => p.id !== id);
    this.saveDatabase();
  }

  // Applications
  getApplications(filterUserId?: string) {
    if (filterUserId) {
      return this.data.applications.filter((a) => a.userId === filterUserId);
    }
    return this.data.applications;
  }

  getApplicationById(id: string) {
    return this.data.applications.find((a) => a.id === id || a.referenceNo === id);
  }

  hasUserApplied(userId: string, programId: string): boolean {
    return this.data.applications.some(
      (a) => a.userId === userId && a.programId === programId && a.status !== 'Withdrawn'
    );
  }

  addApplication(app: Application) {
    this.data.applications.push(app);
    this.addStatusHistory({
      id: 'hist-' + Date.now(),
      applicationId: app.id,
      oldStatus: 'Draft',
      newStatus: app.status,
      changedBy: app.userEmail,
      notes: 'Application submitted successfully.',
      timestamp: new Date().toISOString(),
    });
    this.saveDatabase();
    return app;
  }

  updateApplication(id: string, update: Partial<Application>, changedBy = 'System', notes?: string) {
    const idx = this.data.applications.findIndex((a) => a.id === id || a.referenceNo === id);
    if (idx !== -1) {
      const oldStatus = this.data.applications[idx].status;
      this.data.applications[idx] = {
        ...this.data.applications[idx],
        ...update,
        updatedAt: new Date().toISOString(),
      };

      if (update.status && update.status !== oldStatus) {
        this.addStatusHistory({
          id: 'hist-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
          applicationId: this.data.applications[idx].id,
          oldStatus,
          newStatus: update.status,
          changedBy,
          notes: notes || `Status updated to ${update.status}`,
          timestamp: new Date().toISOString(),
        });
      }

      this.saveDatabase();
      return this.data.applications[idx];
    }
    return null;
  }

  // Status History
  getStatusHistory(applicationId: string) {
    return this.data.statusHistory
      .filter((h) => h.applicationId === applicationId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  addStatusHistory(history: ApplicationStatusHistory) {
    this.data.statusHistory.push(history);
    this.saveDatabase();
  }

  // Contact Messages
  getContactMessages() {
    return [...this.data.contactMessages].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  addContactMessage(msg: Omit<ContactMessage, 'id' | 'status' | 'createdAt'>) {
    const newMsg: ContactMessage = {
      id: 'msg-' + Date.now(),
      status: 'new',
      createdAt: new Date().toISOString(),
      ...msg,
    };
    this.data.contactMessages.push(newMsg);
    this.saveDatabase();
    return newMsg;
  }

  updateContactMessage(id: string, update: Partial<ContactMessage>) {
    const idx = this.data.contactMessages.findIndex((m) => m.id === id);
    if (idx !== -1) {
      this.data.contactMessages[idx] = { ...this.data.contactMessages[idx], ...update };
      this.saveDatabase();
      return this.data.contactMessages[idx];
    }
    return null;
  }

  // Settings
  getSiteSettings() {
    return this.data.siteSettings;
  }

  updateSiteSettings(settings: Partial<SiteSettings>) {
    this.data.siteSettings = { ...this.data.siteSettings, ...settings };
    this.saveDatabase();
    return this.data.siteSettings;
  }

  // Audit Logs
  getAuditLogs() {
    return [...this.data.auditLogs].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  logAction(action: string, details: string, userId?: string) {
    this.data.auditLogs.push({
      id: 'log-' + Date.now(),
      action,
      details,
      userId,
      timestamp: new Date().toISOString(),
    });
    this.saveDatabase();
  }

  // Stats
  getStats() {
    const totalUsers = this.data.users.filter((user) => user.role === 'trainee').length;
    const totalApplications = this.data.applications.length;
    const awaitingReview = this.data.applications.filter((a) => a.status === 'Submitted' || a.status === 'Under Review').length;
    const openPrograms = this.data.programs.filter((p) => p.status === 'Open').length;
    const acceptedApplications = this.data.applications.filter((a) => a.status === 'Accepted').length;
    const totalServices = this.data.services.length;

    return {
      totalUsers,
      totalApplications,
      awaitingReview,
      openPrograms,
      acceptedApplications,
      totalServices,
    };
  }
}

export const db = new Database();
