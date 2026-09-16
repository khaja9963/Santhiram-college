export type UserRole = 'STUDENT' | 'FACULTY' | 'ADMIN';
export type UserStatus = 'INVITED' | 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED' | 'GRADUATED';

export interface User {
  id: string;
  user_code?: string;
  email: string;
  full_name: string;
  name?: string;
  role: UserRole;
  status?: UserStatus | string;
  department_id?: string;
  department_name?: string;
  mobile?: string;
  first_login?: boolean;
  email_verified?: boolean;
  avatar_url?: string;
  is_active: boolean;
  student_details?: any;
  faculty_details?: any;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  short_name: string;
  description: string;
  hod_name: string;
  hod_email: string;
  established_year: number;
  intake: number;
  total_faculty: number;
  labs_count: number;
}

export interface NewsItem {
  id: string;
  title: string;
  category: string;
  content: string;
  is_flash: boolean;
  is_pinned: boolean;
  date: string;
  attachment_url?: string;
}

export interface CollegeEvent {
  id: string;
  title: string;
  department: string;
  category: string;
  date: string;
  time: string;
  location: string;
  description: string;
  organizer: string;
  registration_link?: string;
  is_upcoming: boolean;
}

export interface PlacementStat {
  academic_year: string;
  company_name: string;
  logo_url?: string;
  package_lpa: number;
  students_placed: number;
  roles: string;
}

export interface SubjectAttendance {
  subject_code: string;
  subject_name: string;
  total_classes: number;
  attended_classes: number;
  percentage: number;
}

export interface StudentAttendanceOverview {
  overall_percentage: number;
  total_classes: number;
  total_attended: number;
  is_low_attendance: boolean;
  subjects: SubjectAttendance[];
}

export interface MarksRecord {
  subject_code: string;
  subject_name: string;
  exam_type: string;
  scored_marks: number;
  max_marks: number;
  grade: string;
}

export interface SemesterResult {
  semester: number;
  academic_year: string;
  sgpa: number;
  cgpa: number;
  backlogs: number;
  status: string;
  published_date: string;
}

export interface FeeStatus {
  academic_year: string;
  fee_type: string;
  total_amount: number;
  paid_amount: number;
  due_amount: number;
  status: string;
  receipt_number: string;
  payment_date: string;
}

export interface Citation {
  document_title: string;
  category: string;
  page_number: number;
  relevance_snippet: string;
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Citation[];
  timestamp: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct_option: string;
  explanation: string;
}

export interface ResumeAnalysis {
  technical_skills: string[];
  soft_skills: string[];
  education_summary: string;
  experience_level: string;
  skill_gap: string[];
  recommended_roles: string[];
  improvement_suggestions: string[];
  ats_score: number;
}

export interface MockInterviewFeedback {
  score: number;
  relevance: string;
  technical_depth: string;
  missing_concepts: string[];
  clarity_feedback: string;
  sample_model_answer: string;
}
