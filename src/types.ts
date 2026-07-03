export interface User {
  id: string;
  username: string;
  password?: string;
  name: string;
  role: 'teacher' | 'student' | 'admin';
  approved?: boolean;
}

export interface Subject {
  subject_id: string;
  subject_name: string;
  teacher_id: string;
  question_limit?: number; // กำหนดจำนวนข้อสอบที่จะสุ่มออกมาทำ
  start_time?: string;    // วันเวลาเปิดทำข้อสอบ (YYYY-MM-DDTHH:MM)
  end_time?: string;      // วันเวลาปิดทำข้อสอบ (YYYY-MM-DDTHH:MM)
  is_active?: boolean;    // เปิด/ปิด การทำข้อสอบด้วยตนเอง
}

export interface Question {
  question_id: string;
  subject_id: string;
  question_text: string;
  option_A: string;
  option_B: string;
  option_C: string;
  option_D: string;
  correct_option: 'A' | 'B' | 'C' | 'D';
}

export interface ExamResult {
  result_id: string;
  student_id: string;
  subject_id: string;
  score: number;
  total_questions: number;
  date_time: string;
}

export interface VirtualSheetsState {
  Users: User[];
  Subjects: Subject[];
  Questions: Question[];
  Exam_Results: ExamResult[];
}
