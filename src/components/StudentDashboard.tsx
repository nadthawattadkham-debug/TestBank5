import React, { useState } from 'react';
import { VirtualSheetsState, Subject, Question, ExamResult } from '../types';
import { 
  BookOpen, 
  Clipboard, 
  Calendar, 
  Award, 
  Check, 
  Play, 
  AlertTriangle, 
  ArrowLeft, 
  RefreshCw, 
  Star, 
  Sparkles, 
  Clock, 
  Lock, 
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';

interface StudentDashboardProps {
  sheetsState: VirtualSheetsState;
  currentUserId: string;
  onSubmitExam: (subjectId: string, score: number, totalQuestions: number) => void;
}

export default function StudentDashboard({
  sheetsState,
  currentUserId,
  onSubmitExam
}: StudentDashboardProps) {
  // Navigation & Screen Control
  const [activeScreen, setActiveScreen] = useState<'lobby' | 'testing' | 'finished'>('lobby');
  
  // Selection
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [randomCountLimit, setRandomCountLimit] = useState(5);

  // Active Test State
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  
  // Scoring
  const [scoreResult, setScoreResult] = useState<{ score: number; total: number; percentage: number } | null>(null);

  // Thai Date Time Formatter
  const formatDateTimeThai = (dateTimeStr: string): string => {
    if (!dateTimeStr) return '';
    try {
      const d = new Date(dateTimeStr);
      if (isNaN(d.getTime())) return dateTimeStr;
      return d.toLocaleString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateTimeStr;
    }
  };

  // Check if Exam is Open and return full status info
  const getExamStatus = (sub: Subject) => {
    const now = new Date();
    const isManualActive = sub.is_active ?? true;
    
    if (!isManualActive) {
      return {
        isOpen: false,
        label: 'ปิดสอบชั่วคราว',
        bgClass: 'bg-red-50 text-red-700 border-red-200/60',
        textClass: 'text-red-600',
        reason: 'คุณครูผู้สอนได้ปิดสิทธิ์เข้าสอบในรายวิชานี้ชั่วคราว'
      };
    }
    
    if (sub.start_time) {
      const startTime = new Date(sub.start_time);
      if (now < startTime) {
        return {
          isOpen: false,
          label: 'ยังไม่ถึงเวลาเปิด',
          bgClass: 'bg-amber-50 text-amber-700 border-amber-200/60',
          textClass: 'text-amber-600',
          reason: `จะเริ่มระบบสอบเวลา ${formatDateTimeThai(sub.start_time)}`
        };
      }
    }
    
    if (sub.end_time) {
      const endTime = new Date(sub.end_time);
      if (now > endTime) {
        return {
          isOpen: false,
          label: 'หมดเวลาทำข้อสอบ',
          bgClass: 'bg-slate-100 text-slate-500 border-slate-200/60',
          textClass: 'text-slate-500',
          reason: `ระบบได้ปิดตัวลงเมื่อวันที่ ${formatDateTimeThai(sub.end_time)}`
        };
      }
    }
    
    return {
      isOpen: true,
      label: 'เปิดให้เข้าสอบ',
      bgClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
      textClass: 'text-emerald-600'
    };
  };

  // Filter questions for chosen subject and randomize them
  const handleOpenConfig = (subject: Subject) => {
    const status = getExamStatus(subject);
    if (!status.isOpen) {
      alert(`ไม่สามารถเริ่มทำข้อสอบได้เนื่องจาก: ${status.reason}`);
      return;
    }

    setSelectedSubject(subject);
    
    // Find how many questions are in this subject
    const subjectQuestions = sheetsState.Questions.filter(q => q.subject_id === subject.subject_id);
    const count = subjectQuestions.length;

    if (count === 0) {
      alert('ขออภัยด้วยครับ รายวิชานี้ยังไม่มีคำถามในคลังข้อสอบ กรุณาติดต่อคุณครูผู้สอนเพื่อเพิ่มข้อสอบก่อนเข้าสอบครับ');
      return;
    }

    // If teacher set a specific mandated limit, use it, otherwise fall back to min of 5 or count
    if (subject.question_limit && subject.question_limit > 0) {
      setRandomCountLimit(Math.min(subject.question_limit, count));
    } else {
      setRandomCountLimit(Math.min(5, count));
    }
    
    setShowConfigModal(true);
  };

  const handleStartExam = () => {
    if (!selectedSubject) return;

    setShowConfigModal(false);
    
    // Filter questions for chosen subject
    const subjectQuestions = sheetsState.Questions.filter(q => q.subject_id === selectedSubject.subject_id);
    
    // Fisher-Yates Shuffle Algorithm to randomize order
    const shuffled = [...subjectQuestions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Slice to the randomized limit
    const selectedQuestions = shuffled.slice(0, Math.min(randomCountLimit, shuffled.length));
    
    setActiveQuestions(selectedQuestions);
    setAnswers({});
    setActiveScreen('testing');
  };

  const handleSelectOption = (questionId: string, option: 'A' | 'B' | 'C' | 'D') => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const handleSubmitAnswers = () => {
    const unansweredCount = activeQuestions.filter(q => !answers[q.question_id]).length;
    if (unansweredCount > 0) {
      const confirmSubmit = window.confirm(
        `คุณยังทำข้อสอบไม่ครบ ข้ามตัวเลือกไปทั้งหมด ${unansweredCount} ข้อ ยืนยันที่จะกดส่งคำตอบและบันทึกคะแนนสอบหรือไม่?`
      );
      if (!confirmSubmit) return;
    }

    // Calculate score immediately
    let score = 0;
    activeQuestions.forEach(q => {
      const studentAnswer = answers[q.question_id];
      if (studentAnswer === q.correct_option) {
        score++;
      }
    });

    const total = activeQuestions.length;
    const percentage = Math.round((score / total) * 100);

    setScoreResult({ score, total, percentage });
    
    // Submit results to update database sheet in parent component
    if (selectedSubject) {
      onSubmitExam(selectedSubject.subject_id, score, total);
    }

    setActiveScreen('finished');
  };

  const handleBackToLobby = () => {
    setActiveScreen('lobby');
    setSelectedSubject(null);
    setScoreResult(null);
    setActiveQuestions([]);
    setAnswers({});
  };

  // Filter personal results for history pane
  const personalResults = sheetsState.Exam_Results.filter(r => r.student_id === currentUserId);

  const getSubjectName = (subjectId: string) => {
    const sub = sheetsState.Subjects.find(s => s.subject_id === subjectId);
    return sub ? sub.subject_name : `รายวิชา (${subjectId})`;
  };

  // Student Personal Stats
  const personalCount = personalResults.length;
  const personalPassingCount = personalResults.filter(r => (r.score / r.total_questions) >= 0.5).length;
  const personalAveragePercent = personalCount > 0 
    ? Math.round((personalResults.reduce((acc, r) => acc + (r.score / r.total_questions), 0) / personalCount) * 100) 
    : 0;
  const personalHighestPercent = personalCount > 0 
    ? Math.max(...personalResults.map(r => Math.round((r.score / r.total_questions) * 100))) 
    : 0;

  return (
    <div id="student-dashboard-panel" className="space-y-6">
      {activeScreen === 'lobby' && (
        <div className="space-y-6">
          {/* Personal Stats Dashboard Header */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                <Clipboard className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 block uppercase tracking-wider">สอบรวมสะสม</span>
                <span className="text-lg font-extrabold text-slate-900 font-mono block leading-none mt-1">{personalCount} ครั้ง</span>
              </div>
            </div>
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 block uppercase tracking-wider">คะแนนเฉลี่ย</span>
                <span className="text-lg font-extrabold text-slate-900 font-mono block leading-none mt-1">{personalAveragePercent}%</span>
              </div>
            </div>
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 block uppercase tracking-wider">สถิติสูงสุด</span>
                <span className="text-lg font-extrabold text-slate-900 font-mono block leading-none mt-1">{personalHighestPercent}%</span>
              </div>
            </div>
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 block uppercase tracking-wider">สอบผ่านเกณฑ์</span>
                <span className="text-lg font-extrabold text-slate-900 font-mono block leading-none mt-1">{personalPassingCount} ครั้ง</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Block: Subject Grid */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">เลือกแบบทดสอบรายวิชา</h3>
                <p className="text-xs text-slate-400 font-medium">สุ่มข้อสอบชุดเฉพาะบุคคลจากคลังคำถาม</p>
              </div>
              <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-emerald-200/50">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping"></span>
                เปิดให้เข้าสอบ
              </span>
            </div>

            <div id="student-subjects-grid-container" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sheetsState.Subjects.length === 0 ? (
                <div className="col-span-2 text-center text-slate-400 py-10 font-semibold text-sm">
                  ขณะนี้ยังไม่มีรายวิชาที่สร้างข้อสอบไว้ในระบบ
                </div>
              ) : (
                sheetsState.Subjects.map(sub => {
                  const subQuestionsCount = sheetsState.Questions.filter(q => q.subject_id === sub.subject_id).length;
                  const status = getExamStatus(sub);
                  
                  return (
                    <div
                      key={sub.subject_id}
                      id={`subject-card-${sub.subject_id}`}
                      className={`bg-white p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 group ${
                        status.isOpen 
                          ? 'border-slate-200 hover:border-indigo-500 hover:shadow-md' 
                          : 'border-slate-100 opacity-80'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-start gap-1">
                          <div className="bg-indigo-50 text-indigo-700 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                            {sub.subject_id}
                          </div>
                          
                          {/* Dynamic status badge */}
                          <span className={`inline-block px-2 py-0.5 rounded-lg border text-[9px] font-extrabold tracking-wider ${status.bgClass}`}>
                            {status.label}
                          </span>
                        </div>

                        <h4 className={`font-bold text-base leading-snug transition-colors ${
                          status.isOpen ? 'text-slate-900 group-hover:text-indigo-600' : 'text-slate-500'
                        }`}>
                          {sub.subject_name}
                        </h4>

                        {/* Exam meta constraints */}
                        <div className="space-y-1 bg-slate-50 p-2 rounded-xl text-[10px] font-semibold text-slate-500 border border-slate-100">
                          <div className="flex justify-between">
                            <span>ข้อสอบในคลังย่อย:</span>
                            <span className="text-indigo-600 font-bold">{subQuestionsCount} ข้อ</span>
                          </div>
                          <div className="flex justify-between">
                            <span>สุ่มสอบจริง:</span>
                            <span className="text-slate-700 font-bold">{sub.question_limit ?? 'ตามเลือก'} ข้อ</span>
                          </div>
                          {sub.start_time && (
                            <div className="flex justify-between">
                              <span>วันเวลาเปิด:</span>
                              <span className="text-slate-600">{formatDateTimeThai(sub.start_time)}</span>
                            </div>
                          )}
                          {sub.end_time && (
                            <div className="flex justify-between">
                              <span>วันเวลาปิด:</span>
                              <span className="text-slate-600">{formatDateTimeThai(sub.end_time)}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {status.isOpen ? (
                        <button
                          onClick={() => handleOpenConfig(sub)}
                          id={`btn-start-subject-${sub.subject_id}`}
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm hover:shadow"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          เริ่มสุ่มทำแบบทดสอบ
                        </button>
                      ) : (
                        <button
                          disabled
                          className="w-full bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          ระบบยังไม่เปิดให้สอบ
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Block: History Panel */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 h-fit">
            <div className="border-b border-slate-100 pb-3 flex items-center gap-2 text-slate-900">
              <Award className="w-5 h-5 text-indigo-600" />
              <div>
                <h3 className="font-bold text-base leading-snug">ประวัติคะแนนสอบของคุณ</h3>
                <p className="text-xs text-slate-400 font-medium">บันทึกสถิติความก้าวหน้าและการทดสอบ</p>
              </div>
            </div>

            <div id="student-personal-results-container" className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {personalResults.length === 0 ? (
                <div className="text-center text-slate-400 py-8 text-xs font-semibold">
                  คุณยังไม่เคยทำการสอบในวิชาใดๆ
                </div>
              ) : (
                [...personalResults].reverse().map(r => {
                  const pct = Math.round((r.score / r.total_questions) * 100);
                  let color = 'text-red-600';
                  let bg = 'bg-red-50 border-red-100';
                  if (pct >= 80) {
                    color = 'text-emerald-600';
                    bg = 'bg-emerald-50 border-emerald-100';
                  } else if (pct >= 50) {
                    color = 'text-amber-600';
                    bg = 'bg-amber-50 border-amber-100';
                  }

                  return (
                    <div
                      key={r.result_id}
                      className={`p-3 rounded-xl border flex justify-between items-center text-xs ${bg}`}
                    >
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-800 line-clamp-1">{getSubjectName(r.subject_id)}</p>
                        <p className="text-[9px] text-slate-400 font-bold font-mono">{r.date_time}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`font-bold text-sm ${color} font-mono`}>
                          {r.score} <span className="text-slate-400 font-normal text-[10px]">/ {r.total_questions}</span>
                        </p>
                        <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-md font-mono ${
                          pct >= 80 ? 'bg-emerald-100 text-emerald-800' : pct >= 50 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
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

      {/* Config Randomize Modal */}
      {showConfigModal && selectedSubject && (
        <div id="student-exam-config-modal-backdrop" className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300 p-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full border border-slate-100 space-y-5 animate-scale">
            <div>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full uppercase font-mono">{selectedSubject.subject_id}</span>
              <h3 className="text-lg font-bold text-slate-900 mt-1" id="student-config-subject-title">{selectedSubject.subject_name}</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">ตั้งค่าสุ่มข้อสอบก่อนเริ่มสอบจริง</p>
            </div>

            <div className="space-y-3.5">
              {selectedSubject.question_limit && selectedSubject.question_limit > 0 ? (
                // Mandated Limit Notice (Disabled Slider)
                <div className="bg-indigo-50 border border-indigo-100 p-3.5 rounded-xl text-xs space-y-2">
                  <div className="flex gap-2 items-start text-indigo-800 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span>จำนวนข้อสอบถูกกำหนดโดยคุณครูผู้สอน</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed font-semibold">
                    วิชานี้กำหนดสุ่มทำแบบทดสอบคงที่จำนวน <span className="text-indigo-600 font-bold font-mono text-sm">{randomCountLimit} ข้อ</span> เพื่อให้เป็นมาตรฐานเดียวกันสำหรับผู้สอบทุกคน
                  </p>
                </div>
              ) : (
                // Student Option Slider
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    ต้องการสุ่มข้อสอบมาทำจำนวนกี่ข้อ?
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="1"
                      max={sheetsState.Questions.filter(q => q.subject_id === selectedSubject.subject_id).length}
                      value={randomCountLimit}
                      onChange={(e) => setRandomCountLimit(parseInt(e.target.value, 10))}
                      className="flex-grow accent-indigo-600 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                    />
                    <span className="font-mono font-bold bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1 rounded-xl text-xs shrink-0">
                      {randomCountLimit} ข้อ
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold mt-1.5" id="student-config-count-limit-caption">
                    *สุ่มดึงข้อสอบมาจากคลังย่อยวิชานี้ทั้งหมดที่มี {sheetsState.Questions.filter(q => q.subject_id === selectedSubject.subject_id).length} ข้อ
                  </p>
                </div>
              )}

              <div className="bg-indigo-50/50 border border-indigo-100/50 text-indigo-800 p-3.5 rounded-xl text-xs leading-relaxed font-semibold">
                <div className="flex gap-2 items-start">
                  <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-600">
                    <b>อัลกอริทึม Fisher-Yates Shuffle:</b> ระบบจะทำการสุ่มทั้งชุดโจทย์คำถามและเรียงลำดับใหม่ทั้งหมด เพื่อความยุติธรรมและโปร่งใสในการจัดสอบ
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowConfigModal(false)}
                id="btn-close-exam-config"
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-2.5 rounded-xl text-xs transition-all"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleStartExam}
                id="btn-confirm-start-exam"
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md shadow-indigo-600/10 animate-pulse"
              >
                เข้าทำข้อสอบทันที
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Testing Screen */}
      {activeScreen === 'testing' && selectedSubject && (
        <div id="student-active-test-container" className="bg-white rounded-2xl border-2 border-indigo-500 shadow-md p-5 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 gap-3">
            <div>
              <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                ห้องสอบออนไลน์ส่วนบุคคล (Randomized)
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-1.5">{selectedSubject.subject_name}</h2>
            </div>
            
            {/* Answered / Unanswered stats */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold">สถานะคำตอบ:</span>
              <div className="flex flex-wrap gap-1">
                {activeQuestions.map((q, idx) => {
                  const isAnswered = !!answers[q.question_id];
                  return (
                    <span
                      key={q.question_id}
                      id={`pills-indicator-q-${idx}`}
                      className={`w-6 h-6 rounded-md flex items-center justify-center font-mono text-[10px] font-bold border transition-all ${
                        isAnswered
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-slate-50 text-slate-400 border-slate-200'
                      }`}
                    >
                      {idx + 1}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Question List */}
          <div id="student-exam-questions-list" className="space-y-6">
            {activeQuestions.map((q, idx) => (
              <div key={q.question_id} className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4">
                <div className="flex gap-2.5 items-start">
                  <span className="bg-indigo-600 text-white font-bold text-xs px-2.5 py-1 rounded-lg font-mono shrink-0">
                    ข้อที่ {idx + 1}
                  </span>
                  <p className="font-bold text-slate-900 text-sm sm:text-base leading-relaxed">
                    {q.question_text}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-2">
                  {(['A', 'B', 'C', 'D'] as const).map(letter => {
                    const isSelected = answers[q.question_id] === letter;
                    return (
                      <label
                        key={letter}
                        id={`label-choice-student-${idx}-${letter}`}
                        onClick={() => handleSelectOption(q.question_id, letter)}
                        className={`flex items-center gap-3 border bg-white hover:bg-slate-50/50 hover:border-indigo-400 px-4 py-3.5 rounded-xl cursor-pointer select-none transition-all ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/40 font-bold shadow-sm ring-1 ring-indigo-500'
                            : 'border-slate-200 text-slate-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`ans-${q.question_id}`}
                          value={letter}
                          checked={isSelected}
                          onChange={() => {}} // handled by click of label to feel native
                          className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 shrink-0"
                        />
                        <span className="font-bold text-slate-400 font-mono text-sm shrink-0">{letter}.</span>
                        <span className="text-xs sm:text-sm font-semibold">{q[`option_${letter}`]}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Submission bar */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-100 justify-between items-center">
            <span className="text-xs text-amber-600 font-bold flex items-center gap-1">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
              โปรดตรวจสอบความเรียบร้อยและตอบให้ครบถ้วนก่อนส่งกระดาษคำตอบ
            </span>
            <button
              onClick={handleSubmitAnswers}
              id="btn-student-submit-exam"
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-600/10 flex items-center justify-center gap-2"
            >
              <span>ส่งกระดาษคำตอบและเสร็จสิ้น</span>
            </button>
          </div>
        </div>
      )}

      {/* Finished Result Summary */}
      {activeScreen === 'finished' && scoreResult && selectedSubject && (
        <div id="student-exam-finished-card" className="bg-gradient-to-br from-indigo-950 to-slate-900 rounded-3xl p-8 text-white text-center space-y-6 max-w-xl mx-auto shadow-xl relative overflow-hidden">
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-emerald-600/10 rounded-full blur-3xl"></div>

          <div className="relative space-y-4">
            <div className="w-16 h-16 bg-emerald-500/15 border-2 border-emerald-400 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg animate-scale">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            
            <div>
              <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                ส่งกระดาษคำตอบสำเร็จ
              </span>
              <h2 className="text-xl font-bold mt-3 leading-snug">คำนวณคะแนนและบันทึกลง Google Sheets แล้ว!</h2>
              <p className="text-slate-400 text-xs mt-1">วิชา: {selectedSubject.subject_name}</p>
            </div>

            {/* Score Showcase Card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 my-6 max-w-xs mx-auto">
              <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-widest">สรุปผลสอบย่อย</p>
              <div className="flex items-baseline justify-center gap-1.5 my-3">
                <span className="text-6xl font-extrabold text-emerald-400 font-mono" id="summary-score-val">{scoreResult.score}</span>
                <span className="text-xl text-white/30 font-bold">/</span>
                <span className="text-2xl text-white/70 font-bold font-mono" id="summary-total-val">{scoreResult.total}</span>
              </div>
              <p className="text-xs font-semibold text-slate-300">
                คิดเป็นร้อยละ: <span className="text-emerald-400 font-bold text-sm" id="summary-pct-val">{scoreResult.percentage}%</span>
              </p>
            </div>

            <div className="flex flex-col gap-2 max-w-xs mx-auto">
              <button
                onClick={handleBackToLobby}
                id="btn-back-to-lobby-finished"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl text-xs transition-all shadow-md shadow-indigo-600/25 flex items-center justify-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                กลับสู่หน้าวิชาสอบหลัก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
