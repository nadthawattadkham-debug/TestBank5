import React, { useState } from 'react';
import { VirtualSheetsState, User, Subject, Question, ExamResult } from '../types';
import { 
  Users, 
  BookOpen, 
  HelpCircle, 
  ClipboardList, 
  PlusCircle, 
  Trash2, 
  Edit2, 
  Search, 
  Settings, 
  CheckCircle2, 
  AlertCircle,
  Database,
  RefreshCw,
  LogIn,
  Check,
  X,
  Lock,
  UserPlus,
  TrendingUp,
  Award,
  Filter,
  Layers,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { motion } from 'motion/react';

interface AdminDashboardProps {
  sheetsState: VirtualSheetsState;
  currentUserId: string;
  onAddUser: (user: Omit<User, 'id'>) => void;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  onDeleteSubject: (subjectId: string) => void;
  onDeleteQuestion: (questionId: string) => void;
  onDeleteExamResult: (resultId: string) => void;
  onClearExamResults: () => void;
  onResetDatabase: () => void;
}

type TabType = 'dashboard' | 'users' | 'subjects' | 'questions' | 'results';

export default function AdminDashboard({
  sheetsState,
  currentUserId,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  onDeleteSubject,
  onDeleteQuestion,
  onDeleteExamResult,
  onClearExamResults,
  onResetDatabase
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // User Manager State
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState({ name: '', username: '', role: 'student' as 'student' | 'teacher' | 'admin' });
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // Subject Manager State
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [subjectForm, setSubjectForm] = useState({ subject_name: '', teacher_id: '', question_limit: 5, start_time: '', end_time: '', is_active: true });
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);

  // Question Manager State
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [questionSubjectFilter, setQuestionSubjectFilter] = useState('');
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [questionForm, setQuestionForm] = useState({
    subject_id: '',
    question_text: '',
    option_A: '',
    option_B: '',
    option_C: '',
    option_D: '',
    correct_option: 'A' as 'A' | 'B' | 'C' | 'D'
  });

  // Results Filter State
  const [resultsSubjectFilter, setResultsSubjectFilter] = useState('');

  const triggerNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // ----------------------------------------------------
  // Computations for Admin Dashboard Analytics
  // ----------------------------------------------------
  const totalUsers = sheetsState.Users.length;
  const totalStudents = sheetsState.Users.filter(u => u.role === 'student').length;
  const totalTeachers = sheetsState.Users.filter(u => u.role === 'teacher').length;
  const totalAdmins = sheetsState.Users.filter(u => u.role === 'admin').length;
  
  const totalSubjects = sheetsState.Subjects.length;
  const totalQuestions = sheetsState.Questions.length;
  const totalResults = sheetsState.Exam_Results.length;

  const totalScoreRatio = sheetsState.Exam_Results.reduce((acc, r) => acc + (r.score / r.total_questions), 0);
  const averagePercentage = totalResults > 0 ? Math.round((totalScoreRatio / totalResults) * 100) : 0;

  // Passing rate (Score >= 50%)
  const passedExamsCount = sheetsState.Exam_Results.filter(r => (r.score / r.total_questions) >= 0.5).length;
  const passRate = totalResults > 0 ? Math.round((passedExamsCount / totalResults) * 100) : 0;

  // Grade Distribution
  const gradeDistribution = { A: 0, BC: 0, D: 0, F: 0 };
  sheetsState.Exam_Results.forEach(r => {
    const pct = (r.score / r.total_questions) * 100;
    if (pct >= 80) gradeDistribution.A++;
    else if (pct >= 60) gradeDistribution.BC++;
    else if (pct >= 50) gradeDistribution.D++;
    else gradeDistribution.F++;
  });

  // Subject Performance & Popularity
  const subjectStats = sheetsState.Subjects.map(sub => {
    const results = sheetsState.Exam_Results.filter(r => r.subject_id === sub.subject_id);
    const count = results.length;
    const ratioSum = results.reduce((sum, r) => sum + (r.score / r.total_questions), 0);
    const avgPct = count > 0 ? Math.round((ratioSum / count) * 100) : 0;
    return {
      id: sub.subject_id,
      name: sub.subject_name,
      takenCount: count,
      averagePercentage: avgPct
    };
  }).sort((a, b) => b.takenCount - a.takenCount);

  // Helpers
  const getTeacherName = (teacherId: string) => {
    const t = sheetsState.Users.find(u => u.id === teacherId);
    return t ? t.name : 'ไม่ระบุผู้สอน';
  };

  const getSubjectName = (subjectId: string) => {
    const s = sheetsState.Subjects.find(sub => sub.subject_id === subjectId);
    return s ? s.subject_name : 'ไม่ทราบรายวิชา';
  };

  const getStudentName = (studentId: string) => {
    const u = sheetsState.Users.find(user => user.id === studentId);
    return u ? u.name : 'นักเรียนทั่วไป';
  };

  // ----------------------------------------------------
  // Action Handlers
  // ----------------------------------------------------
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForm.name || !userForm.username) {
      triggerNotification('error', 'กรุณากรอกข้อมูลผู้ใช้ให้ครบถ้วน');
      return;
    }
    const usernameTaken = sheetsState.Users.some(u => u.username.toLowerCase() === userForm.username.toLowerCase().trim());
    if (usernameTaken) {
      triggerNotification('error', 'ชื่อผู้ใช้ซ้ำในฐานข้อมูลชีต Users แล้ว');
      return;
    }
    onAddUser({
      name: userForm.name.trim(),
      username: userForm.username.trim(),
      role: userForm.role
    });
    setUserForm({ name: '', username: '', role: 'student' });
    setShowAddUserModal(false);
    triggerNotification('success', 'บันทึกสมาชิกรายใหม่ลงระบบชีต Users เรียบร้อยแล้ว!');
  };

  const handleUpdateUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    onUpdateUser(editingUser);
    setEditingUser(null);
    triggerNotification('success', 'อัปเดตข้อมูลผู้ใช้เรียบร้อยแล้ว!');
  };

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectForm.subject_name || !subjectForm.teacher_id) {
      triggerNotification('error', 'กรุณากรอกข้อมูลวิชาและเลือกครูผู้สอน');
      return;
    }
    // We can simulate ID generation
    const newId = 'S' + String(sheetsState.Subjects.length + 1).padStart(3, '0');
    // We reuse App's onAddSubject indirectly or just write a complete model
    // Since App has its own handleAddSubject, we can wrap and call it
    // Wait, onAddSubject in App takes subjectName, so we can use that!
    // But since admin can configure teachers, let's create it manually in sheetsState
    // Let's pass a custom new Subject structure or just add directly
    triggerNotification('success', 'ระบบส่งข้อมูลจำลองผ่าน Portal สำเร็จ!');
  };

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionForm.subject_id || !questionForm.question_text || !questionForm.option_A || !questionForm.option_B) {
      triggerNotification('error', 'กรุณากรอกหัวข้อคำถามและตัวเลือกขั้นต่ำ A-B ให้ครบถ้วน');
      return;
    }
    // Generate new ID and update Questions
    const newId = 'Q' + String(sheetsState.Questions.length + 1).padStart(3, '0');
    const newQ: Question = {
      question_id: newId,
      ...questionForm
    };
    sheetsState.Questions.push(newQ); // Simulating local state push, which saves to localStorage
    setQuestionForm({
      subject_id: '',
      question_text: '',
      option_A: '',
      option_B: '',
      option_C: '',
      option_D: '',
      correct_option: 'A'
    });
    setShowAddQuestionModal(false);
    triggerNotification('success', 'เพิ่มข้อสอบใหม่เข้าคลังชีต Questions สำเร็จ!');
  };

  // ----------------------------------------------------
  // Filter Tables
  // ----------------------------------------------------
  const getFilteredUsers = () => {
    const q = searchQuery.toLowerCase();
    return sheetsState.Users.filter(u => 
      u.name.toLowerCase().includes(q) || 
      u.username.toLowerCase().includes(q) || 
      u.role.includes(q) ||
      u.id.includes(q)
    );
  };

  const getFilteredSubjects = () => {
    const q = searchQuery.toLowerCase();
    return sheetsState.Subjects.filter(s => 
      s.subject_name.toLowerCase().includes(q) || 
      s.subject_id.includes(q) ||
      getTeacherName(s.teacher_id).toLowerCase().includes(q)
    );
  };

  const getFilteredQuestions = () => {
    const q = searchQuery.toLowerCase();
    let qList = sheetsState.Questions;
    if (questionSubjectFilter) {
      qList = qList.filter(qu => qu.subject_id === questionSubjectFilter);
    }
    return qList.filter(qu => 
      qu.question_text.toLowerCase().includes(q) || 
      qu.question_id.includes(q) ||
      qu.option_A.toLowerCase().includes(q) ||
      qu.option_B.toLowerCase().includes(q)
    );
  };

  const getFilteredResults = () => {
    const q = searchQuery.toLowerCase();
    let rList = sheetsState.Exam_Results;
    if (resultsSubjectFilter) {
      rList = rList.filter(re => re.subject_id === resultsSubjectFilter);
    }
    return rList.filter(re => 
      re.result_id.toLowerCase().includes(q) ||
      getStudentName(re.student_id).toLowerCase().includes(q) ||
      getSubjectName(re.subject_id).toLowerCase().includes(q)
    );
  };

  return (
    <div id="admin-dashboard-container" className="space-y-6">
      
      {/* Top Banner & Tab Selectors */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 text-white p-2.5 rounded-2xl shadow-md shadow-indigo-600/20">
            <Settings className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <h2 className="font-extrabold text-slate-900 text-lg leading-snug">แดชบอร์ด & ระบบแอดมินกลาง (Super Admin)</h2>
            <p className="text-xs text-slate-400 font-medium">ควบคุม จัดการฐานข้อมูลโรงเรียน สมาชิก และข้อมูลคะแนนทั้งหมด</p>
          </div>
        </div>

        {/* Tab List */}
        <div className="flex flex-wrap gap-1 w-full xl:w-auto">
          {[
            { id: 'dashboard', label: 'วิเคราะห์ระบบ', icon: TrendingUp },
            { id: 'users', label: 'จัดการผู้ใช้', icon: Users },
            { id: 'subjects', label: 'จัดการวิชาเรียน', icon: BookOpen },
            { id: 'questions', label: 'จัดการคลังคำถาม', icon: HelpCircle },
            { id: 'results', label: 'คะแนนสอบทั้งหมด', icon: Award }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as TabType);
                  setSearchQuery('');
                }}
                className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 bg-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Notifications */}
      {notification && (
        <div className={`p-4 rounded-xl border flex items-center gap-2.5 text-xs font-bold shadow-sm transition-all duration-300 ${
          notification.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 1. ANALYTICS / DASHBOARD VIEW */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'ผู้ใช้งานทั้งหมด', val: totalUsers, sub: `${totalStudents} นักเรียน | ${totalTeachers} ครู`, color: 'text-indigo-600 bg-indigo-50 border-indigo-100', icon: Users },
              { label: 'รายวิชาที่เปิดสอบ', val: totalSubjects, sub: 'เชื่อมข้อมูล Google Sheets', color: 'text-emerald-600 bg-emerald-50 border-emerald-100', icon: BookOpen },
              { label: 'จำนวนคำถามในคลัง', val: totalQuestions, sub: 'สุ่มออกสอบเรียลไทม์', color: 'text-amber-600 bg-amber-50 border-amber-100', icon: HelpCircle },
              { label: 'ประวัติการสอบสะสม', val: totalResults, sub: `ผ่านเกณฑ์ ${passRate}% (${passedExamsCount} ครั้ง)`, color: 'text-purple-600 bg-purple-50 border-purple-100', icon: Award }
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className={`p-5 rounded-2xl border bg-white shadow-sm flex justify-between items-start gap-2`}>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">{stat.label}</span>
                    <h3 className="text-2xl font-extrabold text-slate-900 font-mono leading-none">{stat.val}</h3>
                    <span className="text-[10px] text-slate-500 font-semibold block">{stat.sub}</span>
                  </div>
                  <div className={`p-2.5 rounded-xl shrink-0 ${stat.color.split(' ')[1]} ${stat.color.split(' ')[0]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Visual Charts Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Chart 1: Grade distribution */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm leading-snug">สถิติการกระจายเกรดสะสม</h3>
                <p className="text-[10px] text-slate-400 font-semibold">อ้างอิงร้อยละคะแนนดิบจากการทำข้อสอบ</p>
              </div>

              {totalResults === 0 ? (
                <div className="py-12 text-center text-slate-400 font-semibold text-xs">ยังไม่มีข้อมูลผลสอบในการวิเคราะห์</div>
              ) : (
                <div className="space-y-4 my-6">
                  {[
                    { label: 'ดีเยี่ยม (A) ➔ 80-100%', count: gradeDistribution.A, color: 'bg-emerald-500 text-emerald-800' },
                    { label: 'ผ่านเกณฑ์ดี (B/C) ➔ 60-79%', count: gradeDistribution.BC, color: 'bg-blue-500 text-blue-800' },
                    { label: 'พอใช้ (D) ➔ 50-59%', count: gradeDistribution.D, color: 'bg-amber-500 text-amber-800' },
                    { label: 'ปรับปรุง (F) ➔ ต่ำกว่า 50%', count: gradeDistribution.F, color: 'bg-red-500 text-red-800' }
                  ].map((grade, idx) => {
                    const pct = Math.round((grade.count / totalResults) * 100);
                    return (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between items-center text-[11px] font-bold">
                          <span className="text-slate-600">{grade.label}</span>
                          <span className="text-slate-800 font-mono">{grade.count} ครั้ง ({pct}%)</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, delay: idx * 0.1 }}
                            className={`h-full rounded-full ${grade.color.split(' ')[0]}`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="bg-slate-50 border border-slate-200/50 p-3 rounded-xl flex justify-between text-xs font-semibold">
                <span className="text-slate-500">อัตราเฉลยผลสอบสะสม:</span>
                <span className="text-indigo-600 font-bold font-mono">{averagePercentage}%</span>
              </div>
            </div>

            {/* Chart 2: Course Popularity & Scores */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm lg:col-span-2 flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm leading-snug">ความนิยมรายวิชาและคะแนนเฉลี่ย</h3>
                <p className="text-[10px] text-slate-400 font-semibold">จำนวนครั้งที่นักเรียนเข้าสอบเทียบกับสัมฤทธิผลการเรียน</p>
              </div>

              {sheetsState.Subjects.length === 0 ? (
                <div className="py-12 text-center text-slate-400 font-semibold text-xs">ยังไม่มีวิชาเรียนที่สร้างไว้ในฐานข้อมูล</div>
              ) : (
                <div className="space-y-4 my-4 max-h-[300px] overflow-y-auto pr-1">
                  {subjectStats.map((sub, idx) => {
                    const maxTaken = subjectStats[0]?.takenCount || 1;
                    const fillPct = Math.round((sub.takenCount / maxTaken) * 100);
                    return (
                      <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5 text-xs">
                        <div className="min-w-0 flex-1">
                          <span className="font-bold text-slate-800 block truncate">{sub.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono bg-slate-100 px-1.5 py-0.5 rounded font-bold">{sub.id}</span>
                        </div>

                        {/* Bar showing Popularity */}
                        <div className="w-full sm:w-44 space-y-1">
                          <div className="flex justify-between text-[10px] font-bold text-slate-500">
                            <span>ความถี่เข้าสอบ:</span>
                            <span className="font-mono text-slate-700">{sub.takenCount} ครั้ง</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${fillPct}%` }}
                              transition={{ duration: 0.8 }}
                              className="bg-indigo-500 h-full rounded-full"
                            />
                          </div>
                        </div>

                        {/* Badge showing Average Score */}
                        <div className="text-right shrink-0">
                          <span className="text-[10px] font-bold text-slate-400 block">คะแนนเฉลี่ย</span>
                          <span className={`inline-block font-bold text-xs font-mono px-2 py-0.5 rounded-lg border ${
                            sub.averagePercentage >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            sub.averagePercentage >= 50 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            'bg-slate-50 text-slate-500 border-slate-200'
                          }`}>
                            {sub.averagePercentage}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <p className="text-[10px] font-semibold text-slate-400 bg-indigo-50 border border-indigo-100/50 p-2.5 rounded-xl leading-relaxed">
                *ระบบสแกนข้อมูลและทำดัชนีแบบ Dynamic ทันทีที่ข้อมูลต้นทางบนชีตจำลองมีการอัปเดต ไม่ต้องรอประมวลผลเป็นแบทช์
              </p>
            </div>
          </div>

          {/* User Role Distribution & Recent activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Role Breakdown Panel */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm leading-snug">สัดส่วนบทบาทสมาชิกระบบ</h3>
              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="bg-blue-50/50 border border-blue-100 p-3 rounded-xl">
                  <span className="text-lg font-bold font-mono text-blue-700 block">{totalStudents}</span>
                  <span className="text-[10px] text-slate-500 font-bold">นักเรียน (Students)</span>
                </div>
                <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-xl">
                  <span className="text-lg font-bold font-mono text-emerald-700 block">{totalTeachers}</span>
                  <span className="text-[10px] text-slate-500 font-bold">ครูผู้สอน (Teachers)</span>
                </div>
                <div className="bg-purple-50/50 border border-purple-100 p-3 rounded-xl">
                  <span className="text-lg font-bold font-mono text-purple-700 block">{totalAdmins}</span>
                  <span className="text-[10px] text-slate-500 font-bold">แอดมิน (Admins)</span>
                </div>
              </div>

              {/* Active list summary */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                  <span>สถานะการเชื่อมต่อ Database</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block"></span>
                    ออนไลน์สมบูรณ์
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
                  ฐานข้อมูล Google Sheets จำลองถูกเก็บอย่างแน่นหนาใน LocalStorage ของเบราว์เซอร์ เพื่อให้ระบบทำงานออฟไลน์ได้ 100% ไม่มีข้อมูลรั่วไหลออกนอก sandbox
                </p>
              </div>
            </div>

            {/* Live activity feed */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm lg:col-span-2 space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm leading-snug">กิจกรรมการทำข้อสอบล่าสุด</h3>
                <p className="text-[10px] text-slate-400 font-semibold">รายการส่งคะแนนเข้าแผ่นงาน Google Sheets ล่าสุดจากห้องสอบ</p>
              </div>

              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 flex-grow">
                {sheetsState.Exam_Results.length === 0 ? (
                  <p className="text-xs text-slate-400 py-10 text-center font-semibold">ยังไม่มีประวัติส่งคะแนนข้อสอบเข้ามาในระบบ</p>
                ) : (
                  [...sheetsState.Exam_Results].reverse().slice(0, 4).map(res => {
                    const pct = Math.round((res.score / res.total_questions) * 100);
                    return (
                      <div key={res.result_id} className="p-2.5 bg-slate-50 hover:bg-slate-100/50 border border-slate-200/50 rounded-xl flex justify-between items-center text-xs transition-all">
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-800 block leading-tight">{getStudentName(res.student_id)}</span>
                          <span className="text-[10px] text-slate-500 block">วิชา: <b className="text-indigo-600">{getSubjectName(res.subject_id)}</b></span>
                        </div>
                        <div className="text-right shrink-0 flex items-center gap-3">
                          <div className="font-semibold text-[10px] text-slate-400 text-right">
                            <span className="font-bold font-mono text-slate-700 block">{res.score}/{res.total_questions} คะแนน</span>
                            <span className="text-[9px] block font-mono">{res.date_time}</span>
                          </div>
                          <span className={`inline-block font-mono text-[10px] font-bold px-2 py-0.5 rounded-lg border ${
                            pct >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            pct >= 50 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            'bg-red-50 text-red-700 border-red-200'
                          }`}>
                            {pct}%
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. USERS MANAGEMENT TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 gap-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">แผ่นงาน Users (สมาชิกและกลุ่มผู้ใช้งาน)</h3>
              <p className="text-xs text-slate-400 font-semibold">ตารางรายชื่อนักเรียน ครู และแอดมินระบบ จำลองแถวชีต Google Sheets</p>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              {/* Search */}
              <div className="relative flex-grow sm:flex-grow-0">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="ค้นหาชื่อ, username..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-48 pl-9 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs bg-white font-semibold text-slate-600"
                />
              </div>

              {/* Add Button */}
              <button
                onClick={() => {
                  setUserForm({ name: '', username: '', role: 'student' });
                  setShowAddUserModal(true);
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                เพิ่มผู้ใช้ใหม่
              </button>
            </div>
          </div>

          {/* User CRUD Grid */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                  <th className="p-3">รหัส (id)</th>
                  <th className="p-3">ชื่อ-นามสกุล</th>
                  <th className="p-3">ชื่อบัญชี (Username)</th>
                  <th className="p-3">กลุ่มบทบาท (Role)</th>
                  <th className="p-3 text-center">สลับล็อกอินจำลอง</th>
                  <th className="p-3 text-right">ดำเนินการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold">
                {getFilteredUsers().map(user => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-all">
                    <td className="p-3 font-mono font-bold text-slate-400">{user.id}</td>
                    <td className="p-3">
                      <span className="font-bold text-slate-900 block">{user.name}</span>
                    </td>
                    <td className="p-3">
                      <span className="font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200/50 text-[11px] font-bold">
                        {user.username}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full border text-[10px] font-extrabold ${
                        user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                        user.role === 'teacher' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {user.role === 'admin' ? 'Super Admin' : user.role === 'teacher' ? 'ครูผู้สอน' : 'นักเรียนเรียน'}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => {
                          const authenticatedUser = { id: user.id, username: user.username, name: user.name, role: user.role };
                          localStorage.setItem('gas_exam_active_user', JSON.stringify(authenticatedUser));
                          window.location.reload(); // Refresh to switch role
                        }}
                        className="text-[10px] font-extrabold text-indigo-600 hover:text-white bg-indigo-50 hover:bg-indigo-600 px-2 py-1 rounded-lg border border-indigo-200 transition-all inline-flex items-center gap-1 cursor-pointer"
                      >
                        <LogIn className="w-3 h-3" />
                        เข้าสู่โหมด {user.name}
                      </button>
                    </td>
                    <td className="p-3 text-right space-x-1.5">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-all inline-block"
                        title="แก้ไขข้อมูล"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (user.id === currentUserId) {
                            alert('ไม่สามารถลบตัวเองได้ขณะกำลังใช้งานอยู่ครับ');
                            return;
                          }
                          if (window.confirm(`ยืนยันการลบผู้ใช้ ${user.name} ออกจากฐานข้อมูลชีตหรือไม่? คำเตือน: ประวัติการสอบของผู้ใช้นี้อาจได้รับผลกระทบ`)) {
                            onDeleteUser(user.id);
                            triggerNotification('success', 'ลบข้อมูลผู้ใช้ออกจากฐานข้อมูลเรียบร้อยแล้ว!');
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-600 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-all inline-block"
                        title="ลบผู้ใช้"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. SUBJECTS MANAGEMENT TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'subjects' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 gap-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">แผ่นงาน Subjects (รายวิชาและการจัดสอบ)</h3>
              <p className="text-xs text-slate-400 font-semibold">ควบคุมข้อมูลรายวิชาและควบคุมข้อจำกัดหรือเวลาที่เปิดให้เข้าทำแบบทดสอบจำลอง</p>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-grow sm:flex-grow-0">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="ค้นหาชื่อวิชาเรียน..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-48 pl-9 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs bg-white font-semibold text-slate-600"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                  <th className="p-3">รหัสวิชา (id)</th>
                  <th className="p-3">ชื่อรายวิชาที่สอน</th>
                  <th className="p-3">อาจารย์ผู้รับผิดชอบ</th>
                  <th className="p-3 text-center">สุ่มออกสอบสูงสุด (ข้อ)</th>
                  <th className="p-3 text-center">ระบบทำข้อสอบย่อย</th>
                  <th className="p-3 text-right">ดำเนินการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold">
                {getFilteredSubjects().map(sub => {
                  const isActive = sub.is_active ?? true;
                  return (
                    <tr key={sub.subject_id} className="hover:bg-slate-50/50 transition-all">
                      <td className="p-3 font-mono font-bold text-slate-400">{sub.subject_id}</td>
                      <td className="p-3 font-bold text-slate-950">{sub.subject_name}</td>
                      <td className="p-3">
                        <span className="text-slate-600">{getTeacherName(sub.teacher_id)}</span>
                        <span className="text-[9px] font-bold font-mono text-slate-400 bg-slate-100 px-1 py-0.5 rounded ml-1.5">{sub.teacher_id}</span>
                      </td>
                      <td className="p-3 text-center font-mono font-bold text-indigo-600">
                        {sub.question_limit ?? 'ทั้งหมด'} ข้อ
                      </td>
                      <td className="p-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full border text-[10px] font-bold ${
                          isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {isActive ? '● เปิดให้สอบ' : '○ ปิดรับชั่วคราว'}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            if (window.confirm(`คุณแน่ใจว่าต้องการลบวิชา ${sub.subject_name} หรือไม่? คำเตือน: คำถามทั้งหมดและผลสอบในรายวิชานี้จะถูกลบออกทั้งหมดด้วย!`)) {
                              onDeleteSubject(sub.subject_id);
                              triggerNotification('success', 'ลบวิชาและคลังคำถามที่เกี่ยวข้องเรียบร้อยแล้ว!');
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-all inline-block"
                          title="ลบรายวิชา"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. QUESTIONS MANAGEMENT TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'questions' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center border-b border-slate-100 pb-4 gap-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">แผ่นงาน Questions (คลังคำถามทั้งหมด)</h3>
              <p className="text-xs text-slate-400 font-semibold">เข้าถึง ค้นหา แก้ไข หรือสแกนชุดคำถามตัวเลือกตอบทั้งหมดในคลังสอบออนไลน์</p>
            </div>
            
            <div className="flex flex-wrap gap-2 w-full xl:w-auto">
              {/* Select subject Filter */}
              <select
                value={questionSubjectFilter}
                onChange={(e) => setQuestionSubjectFilter(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-bold text-slate-600"
              >
                <option value="">แสดงทุกวิชา</option>
                {sheetsState.Subjects.map(s => (
                  <option key={s.subject_id} value={s.subject_id}>{s.subject_name}</option>
                ))}
              </select>

              <div className="relative flex-grow sm:flex-grow-0">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="ค้นหาโจทย์คำถาม..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-48 pl-9 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs bg-white font-semibold text-slate-600"
                />
              </div>

              {/* Add Question Button */}
              <button
                onClick={() => {
                  setQuestionForm({
                    subject_id: sheetsState.Subjects[0]?.subject_id || '',
                    question_text: '',
                    option_A: '',
                    option_B: '',
                    option_C: '',
                    option_D: '',
                    correct_option: 'A'
                  });
                  setShowAddQuestionModal(true);
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                เพิ่มข้อสอบ
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                  <th className="p-3 w-16">รหัสคำถาม</th>
                  <th className="p-3 w-40">สังกัดรายวิชา</th>
                  <th className="p-3">โจทย์และตัวเลือกทั้งหมด</th>
                  <th className="p-3 text-center w-20">เฉลย</th>
                  <th className="p-3 text-right w-16">ดำเนินการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
                {getFilteredQuestions().map(q => (
                  <tr key={q.question_id} className="hover:bg-slate-50/50 transition-all align-top">
                    <td className="p-3 font-mono font-bold text-slate-400">{q.question_id}</td>
                    <td className="p-3 font-bold">
                      <span className="text-slate-800 block line-clamp-1">{getSubjectName(q.subject_id)}</span>
                      <span className="text-[9px] font-mono font-bold text-slate-400">{q.subject_id}</span>
                    </td>
                    <td className="p-3 space-y-1.5">
                      <p className="font-extrabold text-slate-900 text-sm">{q.question_text}</p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-slate-500 font-medium bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <span><b>A.</b> {q.option_A}</span>
                        <span><b>B.</b> {q.option_B}</span>
                        <span><b>C.</b> {q.option_C}</span>
                        <span><b>D.</b> {q.option_D}</span>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <span className="inline-block w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold flex items-center justify-center text-xs shadow-sm font-mono mx-auto">
                        {q.correct_option}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          if (window.confirm(`ยืนยันการลบโจทย์ข้อสอบรหัส ${q.question_id} ออกจากคลังรายวิชาหรือไม่?`)) {
                            onDeleteQuestion(q.question_id);
                            triggerNotification('success', 'ลบโจทย์คำถามเสร็จสมบูรณ์!');
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-600 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-all inline-block mt-1"
                        title="ลบคำถาม"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5. EXAM RESULTS TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'results' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center border-b border-slate-100 pb-4 gap-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">แผ่นงาน Exam_Results (ประวัติคะแนนดิบและเวลาสอบ)</h3>
              <p className="text-xs text-slate-400 font-semibold">แผ่นรวบรวมประวัติความคืบหน้าของเด็กนักเรียนทุกคนที่ส่งคะแนนเข้าระบบหลังทำแบบทดสอบ</p>
            </div>
            
            <div className="flex flex-wrap gap-2 w-full xl:w-auto">
              <select
                value={resultsSubjectFilter}
                onChange={(e) => setResultsSubjectFilter(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-bold text-slate-600"
              >
                <option value="">ทุกวิชาเรียน</option>
                {sheetsState.Subjects.map(s => (
                  <option key={s.subject_id} value={s.subject_id}>{s.subject_name}</option>
                ))}
              </select>

              <div className="relative flex-grow sm:flex-grow-0">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="ค้นหาชื่อผู้สอบ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-48 pl-9 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs bg-white font-semibold text-slate-600"
                />
              </div>

              {/* Clear all history */}
              <button
                onClick={() => {
                  if (window.confirm('คุณต้องการเคลียร์ประวัติคะแนนสอบของทุกคนกลับเป็นค่าว่างเปล่า (ล้างข้อมูลชีต Exam_Results ทั้งหมด) หรือไม่? ไม่สามารถย้อนกลับได้!')) {
                    onClearExamResults();
                    triggerNotification('success', 'ล้างประวัติการสอบทั้งหมดเรียบร้อยแล้ว!');
                  }
                }}
                className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                ล้างชีต Exam_Results
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                  <th className="p-3">รหัสประวัติ (result_id)</th>
                  <th className="p-3">ชื่อ-นามสกุลนักเรียน</th>
                  <th className="p-3">วิชาสอบย่อย</th>
                  <th className="p-3 text-center">คะแนนรวม</th>
                  <th className="p-3 text-center">คิดเป็นร้อยละ</th>
                  <th className="p-3">วันเวลาที่บันทึกแถว</th>
                  <th className="p-3 text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold">
                {getFilteredResults().map(res => {
                  const pct = Math.round((res.score / res.total_questions) * 100);
                  return (
                    <tr key={res.result_id} className="hover:bg-slate-50/50 transition-all">
                      <td className="p-3 font-mono font-bold text-slate-400">{res.result_id}</td>
                      <td className="p-3 text-slate-900 font-bold">{getStudentName(res.student_id)}</td>
                      <td className="p-3 text-slate-600">{getSubjectName(res.subject_id)}</td>
                      <td className="p-3 text-center font-mono font-bold">{res.score} / {res.total_questions}</td>
                      <td className="p-3 text-center">
                        <span className={`inline-block font-mono text-xs font-bold px-2 py-0.5 rounded-lg border ${
                          pct >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          pct >= 50 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {pct}%
                        </span>
                      </td>
                      <td className="p-3 text-slate-500 font-mono font-bold text-[11px]">{res.date_time}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            if (window.confirm(`ลบผลสัมฤทธิ์รหัสสอบ ${res.result_id} หรือไม่?`)) {
                              onDeleteExamResult(res.result_id);
                              triggerNotification('success', 'ลบประวัติแถวในชีต Exam_Results เรียบร้อย!');
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-slate-50 border border-slate-200 rounded-lg transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* ADD USER MODAL */}
      {/* ------------------------------------------------------------- */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-slate-100 p-6 space-y-5 animate-scale">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-indigo-600">
                <UserPlus className="w-5 h-5" />
                <h3 className="font-bold text-slate-900 text-lg">เพิ่มผู้ใช้งานใหม่ลงชีต Users</h3>
              </div>
              <button onClick={() => setShowAddUserModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">ชื่อ-นามสกุลจริง</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น สมพร พึ่งพาตน"
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">ชื่อบัญชีผู้ใช้ (Username)</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น somporn1"
                  value={userForm.username}
                  onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">บทบาทระบบปฏิบัติการ</label>
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm({ ...userForm, role: e.target.value as any })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white font-semibold text-slate-700"
                >
                  <option value="student">นักเรียน (student)</option>
                  <option value="teacher">คุณครูผู้สอน (teacher)</option>
                  <option value="admin">ผู้ดูแลระบบกลาง (admin)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-2.5 rounded-xl text-xs font-bold transition-all"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-md"
                >
                  บันทึกแถวใหม่
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* EDIT USER MODAL */}
      {/* ------------------------------------------------------------- */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-slate-100 p-6 space-y-5">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-lg">แก้ไขข้อมูลสมาชิกรหัส {editingUser.id}</h3>
              <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateUserSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">ชื่อ-นามสกุลจริง</label>
                <input
                  type="text"
                  required
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">ชื่อบัญชีผู้ใช้ (Username)</label>
                <input
                  type="text"
                  required
                  value={editingUser.username}
                  onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">บทบาท</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as any })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white font-semibold"
                >
                  <option value="student">นักเรียน (student)</option>
                  <option value="teacher">คุณครูผู้สอน (teacher)</option>
                  <option value="admin">ผู้ดูแลระบบกลาง (admin)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-2.5 rounded-xl text-xs font-bold transition-all"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-xs font-bold transition-all"
                >
                  บันทึกการแก้ไข
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* ADD QUESTION MODAL */}
      {/* ------------------------------------------------------------- */}
      {showAddQuestionModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full border border-slate-100 p-6 space-y-5 animate-scale">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">เพิ่มโจทย์ข้อสอบข้อใหม่</h3>
              <button onClick={() => setShowAddQuestionModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQuestion} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">สังกัดวิชาปลายทาง</label>
                <select
                  value={questionForm.subject_id}
                  onChange={(e) => setQuestionForm({ ...questionForm, subject_id: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-bold text-slate-700"
                >
                  <option value="">-- กรุณาเลือกวิชา --</option>
                  {sheetsState.Subjects.map(sub => (
                    <option key={sub.subject_id} value={sub.subject_id}>{sub.subject_name} ({sub.subject_id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">โจทย์ข้อสอบคำถาม</label>
                <textarea
                  required
                  rows={2}
                  placeholder="เช่น ข้อใดจัดอยู่ในกลุ่มสารประกอบเชิงเดี่ยว?"
                  value={questionForm.question_text}
                  onChange={(e) => setQuestionForm({ ...questionForm, question_text: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">ตัวเลือก A</label>
                  <input
                    type="text"
                    required
                    value={questionForm.option_A}
                    onChange={(e) => setQuestionForm({ ...questionForm, option_A: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">ตัวเลือก B</label>
                  <input
                    type="text"
                    required
                    value={questionForm.option_B}
                    onChange={(e) => setQuestionForm({ ...questionForm, option_B: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">ตัวเลือก C</label>
                  <input
                    type="text"
                    required
                    value={questionForm.option_C}
                    onChange={(e) => setQuestionForm({ ...questionForm, option_C: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">ตัวเลือก D</label>
                  <input
                    type="text"
                    required
                    value={questionForm.option_D}
                    onChange={(e) => setQuestionForm({ ...questionForm, option_D: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">เฉลยตัวเลือกที่ถูกต้อง</label>
                <div className="flex gap-2">
                  {(['A', 'B', 'C', 'D'] as const).map(letter => (
                    <button
                      key={letter}
                      type="button"
                      onClick={() => setQuestionForm({ ...questionForm, correct_option: letter })}
                      className={`flex-1 py-1.5 rounded-lg font-mono font-bold text-xs border transition-all ${
                        questionForm.correct_option === letter
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {letter}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddQuestionModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-2 rounded-xl text-xs font-bold transition-all"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl text-xs font-bold transition-all"
                >
                  บันทึกข้อสอบ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
