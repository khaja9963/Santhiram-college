import { clientRAGEngine } from './rag-client';
import { StudyAssistantClient, PlacementAssistantClient } from './study-placement-client';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('srec_token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || `Request failed with status ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.warn(`API call ${endpoint} error:`, error);
    throw error;
  }
}

// API Services
export const CollegeAPI = {
  getStats: () => apiFetch<any>('/college/stats'),
  getDepartments: () => apiFetch<any[]>('/college/departments'),
  getDepartment: (code: string) => apiFetch<any>(`/college/departments/${code}`),
  getNews: () => apiFetch<any[]>('/college/news'),
  getEvents: () => apiFetch<any[]>('/college/events'),
  getPlacements: () => apiFetch<any[]>('/college/placements'),
};

export const AuthAPI = {
  login: (credentials: { identifier?: string; email?: string; password: string }) =>
    apiFetch<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        identifier: credentials.identifier || credentials.email,
        email: credentials.email || credentials.identifier,
        password: credentials.password,
      }),
    }),
  logout: () => apiFetch<any>('/auth/logout', { method: 'POST' }),
  getMe: () => apiFetch<any>('/auth/me'),
  verifyActivationToken: (token: string) =>
    apiFetch<any>(`/auth/verify-activation-token?token=${encodeURIComponent(token)}`),
  activateAccount: (data: { token: string; password: string; confirm_password: string }) =>
    apiFetch<any>('/auth/activate', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  forgotPassword: (identifier: string) =>
    apiFetch<any>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ identifier }),
    }),
  verifyResetToken: (token: string) =>
    apiFetch<any>(`/auth/verify-reset-token?token=${encodeURIComponent(token)}`),
  resetPassword: (data: { token: string; password: string; confirm_password: string }) =>
    apiFetch<any>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  changePassword: (data: { current_password: string; new_password: string; confirm_new_password: string }) =>
    apiFetch<any>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateProfile: (data: { mobile?: string; address?: string; phone?: string }) =>
    apiFetch<any>('/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

export const StudentAPI = {
  getProfile: () => apiFetch<any>('/student/profile'),
  getAttendance: () => apiFetch<any>('/student/attendance'),
  getMarks: () => apiFetch<any[]>('/student/marks'),
  getResults: () => apiFetch<any[]>('/student/results'),
  getFees: () => apiFetch<any>('/student/fees'),
};

export const FacultyAPI = {
  getSummary: () => apiFetch<any>('/faculty/dashboard-summary'),
  getStudents: () => apiFetch<any[]>('/faculty/students'),
  markAttendance: (data: any) =>
    apiFetch<any>('/faculty/attendance', { method: 'POST', body: JSON.stringify(data) }),
  uploadMarks: (data: any) =>
    apiFetch<any>('/faculty/marks', { method: 'POST', body: JSON.stringify(data) }),
  createAssignment: (data: any) =>
    apiFetch<any>('/faculty/assignments', { method: 'POST', body: JSON.stringify(data) }),
};

export const AdminAPI = {
  getDashboardStats: () => apiFetch<any>('/admin/dashboard-stats'),
  getUserStats: () => apiFetch<any>('/admin/users/stats'),
  getUsers: (params: {
    search?: string;
    role?: string;
    status?: string;
    department?: string;
    sort_by?: string;
    sort_order?: string;
    page?: number;
    limit?: number;
  } = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.role) query.set('role', params.role);
    if (params.status) query.set('status', params.status);
    if (params.department) query.set('department', params.department);
    if (params.sort_by) query.set('sort_by', params.sort_by);
    if (params.sort_order) query.set('sort_order', params.sort_order);
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    return apiFetch<any>(`/admin/users?${query.toString()}`);
  },
  getUser: (id: string) => apiFetch<any>(`/admin/users/${id}`),
  createStudent: (data: {
    student_id: string;
    full_name: string;
    college_email: string;
    mobile_number?: string;
    department: string;
    year: number;
    semester: number;
    section: string;
    admission_year: number;
    status?: string;
  }) => apiFetch<any>('/admin/users/students', { method: 'POST', body: JSON.stringify(data) }),
  createFaculty: (data: {
    employee_id: string;
    full_name: string;
    college_email: string;
    mobile_number?: string;
    department: string;
    designation: string;
    joining_year: number;
    status?: string;
  }) => apiFetch<any>('/admin/users/faculty', { method: 'POST', body: JSON.stringify(data) }),
  updateUserStatus: (id: string, status: string, reason?: string) =>
    apiFetch<any>(`/admin/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, reason }),
    }),
  resendActivation: (id: string) =>
    apiFetch<any>(`/admin/users/${id}/resend-activation`, { method: 'POST' }),
  resetAccount: (id: string) =>
    apiFetch<any>(`/admin/users/${id}/reset-account`, { method: 'POST' }),
  getAuditLogs: (params: { user_id?: string; action?: string; role?: string; page?: number; limit?: number } = {}) => {
    const query = new URLSearchParams();
    if (params.user_id) query.set('user_id', params.user_id);
    if (params.action) query.set('action', params.action);
    if (params.role) query.set('role', params.role);
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    return apiFetch<any>(`/admin/audit-logs?${query.toString()}`);
  },
  getDocuments: () => apiFetch<any[]>('/admin/documents'),
  uploadDocument: async (formData: FormData) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('srec_token') : null;
    const res = await fetch(`${API_BASE}/admin/documents/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });
    if (!res.ok) throw new Error('Document upload failed');
    return res.json();
  },
  deleteDocument: (id: string) =>
    apiFetch<any>(`/admin/documents/${id}`, { method: 'DELETE' }),
};

export const AI_API = {
  chat: async (message: string, conversationId?: string, department?: string) => {
    try {
      // Attempt backend call first with a fast timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const res = await apiFetch<any>('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message, conversation_id: conversationId, department }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return res;
    } catch {
      // Seamlessly fall back to client-side RAG engine for static deployments / offline / GitHub Pages
      return await clientRAGEngine.answerQuery(message, department);
    }
  },

  explainConcept: async (subject: string, topic: string, difficulty = 'intermediate') => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const res = await apiFetch<any>('/ai/study/explain', {
        method: 'POST',
        body: JSON.stringify({ subject, topic, difficulty }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return res;
    } catch {
      return await StudyAssistantClient.explainConcept(subject, topic, difficulty);
    }
  },

  generateQuiz: async (subject: string, topic: string, count = 5) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const res = await apiFetch<any>('/ai/study/quiz', {
        method: 'POST',
        body: JSON.stringify({ subject, topic, count }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return res;
    } catch {
      return await StudyAssistantClient.generateQuiz(subject, topic, count);
    }
  },

  evaluateQuiz: async (subject: string, userAnswers: Record<number, string>, questions: any[]) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const res = await apiFetch<any>('/ai/study/evaluate', {
        method: 'POST',
        body: JSON.stringify({ subject, user_answers: userAnswers, questions }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return res;
    } catch {
      return await StudyAssistantClient.evaluateQuiz(subject, userAnswers, questions);
    }
  },

  analyzeResume: async (resumeText: string, targetRole = 'Software Development Engineer') => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const res = await apiFetch<any>('/ai/placement/analyze-resume', {
        method: 'POST',
        body: JSON.stringify({ resume_text: resumeText, target_role: targetRole }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return res;
    } catch {
      return await PlacementAssistantClient.analyzeResume(resumeText, targetRole);
    }
  },

  getInterviewQuestion: async (role = 'Python Developer', questionNumber = 1) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const res = await apiFetch<any>(
        `/ai/placement/mock-interview/question?role=${encodeURIComponent(role)}&question_number=${questionNumber}`,
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);
      return res;
    } catch {
      return await PlacementAssistantClient.getInterviewQuestion(role, questionNumber);
    }
  },

  submitInterviewAnswer: async (question: string, studentAnswer: string, roleTarget: string, questionNumber = 1) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const res = await apiFetch<any>('/ai/placement/mock-interview/submit', {
        method: 'POST',
        body: JSON.stringify({
          question,
          student_answer: studentAnswer,
          role_target: roleTarget,
          question_number: questionNumber,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return res;
    } catch {
      return await PlacementAssistantClient.submitInterviewAnswer(
        question,
        studentAnswer,
        roleTarget,
        questionNumber
      );
    }
  },
};

