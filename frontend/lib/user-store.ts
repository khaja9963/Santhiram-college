'use client';

export interface AccessRequest {
  id: string;
  type: 'STUDENT' | 'FACULTY';
  fullName: string;
  idCardNumber?: string; // Student College ID Card / Roll No
  empId?: string;        // Faculty Employee ID
  email: string;
  mobile: string;
  department: string;
  yearOrDesignation: string; // e.g. "B.Tech 1st Year (CSE)" or "Assistant Professor"
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
  approvedAt?: string;
  assignedLoginId?: string;
  tempPassword?: string;
  rejectionReason?: string;
  emailSent?: boolean;
}

export interface StoredUser {
  id: string;
  user_code: string;
  email: string;
  full_name: string;
  name: string;
  role: 'STUDENT' | 'FACULTY' | 'ADMIN';
  password: string;
  mustChangePassword?: boolean;
  status: 'ACTIVE' | 'INVITED' | 'SUSPENDED';
  department_name?: string;
  mobile?: string;
  created_at: string;
}

export interface DispatchedEmail {
  id: string;
  to: string;
  recipientName: string;
  subject: string;
  loginId: string;
  tempPassword: string;
  role: 'STUDENT' | 'FACULTY';
  sentAt: string;
}

const DEFAULT_USERS: StoredUser[] = [
  {
    id: 'admin-001',
    user_code: 'ADM-001',
    email: 'admin@srecnandyal.edu.in',
    full_name: 'Dr. M. Santhiramudu',
    name: 'Dr. M. Santhiramudu',
    role: 'ADMIN',
    password: 'Admin@Srec2026',
    mustChangePassword: false,
    status: 'ACTIVE',
    department_name: 'Central Administration',
    mobile: '9848011223',
    created_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'student-001',
    user_code: '22X51A0501',
    email: 'student@srecnandyal.edu.in',
    full_name: 'Sai Teja Reddy',
    name: 'Sai Teja Reddy',
    role: 'STUDENT',
    password: 'Student@Srec2026',
    mustChangePassword: false,
    status: 'ACTIVE',
    department_name: 'Computer Science & Engineering',
    mobile: '9848022338',
    created_at: '2026-02-15T00:00:00.000Z',
  },
  {
    id: 'faculty-001',
    user_code: 'FAC-0104',
    email: 'faculty@srecnandyal.edu.in',
    full_name: 'Dr. K. Subba Reddy',
    name: 'Dr. K. Subba Reddy',
    role: 'FACULTY',
    password: 'Faculty@Srec2026',
    mustChangePassword: false,
    status: 'ACTIVE',
    department_name: 'Computer Science & Engineering',
    mobile: '9848033449',
    created_at: '2026-01-10T00:00:00.000Z',
  },
];

const INITIAL_SAMPLE_REQUESTS: AccessRequest[] = [
  {
    id: 'REQ-STU-2026-8819',
    type: 'STUDENT',
    fullName: 'K. Sneha Latha',
    idCardNumber: '24X51A0588',
    email: 'sneha.latha@gmail.com',
    mobile: '9440182736',
    department: 'Computer Science & Engineering',
    yearOrDesignation: 'B.Tech 1st Year (CSE)',
    status: 'PENDING',
    submittedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'REQ-FAC-2026-4102',
    type: 'FACULTY',
    fullName: 'Dr. V. Ramanjaneyulu',
    empId: 'FAC-0118',
    email: 'ramanjaneyulu.v@gmail.com',
    mobile: '9866123450',
    department: 'Artificial Intelligence & Machine Learning',
    yearOrDesignation: 'Associate Professor',
    status: 'PENDING',
    submittedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
];

export const UserStore = {
  // Get all registered users
  getUsers(): StoredUser[] {
    if (typeof window === 'undefined') return DEFAULT_USERS;
    const raw = localStorage.getItem('srec_users');
    if (!raw) {
      localStorage.setItem('srec_users', JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_USERS;
    }
  },

  // Save users list
  saveUsers(users: StoredUser[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem('srec_users', JSON.stringify(users));
  },

  // Find user by identifier (user_code or email or mobile)
  findUser(identifier: string): StoredUser | null {
    const clean = identifier.trim().toLowerCase();
    const users = this.getUsers();
    return (
      users.find(
        (u) =>
          u.user_code.toLowerCase() === clean ||
          u.email.toLowerCase() === clean ||
          (u.mobile && u.mobile.toLowerCase() === clean)
      ) || null
    );
  },

  // Verify credentials
  verifyCredentials(identifier: string, pass: string): { user: StoredUser | null; error?: string } {
    const user = this.findUser(identifier);
    if (!user) {
      return { user: null, error: 'User account not found. If you are a new student or faculty, please submit an Access Request.' };
    }
    if (user.password !== pass) {
      return { user: null, error: 'Incorrect password. Please verify your credentials or contact Administration.' };
    }
    if (user.status !== 'ACTIVE') {
      return { user: null, error: `Your account status is ${user.status}. Please contact SREC ICT Administration.` };
    }
    return { user };
  },

  // Change user password
  changePassword(userId: string, newPassword: string): boolean {
    const users = this.getUsers();
    const idx = users.findIndex((u) => u.id === userId || u.user_code === userId);
    if (idx === -1) return false;
    users[idx].password = newPassword;
    users[idx].mustChangePassword = false;
    this.saveUsers(users);
    return true;
  },

  // ACCESS REQUESTS
  getRequests(): AccessRequest[] {
    if (typeof window === 'undefined') return INITIAL_SAMPLE_REQUESTS;
    const raw = localStorage.getItem('srec_access_requests');
    if (!raw) {
      localStorage.setItem('srec_access_requests', JSON.stringify(INITIAL_SAMPLE_REQUESTS));
      return INITIAL_SAMPLE_REQUESTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_SAMPLE_REQUESTS;
    }
  },

  saveRequests(reqs: AccessRequest[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem('srec_access_requests', JSON.stringify(reqs));
  },

  submitStudentRequest(data: {
    fullName: string;
    idCardNumber: string;
    email: string;
    mobile: string;
    department: string;
    year: string;
  }): AccessRequest {
    const reqs = this.getRequests();
    const id = `REQ-STU-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReq: AccessRequest = {
      id,
      type: 'STUDENT',
      fullName: data.fullName.trim(),
      idCardNumber: data.idCardNumber.trim().toUpperCase(),
      email: data.email.trim().toLowerCase(),
      mobile: data.mobile.trim(),
      department: data.department,
      yearOrDesignation: data.year,
      status: 'PENDING',
      submittedAt: new Date().toISOString(),
    };
    this.saveRequests([newReq, ...reqs]);
    return newReq;
  },

  submitFacultyRequest(data: {
    fullName: string;
    empId: string;
    email: string;
    mobile: string;
    department: string;
    designation: string;
  }): AccessRequest {
    const reqs = this.getRequests();
    const id = `REQ-FAC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReq: AccessRequest = {
      id,
      type: 'FACULTY',
      fullName: data.fullName.trim(),
      empId: data.empId.trim().toUpperCase(),
      email: data.email.trim().toLowerCase(),
      mobile: data.mobile.trim(),
      department: data.department,
      yearOrDesignation: data.designation,
      status: 'PENDING',
      submittedAt: new Date().toISOString(),
    };
    this.saveRequests([newReq, ...reqs]);
    return newReq;
  },

  // Admin approves request & creates login credentials
  approveRequest(
    requestId: string,
    loginId: string,
    tempPassword: string
  ): { success: boolean; user?: StoredUser; emailDispatch?: DispatchedEmail } {
    const reqs = this.getRequests();
    const idx = reqs.findIndex((r) => r.id === requestId);
    if (idx === -1) return { success: false };

    const req = reqs[idx];
    req.status = 'APPROVED';
    req.approvedAt = new Date().toISOString();
    req.assignedLoginId = loginId.trim();
    req.tempPassword = tempPassword.trim();
    req.emailSent = true;
    this.saveRequests(reqs);

    // Create user in srec_users
    const users = this.getUsers();
    const newUser: StoredUser = {
      id: `${req.type.toLowerCase()}-${Date.now()}`,
      user_code: loginId.trim(),
      email: req.email,
      full_name: req.fullName,
      name: req.fullName,
      role: req.type,
      password: tempPassword.trim(),
      mustChangePassword: true, // Force password change on first login!
      status: 'ACTIVE',
      department_name: req.department,
      mobile: req.mobile,
      created_at: new Date().toISOString(),
    };

    // Remove any previous conflicting entry with same user_code
    const filtered = users.filter((u) => u.user_code.toLowerCase() !== loginId.trim().toLowerCase());
    this.saveUsers([newUser, ...filtered]);

    // Record dispatched email
    const emailDispatch: DispatchedEmail = {
      id: `EMAIL-${Date.now()}`,
      to: req.email,
      recipientName: req.fullName,
      subject: 'Welcome to SREC Smart Campus - Official Login Credentials',
      loginId: loginId.trim(),
      tempPassword: tempPassword.trim(),
      role: req.type,
      sentAt: new Date().toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    this.logEmail(emailDispatch);

    return { success: true, user: newUser, emailDispatch };
  },

  // Admin rejects request
  rejectRequest(requestId: string, reason: string): boolean {
    const reqs = this.getRequests();
    const idx = reqs.findIndex((r) => r.id === requestId);
    if (idx === -1) return false;
    reqs[idx].status = 'REJECTED';
    reqs[idx].rejectionReason = reason;
    this.saveRequests(reqs);
    return true;
  },

  // Dispatched Emails Log
  getEmails(): DispatchedEmail[] {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem('srec_dispatched_emails');
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  logEmail(email: DispatchedEmail) {
    if (typeof window === 'undefined') return;
    const existing = this.getEmails();
    localStorage.setItem('srec_dispatched_emails', JSON.stringify([email, ...existing]));
  },

  generateRandomPassword(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const nums = '23456789';
    const specials = '!@#$%&*';
    const randomChar = chars[Math.floor(Math.random() * chars.length)];
    const randomSpecial = specials[Math.floor(Math.random() * specials.length)];
    const randomNum = Math.floor(100 + Math.random() * 900);
    return `Srec@${new Date().getFullYear()}${randomSpecial}${randomChar}${randomNum}`;
  },
};
