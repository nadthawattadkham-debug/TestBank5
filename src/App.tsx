import React, { useState, useEffect } from 'react';
import { VirtualSheetsState, User, Subject, Question, ExamResult } from './types';
import { 
  INITIAL_USERS, 
  INITIAL_SUBJECTS, 
  INITIAL_QUESTIONS, 
  INITIAL_RESULTS 
} from './data';
import SheetsSimulator from './components/SheetsSimulator';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';
import { 
  GraduationCap, 
  Database, 
  LogOut, 
  User as UserIcon, 
  Lock, 
  Sparkles, 
  ArrowRight,
  BookOpen,
  UserPlus,
  KeyRound
} from 'lucide-react';

export default function App() {
  // 1. Virtual Sheets Database State (Persisted in LocalStorage)
  const [sheetsState, setSheetsState] = useState<VirtualSheetsState>(() => {
    const saved = localStorage.getItem('gas_exam_sheets_db');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback to seeds on parse error
      }
    }
    return {
      Users: INITIAL_USERS,
      Subjects: INITIAL_SUBJECTS,
      Questions: INITIAL_QUESTIONS,
      Exam_Results: INITIAL_RESULTS
    };
  });

  // Save to LocalStorage on every change
  useEffect(() => {
    localStorage.setItem('gas_exam_sheets_db', JSON.stringify(sheetsState));
  }, [sheetsState]);

  // 3. User Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('gas_exam_active_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // 4. Form States
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [showRegister, setShowRegister] = useState(false);
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<'teacher' | 'student'>('student');
  const [regSuccess, setRegSuccess] = useState('');
  const [regError, setRegError] = useState('');

  // 5. Auth Handlers
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const u = sheetsState.Users.find(
      user => user.username.trim().toLowerCase() === loginUsername.trim().toLowerCase()
    );

    if (u) {
      // Check password if set
      const userPassword = u.password || '5210273008Aa';
      if (userPassword !== loginPassword) {
        setLoginError('รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง');
        return;
      }

      // Check approval status (roles of teacher/admin are auto-approved, students must be approved)
      if (u.approved === false) {
        setLoginError('❌ บัญชีของคุณยังไม่ได้รับการอนุมัติจากคุณครู กรุณารอการตรวจสอบและอนุมัติก่อนเข้าใช้งาน');
        return;
      }

      const authenticatedUser = { id: u.id, username: u.username, name: u.name, role: u.role, approved: u.approved };
      setCurrentUser(authenticatedUser);
      localStorage.setItem('gas_exam_active_user', JSON.stringify(authenticatedUser));
      setLoginUsername('');
      setLoginPassword('');
    } else {
      setLoginError('ไม่พบรายชื่อผู้ใช้ดังกล่าวในระบบชีต Users (โปรดตรวจสอบชื่อผู้ใช้หรือสมัครสมาชิกใหม่)');
    }
  };

  const handleQuickLogin = (username: string) => {
    const u = sheetsState.Users.find(user => user.username === username);
    if (u) {
      if (u.approved === false) {
        setLoginError(`❌ บัญชี ${u.name} ยังไม่ได้รับการอนุมัติจากคุณครู`);
        return;
      }
      const authenticatedUser = { id: u.id, username: u.username, name: u.name, role: u.role, approved: u.approved };
      setCurrentUser(authenticatedUser);
      localStorage.setItem('gas_exam_active_user', JSON.stringify(authenticatedUser));
      setLoginError('');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('gas_exam_active_user');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');

    if (!regName.trim() || !regUsername.trim() || !regPassword.trim()) {
      setRegError('กรุณากรอกข้อมูลให้ครบถ้วนทุกช่อง');
      return;
    }

    const exists = sheetsState.Users.some(
      u => u.username.toLowerCase() === regUsername.toLowerCase().trim()
    );

    if (exists) {
      setRegError('ชื่อผู้ใช้นี้มีอยู่ในระบบฐานข้อมูลชีต Users แล้ว');
      return;
    }

    const newId = 'U' + String(sheetsState.Users.length + 1).padStart(3, '0');
    const newUser: User = {
      id: newId,
      username: regUsername.trim(),
      password: regPassword.trim(),
      name: regName.trim(),
      role: regRole,
      approved: false // New users need approval from teachers
    };

    setSheetsState(prev => ({
      ...prev,
      Users: [...prev.Users, newUser]
    }));

    setRegSuccess('🎉 ลงทะเบียนส่งไปยังชีต Users สำเร็จ! กรุณารอคุณครูอนุมัติสิทธิ์การเข้าใช้งานระบบ');
    setTimeout(() => {
      setShowRegister(false);
      setLoginUsername(newUser.username);
      setRegName('');
      setRegUsername('');
      setRegPassword('');
      setRegSuccess('');
    }, 2500);
  };

  // 6. DB Mutators passed down to components (simulating the server-side GAS appends)
  const handleAddSubject = (subjectName: string) => {
    const newId = 'S' + String(sheetsState.Subjects.length + 1).padStart(3, '0');
    const newSubject: Subject = {
      subject_id: newId,
      subject_name: subjectName,
      teacher_id: currentUser?.id || 'U001',
      question_limit: 5, // ค่าเริ่มต้น
      is_active: true
    };

    setSheetsState(prev => ({
      ...prev,
      Subjects: [...prev.Subjects, newSubject]
    }));
  };

  const handleUpdateSubjectSettings = (updatedSubject: Subject) => {
    setSheetsState(prev => ({
      ...prev,
      Subjects: prev.Subjects.map(sub => sub.subject_id === updatedSubject.subject_id ? updatedSubject : sub)
    }));
  };

  const handleAddQuestionsBulk = (newQuestions: Omit<Question, 'question_id'>[]) => {
    setSheetsState(prev => {
      let currentLength = prev.Questions.length;
      const questionsWithIds = newQuestions.map((q, idx) => ({
        ...q,
        question_id: 'Q' + String(currentLength + idx + 1).padStart(3, '0')
      }));
      return {
        ...prev,
        Questions: [...prev.Questions, ...questionsWithIds]
      };
    });
  };

  const handleAddQuestion = (
    subjectId: string,
    questionText: string,
    optionA: string,
    optionB: string,
    optionC: string,
    optionD: string,
    correctOption: 'A' | 'B' | 'C' | 'D'
  ) => {
    const newId = 'Q' + String(sheetsState.Questions.length + 1).padStart(3, '0');
    const newQuestion: Question = {
      question_id: newId,
      subject_id: subjectId,
      question_text: questionText,
      option_A: optionA,
      option_B: optionB,
      option_C: optionC,
      option_D: optionD,
      correct_option: correctOption
    };

    setSheetsState(prev => ({
      ...prev,
      Questions: [...prev.Questions, newQuestion]
    }));
  };

  const handleSubmitExam = (subjectId: string, score: number, totalQuestions: number) => {
    if (!currentUser) return;

    const newId = 'R' + String(sheetsState.Exam_Results.length + 1).padStart(3, '0');
    
    // Format timestamp in UTC+7 (simulated)
    const now = new Date();
    const formattedDate = now.toISOString().replace('T', ' ').substring(0, 19);

    const newResult: ExamResult = {
      result_id: newId,
      student_id: currentUser.id,
      subject_id: subjectId,
      score,
      total_questions: totalQuestions,
      date_time: formattedDate
    };

    setSheetsState(prev => ({
      ...prev,
      Exam_Results: [...prev.Exam_Results, newResult]
    }));
  };

  const handleResetDatabase = () => {
    if (window.confirm('คุณต้องการรีเซ็ตฐานข้อมูลจำลองทั้งหมดกลับเป็นค่าเริ่มต้นหรือไม่? (ประวัติการเพิ่มวิชา/ข้อสอบจะหายไป)')) {
      const defaultState = {
        Users: INITIAL_USERS,
        Subjects: INITIAL_SUBJECTS,
        Questions: INITIAL_QUESTIONS,
        Exam_Results: INITIAL_RESULTS
      };
      setSheetsState(defaultState);
      localStorage.setItem('gas_exam_sheets_db', JSON.stringify(defaultState));
    }
  };

  const handleAdminAddUser = (user: Omit<User, 'id'>) => {
    const newId = 'U' + String(sheetsState.Users.length + 1).padStart(3, '0');
    const newUser: User = { ...user, id: newId };
    setSheetsState(prev => ({
      ...prev,
      Users: [...prev.Users, newUser]
    }));
  };

  const handleAdminUpdateUser = (updatedUser: User) => {
    setSheetsState(prev => ({
      ...prev,
      Users: prev.Users.map(u => u.id === updatedUser.id ? updatedUser : u)
    }));
  };

  const handleAdminDeleteUser = (userId: string) => {
    setSheetsState(prev => ({
      ...prev,
      Users: prev.Users.filter(u => u.id !== userId)
    }));
  };

  const handleAdminDeleteSubject = (subjectId: string) => {
    setSheetsState(prev => ({
      ...prev,
      Subjects: prev.Subjects.filter(s => s.subject_id !== subjectId),
      Questions: prev.Questions.filter(q => q.subject_id !== subjectId),
      Exam_Results: prev.Exam_Results.filter(r => r.subject_id !== subjectId)
    }));
  };

  const handleAdminDeleteQuestion = (questionId: string) => {
    setSheetsState(prev => ({
      ...prev,
      Questions: prev.Questions.filter(q => q.question_id !== questionId)
    }));
  };

  const handleAdminDeleteExamResult = (resultId: string) => {
    setSheetsState(prev => ({
      ...prev,
      Exam_Results: prev.Exam_Results.filter(r => r.result_id !== resultId)
    }));
  };

  const handleAdminClearExamResults = () => {
    setSheetsState(prev => ({
      ...prev,
      Exam_Results: []
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans selection:bg-indigo-600 selection:text-white text-slate-800">
      
      {/* 1. Sidebar - Persistent on Desktop (md:), Top Nav on Mobile */}
      <aside className="w-full md:w-64 bg-slate-900 flex flex-col shrink-0 border-b md:border-b-0 md:border-r border-slate-800 z-30">
        {/* Brand Area */}
        <div className="p-5 md:p-6 border-b border-slate-800/60 flex items-center justify-between md:block">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
              <GraduationCap className="w-5.5 h-5.5" />
            </div>
            <div>
              <span className="font-bold text-white tracking-tight text-sm block">ระบบสอบและคลังข้อสอบ</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono font-bold block mt-0.5">Google Sheets Portal</span>
            </div>
          </div>

          {/* Quick status for mobile right header */}
          <div className="md:hidden flex items-center gap-2">
            {currentUser && (
              <button
                id="btn-logout-mobile"
                onClick={handleLogout}
                className="text-slate-400 hover:text-red-500 p-2 rounded-xl hover:bg-slate-800/50 transition-all"
                title="ออกจากระบบ"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 md:p-4 flex flex-row md:flex-col gap-2 flex-grow md:flex-grow-0">
          <div
            className="flex-1 md:flex-initial flex items-center justify-center md:justify-start gap-3 px-3.5 py-3 rounded-xl text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/25"
          >
            <Database className="w-4 h-4" />
            <span>หน้าหลักระบบสอบ</span>
          </div>
        </nav>

        {/* Bottom Profile Area - Desktop Only */}
        <div className="hidden md:flex flex-col mt-auto p-4 border-t border-slate-800/80 bg-slate-950/20">
          {currentUser ? (
            <div className="flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center text-xs font-bold text-indigo-400 shrink-0">
                  {currentUser.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-white truncate block">{currentUser.name}</span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold font-mono mt-0.5">
                    {currentUser.role === 'teacher' ? '👨‍🏫 Teacher' : '🙋‍♂️ Student'}
                  </span>
                </div>
              </div>
              <button
                id="btn-logout"
                onClick={handleLogout}
                className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-800 transition-all shrink-0"
                title="ออกจากระบบ"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 text-slate-500 py-1">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/50 flex items-center justify-center text-slate-600 shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-400 leading-tight">ยังไม่ได้เข้าสู่ระบบ</span>
                <span className="text-[9px] text-slate-500 font-medium">โปรดสลับล็อกอินด่วน</span>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* 2. Main Content Layout */}
      <div className="flex-1 flex flex-col min-h-0 md:h-screen md:overflow-y-auto bg-slate-50">
        
        {/* Top Header bar */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 sticky top-0 md:relative z-20 shadow-sm md:shadow-none">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <h2 className="text-sm font-bold text-slate-800">
              ระบบสอบและคลังข้อสอบ (Google Sheets Live Database)
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Display active status */}
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold rounded-lg font-mono">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>G-Sheets API: Online</span>
            </span>
          </div>
        </header>

        {/* Main Workspace Body */}
        <main className="flex-grow p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl w-full mx-auto">
          <div className="space-y-8 animate-fade-in">
            
            {/* Show profile context if logged in */}
            {currentUser && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-bold">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-800">ยินดีต้อนรับ, {currentUser.name}</h2>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                        currentUser.role === 'teacher'
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-100'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                      }`}>
                        บทบาท: {currentUser.role === 'teacher' ? 'คุณครูผู้สอน' : 'นักเรียน / ผู้เข้าสอบ'}
                      </span>
                      <span className="text-slate-300 font-bold">•</span>
                      <span className="text-[10px] text-slate-400 font-bold font-mono">ID: {currentUser.id}</span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>ข้อมูลถูกเชื่อมโยงกับฐานข้อมูลแผ่นงานด้านล่างแบบสดๆ</span>
                </div>
              </div>
            )}

            {/* If NOT logged in, show Auth Gate */}
            {!currentUser ? (
              <div className="flex justify-center items-center py-8">
                {/* Auth Form card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden w-full max-w-md">
                  <div className="bg-indigo-600 px-6 py-8 text-white text-center">
                    <GraduationCap className="w-12 h-12 mx-auto mb-3" />
                    <h3 className="text-xl font-bold">เข้าสู่ระบบ / สมัครสมาชิก</h3>
                    <p className="text-indigo-200 text-xs mt-1 font-medium">เข้าใช้งานระบบสอบออนไลน์</p>
                  </div>

                  {!showRegister ? (
                    /* Login Form */
                    <form id="app-login-form" onSubmit={handleLogin} className="p-6 space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">ชื่อผู้ใช้งาน (Username)</label>
                        <div className="relative">
                          <UserIcon className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                          <input
                            type="text"
                            id="app-login-username-input"
                            value={loginUsername}
                            onChange={(e) => setLoginUsername(e.target.value)}
                            required
                            placeholder="ป้อน teacher1 หรือ student1"
                            className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">รหัสผ่าน (Password)</label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                          <input
                            type="password"
                            id="app-login-password-input"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            required
                            placeholder="รหัสผ่านเข้าสู่ระบบ"
                            className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-sm"
                          />
                        </div>
                      </div>

                      {loginError && (
                        <p id="app-login-error-message" className="text-xs text-red-600 bg-red-50 border border-red-200 p-2.5 rounded-xl font-semibold leading-relaxed">
                          ⚠️ {loginError}
                        </p>
                      )}

                      <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-xl font-bold text-xs transition-all shadow-md shadow-indigo-600/20 flex justify-center items-center gap-1 animate-pulse"
                      >
                        <span>เข้าสู่ระบบ</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <div className="pt-3 border-t border-slate-100 text-center">
                        <button
                          type="button"
                          onClick={() => { setShowRegister(true); setLoginError(''); }}
                          className="text-xs text-indigo-600 hover:text-indigo-800 font-bold"
                        >
                          สมัครสมาชิกและลงทะเบียนใหม่ในชีต Users
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* Register Form */
                    <form id="app-register-form" onSubmit={handleRegister} className="p-6 space-y-3.5">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">ชื่อ-นามสกุลจริง</label>
                        <input
                          type="text"
                          id="app-reg-name-input"
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          required
                          placeholder="เช่น นายอรรถพล ขยันเรียน"
                          className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-xs font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">ชื่อผู้ใช้ (Username ภาษาอังกฤษ)</label>
                        <input
                          type="text"
                          id="app-reg-username-input"
                          value={regUsername}
                          onChange={(e) => setRegUsername(e.target.value)}
                          required
                          placeholder="เช่น attaphol"
                          className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-xs font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">รหัสผ่าน</label>
                        <input
                          type="password"
                          id="app-reg-password-input"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          required
                          placeholder="รหัสผ่านเข้าสอบ"
                          className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-xs font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">สิทธิ์/บทบาทในระบบ</label>
                        <select
                          id="app-reg-role-select"
                          value={regRole}
                          onChange={(e) => setRegRole(e.target.value as 'teacher' | 'student')}
                          required
                          className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-xs font-bold text-slate-700"
                        >
                          <option value="student">ผู้สอบ/นักเรียน (student)</option>
                          <option value="teacher">ผู้สอน/คุณครู (teacher)</option>
                        </select>
                      </div>

                      {regError && (
                        <p className="text-xs text-red-600 bg-red-50 p-2 rounded-xl font-bold">{regError}</p>
                      )}
                      {regSuccess && (
                        <p className="text-xs text-emerald-600 bg-emerald-50 p-2 rounded-xl font-bold">{regSuccess}</p>
                      )}

                      <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-xl font-bold text-xs transition-all shadow-md"
                      >
                        สมัครสมาชิกบันทึกข้อมูล
                      </button>

                      <div className="pt-2 text-center">
                        <button
                          type="button"
                          onClick={() => { setShowRegister(false); setRegError(''); }}
                          className="text-xs text-indigo-600 hover:text-indigo-800 font-bold"
                        >
                          มีบัญชีอยู่แล้ว? กลับสู่หน้าเข้าสู่ระบบ
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            ) : (
              /* If LOGGED IN, render corresponding dashboard */
              <div className="space-y-8">
                {currentUser.role === 'admin' ? (
                  <AdminDashboard
                    sheetsState={sheetsState}
                    currentUserId={currentUser.id}
                    onAddUser={handleAdminAddUser}
                    onUpdateUser={handleAdminUpdateUser}
                    onDeleteUser={handleAdminDeleteUser}
                    onDeleteSubject={handleAdminDeleteSubject}
                    onDeleteQuestion={handleAdminDeleteQuestion}
                    onDeleteExamResult={handleAdminDeleteExamResult}
                    onClearExamResults={handleAdminClearExamResults}
                    onResetDatabase={handleResetDatabase}
                  />
                ) : currentUser.role === 'teacher' ? (
                  <TeacherDashboard
                    sheetsState={sheetsState}
                    currentUserId={currentUser.id}
                    onAddSubject={handleAddSubject}
                    onAddQuestion={handleAddQuestion}
                    onUpdateSubjectSettings={handleUpdateSubjectSettings}
                    onAddQuestionsBulk={handleAddQuestionsBulk}
                    onUpdateUser={handleAdminUpdateUser}
                  />
                ) : (
                  <StudentDashboard
                    sheetsState={sheetsState}
                    currentUserId={currentUser.id}
                    onSubmitExam={handleSubmitExam}
                  />
                )}
              </div>
            )}

            {/* Bottom Panel: Sheets Simulator Visualizer (Teacher and Admin only) */}
            {currentUser && (currentUser.role === 'teacher' || currentUser.role === 'admin') && (
              <div className="pt-4 border-t border-slate-200 animate-fade-in">
                <div className="flex items-center gap-2 mb-4">
                  <Database className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-extrabold text-slate-800 text-base">ฐานข้อมูล Google Sheets จำลองหลังบ้าน</h3>
                </div>
                <SheetsSimulator 
                  sheetsState={sheetsState} 
                  onResetDatabase={handleResetDatabase} 
                  onUpdateSheetsState={setSheetsState}
                />
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-slate-900 border-t border-slate-800 py-8 text-white">
          <div className="max-w-7xl mx-auto px-4 text-center space-y-3">
            <div className="flex justify-center items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-400" />
              <span className="font-bold text-sm text-slate-200">ระบบสอบและคลังข้อสอบ</span>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl mx-auto leading-relaxed">
              พัฒนาโดยใช้เทคโนโลยี Google Sheets และ Google Apps Script โดยครูณัฐวรรธน์
            </p>
            <div className="text-[10px] text-slate-500 font-mono">
              &copy; 2026 ระบบสอบออนไลน์ & คลังข้อสอบ
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
