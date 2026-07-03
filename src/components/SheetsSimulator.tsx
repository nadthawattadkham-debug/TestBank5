import React, { useState } from 'react';
import { VirtualSheetsState, User, Subject, Question, ExamResult } from '../types';
import { 
  Database, 
  RefreshCw, 
  FileSpreadsheet, 
  Eye, 
  Sparkles,
  Cloud,
  CloudLightning,
  CloudDownload,
  CloudUpload,
  Download,
  Upload,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Info,
  HelpCircle
} from 'lucide-react';
import { read, utils, write } from 'xlsx';

interface SheetsSimulatorProps {
  sheetsState: VirtualSheetsState;
  onResetDatabase: () => void;
  onUpdateSheetsState?: (newState: VirtualSheetsState) => void;
}

type TabType = 'Users' | 'Subjects' | 'Questions' | 'Exam_Results';

// Helper to extract Spreadsheet ID from URL
const extractSpreadsheetId = (urlOrId: string): string => {
  const trimmed = urlOrId.trim();
  if (!trimmed) return '';
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    return match[1];
  }
  return trimmed;
};

// Robust local CSV parser that handles quotes and delimiters
const parseCSV = (text: string): string[][] => {
  const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
  if (lines.length === 0) return [];

  let commaCount = 0;
  let semicolonCount = 0;
  for (let i = 0; i < Math.min(lines.length, 5); i++) {
    commaCount += (lines[i].match(/,/g) || []).length;
    semicolonCount += (lines[i].match(/;/g) || []).length;
  }
  const delimiter = semicolonCount > commaCount ? ';' : ',';

  return lines.map(line => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === delimiter && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    
    return result.map(val => {
      let v = val.trim();
      if (v.startsWith('"') && v.endsWith('"')) {
        v = v.substring(1, v.length - 1);
      }
      return v;
    });
  });
};

// Fetch published Google Sheet as CSV
const fetchSheetAsCSV = async (spreadsheetId: string, sheetName: string): Promise<string[][]> => {
  const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`ไม่สามารถดาวน์โหลดชีต "${sheetName}" ได้ โปรดตรวจเช็คว่าท่านสะกดชื่อแผ่นงานตรงกันและตั้งค่าแชร์ให้ทุกคนที่มีลิงก์มีสิทธิ์อ่านแล้ว`);
  }
  const text = await response.text();
  return parseCSV(text);
};

// Map row-by-row for Users
const mapRowsToUsers = (rows: string[][]): User[] => {
  if (rows.length < 2) return [];
  const headers = rows[0].map(h => h.trim().toLowerCase());
  const dataRows = rows.slice(1);

  const idIdx = headers.indexOf('id');
  const userIdx = headers.indexOf('username');
  const passwordIdx = headers.indexOf('password');
  const nameIdx = headers.indexOf('name');
  const roleIdx = headers.indexOf('role');
  const approvedIdx = headers.indexOf('approved');

  return dataRows.map((row, index) => {
    const id = idIdx !== -1 && row[idIdx] ? row[idIdx] : `U${String(index + 1).padStart(3, '0')}`;
    const username = userIdx !== -1 && row[userIdx] ? row[userIdx] : `user${index + 1}`;
    const password = passwordIdx !== -1 && row[passwordIdx] ? row[passwordIdx] : '5210273008Aa';
    const name = nameIdx !== -1 && row[nameIdx] ? row[nameIdx] : `User ${index + 1}`;
    const roleRaw = roleIdx !== -1 && row[roleIdx] ? row[roleIdx].toLowerCase() : 'student';
    const role = (roleRaw === 'teacher' || roleRaw === 'admin') ? roleRaw : 'student';
    
    let approved = true;
    if (approvedIdx !== -1 && row[approvedIdx]) {
      approved = row[approvedIdx].trim().toLowerCase() !== 'false';
    }

    return { id, username, password, name, role, approved };
  });
};

// Map row-by-row for Subjects
const mapRowsToSubjects = (rows: string[][]): Subject[] => {
  if (rows.length < 2) return [];
  const headers = rows[0].map(h => h.trim().toLowerCase());
  const dataRows = rows.slice(1);

  const idIdx = headers.indexOf('subject_id');
  const nameIdx = headers.indexOf('subject_name');
  const teacherIdx = headers.indexOf('teacher_id');
  const limitIdx = headers.indexOf('question_limit');
  const startIdx = headers.indexOf('start_time');
  const endIdx = headers.indexOf('end_time');
  const activeIdx = headers.indexOf('is_active');

  return dataRows.map((row, index) => {
    const subject_id = idIdx !== -1 && row[idIdx] ? row[idIdx] : `S${String(index + 1).padStart(3, '0')}`;
    const subject_name = nameIdx !== -1 && row[nameIdx] ? row[nameIdx] : `Subject ${index + 1}`;
    const teacher_id = teacherIdx !== -1 && row[teacherIdx] ? row[teacherIdx] : 'U001';
    
    let question_limit: number | undefined = undefined;
    if (limitIdx !== -1 && row[limitIdx]) {
      const parsedLimit = parseInt(row[limitIdx], 10);
      if (!isNaN(parsedLimit)) question_limit = parsedLimit;
    }

    const start_time = startIdx !== -1 && row[startIdx] ? row[startIdx] : '';
    const end_time = endIdx !== -1 && row[endIdx] ? row[endIdx] : '';
    
    let is_active = true;
    if (activeIdx !== -1 && row[activeIdx]) {
      is_active = row[activeIdx].toLowerCase() !== 'false';
    }

    return { subject_id, subject_name, teacher_id, question_limit, start_time, end_time, is_active };
  });
};

// Map row-by-row for Questions
const mapRowsToQuestions = (rows: string[][]): Question[] => {
  if (rows.length < 2) return [];
  const headers = rows[0].map(h => h.trim().toLowerCase());
  const dataRows = rows.slice(1);

  const qIdIdx = headers.indexOf('question_id');
  const sIdIdx = headers.indexOf('subject_id');
  const textIdx = headers.indexOf('question_text');
  const optAIdx = headers.indexOf('option_a');
  const optBIdx = headers.indexOf('option_b');
  const optCIdx = headers.indexOf('option_c');
  const optDIdx = headers.indexOf('option_d');
  const correctIdx = headers.indexOf('correct_option');

  return dataRows.map((row, index) => {
    const question_id = qIdIdx !== -1 && row[qIdIdx] ? row[qIdIdx] : `Q${String(index + 1).padStart(3, '0')}`;
    const subject_id = sIdIdx !== -1 && row[sIdIdx] ? row[sIdIdx] : 'S001';
    const question_text = textIdx !== -1 && row[textIdx] ? row[textIdx] : `คำถามที่ ${index + 1}`;
    const option_A = optAIdx !== -1 && row[optAIdx] ? row[optAIdx] : '';
    const option_B = optBIdx !== -1 && row[optBIdx] ? row[optBIdx] : '';
    const option_C = optCIdx !== -1 && row[optCIdx] ? row[optCIdx] : '';
    const option_D = optDIdx !== -1 && row[optDIdx] ? row[optDIdx] : '';
    
    let correct_option: 'A' | 'B' | 'C' | 'D' = 'A';
    if (correctIdx !== -1 && row[correctIdx]) {
      const correct = row[correctIdx].trim().toUpperCase();
      if (correct === 'A' || correct === 'B' || correct === 'C' || correct === 'D') {
        correct_option = correct;
      }
    }

    return { question_id, subject_id, question_text, option_A, option_B, option_C, option_D, correct_option };
  });
};

// Map row-by-row for Exam Results
const mapRowsToExamResults = (rows: string[][]): ExamResult[] => {
  if (rows.length < 2) return [];
  const headers = rows[0].map(h => h.trim().toLowerCase());
  const dataRows = rows.slice(1);

  const rIdIdx = headers.indexOf('result_id');
  const stIdIdx = headers.indexOf('student_id');
  const sbIdIdx = headers.indexOf('subject_id');
  const scoreIdx = headers.indexOf('score');
  const totalIdx = headers.indexOf('total_questions');
  const dateIdx = headers.indexOf('date_time');

  return dataRows.map((row, index) => {
    const result_id = rIdIdx !== -1 && row[rIdIdx] ? row[rIdIdx] : `R${String(index + 1).padStart(3, '0')}`;
    const student_id = stIdIdx !== -1 && row[stIdIdx] ? row[stIdIdx] : 'U002';
    const subject_id = sbIdIdx !== -1 && row[sbIdIdx] ? row[sbIdIdx] : 'S001';
    
    let score = 0;
    if (scoreIdx !== -1 && row[scoreIdx]) {
      const parsed = parseInt(row[scoreIdx], 10);
      if (!isNaN(parsed)) score = parsed;
    }

    let total_questions = 10;
    if (totalIdx !== -1 && row[totalIdx]) {
      const parsed = parseInt(row[totalIdx], 10);
      if (!isNaN(parsed)) total_questions = parsed;
    }

    const date_time = dateIdx !== -1 && row[dateIdx] ? row[dateIdx] : new Date().toLocaleString('th-TH');

    return { result_id, student_id, subject_id, score, total_questions, date_time };
  });
};

export default function SheetsSimulator({ sheetsState, onResetDatabase, onUpdateSheetsState }: SheetsSimulatorProps) {
  const [activeTab, setActiveTab] = useState<TabType>('Users');
  const [searchQuery, setSearchQuery] = useState('');

  // Google Sheets Sync State
  const [showSyncPanel, setShowSyncPanel] = useState(true);
  const [spreadsheetUrl, setSpreadsheetUrl] = useState('https://docs.google.com/spreadsheets/d/1UJ5otMUveZVQBVDQAxJ22JaCMTCTvE7GCHmHkquM-TY/edit?usp=sharing');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState('');
  const [syncSuccess, setSyncSuccess] = useState('');

  const tabs: { id: TabType; label: string; count: number; color: string }[] = [
    { id: 'Users', label: 'ชีต Users (ผู้ใช้งาน)', count: sheetsState.Users.length, color: 'bg-blue-500' },
    { id: 'Subjects', label: 'ชีต Subjects (วิชา)', count: sheetsState.Subjects.length, color: 'bg-emerald-500' },
    { id: 'Questions', label: 'ชีต Questions (คลังข้อสอบ)', count: sheetsState.Questions.length, color: 'bg-amber-500' },
    { id: 'Exam_Results', label: 'ชีต Exam_Results (คะแนนสอบ)', count: sheetsState.Exam_Results.length, color: 'bg-purple-500' },
  ];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredData = () => {
    const q = searchQuery.toLowerCase();
    if (!q) return sheetsState[activeTab];

    switch (activeTab) {
      case 'Users':
        return sheetsState.Users.filter(u => 
          u.id.toLowerCase().includes(q) || 
          u.name.toLowerCase().includes(q) || 
          u.username.toLowerCase().includes(q) ||
          u.role.toLowerCase().includes(q)
        );
      case 'Subjects':
        return sheetsState.Subjects.filter(s => 
          s.subject_id.toLowerCase().includes(q) || 
          s.subject_name.toLowerCase().includes(q) || 
          s.teacher_id.toLowerCase().includes(q)
        );
      case 'Questions':
        return sheetsState.Questions.filter(qu => 
          qu.question_id.toLowerCase().includes(q) || 
          qu.question_text.toLowerCase().includes(q) || 
          qu.subject_id.toLowerCase().includes(q)
        );
      case 'Exam_Results':
        return sheetsState.Exam_Results.filter(r => 
          r.result_id.toLowerCase().includes(q) || 
          r.student_id.toLowerCase().includes(q) || 
          r.subject_id.toLowerCase().includes(q) ||
          r.score.toString().includes(q)
        );
      default:
        return sheetsState[activeTab];
    }
  };

  const handleSyncFromGoogleSheets = async () => {
    setSyncError('');
    setSyncSuccess('');
    
    const spreadsheetId = extractSpreadsheetId(spreadsheetUrl);
    if (!spreadsheetId) {
      setSyncError('กรุณากรอกลิงก์หรือรหัส Google Sheets ที่ถูกต้อง');
      return;
    }

    setIsSyncing(true);
    try {
      const tabs: TabType[] = ['Users', 'Subjects', 'Questions', 'Exam_Results'];
      const results: Record<string, string[][]> = {};

      for (const t of tabs) {
        const rows = await fetchSheetAsCSV(spreadsheetId, t);
        results[t] = rows;
      }

      const newUsers = mapRowsToUsers(results['Users']);
      const newSubjects = mapRowsToSubjects(results['Subjects']);
      const newQuestions = mapRowsToQuestions(results['Questions']);
      const newExamResults = mapRowsToExamResults(results['Exam_Results']);

      if (onUpdateSheetsState) {
        onUpdateSheetsState({
          Users: newUsers,
          Subjects: newSubjects,
          Questions: newQuestions,
          Exam_Results: newExamResults
        });
        setSyncSuccess(`ซิงก์สำเร็จ! ดึงตารางจาก Google Sheets ครบถ้วน: Users (${newUsers.length} แถว), Subjects (${newSubjects.length} แถว), Questions (${newQuestions.length} แถว), Exam_Results (${newExamResults.length} แถว) เรียบร้อยแล้ว`);
      } else {
        setSyncError('ระบบสเตทหลักไม่รองรับการซิงก์จากหน้านี้ในขณะนี้');
      }
    } catch (err: any) {
      console.error('Error syncing:', err);
      setSyncError(err.message || 'เกิดข้อผิดพลาดในการโหลดชีต กรุณาตรวจสอบว่าแผ่นงานตั้งค่าแชร์เป็น "ทุกคนที่มีลิงก์มีสิทธิ์อ่าน" และชื่อชีตย่อย (Users, Subjects, Questions, Exam_Results) สะกดตรงกันอย่างถูกต้อง');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleExportToSpreadsheetFile = () => {
    try {
      const wb = utils.book_new();

      const wsUsers = utils.json_to_sheet(sheetsState.Users);
      const wsSubjects = utils.json_to_sheet(sheetsState.Subjects);
      const wsQuestions = utils.json_to_sheet(sheetsState.Questions);
      const wsExamResults = utils.json_to_sheet(sheetsState.Exam_Results);

      utils.book_append_sheet(wb, wsUsers, 'Users');
      utils.book_append_sheet(wb, wsSubjects, 'Subjects');
      utils.book_append_sheet(wb, wsQuestions, 'Questions');
      utils.book_append_sheet(wb, wsExamResults, 'Exam_Results');

      const wbout = write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], { type: 'application/octet-stream' });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ExamHub_Pro_Database.xlsx';
      a.click();
      URL.revokeObjectURL(url);
      
      setSyncSuccess('ส่งออกระบบคลังข้อสอบและผลลัพธ์เป็นไฟล์ ExamHub_Pro_Database.xlsx สำเร็จ! ท่านสามารถนำไปเปิดบน Google Sheets ได้ทันที');
    } catch (err: any) {
      setSyncError('เกิดข้อผิดพลาดขณะเขียนไฟล์: ' + err.message);
    }
  };

  const handleImportExcelDatabase = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = read(data, { type: 'array' });
        
        const newUsers = workbook.Sheets['Users'] 
          ? utils.sheet_to_json<any>(workbook.Sheets['Users']) 
          : sheetsState.Users;
          
        const newSubjects = workbook.Sheets['Subjects'] 
          ? utils.sheet_to_json<any>(workbook.Sheets['Subjects']) 
          : sheetsState.Subjects;
          
        const newQuestions = workbook.Sheets['Questions'] 
          ? utils.sheet_to_json<any>(workbook.Sheets['Questions']) 
          : sheetsState.Questions;
          
        const newExamResults = workbook.Sheets['Exam_Results'] 
          ? utils.sheet_to_json<any>(workbook.Sheets['Exam_Results']) 
          : sheetsState.Exam_Results;

        if (!workbook.Sheets['Users'] && !workbook.Sheets['Subjects'] && !workbook.Sheets['Questions'] && !workbook.Sheets['Exam_Results']) {
          setSyncError('ไม่พบแท็บชีตย่อยมาตรฐาน (Users, Subjects, Questions, Exam_Results) ในไฟล์ที่อัปโหลด');
          return;
        }

        const mappedUsers = newUsers.map((u: any) => ({
          id: String(u.id !== undefined && u.id !== null ? u.id : ''),
          username: String(u.username || ''),
          password: String(u.password || '5210273008Aa'),
          name: String(u.name || ''),
          role: String(u.role || 'student') as 'student' | 'teacher' | 'admin',
          approved: u.approved === undefined ? true : (String(u.approved).toLowerCase() !== 'false')
        }));

        const mappedSubjects = newSubjects.map((s: any) => ({
          subject_id: String(s.subject_id || ''),
          subject_name: String(s.subject_name || ''),
          teacher_id: String(s.teacher_id || 'U001'),
          question_limit: s.question_limit ? parseInt(s.question_limit, 10) : undefined,
          start_time: String(s.start_time || ''),
          end_time: String(s.end_time || ''),
          is_active: s.is_active === undefined ? true : (String(s.is_active).toLowerCase() !== 'false')
        }));

        const mappedQuestions = newQuestions.map((q: any) => ({
          question_id: String(q.question_id || ''),
          subject_id: String(q.subject_id || ''),
          question_text: String(q.question_text || ''),
          option_A: String(q.option_A || q.option_a || ''),
          option_B: String(q.option_B || q.option_b || ''),
          option_C: String(q.option_C || q.option_c || ''),
          option_D: String(q.option_D || q.option_d || ''),
          correct_option: String(q.correct_option || 'A') as 'A' | 'B' | 'C' | 'D'
        }));

        const mappedExamResults = newExamResults.map((r: any) => ({
          result_id: String(r.result_id || ''),
          student_id: String(r.student_id || ''),
          subject_id: String(r.subject_id || ''),
          score: parseInt(r.score || 0, 10),
          total_questions: parseInt(r.total_questions || 10, 10),
          date_time: String(r.date_time || '')
        }));

        if (onUpdateSheetsState) {
          onUpdateSheetsState({
            Users: mappedUsers,
            Subjects: mappedSubjects,
            Questions: mappedQuestions,
            Exam_Results: mappedExamResults
          });
          setSyncSuccess('อัปโหลดไฟล์แผ่นงานและปรับปรุงระบบฐานข้อมูล Google Sheets จำลองสำเร็จ!');
        } else {
          setSyncError('ระบบจำลองไม่เปิดรับข้อมูลสเตทหลักในตอนนี้');
        }
      } catch (err: any) {
        setSyncError('เกิดข้อผิดพลาดในการอ่านไฟล์แผ่นงาน: ' + err.message);
      }
      if (e.target) e.target.value = '';
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div id="sheets-simulator-section" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full min-h-[500px]">
      {/* Simulator Header */}
      <div className="bg-slate-900 text-white p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500 text-slate-950 p-2 rounded-xl">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-slate-100">จำลองฐานข้อมูล Google Sheets</h3>
              <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse border border-emerald-500/20">
                Live Sync
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">จำลองการเปลี่ยนแปลงของแถวตารางในแต่ละชีตแบบเรียลไทม์</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 self-stretch sm:self-auto w-full sm:w-auto">
          <button
            id="btn-toggle-sheets-sync"
            onClick={() => {
              setShowSyncPanel(!showSyncPanel);
              setSyncError('');
              setSyncSuccess('');
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-white bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 px-3 py-2 rounded-xl transition-all flex-1 sm:flex-none justify-center cursor-pointer"
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>เชื่อมต่อ Google Sheets จริง</span>
            {showSyncPanel ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            id="btn-reset-db"
            onClick={onResetDatabase}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-xl border border-slate-700 transition-all flex-1 sm:flex-none justify-center cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            ล้างข้อมูล
          </button>
        </div>
      </div>

      {/* Collapsible Integration Panel */}
      {showSyncPanel && (
        <div id="sheets-integration-panel" className="bg-slate-50 border-b border-slate-200 p-5 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <CloudLightning className="w-4 h-4 text-emerald-600 animate-pulse" />
                แผงซิงโครไนซ์ Google Sheets & นำเข้า-ส่งออกฐานข้อมูล
              </h4>
              <p className="text-xs text-slate-500 font-medium">ซิงก์ตาราง Users, Subjects, Questions, และ Exam_Results เข้ากับสเปรดชีตจริงบน Google Drive ได้ทันที</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                id="btn-export-xlsx"
                onClick={handleExportToSpreadsheetFile}
                className="flex items-center gap-1.5 text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-3.5 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
                title="ดาวน์โหลดโครงสร้างตารางระบบสอบทั้งหมดเพื่อนำเข้า Google Sheets"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>ส่งออกข้อมูล (XLSX)</span>
              </button>

              <label
                htmlFor="upload-xlsx-db-input"
                className="flex items-center gap-1.5 text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-3.5 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
                title="อัปโหลดตารางจาก Google Sheets หรือ Excel กลับเข้ามา"
              >
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                <span>อัปโหลดข้อมูลย้อนกลับ</span>
                <input
                  type="file"
                  id="upload-xlsx-db-input"
                  accept=".xlsx,.xls"
                  onChange={handleImportExcelDatabase}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4.5 space-y-3.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">ป้อนลิงก์ Google Sheets ของคุณ (Spreadsheet URL หรือ ID)</label>
              <a 
                href="https://docs.google.com/spreadsheets" 
                target="_blank" 
                rel="noreferrer"
                className="text-[10px] text-emerald-600 font-bold hover:underline flex items-center gap-0.5"
              >
                เปิด Google Sheets คลาวด์
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                id="google-sheet-url-input"
                placeholder="วางลิงก์ เช่น https://docs.google.com/spreadsheets/d/.../edit"
                value={spreadsheetUrl}
                onChange={(e) => setSpreadsheetUrl(e.target.value)}
                className="flex-grow px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white text-xs font-medium text-slate-700"
              />
              <button
                id="btn-trigger-sheets-sync"
                onClick={handleSyncFromGoogleSheets}
                disabled={isSyncing}
                className={`flex items-center justify-center gap-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl transition-all shadow-sm shrink-0 cursor-pointer ${isSyncing ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSyncing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>กำลังซิงก์ข้อมูล...</span>
                  </>
                ) : (
                  <>
                    <CloudLightning className="w-3.5 h-3.5" />
                    <span>ดึงตารางสดทันที (Sync Live!)</span>
                  </>
                )}
              </button>
            </div>

            {/* Sync Notifications */}
            {syncError && (
              <div id="sync-error-banner" className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-800 p-3 rounded-xl text-xs leading-relaxed">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span className="font-semibold">{syncError}</span>
              </div>
            )}
            {syncSuccess && (
              <div id="sync-success-banner" className="flex items-start gap-2 bg-emerald-50 border border-emerald-100 text-emerald-800 p-3 rounded-xl text-xs leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="font-semibold">{syncSuccess}</span>
              </div>
            )}

            {/* Step-by-step Sync Instructions */}
            <div className="bg-slate-50/50 p-3.5 rounded-xl border border-slate-100 space-y-2 text-xs text-slate-600 leading-relaxed">
              <p className="font-bold text-slate-700 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-emerald-600" />
                คำแนะนำในการเชื่อมโยงชีตจริง (Google Sheets Live Sync):
              </p>
              <ul className="list-decimal pl-5 space-y-1.5 font-medium">
                <li>เปิดสเปรดชีตบน Google Sheets และสร้างแผ่นงานย่อย (Tabs) ให้ครบทั้ง 4 ชีต: <code className="font-mono bg-white border border-slate-200 px-1.5 py-0.5 rounded font-bold text-slate-800">Users</code>, <code className="font-mono bg-white border border-slate-200 px-1.5 py-0.5 rounded font-bold text-slate-800">Subjects</code>, <code className="font-mono bg-white border border-slate-200 px-1.5 py-0.5 rounded font-bold text-slate-800">Questions</code>, และ <code className="font-mono bg-white border border-slate-200 px-1.5 py-0.5 rounded font-bold text-slate-800">Exam_Results</code></li>
                <li>คลิกปุ่ม **แชร์ (Share)** ขวาบน แล้วเลือกการเข้าถึงทั่วไปเป็น **"ทุกคนที่มีลิงก์ (Anyone with the link)"** มอบสิทธิ์แบบ **"ผู้มีสิทธิ์อ่าน (Viewer)"** (ปลอดภัยสูงที่สุดและง่ายต่อการสื่อสาร)</li>
                <li>คัดลอก URL ของชีตทั้งหมดนำมาวางในกล่องข้อความด้านบน แล้วกด **"ดึงตารางสดทันที (Sync Live!)"** ข้อมูลคลังข้อสอบ วิชาเรียน และนักเรียนจะถูกซิงก์เข้าสู่หน้าเว็บทันที!</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Spreadsheet Tabs */}
      <div className="bg-slate-50 border-b border-slate-200 p-2 flex flex-wrap gap-1.5 items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {tabs.map(t => (
            <button
              key={t.id}
              id={`tab-sheet-${t.id}`}
              onClick={() => {
                setActiveTab(t.id);
                setSearchQuery('');
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === t.id
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200 font-bold'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
              }`}
            >
              <FileSpreadsheet className={`w-3.5 h-3.5 ${activeTab === t.id ? 'text-emerald-500' : 'text-slate-400'}`} />
              <span>{t.label}</span>
              <span className="bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-md text-[10px] font-bold">
                {t.count} แถว
              </span>
            </button>
          ))}
        </div>

        <div className="w-full sm:w-auto mt-2 sm:mt-0 px-1">
          <input
            type="text"
            id="sheet-search-input"
            value={searchQuery}
            onChange={handleSearch}
            placeholder={`ค้นหาในชีต ${activeTab}...`}
            className="w-full sm:w-48 px-3 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
          />
        </div>
      </div>

      {/* Sheet Content Viewer */}
      <div className="flex-grow overflow-auto max-h-[400px]">
        {filteredData().length === 0 ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
            <Eye className="w-8 h-8 text-slate-300" />
            <p className="text-sm font-semibold">ไม่พบข้อมูลแถวในชีตนี้</p>
            {searchQuery && <p className="text-xs text-slate-400">ลองล้างตัวค้นหาเพื่อแสดงแถวทั้งหมด</p>}
          </div>
        ) : (
          <table id="simulator-spreadsheet-table" className="w-full text-left border-collapse text-xs select-text">
            <thead>
              <tr className="bg-slate-100/80 text-slate-500 font-bold border-b border-slate-200 sticky top-0 bg-slate-100">
                <th className="p-2.5 w-12 border-r border-slate-200 text-center bg-slate-200 text-slate-600 font-bold font-mono">Row</th>
                {activeTab === 'Users' && (
                  <>
                    <th className="p-2.5 border-r border-slate-200 font-mono">id</th>
                    <th className="p-2.5 border-r border-slate-200">username</th>
                    <th className="p-2.5 border-r border-slate-200">password</th>
                    <th className="p-2.5 border-r border-slate-200">name</th>
                    <th className="p-2.5 border-r border-slate-200 font-mono">role</th>
                    <th className="p-2.5 font-mono">approved</th>
                  </>
                )}
                {activeTab === 'Subjects' && (
                  <>
                    <th className="p-2.5 border-r border-slate-200 font-mono">subject_id</th>
                    <th className="p-2.5 border-r border-slate-200">subject_name</th>
                    <th className="p-2.5 border-r border-slate-200 font-mono">teacher_id</th>
                    <th className="p-2.5 border-r border-slate-200 font-mono">question_limit</th>
                    <th className="p-2.5 border-r border-slate-200 font-mono">start_time</th>
                    <th className="p-2.5 border-r border-slate-200 font-mono">end_time</th>
                    <th className="p-2.5 font-mono">is_active</th>
                  </>
                )}
                {activeTab === 'Questions' && (
                  <>
                    <th className="p-2.5 border-r border-slate-200 font-mono">question_id</th>
                    <th className="p-2.5 border-r border-slate-200 font-mono">subject_id</th>
                    <th className="p-2.5 border-r border-slate-200 max-w-xs truncate">question_text</th>
                    <th className="p-2.5 border-r border-slate-200">option_A</th>
                    <th className="p-2.5 border-r border-slate-200">option_B</th>
                    <th className="p-2.5 border-r border-slate-200">option_C</th>
                    <th className="p-2.5 border-r border-slate-200">option_D</th>
                    <th className="p-2.5 font-mono text-center">correct_option</th>
                  </>
                )}
                {activeTab === 'Exam_Results' && (
                  <>
                    <th className="p-2.5 border-r border-slate-200 font-mono">result_id</th>
                    <th className="p-2.5 border-r border-slate-200 font-mono">student_id</th>
                    <th className="p-2.5 border-r border-slate-200 font-mono">subject_id</th>
                    <th className="p-2.5 border-r border-slate-200 text-center">score</th>
                    <th className="p-2.5 border-r border-slate-200 text-center">total_questions</th>
                    <th className="p-2.5">date_time</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-sans text-slate-700">
              {filteredData().map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors odd:bg-white even:bg-slate-50/50">
                  <td className="p-2 border-r border-slate-200 bg-slate-100/40 text-center font-mono font-bold text-slate-400">
                    {idx + 2}
                  </td>
                  {activeTab === 'Users' && (
                    <>
                      <td className="p-2 border-r border-slate-200 font-mono font-semibold text-slate-500">{(row as any).id}</td>
                      <td className="p-2 border-r border-slate-200 font-medium">{(row as any).username}</td>
                      <td className="p-2 border-r border-slate-200 text-slate-400 font-mono">••••••••</td>
                      <td className="p-2 border-r border-slate-200 font-semibold text-slate-800">{(row as any).name}</td>
                      <td className="p-2 border-r border-slate-200">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          (row as any).role === 'teacher' ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          {(row as any).role}
                        </span>
                      </td>
                      <td className="p-2">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          (row as any).approved !== false ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {String((row as any).approved !== false)}
                        </span>
                      </td>
                    </>
                  )}
                  {activeTab === 'Subjects' && (
                    <>
                      <td className="p-2 border-r border-slate-200 font-mono font-semibold text-slate-500">{(row as any).subject_id}</td>
                      <td className="p-2 border-r border-slate-200 font-semibold text-slate-800">{(row as any).subject_name}</td>
                      <td className="p-2 border-r border-slate-200 font-mono text-slate-500">{(row as any).teacher_id}</td>
                      <td className="p-2 border-r border-slate-200 text-center font-bold font-mono text-indigo-600">{(row as any).question_limit ?? 'ทั้งหมด'}</td>
                      <td className="p-2 border-r border-slate-200 font-mono text-slate-500">{(row as any).start_time || '-'}</td>
                      <td className="p-2 border-r border-slate-200 font-mono text-slate-500">{(row as any).end_time || '-'}</td>
                      <td className={`p-2 font-mono font-bold text-center ${((row as any).is_active ?? true) ? 'text-emerald-600' : 'text-red-500'}`}>
                        {String((row as any).is_active ?? true)}
                      </td>
                    </>
                  )}
                  {activeTab === 'Questions' && (
                    <>
                      <td className="p-2 border-r border-slate-200 font-mono font-semibold text-slate-500">{(row as any).question_id}</td>
                      <td className="p-2 border-r border-slate-200 font-mono text-slate-500">{(row as any).subject_id}</td>
                      <td className="p-2 border-r border-slate-200 max-w-xs font-semibold text-slate-800">{(row as any).question_text}</td>
                      <td className="p-2 border-r border-slate-200 text-slate-600">{(row as any).option_A}</td>
                      <td className="p-2 border-r border-slate-200 text-slate-600">{(row as any).option_B}</td>
                      <td className="p-2 border-r border-slate-200 text-slate-600">{(row as any).option_C}</td>
                      <td className="p-2 border-r border-slate-200 text-slate-600">{(row as any).option_D}</td>
                      <td className="p-2 font-mono font-bold text-center text-indigo-600 bg-indigo-50/25">{(row as any).correct_option}</td>
                    </>
                  )}
                  {activeTab === 'Exam_Results' && (
                    <>
                      <td className="p-2 border-r border-slate-200 font-mono font-semibold text-slate-500">{(row as any).result_id}</td>
                      <td className="p-2 border-r border-slate-200 font-mono text-slate-600">{(row as any).student_id}</td>
                      <td className="p-2 border-r border-slate-200 font-mono text-slate-600">{(row as any).subject_id}</td>
                      <td className="p-2 border-r border-slate-200 font-bold text-center text-slate-800 font-mono">{(row as any).score}</td>
                      <td className="p-2 border-r border-slate-200 text-center text-slate-500 font-mono">{(row as any).total_questions}</td>
                      <td className="p-2 text-slate-400 font-medium font-mono">{(row as any).date_time}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Spreadsheets Footer mimicking Google Sheets UI */}
      <div className="bg-slate-100 border-t border-slate-200 p-2 text-[10px] text-slate-500 font-mono flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
          <span>เสร็จสิ้น การเชื่อมต่อสคริปต์หลังบ้านเสถียร</span>
        </div>
        <div className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>จำลองการจัดเก็บชีตจริง</span>
        </div>
      </div>
    </div>
  );
}
