// Unified Attendance Store for Santhiram Engineering College (Autonomous)
// Synchronizes Faculty Attendance Marking, All Candidates Analytics, and Student Portal Views

export interface CandidateProfile {
  id: string;
  roll: string;
  name: string;
  section: string;
  department: string;
  semester: number;
  subjectBaseline: Record<string, { baseAttended: number; baseTotal: number }>;
}

export interface StudentRecord {
  id: string;
  roll: string;
  name: string;
  status: 'PRESENT' | 'ABSENT';
}

export interface AttendanceSession {
  id: string;
  facultyId: string;
  facultyName: string;
  subject: string;
  subjectCode: string;
  section: string;
  date: string;
  period: number;
  periodTime: string;
  presentCount: number;
  totalCount: number;
  timestamp: string;
  records: StudentRecord[];
}

export interface SubjectInfo {
  code: string;
  name: string;
  section: string;
  fullName: string;
}

export const AVAILABLE_SUBJECTS: SubjectInfo[] = [
  { code: '20A05601T', name: 'Database Management Systems', section: 'CSE-III-A', fullName: '20A05601T - DBMS (CSE-III-A)' },
  { code: '20A05603T', name: 'Machine Learning & AI', section: 'CSM-III-B', fullName: '20A05603T - Machine Learning (CSM-III-B)' },
  { code: '20A05602T', name: 'Operating Systems', section: 'CSE-III-B', fullName: '20A05602T - Operating Systems (CSE-III-B)' },
];

export const SECTION_TO_SUBJECT: Record<string, SubjectInfo> = {
  'CSE-III-A': AVAILABLE_SUBJECTS[0],
  'CSM-III-B': AVAILABLE_SUBJECTS[1],
  'CSE-III-B': AVAILABLE_SUBJECTS[2],
};

export const PERIOD_SLOTS = [
  { id: 1, name: 'Period 1', time: '09:10 AM - 10:00 AM' },
  { id: 2, name: 'Period 2', time: '10:00 AM - 10:50 AM' },
  { id: 3, name: 'Period 3', time: '11:10 AM - 12:00 PM' },
  { id: 4, name: 'Period 4', time: '12:00 PM - 12:50 PM' },
  { id: 5, name: 'Period 5', time: '01:40 PM - 02:30 PM' },
  { id: 6, name: 'Period 6', time: '02:30 PM - 03:20 PM' },
  { id: 7, name: 'Period 7', time: '03:20 PM - 04:10 PM' },
];

export const CANDIDATE_ROSTER: CandidateProfile[] = [
  // CSE-III-A
  {
    id: '1',
    roll: '22X51A0501',
    name: 'Sai Teja Reddy',
    section: 'CSE-III-A',
    department: 'Computer Science & Engineering',
    semester: 6,
    subjectBaseline: {
      '20A05601T': { baseAttended: 43, baseTotal: 48 },
      '20A05602T': { baseAttended: 39, baseTotal: 46 },
      '20A05603T': { baseAttended: 46, baseTotal: 50 },
      '20A05604T': { baseAttended: 35, baseTotal: 45 },
      '20A05605T': { baseAttended: 38, baseTotal: 44 },
      '20A52201':  { baseAttended: 29, baseTotal: 30 },
    },
  },
  {
    id: '2',
    roll: '22X51A0502',
    name: 'B. Anusha',
    section: 'CSE-III-A',
    department: 'Computer Science & Engineering',
    semester: 6,
    subjectBaseline: {
      '20A05601T': { baseAttended: 44, baseTotal: 48 },
      '20A05602T': { baseAttended: 42, baseTotal: 46 },
      '20A05603T': { baseAttended: 47, baseTotal: 50 },
      '20A05604T': { baseAttended: 40, baseTotal: 45 },
      '20A05605T': { baseAttended: 41, baseTotal: 44 },
      '20A52201':  { baseAttended: 30, baseTotal: 30 },
    },
  },
  {
    id: '3',
    roll: '22X51A0503',
    name: 'C. Harish',
    section: 'CSE-III-A',
    department: 'Computer Science & Engineering',
    semester: 6,
    subjectBaseline: {
      '20A05601T': { baseAttended: 39, baseTotal: 48 },
      '20A05602T': { baseAttended: 36, baseTotal: 46 },
      '20A05603T': { baseAttended: 41, baseTotal: 50 },
      '20A05604T': { baseAttended: 34, baseTotal: 45 },
      '20A05605T': { baseAttended: 35, baseTotal: 44 },
      '20A52201':  { baseAttended: 26, baseTotal: 30 },
    },
  },
  {
    id: '4',
    roll: '22X51A0504',
    name: 'D. Kalyan',
    section: 'CSE-III-A',
    department: 'Computer Science & Engineering',
    semester: 6,
    subjectBaseline: {
      '20A05601T': { baseAttended: 34, baseTotal: 48 }, // 70.8% - Shortage
      '20A05602T': { baseAttended: 32, baseTotal: 46 },
      '20A05603T': { baseAttended: 36, baseTotal: 50 },
      '20A05604T': { baseAttended: 31, baseTotal: 45 },
      '20A05605T': { baseAttended: 32, baseTotal: 44 },
      '20A52201':  { baseAttended: 24, baseTotal: 30 },
    },
  },
  {
    id: '5',
    roll: '22X51A0505',
    name: 'E. Meena',
    section: 'CSE-III-A',
    department: 'Computer Science & Engineering',
    semester: 6,
    subjectBaseline: {
      '20A05601T': { baseAttended: 45, baseTotal: 48 },
      '20A05602T': { baseAttended: 43, baseTotal: 46 },
      '20A05603T': { baseAttended: 48, baseTotal: 50 },
      '20A05604T': { baseAttended: 42, baseTotal: 45 },
      '20A05605T': { baseAttended: 42, baseTotal: 44 },
      '20A52201':  { baseAttended: 29, baseTotal: 30 },
    },
  },
  {
    id: '6',
    roll: '22X51A0506',
    name: 'F. Nithin',
    section: 'CSE-III-A',
    department: 'Computer Science & Engineering',
    semester: 6,
    subjectBaseline: {
      '20A05601T': { baseAttended: 35, baseTotal: 48 }, // 72.9% - Shortage
      '20A05602T': { baseAttended: 33, baseTotal: 46 },
      '20A05603T': { baseAttended: 37, baseTotal: 50 },
      '20A05604T': { baseAttended: 33, baseTotal: 45 },
      '20A05605T': { baseAttended: 34, baseTotal: 44 },
      '20A52201':  { baseAttended: 25, baseTotal: 30 },
    },
  },
  {
    id: '7',
    roll: '22X51A0507',
    name: 'G. Sneha',
    section: 'CSE-III-A',
    department: 'Computer Science & Engineering',
    semester: 6,
    subjectBaseline: {
      '20A05601T': { baseAttended: 42, baseTotal: 48 },
      '20A05602T': { baseAttended: 40, baseTotal: 46 },
      '20A05603T': { baseAttended: 44, baseTotal: 50 },
      '20A05604T': { baseAttended: 39, baseTotal: 45 },
      '20A05605T': { baseAttended: 39, baseTotal: 44 },
      '20A52201':  { baseAttended: 28, baseTotal: 30 },
    },
  },
  {
    id: '8',
    roll: '22X51A0508',
    name: 'K. Rajesh',
    section: 'CSE-III-A',
    department: 'Computer Science & Engineering',
    semester: 6,
    subjectBaseline: {
      '20A05601T': { baseAttended: 33, baseTotal: 48 }, // 68.8% - Detained risk
      '20A05602T': { baseAttended: 31, baseTotal: 46 },
      '20A05603T': { baseAttended: 34, baseTotal: 50 },
      '20A05604T': { baseAttended: 30, baseTotal: 45 },
      '20A05605T': { baseAttended: 30, baseTotal: 44 },
      '20A52201':  { baseAttended: 23, baseTotal: 30 },
    },
  },

  // CSM-III-B (Artificial Intelligence & Machine Learning)
  {
    id: '9',
    roll: '22X51A3301',
    name: 'L. Akhil',
    section: 'CSM-III-B',
    department: 'Computer Science & Machine Learning',
    semester: 6,
    subjectBaseline: {
      '20A05603T': { baseAttended: 46, baseTotal: 50 },
      '20A05601T': { baseAttended: 42, baseTotal: 48 },
      '20A05605T': { baseAttended: 38, baseTotal: 45 },
    },
  },
  {
    id: '10',
    roll: '22X51A3302',
    name: 'M. Swathi',
    section: 'CSM-III-B',
    department: 'Computer Science & Machine Learning',
    semester: 6,
    subjectBaseline: {
      '20A05603T': { baseAttended: 48, baseTotal: 50 },
      '20A05601T': { baseAttended: 45, baseTotal: 48 },
      '20A05605T': { baseAttended: 43, baseTotal: 45 },
    },
  },
  {
    id: '11',
    roll: '22X51A3303',
    name: 'N. Rakesh',
    section: 'CSM-III-B',
    department: 'Computer Science & Machine Learning',
    semester: 6,
    subjectBaseline: {
      '20A05603T': { baseAttended: 36, baseTotal: 50 }, // 72.0% - Shortage
      '20A05601T': { baseAttended: 33, baseTotal: 48 },
      '20A05605T': { baseAttended: 31, baseTotal: 45 },
    },
  },
  {
    id: '12',
    roll: '22X51A3304',
    name: 'P. Sravani',
    section: 'CSM-III-B',
    department: 'Computer Science & Machine Learning',
    semester: 6,
    subjectBaseline: {
      '20A05603T': { baseAttended: 47, baseTotal: 50 },
      '20A05601T': { baseAttended: 44, baseTotal: 48 },
      '20A05605T': { baseAttended: 41, baseTotal: 45 },
    },
  },
  {
    id: '13',
    roll: '22X51A3305',
    name: 'R. Karthik',
    section: 'CSM-III-B',
    department: 'Computer Science & Machine Learning',
    semester: 6,
    subjectBaseline: {
      '20A05603T': { baseAttended: 43, baseTotal: 50 },
      '20A05601T': { baseAttended: 40, baseTotal: 48 },
      '20A05605T': { baseAttended: 37, baseTotal: 45 },
    },
  },
  {
    id: '14',
    roll: '22X51A3306',
    name: 'S. Manasa',
    section: 'CSM-III-B',
    department: 'Computer Science & Machine Learning',
    semester: 6,
    subjectBaseline: {
      '20A05603T': { baseAttended: 45, baseTotal: 50 },
      '20A05601T': { baseAttended: 43, baseTotal: 48 },
      '20A05605T': { baseAttended: 40, baseTotal: 45 },
    },
  },

  // CSE-III-B
  {
    id: '15',
    roll: '22X51A0521',
    name: 'G. Praveen',
    section: 'CSE-III-B',
    department: 'Computer Science & Engineering',
    semester: 6,
    subjectBaseline: {
      '20A05602T': { baseAttended: 41, baseTotal: 46 },
      '20A05601T': { baseAttended: 42, baseTotal: 48 },
      '20A05605T': { baseAttended: 38, baseTotal: 45 },
    },
  },
  {
    id: '16',
    roll: '22X51A0522',
    name: 'H. Divya',
    section: 'CSE-III-B',
    department: 'Computer Science & Engineering',
    semester: 6,
    subjectBaseline: {
      '20A05602T': { baseAttended: 43, baseTotal: 46 },
      '20A05601T': { baseAttended: 44, baseTotal: 48 },
      '20A05605T': { baseAttended: 42, baseTotal: 45 },
    },
  },
  {
    id: '17',
    roll: '22X51A0523',
    name: 'I. Suresh',
    section: 'CSE-III-B',
    department: 'Computer Science & Engineering',
    semester: 6,
    subjectBaseline: {
      '20A05602T': { baseAttended: 32, baseTotal: 46 }, // 69.5% - Shortage
      '20A05601T': { baseAttended: 34, baseTotal: 48 },
      '20A05605T': { baseAttended: 31, baseTotal: 45 },
    },
  },
  {
    id: '18',
    roll: '22X51A0524',
    name: 'J. Kavitha',
    section: 'CSE-III-B',
    department: 'Computer Science & Engineering',
    semester: 6,
    subjectBaseline: {
      '20A05602T': { baseAttended: 42, baseTotal: 46 },
      '20A05601T': { baseAttended: 43, baseTotal: 48 },
      '20A05605T': { baseAttended: 40, baseTotal: 45 },
    },
  },
  {
    id: '19',
    roll: '22X51A0525',
    name: 'K. Mahesh',
    section: 'CSE-III-B',
    department: 'Computer Science & Engineering',
    semester: 6,
    subjectBaseline: {
      '20A05602T': { baseAttended: 39, baseTotal: 46 },
      '20A05601T': { baseAttended: 41, baseTotal: 48 },
      '20A05605T': { baseAttended: 37, baseTotal: 45 },
    },
  },
];

const SESSIONS_STORAGE_KEY = 'srec_all_attendance_sessions';

// Retrieve all recorded sessions across the portal
export function getAllRecordedSessions(): AttendanceSession[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SESSIONS_STORAGE_KEY);
    const unified: AttendanceSession[] = raw ? JSON.parse(raw) : [];

    // Also check any faculty-specific keys and merge them seamlessly
    const facultyKeys = Object.keys(localStorage).filter((k) => k.startsWith('srec_master_attendance_'));
    const mergedMap = new Map<string, AttendanceSession>();

    unified.forEach((s) => mergedMap.set(s.id, s));

    facultyKeys.forEach((key) => {
      try {
        const facRaw = localStorage.getItem(key);
        if (facRaw) {
          const facSessions: AttendanceSession[] = JSON.parse(facRaw);
          facSessions.forEach((s) => mergedMap.set(s.id, s));
        }
      } catch {}
    });

    return Array.from(mergedMap.values()).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  } catch {
    return [];
  }
}

// Save a session to both the global sessions register and the faculty's master register
export function recordAttendanceSession(session: AttendanceSession): AttendanceSession[] {
  if (typeof window === 'undefined') return [session];
  try {
    const existing = getAllRecordedSessions();
    const updated = [
      session,
      ...existing.filter(
        (s) => !(s.subject === session.subject && s.date === session.date && s.period === session.period)
      ),
    ];
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(updated));

    // Also write to faculty-specific register
    const facKey = `srec_master_attendance_${session.facultyId}`;
    const facExistingRaw = localStorage.getItem(facKey);
    const facExisting: AttendanceSession[] = facExistingRaw ? JSON.parse(facExistingRaw) : [];
    const facUpdated = [
      session,
      ...facExisting.filter(
        (s) => !(s.subject === session.subject && s.date === session.date && s.period === session.period)
      ),
    ];
    localStorage.setItem(facKey, JSON.stringify(facUpdated));

    // Dispatch custom event so open tabs/components re-render live
    window.dispatchEvent(new Event('srec_attendance_updated'));
    return updated;
  } catch {
    return [session];
  }
}

// Get student roster for marking attendance based on selected subject or section
export function getStudentsForSection(sectionOrSubject: string): StudentRecord[] {
  let section = sectionOrSubject;
  const match = sectionOrSubject.match(/\(([^)]+)\)/);
  if (match && match[1]) {
    section = match[1];
  }

  const candidates = CANDIDATE_ROSTER.filter((c) => c.section === section);
  if (candidates.length > 0) {
    return candidates.map((c) => ({
      id: c.id,
      roll: c.roll,
      name: c.name,
      status: 'PRESENT',
    }));
  }

  // Fallback to CSE-III-A if not matched
  return CANDIDATE_ROSTER.filter((c) => c.section === 'CSE-III-A').map((c) => ({
    id: c.id,
    roll: c.roll,
    name: c.name,
    status: 'PRESENT',
  }));
}

// Calculate live attendance percentage for a single student in a specific subject
export function getCandidateSubjectStats(roll: string, subjectCodeOrFull: string) {
  const code = subjectCodeOrFull.split(' - ')[0].trim();
  const candidate = CANDIDATE_ROSTER.find((c) => c.roll === roll);
  const baseline = candidate?.subjectBaseline[code] || { baseAttended: 38, baseTotal: 44 };

  const sessions = getAllRecordedSessions();
  let addedAttended = 0;
  let addedTotal = 0;

  sessions.forEach((session) => {
    const sCode = (session.subjectCode || session.subject.split(' - ')[0]).trim();
    if (sCode === code) {
      const studentRec = session.records.find((r) => r.roll === roll);
      if (studentRec) {
        addedTotal += 1;
        if (studentRec.status === 'PRESENT') {
          addedAttended += 1;
        }
      }
    }
  });

  const total = baseline.baseTotal + addedTotal;
  const attended = baseline.baseAttended + addedAttended;
  const percentage = total > 0 ? Math.round((attended / total) * 1000) / 10 : 0;

  let standing: 'ELIGIBLE' | 'CONDONATION' | 'DETAINED' = 'ELIGIBLE';
  if (percentage < 65) standing = 'DETAINED';
  else if (percentage < 75) standing = 'CONDONATION';

  return {
    roll,
    name: candidate?.name || roll,
    section: candidate?.section || 'CSE-III-A',
    subjectCode: code,
    total,
    attended,
    absent: total - attended,
    percentage,
    standing,
  };
}

// Get comprehensive attendance list for "All Candidates" view with filters
export interface CandidateAttendanceItem {
  id: string;
  roll: string;
  name: string;
  section: string;
  department: string;
  subjectCode: string;
  subjectName: string;
  totalClasses: number;
  attendedClasses: number;
  absentClasses: number;
  percentage: number;
  standing: 'ELIGIBLE' | 'CONDONATION' | 'DETAINED';
}

const SEMESTER_SUBJECT_NAMES: Record<string, string> = {
  '20A05601T': 'Database Management Systems',
  '20A05602T': 'Operating Systems',
  '20A05603T': 'Machine Learning & AI',
  '20A05604T': 'Computer Networks',
  '20A05605T': 'Cloud Computing Technologies',
  '20A52201':  'Universal Human Values & Professional Ethics',
};

export function getAllCandidatesAttendance(
  subjectCodeFilter?: string,
  sectionFilter?: string
): CandidateAttendanceItem[] {
  const result: CandidateAttendanceItem[] = [];

  CANDIDATE_ROSTER.forEach((candidate) => {
    if (sectionFilter && sectionFilter !== 'ALL' && candidate.section !== sectionFilter) {
      return;
    }

    // Strictly ONE subject per class section - no multi-subject per section
    const assignedSubject = SECTION_TO_SUBJECT[candidate.section] || AVAILABLE_SUBJECTS[0];

    if (subjectCodeFilter && subjectCodeFilter !== 'ALL' && assignedSubject.code !== subjectCodeFilter) {
      return;
    }

    const stats = getCandidateSubjectStats(candidate.roll, assignedSubject.code);

    result.push({
      id: `${candidate.roll}_${assignedSubject.code}`,
      roll: candidate.roll,
      name: candidate.name,
      section: candidate.section,
      department: candidate.department,
      subjectCode: assignedSubject.code,
      subjectName: assignedSubject.name,
      totalClasses: stats.total,
      attendedClasses: stats.attended,
      absentClasses: stats.absent,
      percentage: stats.percentage,
      standing: stats.standing,
    });
  });

  return result;
}

// Live Attendance Summary for Student Login Portal (e.g. 22X51A0501)
export function getStudentAttendanceSummary(roll: string = '22X51A0501') {
  const candidate = CANDIDATE_ROSTER.find((c) => c.roll === roll) || CANDIDATE_ROSTER[0];
  const allSessions = getAllRecordedSessions();

  let overallAttended = 0;
  let overallTotal = 0;

  const subjects = Object.entries(candidate.subjectBaseline).map(([subCode, _]) => {
    const stats = getCandidateSubjectStats(candidate.roll, subCode);
    const subName = SEMESTER_SUBJECT_NAMES[subCode] || subCode;

    overallAttended += stats.attended;
    overallTotal += stats.total;

    return {
      subject_code: subCode,
      subject_name: subName,
      total_classes: stats.total,
      attended_classes: stats.attended,
      percentage: stats.percentage,
    };
  });

  const overallPercentage = overallTotal > 0 ? Math.round((overallAttended / overallTotal) * 1000) / 10 : 86.2;

  // Student's individual session records from faculty markings
  const recentRecords = allSessions
    .filter((s) => s.records.some((r) => r.roll === roll))
    .map((s) => {
      const rec = s.records.find((r) => r.roll === roll)!;
      return {
        sessionId: s.id,
        date: s.date,
        period: s.period,
        periodTime: s.periodTime,
        subject: s.subject,
        facultyName: s.facultyName,
        status: rec.status,
        timestamp: s.timestamp,
      };
    });

  return {
    roll: candidate.roll,
    name: candidate.name,
    section: candidate.section,
    overall_percentage: overallPercentage,
    total_classes: overallTotal,
    total_attended: overallAttended,
    is_low_attendance: overallPercentage < 75,
    subjects,
    recentRecords,
  };
}
