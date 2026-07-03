import React, { useState } from 'react';
import { read, utils } from 'xlsx';
import { VirtualSheetsState, Subject, Question, ExamResult, User } from '../types';
import { 
  PlusCircle, 
  FileSpreadsheet, 
  ClipboardList, 
  CheckCircle2, 
  Award, 
  ListFilter, 
  Users,
  Settings,
  Upload,
  Download,
  Printer,
  Calendar,
  Clock,
  Check,
  AlertCircle,
  ToggleLeft,
  X
} from 'lucide-react';

interface TeacherDashboardProps {
  sheetsState: VirtualSheetsState;
  currentUserId: string;
  onAddSubject: (subjectName: string) => void;
  onAddQuestion: (
    subjectId: string,
    questionText: string,
    optionA: string,
    optionB: string,
    optionC: string,
    optionD: string,
    correctOption: 'A' | 'B' | 'C' | 'D'
  ) => void;
  onUpdateSubjectSettings: (subject: Subject) => void;
  onAddQuestionsBulk: (questions: Omit<Question, 'question_id'>[]) => void;
  onUpdateUser?: (user: User) => void;
}

export default function TeacherDashboard({
  sheetsState,
  currentUserId,
  onAddSubject,
  onAddQuestion,
  onUpdateSubjectSettings,
  onAddQuestionsBulk,
  onUpdateUser
}: TeacherDashboardProps) {
  const [activeTab, setActiveTab] = useState<'manage' | 'results' | 'approvals'>('manage');
  const [newSubjectName, setNewSubjectName] = useState('');
  
  // Question Form State
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctOpt, setCorrectOpt] = useState<'A' | 'B' | 'C' | 'D'>('A');

  // Excel/CSV Import/Export States
  const [importSubjectId, setImportSubjectId] = useState('');

  // Results Filter State
  const [resultsSubjectFilter, setResultsSubjectFilter] = useState('');

  // Subject Settings Modal State
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [editQuestionLimit, setEditQuestionLimit] = useState(5);
  const [editStartTime, setEditStartTime] = useState('');
  const [editEndTime, setEditEndTime] = useState('');
  const [editIsActive, setEditIsActive] = useState(true);

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [approvalFilter, setApprovalFilter] = useState<'all' | 'pending' | 'approved'>('pending');
  const [approvalSearch, setApprovalSearch] = useState('');

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;

    onAddSubject(newSubjectName.trim());
    setNewSubjectName('');
    showNotification('success', 'บันทึกวิชาใหม่ลงฐานข้อมูลชีต Subjects เรียบร้อยแล้ว!');
  };

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubjectId || !questionText.trim() || !optA.trim() || !optB.trim() || !optC.trim() || !optD.trim()) {
      showNotification('error', 'กรุณากรอกข้อมูลคำถามและตัวเลือกให้ครบทุกช่อง');
      return;
    }

    onAddQuestion(
      selectedSubjectId,
      questionText.trim(),
      optA.trim(),
      optB.trim(),
      optC.trim(),
      optD.trim(),
      correctOpt
    );

    // Reset Form
    setQuestionText('');
    setOptA('');
    setOptB('');
    setOptC('');
    setOptD('');
    setCorrectOpt('A');
    showNotification('success', 'บันทึกข้อสอบใหม่ลงคลังข้อสอบชีต Questions เรียบร้อยแล้ว!');
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Helpers to join student names and subject names for Results display
  const getStudentName = (studentId: string) => {
    const user = sheetsState.Users.find(u => u.id === studentId);
    return user ? user.name : `ไม่ทราบชื่อนักเรียน (${studentId})`;
  };

  const getSubjectName = (subjectId: string) => {
    const sub = sheetsState.Subjects.find(s => s.subject_id === subjectId);
    return sub ? sub.subject_name : `ไม่ทราบรายวิชา (${subjectId})`;
  };

  // Subject settings helpers
  const handleOpenSettings = (sub: Subject) => {
    setEditingSubject(sub);
    setEditQuestionLimit(sub.question_limit ?? 5);
    setEditStartTime(sub.start_time ?? '');
    setEditEndTime(sub.end_time ?? '');
    setEditIsActive(sub.is_active ?? true);
  };

  const handleSaveSettings = () => {
    if (!editingSubject) return;

    onUpdateSubjectSettings({
      ...editingSubject,
      question_limit: editQuestionLimit,
      start_time: editStartTime,
      end_time: editEndTime,
      is_active: editIsActive
    });

    setEditingSubject(null);
    showNotification('success', `อัปเดตการตั้งค่ารายวิชา ${editingSubject.subject_name} เรียบร้อยแล้ว!`);
  };

  // Excel/CSV Helper Functions
  const parseCSV = (text: string): string[][] => {
    const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
    if (lines.length === 0) return [];

    // Auto-detect delimiter by counting commas vs semicolons in the first few lines
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
      return result;
    }).filter(row => row.length > 0 && row.some(cell => cell !== ''));
  };

  const handleDownloadTemplate = () => {
    const headers = ['โจทย์คำถาม', 'ตัวเลือก A', 'ตัวเลือก B', 'ตัวเลือก C', 'ตัวเลือก D', 'เฉลยคำตอบ (พิมพ์ตัวอักษร A หรือ B หรือ C หรือ D เท่านั้น)'];
    const sampleRows = [
      ['ข้อใดสะกดคำว่า "อนุญาต" ได้อย่างถูกต้อง?', 'อนุณาต', 'อนุญาต', 'อนุญาติ', 'อนุณาติ', 'B'],
      ['คำลักษณะนามของ "ปากกา" คือข้อใด?', 'ด้าม', 'แท่ง', 'อัน', 'เล่ม', 'A'],
      ['ดาวเคราะห์ดวงใดในระบบสุริยะของเราที่มีขนาดใหญ่ที่สุด?', 'ดาวพุธ', 'โลก', 'ดาวอังคาร', 'ดาวพฤหัสบดี', 'D']
    ];
    
    // Use \uFEFF Byte Order Mark (BOM) so Excel opens UTF-8 Thai correctly
    const csvContent = "\uFEFF" + [headers, ...sampleRows].map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "เทมเพลตนำเข้าข้อสอบ.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('success', 'ดาวน์โหลดเทมเพลตนำเข้าแบบทดสอบสำเร็จแล้ว! ท่านสามารถเปิดแก้ไขใน Excel และนำกลับมาอัปโหลดได้');
  };

  const handleExportQuestions = (subjectId: string) => {
    if (!subjectId) {
      showNotification('error', 'กรุณาเลือกรายวิชาที่ต้องการส่งออกข้อสอบ');
      return;
    }
    const subject = sheetsState.Subjects.find(s => s.subject_id === subjectId);
    const questions = sheetsState.Questions.filter(q => q.subject_id === subjectId);
    if (questions.length === 0) {
      showNotification('error', 'วิชานี้ยังไม่มีข้อสอบในคลังที่จะส่งออก');
      return;
    }
    
    const headers = ['โจทย์คำถาม', 'ตัวเลือก A', 'ตัวเลือก B', 'ตัวเลือก C', 'ตัวเลือก D', 'เฉลยคำตอบ (พิมพ์ตัวอักษร A หรือ B หรือ C หรือ D เท่านั้น)'];
    const rows = questions.map(q => [
      q.question_text,
      q.option_A,
      q.option_B,
      q.option_C,
      q.option_D,
      q.correct_option
    ]);
    
    const csvContent = "\uFEFF" + [headers, ...rows].map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `คลังข้อสอบ_${subjectId}_${subject?.subject_name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('success', `ส่งออกคลังข้อสอบวิชา ${subject?.subject_name} สำเร็จ ทั้งหมด ${questions.length} ข้อ!`);
  };

  const processImportRows = (rows: any[][], targetSubjectId: string) => {
    if (rows.length <= 1) {
      showNotification('error', 'ไม่พบข้อมูลข้อสอบในไฟล์ หรือไฟล์ไม่มีแถวคำถามตามรูปแบบที่กำหนด');
      return;
    }

    const newQuestions: Omit<Question, 'question_id'>[] = [];
    let skippedRows = 0;

    for (let i = 1; i < rows.length; i++) {
      const cols = rows[i];
      if (!cols || cols.length < 6) {
        skippedRows++;
        continue;
      }

      const qText = cols[0]?.toString().trim();
      const optA = cols[1]?.toString().trim();
      const optB = cols[2]?.toString().trim();
      const optC = cols[3]?.toString().trim();
      const optD = cols[4]?.toString().trim();
      let correct = cols[5]?.toString().trim().toUpperCase();

      if (!qText || !optA || !optB || !optC || !optD || !correct) {
        skippedRows++;
        continue;
      }

      // Clean up correct letter
      if (correct.includes('A') || correct === '1') correct = 'A';
      else if (correct.includes('B') || correct === '2') correct = 'B';
      else if (correct.includes('C') || correct === '3') correct = 'C';
      else if (correct.includes('D') || correct === '4') correct = 'D';

      if (correct !== 'A' && correct !== 'B' && correct !== 'C' && correct !== 'D') {
        skippedRows++;
        continue;
      }

      newQuestions.push({
        subject_id: targetSubjectId,
        question_text: qText,
        option_A: optA,
        option_B: optB,
        option_C: optC,
        option_D: optD,
        correct_option: correct as 'A' | 'B' | 'C' | 'D'
      });
    }

    if (newQuestions.length === 0) {
      showNotification('error', 'ไม่สามารถนำเข้าข้อมูลได้ คาดว่าข้อมูลไม่ตรงตามช่องของเทมเพลตมาตรฐาน');
      return;
    }

    onAddQuestionsBulk(newQuestions);
    let msg = `นำเข้าข้อสอบเข้าคลังสำเร็จรวม ${newQuestions.length} ข้อ!`;
    if (skippedRows > 0) {
      msg += ` (ข้ามบรรทัดที่ว่างหรือไม่สมบูรณ์ ${skippedRows} แถว)`;
    }
    showNotification('success', msg);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>, targetSubjectId: string) => {
    if (!targetSubjectId) {
      showNotification('error', 'กรุณาเลือกวิชาปลายทางที่ต้องการนำเข้าข้อสอบ');
      if (e.target) e.target.value = '';
      return;
    }
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const reader = new FileReader();

    if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target?.result as ArrayBuffer);
          const workbook = read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // Convert sheet to json array of arrays
          const rows = utils.sheet_to_json<any[]>(worksheet, { header: 1 });
          processImportRows(rows, targetSubjectId);
        } catch (err) {
          showNotification('error', 'เกิดข้อผิดพลาดในการนำเข้าไฟล์ Excel กรุณาใช้ไฟล์เทมเพลตที่จัดเรียงคอลัมน์ถูกต้อง');
        }
        if (e.target) e.target.value = '';
      };
      reader.readAsArrayBuffer(file);
    } else {
      // CSV File with auto encoding detection (UTF-8 / Windows-874)
      reader.onload = (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          if (!arrayBuffer) return;
          
          let text = new TextDecoder('utf-8').decode(arrayBuffer);
          const hasReplacementChar = text.includes('\uFFFD');
          const hasThaiChars = /[\u0E00-\u0E7F]/.test(text);
          
          if (hasReplacementChar || (!hasThaiChars && /[À-ÿ]/.test(text))) {
            try {
              text = new TextDecoder('windows-874').decode(arrayBuffer);
            } catch (e) {
              // fallback to utf-8 text
            }
          }
          
          const rows = parseCSV(text);
          processImportRows(rows, targetSubjectId);
        } catch (err) {
          showNotification('error', 'เกิดข้อผิดพลาดในการนำเข้าไฟล์ CSV กรุณาลองตรวจสอบความถูกต้องอีกครั้ง');
        }
        if (e.target) e.target.value = '';
      };
      reader.readAsArrayBuffer(file);
    }
  };

  // Beautiful Official Window Print layout to PDF 
  const handlePrintPDF = (filteredResults: ExamResult[]) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('กรุณาอนุญาตให้เปิดบล็อกป็อปอัพของเบราว์เซอร์เพื่อแสดงหน้าเอกสารพิมพ์รายงาน');
      return;
    }

    const currentFilterName = resultsSubjectFilter 
      ? getSubjectName(resultsSubjectFilter) 
      : 'ทุกวิชาที่เปิดสอบ';

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>รายงานคะแนนสอบนักเรียน - ${currentFilterName}</title>
          <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap" rel="stylesheet">
          <style>
            body {
              font-family: 'Sarabun', sans-serif;
              padding: 45px;
              color: #1e293b;
              background-color: #ffffff;
              line-height: 1.5;
            }
            .header-table {
              width: 100%;
              margin-bottom: 25px;
              border-bottom: 3px double #334155;
              padding-bottom: 15px;
            }
            .title {
              font-size: 22px;
              font-weight: bold;
              margin: 0;
              color: #111827;
              text-align: center;
            }
            .subtitle {
              font-size: 13px;
              color: #4b5563;
              margin-top: 5px;
              text-align: center;
              font-weight: 500;
            }
            .meta-info {
              margin-top: 15px;
              font-size: 12px;
              display: flex;
              justify-content: space-between;
              border-top: 1px solid #e2e8f0;
              padding-top: 8px;
              color: #475569;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 15px;
            }
            th {
              background-color: #f8fafc;
              border: 1px solid #94a3b8;
              padding: 10px 8px;
              font-weight: bold;
              font-size: 12px;
              text-align: left;
              color: #0f172a;
            }
            td {
              border: 1px solid #cbd5e1;
              padding: 8px 10px;
              font-size: 12px;
            }
            .center {
              text-align: center;
            }
            .font-mono {
              font-family: monospace;
              font-weight: bold;
            }
            .badge {
              display: inline-block;
              padding: 2px 6px;
              border-radius: 4px;
              font-size: 11px;
              font-weight: bold;
              border: 1px solid;
            }
            .badge-pass {
              background-color: #f0fdf4;
              color: #166534;
              border-color: #bbf7d0;
            }
            .badge-fail {
              background-color: #fef2f2;
              color: #991b1b;
              border-color: #fecaca;
            }
            .grade-excellent {
              color: #15803d;
              font-weight: bold;
            }
            .grade-normal {
              color: #1d4ed8;
              font-weight: bold;
            }
            .grade-warning {
              color: #b45309;
              font-weight: bold;
            }
            .grade-fail {
              color: #b91c1c;
              font-weight: bold;
            }
            .footer {
              margin-top: 60px;
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              font-size: 12px;
              color: #334155;
            }
            .signature-box {
              text-align: center;
              width: 250px;
            }
            .signature-line {
              border-bottom: 1px dashed #475569;
              margin-top: 35px;
              margin-bottom: 6px;
            }
            @media print {
              @page {
                size: A4;
                margin: 15mm 12mm;
              }
              body {
                padding: 0;
                background-color: #fff;
              }
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <table class="header-table">
            <tr>
              <td>
                <div class="title">ทะเบียนแสดงผลสัมฤทธิ์และรายชื่อคะแนนสอบนักเรียน</div>
                <div class="subtitle">ระบบสอบออนไลน์อัจฉริยะจำลองเชื่อมโยง Google Sheets (GAS Database)</div>
                <div class="meta-info">
                  <div><strong>วิชาหลัก:</strong> ${currentFilterName}</div>
                  <div><strong>ผู้ปริ้นรายงาน:</strong> ครูผู้ดูแลระบบ</div>
                  <div><strong>วันเวลาที่จัดพิมพ์:</strong> ${new Date().toLocaleString('th-TH')}</div>
                </div>
              </td>
            </tr>
          </table>

          <table>
            <thead>
              <tr>
                <th width="6%" class="center">ลำดับ</th>
                <th width="12%" class="center">รหัสผลสอบ</th>
                <th width="30%">ชื่อ-นามสกุลนักเรียน</th>
                <th width="24%">วิชาที่เข้าทำข้อสอบ</th>
                <th width="10%" class="center">คะแนนรวม</th>
                <th width="8%" class="center">คิดเป็นร้อยละ</th>
                <th width="10%" class="center">ระดับผลสอบ</th>
              </tr>
            </thead>
            <tbody>
              ${filteredResults.length === 0 ? `
                <tr>
                  <td colSpan="7" class="center" style="padding: 30px; color: #64748b;">ไม่พบประวัติผลการส่งคะแนนในหมวดวิชาที่ท่านเลือก</td>
                </tr>
              ` : filteredResults.map((r, idx) => {
                const percentage = Math.round((r.score / r.total_questions) * 100);
                let gradeText = 'ปรับปรุง (F)';
                let gradeClass = 'grade-fail';
                if (percentage >= 80) {
                  gradeText = 'ดีเยี่ยม (A)';
                  gradeClass = 'grade-excellent';
                } else if (percentage >= 60) {
                  gradeText = 'ผ่านเกณฑ์ (B/C)';
                  gradeClass = 'grade-normal';
                } else if (percentage >= 50) {
                  gradeText = 'พอใช้ (D)';
                  gradeClass = 'grade-warning';
                }

                return `
                  <tr>
                    <td class="center">${idx + 1}</td>
                    <td class="center font-mono" style="color: #64748b;">${r.result_id}</td>
                    <td style="font-weight: 600; color: #0f172a;">${getStudentName(r.student_id)}</td>
                    <td style="color: #475569;">${getSubjectName(r.subject_id)}</td>
                    <td class="center font-mono" style="font-size: 13px;">${r.score} / ${r.total_questions}</td>
                    <td class="center font-mono" style="color: #4f46e5; font-size: 13px;">${percentage}%</td>
                    <td class="center">
                      <span class="${gradeClass}">${gradeText}</span>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>

          <div class="footer">
            <div style="max-w: 400px; font-style: italic; color: #64748b; font-size: 11px;">
              * รายงานคะแนนสอบจำลองนี้อิงข้อมูลตามที่เก็บบันทึกบน Google Sheets จริง <br>
              ระบบรองรับการสุ่มข้อสอบและการควบคุมเวลาเปิด-ปิด อย่างโปร่งใส
            </div>
            <div class="signature-box">
              <p>ผู้รับรองความถูกต้องของเกรด</p>
              <div class="signature-line"></div>
              <p style="font-size: 11px; color: #64748b;">(............................................................)</p>
              <p style="font-size: 11px; color: #64748b; margin-top: 4px;">ครูผู้สอน / หัวหน้ากลุ่มสาระการเรียนรู้</p>
            </div>
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  const getFilteredResults = () => {
    if (!resultsSubjectFilter) return sheetsState.Exam_Results;
    return sheetsState.Exam_Results.filter(r => r.subject_id === resultsSubjectFilter);
  };

  // Helper formatting function for DateTime local string
  const formatThaiDate = (dateTimeStr: string) => {
    if (!dateTimeStr) return 'ไม่กำหนด';
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

  return (
    <div id="teacher-dashboard-panel" className="space-y-6">
      {/* Tab Selectors */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            id="btn-teacher-tab-manage"
            onClick={() => setActiveTab('manage')}
            className={`flex-grow sm:flex-initial px-4 py-2 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'manage'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            คลังข้อสอบและคอร์สเรียน
          </button>
          <button
            id="btn-teacher-tab-results"
            onClick={() => setActiveTab('results')}
            className={`flex-grow sm:flex-initial px-4 py-2 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'results'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            รายงานผลสอบนักเรียน ({sheetsState.Exam_Results.length})
          </button>
          <button
            id="btn-teacher-tab-approvals"
            onClick={() => setActiveTab('approvals')}
            className={`flex-grow sm:flex-initial px-4 py-2 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-1.5 relative ${
              activeTab === 'approvals'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            อนุมัติสมาชิกใหม่
            {sheetsState.Users.filter(u => u.approved === false).length > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full absolute -top-1.5 -right-1.5 shadow-sm animate-pulse">
                {sheetsState.Users.filter(u => u.approved === false).length}
              </span>
            )}
          </button>
        </div>
        <span className="text-xs bg-slate-100 text-slate-500 font-bold px-3 py-1 rounded-full border border-slate-200 shrink-0">
          โหมดครูผู้สอน
        </span>
      </div>

      {/* Notifications */}
      {notification && (
        <div
          id="teacher-notification-banner"
          className={`p-4 rounded-xl border flex items-center gap-2.5 text-sm font-semibold transition-all duration-300 ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          <CheckCircle2 className={`w-5 h-5 shrink-0 ${notification.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`} />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Tab Content: Manage */}
      {activeTab === 'manage' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Panel: Add Subject */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 h-fit">
              <div className="border-b border-slate-100 pb-3 flex items-center gap-2 text-indigo-600">
                <PlusCircle className="w-5 h-5" />
                <h3 className="font-bold text-slate-900 text-lg">เพิ่มวิชาใหม่</h3>
              </div>

              <form id="teacher-add-subject-form" onSubmit={handleCreateSubject} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">ชื่อรายวิชาเรียน</label>
                  <input
                    type="text"
                    id="teacher-new-subject-input"
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                    placeholder="เช่น ฟิสิกส์ ม.4 เทอม 1"
                    required
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-xl font-bold text-xs transition-all shadow-md shadow-indigo-600/10"
                >
                  บันทึกรายวิชาลงฐานข้อมูล
                </button>
              </form>

              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1">
                  <ListFilter className="w-3.5 h-3.5" />
                  รายวิชาและการสอบทั้งหมด ({sheetsState.Subjects.length})
                </h4>
                <div id="teacher-subjects-list-container" className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {sheetsState.Subjects.length === 0 ? (
                    <p className="text-xs text-slate-400 py-3 text-center">ยังไม่มีรายวิชาในระบบ</p>
                  ) : (
                    sheetsState.Subjects.map(sub => {
                      const isManualOpen = sub.is_active ?? true;
                      const hasLimit = sub.question_limit !== undefined;
                      const hasDates = sub.start_time || sub.end_time;
                      
                      return (
                        <div
                          key={sub.subject_id}
                          className="bg-slate-50 border border-slate-200/60 p-3 rounded-xl hover:bg-slate-100/50 transition-all flex flex-col gap-2"
                        >
                          <div className="flex justify-between items-start gap-2 text-xs">
                            <div className="min-w-0">
                              <span className="font-bold text-slate-800 block truncate">{sub.subject_name}</span>
                              <span className="text-[10px] text-slate-400 font-bold font-mono bg-slate-200/40 px-1.5 py-0.5 rounded">
                                {sub.subject_id}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => handleOpenSettings(sub)}
                                className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 bg-white rounded-lg transition-all"
                                title="ตั้งค่าเวลาและข้อสอบ"
                              >
                                <Settings className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Quick info panel */}
                          <div className="text-[10px] text-slate-500 font-semibold space-y-0.5 bg-white/60 p-1.5 rounded-lg border border-slate-100">
                            <div className="flex justify-between">
                              <span>จำกัดข้อสอบ:</span>
                              <span className="text-indigo-600 font-bold">{sub.question_limit ?? 'ทั้งหมด'} ข้อ</span>
                            </div>
                            <div className="flex justify-between">
                              <span>สถานะระบบสอบ:</span>
                              <span className={`font-bold ${isManualOpen ? 'text-emerald-600' : 'text-red-500'}`}>
                                {isManualOpen ? 'เปิดรับทำ' : 'ปิดรับทำ'}
                              </span>
                            </div>
                            {sub.start_time && (
                              <div className="flex justify-between text-[9px]">
                                <span className="text-slate-400">เริ่ม:</span>
                                <span className="text-slate-600">{formatThaiDate(sub.start_time)}</span>
                              </div>
                            )}
                            {sub.end_time && (
                              <div className="flex justify-between text-[9px]">
                                <span className="text-slate-400">สิ้นสุด:</span>
                                <span className="text-slate-600">{formatThaiDate(sub.end_time)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Right Panel: Add Questions */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm lg:col-span-2 space-y-6">
              <div className="border-b border-slate-100 pb-3 flex items-center gap-2 text-indigo-600">
                <PlusCircle className="w-5 h-5" />
                <h3 className="font-bold text-slate-900 text-lg">เพิ่มคำถามใหม่เข้าคลังข้อสอบ</h3>
              </div>

              <form id="teacher-add-question-form" onSubmit={handleCreateQuestion} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">สังกัดวิชาเรียน</label>
                    <select
                      id="teacher-q-subject-select"
                      value={selectedSubjectId}
                      onChange={(e) => setSelectedSubjectId(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-semibold text-slate-700"
                    >
                      <option value="">-- กรุณาเลือกวิชาเรียน --</option>
                      {sheetsState.Subjects.map(sub => (
                        <option key={sub.subject_id} value={sub.subject_id}>
                          {sub.subject_name} ({sub.subject_id})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">โจทย์คำถาม</label>
                    <textarea
                      id="teacher-q-text-input"
                      value={questionText}
                      onChange={(e) => setQuestionText(e.target.value)}
                      rows={3}
                      placeholder="ป้อนคำถามของคุณ เช่น ข้อใดคือดาวเคราะห์ที่อยู่ใกล้โลกมากที่สุด?"
                      required
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">ตัวเลือกคำตอบ A</label>
                    <input
                      type="text"
                      id="teacher-q-optA-input"
                      value={optA}
                      onChange={(e) => setOptA(e.target.value)}
                      placeholder="คำตอบข้อ A"
                      required
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">ตัวเลือกคำตอบ B</label>
                    <input
                      type="text"
                      id="teacher-q-optB-input"
                      value={optB}
                      onChange={(e) => setOptB(e.target.value)}
                      placeholder="คำตอบข้อ B"
                      required
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">ตัวเลือกคำตอบ C</label>
                    <input
                      type="text"
                      id="teacher-q-optC-input"
                      value={optC}
                      onChange={(e) => setOptC(e.target.value)}
                      placeholder="คำตอบข้อ C"
                      required
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">ตัวเลือกคำตอบ D</label>
                    <input
                      type="text"
                      id="teacher-q-optD-input"
                      value={optD}
                      onChange={(e) => setOptD(e.target.value)}
                      placeholder="คำตอบข้อ D"
                      required
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-sm"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">เฉลยตัวเลือกที่ถูกต้อง</label>
                    <div className="flex flex-wrap gap-3">
                      {(['A', 'B', 'C', 'D'] as const).map(ch => (
                        <label
                          key={ch}
                          id={`label-choice-radio-${ch}`}
                          className={`flex-1 min-w-[60px] flex items-center justify-center gap-2 border px-4 py-2.5 rounded-xl cursor-pointer select-none transition-all ${
                            correctOpt === ch
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold shadow-sm'
                              : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-semibold'
                          }`}
                        >
                          <input
                            type="radio"
                            name="correct_option"
                            value={ch}
                            checked={correctOpt === ch}
                            onChange={() => setCorrectOpt(ch)}
                            className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300"
                          />
                          <span>{ch}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-xl font-bold text-sm transition-all shadow-md shadow-indigo-600/10"
                >
                  บันทึกข้อสอบลงคลัง (Questions Sheet)
                </button>
              </form>
            </div>
          </div>

          {/* New Section: Excel/CSV Import/Export System */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-indigo-600">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5" />
                <h3 className="font-bold text-slate-900 text-lg">จัดการข้อสอบด้วยไฟล์ Excel / CSV</h3>
              </div>
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl border border-indigo-100/50 transition-all flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Download className="w-3.5 h-3.5" />
                ดาวน์โหลดเทมเพลตมาตรฐาน Excel
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              ครูผู้สอนสามารถใช้ Excel จัดเตรียมข้อสอบในคอมพิวเตอร์ทีละมากๆ แล้วนำมาอัปโหลดเข้าคลังข้อสอบย่อยได้ภายในคลิกเดียว
              หรือส่งออกคำถามทั้งหมดออกมาเซฟเก็บรักษาไว้ได้เช่นกัน
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Import box */}
              <div className="border-2 border-dashed border-slate-200 hover:border-indigo-400 p-5 rounded-2xl transition-all space-y-4 bg-slate-50/50">
                <div className="flex items-center gap-2 text-indigo-600">
                  <Upload className="w-4 h-4" />
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-700">นำเข้าข้อสอบจากไฟล์ Excel (CSV)</span>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">เลือกวิชาปลายทางที่ต้องการเก็บข้อสอบ</label>
                    <select
                      value={importSubjectId}
                      onChange={(e) => setImportSubjectId(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-semibold text-slate-600"
                    >
                      <option value="">-- กรุณาเลือกวิชาปลายทาง --</option>
                      {sheetsState.Subjects.map(sub => (
                        <option key={sub.subject_id} value={sub.subject_id}>
                          {sub.subject_name} ({sub.subject_id})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">อัปโหลดไฟล์ข้อสอบ Excel / CSV</label>
                    <input
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={(e) => handleImportFile(e, importSubjectId)}
                      disabled={!importSubjectId}
                      className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <p className="text-[10px] text-slate-400 font-bold mt-1.5">
                      *รองรับไฟล์ Excel (.xlsx, .xls) และ CSV (.csv) (กรุณาเลือกรายวิชาปลายทางก่อนกดอัปโหลด)
                    </p>
                  </div>
                </div>
              </div>

              {/* Export box */}
              <div className="border border-slate-200 p-5 rounded-2xl space-y-4 bg-slate-50/20">
                <div className="flex items-center gap-2 text-indigo-600">
                  <Download className="w-4 h-4" />
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-700">ส่งออกคลังข้อสอบเป็น Excel (CSV)</span>
                </div>

                <p className="text-xs text-slate-400">
                  ดาวน์โหลดคำถามทั้งหมดในวิชาที่เลือกออกมาเป็นไฟล์ CSV เพื่อนำไปเปิดใช้งานใน Excel, Google Sheets หรือแบ็กอัปข้อมูล
                </p>

                <div className="flex flex-col gap-3">
                  <select
                    id="teacher-export-subject-select"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-semibold text-slate-600"
                    defaultValue=""
                    onChange={(e) => {
                      if (e.target.value) {
                        handleExportQuestions(e.target.value);
                        e.target.value = ""; // Reset
                      }
                    }}
                  >
                    <option value="">-- กรุณาเลือกวิชาที่จะส่งออก --</option>
                    {sheetsState.Subjects.map(sub => (
                      <option key={sub.subject_id} value={sub.subject_id}>
                        {sub.subject_name} ({sub.subject_id})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Results */}
      {activeTab === 'results' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">ประวัติคะแนนสอบและผู้เข้าทำข้อสอบ</h3>
              <p className="text-xs text-slate-400 font-medium">สถิติคะแนนการทำแบบทดสอบแบบละเอียดของนักเรียนทุกคน</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
              {/* Subject Filter */}
              <select
                value={resultsSubjectFilter}
                onChange={(e) => setResultsSubjectFilter(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-bold text-slate-600"
              >
                <option value="">แสดงทุกวิชาที่เปิดสอบ</option>
                {sheetsState.Subjects.map(sub => (
                  <option key={sub.subject_id} value={sub.subject_id}>
                    {sub.subject_name}
                  </option>
                ))}
              </select>

              {/* PDF Print Button */}
              <button
                onClick={() => handlePrintPDF(getFilteredResults())}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all shadow-md shadow-indigo-600/10"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>พิมพ์รายงาน / บันทึก PDF</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table id="teacher-results-table" className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                  <th className="p-3.5">รหัสการสอบ</th>
                  <th className="p-3.5">ชื่อ-นามสกุล นักเรียน</th>
                  <th className="p-3.5">วิชาสอบ</th>
                  <th className="p-3.5 text-center">คะแนนรวม</th>
                  <th className="p-3.5 text-center">ร้อยละ</th>
                  <th className="p-3.5 text-center">ระดับผลการเรียน</th>
                  <th className="p-3.5">วันเวลาที่ส่งผลสอบ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {getFilteredResults().length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-10 text-center text-slate-400 font-semibold text-sm">
                      ไม่พบประวัติผลสอบในระบบสำหรับหมวดหมู่นี้
                    </td>
                  </tr>
                ) : (
                  [...getFilteredResults()].reverse().map(r => {
                    const percentage = Math.round((r.score / r.total_questions) * 100);
                    let gradeColor = 'bg-red-50 text-red-700 border-red-200';
                    let gradeText = 'ปรับปรุง';
                    if (percentage >= 80) {
                      gradeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                      gradeText = 'ดีเยี่ยม (A)';
                    } else if (percentage >= 60) {
                      gradeColor = 'bg-blue-50 text-blue-700 border-blue-200';
                      gradeText = 'ผ่าน (B/C)';
                    } else if (percentage >= 50) {
                      gradeColor = 'bg-amber-50 text-amber-700 border-amber-200';
                      gradeText = 'พอใช้ (D)';
                    }

                    return (
                      <tr key={r.result_id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-slate-400">{r.result_id}</td>
                        <td className="p-3.5 font-bold text-slate-900">{getStudentName(r.student_id)}</td>
                        <td className="p-3.5 font-semibold text-slate-600">{getSubjectName(r.subject_id)}</td>
                        <td className="p-3.5 text-center font-bold text-slate-800 font-mono text-sm">
                          {r.score} <span className="text-slate-400 font-normal text-xs">/ {r.total_questions}</span>
                        </td>
                        <td className="p-3.5 text-center font-bold text-indigo-600 font-mono text-sm">{percentage}%</td>
                        <td className="p-3.5 text-center">
                          <span className={`inline-block px-2 py-1 text-[10px] font-bold rounded-lg border uppercase tracking-wider ${gradeColor}`}>
                            {gradeText}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-400 font-medium font-mono">{r.date_time}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: User Approvals */}
      {activeTab === 'approvals' && (
        <div id="teacher-approvals-panel" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in space-y-4">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                ระบบอนุมัติและจัดการสิทธิ์ผู้สอบ
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                อนุมัติคำขอลงทะเบียนของนักเรียน และควบคุมสิทธิ์การเข้าใช้งานระบบทดสอบ
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                รออนุมัติ: {sheetsState.Users.filter(u => u.approved === false).length} คน
              </span>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-100 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                ใช้งานได้ปกติ: {sheetsState.Users.filter(u => u.approved !== false).length} คน
              </span>
            </div>
          </div>

          <div className="px-6 pb-6 space-y-4">
            {/* Filters bar */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
              {/* Segmented control filter */}
              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setApprovalFilter('pending')}
                  className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    approvalFilter === 'pending'
                      ? 'bg-white text-slate-800 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  รออนุมัติ ({sheetsState.Users.filter(u => u.approved === false).length})
                </button>
                <button
                  type="button"
                  onClick={() => setApprovalFilter('approved')}
                  className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    approvalFilter === 'approved'
                      ? 'bg-white text-slate-800 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  อนุมัติแล้ว ({sheetsState.Users.filter(u => u.approved !== false).length})
                </button>
                <button
                  type="button"
                  onClick={() => setApprovalFilter('all')}
                  className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    approvalFilter === 'all'
                      ? 'bg-white text-slate-800 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  ทั้งหมด ({sheetsState.Users.length})
                </button>
              </div>

              {/* Search box */}
              <div className="relative w-full sm:w-64 shrink-0">
                <input
                  type="text"
                  placeholder="ค้นหาชื่อ หรือชื่อผู้ใช้..."
                  value={approvalSearch}
                  onChange={(e) => setApprovalSearch(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                />
                {approvalSearch && (
                  <button
                    onClick={() => setApprovalSearch('')}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* List/Table view */}
            <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
              {(() => {
                const filteredUsers = sheetsState.Users.filter(u => {
                  // 1. Filter by state
                  if (approvalFilter === 'pending') {
                    if (u.approved !== false) return false;
                  } else if (approvalFilter === 'approved') {
                    if (u.approved === false) return false;
                  }
                  
                  // 2. Filter by search query
                  if (approvalSearch.trim()) {
                    const q = approvalSearch.toLowerCase().trim();
                    return (
                      u.name.toLowerCase().includes(q) ||
                      u.username.toLowerCase().includes(q) ||
                      u.id.toLowerCase().includes(q)
                    );
                  }
                  return true;
                });

                if (filteredUsers.length === 0) {
                  return (
                    <div className="p-12 text-center text-slate-400 bg-slate-50/20">
                      <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                      <p className="font-bold text-xs">ไม่พบข้อมูลผู้ใช้ที่ตรงกับเงื่อนไข</p>
                      <p className="text-[10px] text-slate-400 mt-1">ลองเปลี่ยนตัวกรองหรือคำค้นหาของคุณ</p>
                    </div>
                  );
                }

                return (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                          <th className="p-3 border-r border-slate-200 w-16 text-center font-mono">ID</th>
                          <th className="p-3 border-r border-slate-200">ชื่อ-นามสกุลจริง</th>
                          <th className="p-3 border-r border-slate-200">ชื่อผู้ใช้ (Username)</th>
                          <th className="p-3 border-r border-slate-200">รหัสผ่าน</th>
                          <th className="p-3 border-r border-slate-200">ประเภทบัญชี</th>
                          <th className="p-3 border-r border-slate-200 text-center">สถานะปัจจุบัน</th>
                          <th className="p-3 text-center">ดำเนินการอนุมัติสิทธิ์</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white font-medium text-slate-700">
                        {filteredUsers.map(u => {
                          const isPending = u.approved === false;
                          return (
                            <tr key={u.id} className={`hover:bg-slate-50/50 transition-colors ${isPending ? 'bg-amber-50/10' : ''}`}>
                              <td className="p-3 border-r border-slate-100 font-mono text-center font-bold text-slate-400">{u.id}</td>
                              <td className="p-3 border-r border-slate-100 font-extrabold text-slate-900">{u.name}</td>
                              <td className="p-3 border-r border-slate-100 font-bold text-indigo-600 font-mono">{u.username}</td>
                              <td className="p-3 border-r border-slate-100 font-mono text-slate-400">{u.password || '5210273008Aa'}</td>
                              <td className="p-3 border-r border-slate-100">
                                <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                  u.role === 'teacher'
                                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                                    : u.role === 'admin'
                                    ? 'bg-red-50 text-red-700 border border-red-100'
                                    : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                }`}>
                                  {u.role === 'teacher' ? 'คุณครู' : u.role === 'admin' ? 'แอดมิน' : 'นักเรียน (student)'}
                                </span>
                              </td>
                              <td className="p-3 border-r border-slate-100 text-center">
                                {isPending ? (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                    รอการอนุมัติ
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                    อนุมัติแล้ว
                                  </span>
                                )}
                              </td>
                              <td className="p-3 text-center font-bold">
                                {isPending ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (onUpdateUser) {
                                        onUpdateUser({ ...u, approved: true });
                                        showNotification('success', `🎉 อนุมัติสิทธิ์คุณ ${u.name} สำเร็จ สามารถใช้บัญชีนี้เข้าสอบได้ทันที!`);
                                      }
                                    }}
                                    className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-sm cursor-pointer border border-emerald-700"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>อนุมัติเข้าใช้งาน</span>
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (onUpdateUser) {
                                        onUpdateUser({ ...u, approved: false });
                                        showNotification('success', `🔒 ระงับสิทธิ์การเข้าใช้งานคุณ ${u.name} เรียบร้อยแล้ว`);
                                      }
                                    }}
                                    className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-600 font-bold text-xs transition-all cursor-pointer border border-slate-200 hover:border-red-200"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                    <span>ระงับสิทธิ์ชั่วคราว</span>
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Subject Settings Modal */}
      {editingSubject && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-slate-100 space-y-5 animate-scale p-6 overflow-hidden">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-indigo-600">
                <Settings className="w-5 h-5" />
                <h3 className="font-extrabold text-slate-900 text-lg">ตั้งค่าระบบการสอบ</h3>
              </div>
              <button 
                onClick={() => setEditingSubject(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">รายวิชาเรียน</label>
                <p className="text-sm font-bold text-slate-800 bg-slate-50 border border-slate-200/50 p-2.5 rounded-xl">
                  {editingSubject.subject_name} ({editingSubject.subject_id})
                </p>
              </div>

              {/* Question Limit */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  กำหนดจำนวนข้อในการสุ่มทำข้อสอบ (Question Limit)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    max={sheetsState.Questions.filter(q => q.subject_id === editingSubject.subject_id).length || 50}
                    value={editQuestionLimit}
                    onChange={(e) => setEditQuestionLimit(Math.max(1, parseInt(e.target.value, 10) || 5))}
                    className="w-24 px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm bg-white"
                  />
                  <span className="text-xs text-slate-400 font-semibold">
                    ข้อ (ข้อสอบที่มีอยู่ในคลังวิชานี้ขณะนี้: {sheetsState.Questions.filter(q => q.subject_id === editingSubject.subject_id).length} ข้อ)
                  </span>
                </div>
              </div>

              {/* Status Toggle (Manual Open/Close) */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">สถานะการทำแบบทดสอบ (Manual Toggle)</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setEditIsActive(!editIsActive)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold text-xs transition-all ${
                      editIsActive 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                        : 'bg-red-50 text-red-800 border-red-200'
                    }`}
                  >
                    {editIsActive ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        เปิดให้ทำข้อสอบปกติ
                      </>
                    ) : (
                      <>
                        <X className="w-3.5 h-3.5" />
                        ปิดรับการส่งข้อสอบชั่วคราว
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Start & End Times */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">ตารางเวลาเปิด-ปิดสอบ</span>
                  {(editStartTime || editEndTime) && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditStartTime('');
                        setEditEndTime('');
                      }}
                      className="text-[10px] text-red-600 hover:text-red-800 font-bold hover:underline"
                    >
                      ล้างเวลาทั้งหมด
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-indigo-500" />
                      กำหนดเวลาเปิดระบบสอบ
                    </label>
                    <input
                      type="datetime-local"
                      value={editStartTime}
                      onChange={(e) => setEditStartTime(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-semibold bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-red-500" />
                      กำหนดเวลาปิดระบบสอบ
                    </label>
                    <input
                      type="datetime-local"
                      value={editEndTime}
                      onChange={(e) => setEditEndTime(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-semibold bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-xl text-[10px] leading-relaxed font-semibold">
                * หากต้องการเปิดสอบทันทีแบบไม่มีกำหนดเวลาเปิดปิด ท่านไม่จำเป็นต้องกำหนดเวลาเปิดและเวลาปิด (ปล่อยว่างไว้)
              </div>
            </div>

            <div className="flex gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingSubject(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-2.5 rounded-xl text-xs transition-all"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleSaveSettings}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md"
              >
                บันทึกการตั้งค่า
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
