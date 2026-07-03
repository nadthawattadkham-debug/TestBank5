import { User, Subject, Question, ExamResult } from './types';

export const INITIAL_USERS: User[] = [
  { id: "U001", username: "teacher1", password: "5210273008Aa", name: "ครูสมชาย ใจดี", role: "teacher", approved: true },
  { id: "U002", username: "student1", password: "5210273008Aa", name: "สมหมาย รักเรียน", role: "student", approved: true },
  { id: "U003", username: "student2", password: "5210273008Aa", name: "วิภา ตั้งใจเรียน", role: "student", approved: true },
  { id: "U004", username: "admin1", password: "5210273008Aa", name: "ผู้ดูแลระบบ สุดยอด", role: "admin", approved: true }
];

export const INITIAL_SUBJECTS: Subject[] = [
  { subject_id: "S001", subject_name: "ภาษาไทยและวรรณคดี", teacher_id: "U001" },
  { subject_id: "S002", subject_name: "คณิตศาสตร์ทั่วไป ม.ต้น", teacher_id: "U001" },
  { subject_id: "S003", subject_name: "วิทยาศาสตร์และเทคโนโลยีอวกาศ", teacher_id: "U001" }
];

export const INITIAL_QUESTIONS: Question[] = [
  // Thai
  {
    question_id: "Q001",
    subject_id: "S001",
    question_text: "ข้อใดสะกดสะกดคำว่า 'อนุญาต' ได้อย่างถูกต้อง?",
    option_A: "อนุณาต",
    option_B: "อนุญาต",
    option_C: "อนุญาติ",
    option_D: "อนุณาติ",
    correct_option: "B"
  },
  {
    question_id: "Q002",
    subject_id: "S001",
    question_text: "คำนามในข้อใดทำหน้าที่เป็นประธานในประโยค 'สุนัขสีดำวิ่งไล่จับแมวอย่างรวดเร็ว'?",
    option_A: "สุนัข",
    option_B: "แมว",
    option_C: "วิ่งไล่",
    option_D: "รวดเร็ว",
    correct_option: "A"
  },
  {
    question_id: "Q003",
    subject_id: "S001",
    question_text: "คำลักษณะนามของ 'ปากกา' และ 'ดินสอ' คือข้อใดตามลำดับ?",
    option_A: "ด้าม, แท่ง",
    option_B: "แท่ง, ด้าม",
    option_C: "อัน, ชิ้น",
    option_D: "เล่ม, ด้าม",
    correct_option: "A"
  },
  {
    question_id: "Q004",
    subject_id: "S001",
    question_text: "พยัญชนะไทยมีทั้งหมดกี่รูป และมีรูปสระกี่รูป?",
    option_A: "44 รูป, 21 รูป",
    option_B: "42 รูป, 21 รูป",
    option_C: "44 รูป, 32 รูป",
    option_D: "42 รูป, 32 รูป",
    correct_option: "A"
  },
  {
    question_id: "Q005",
    subject_id: "S001",
    question_text: "ข้อใดเป็นคำควบกล้ำแท้ทุกคำ?",
    option_A: "กวาดบ้าน, พริกไทย, ขว้างขวาน",
    option_B: "จริงใจ, เศร้าสร้อย, ทรุดโทรม",
    option_C: "สร้างบ้าน, ปรับปรุง, สรงน้ำ",
    option_D: "เพลงเพราะ, ทรายทอง, ตลาด",
    correct_option: "A"
  },
  {
    question_id: "Q006",
    subject_id: "S001",
    question_text: "วรรณคดีเรื่อง 'ขุนช้างขุนแผน' แต่งด้วยคำประพันธ์ชนิดใดเป็นหลัก?",
    option_A: "กลอนสุภาพ (กลอนเสภา)",
    option_B: "โคลงสี่สุภาพ",
    option_C: "กาพย์ยานี 11",
    option_D: "ร่ายสุภาพ",
    correct_option: "A"
  },

  // Math
  {
    question_id: "Q007",
    subject_id: "S002",
    question_text: "ถ้า 3x + 12 = 27 แล้ว ค่าของ x^2 มีค่าเท่าใด?",
    option_A: "25",
    option_B: "9",
    option_C: "16",
    option_D: "36",
    correct_option: "A"
  },
  {
    question_id: "Q008",
    subject_id: "S002",
    question_text: "สูตรในการหาพื้นที่ของรูปสามเหลี่ยมใดๆ คือข้อใด?",
    option_A: "1/2 × ฐาน × สูง",
    option_B: "กว้าง × ยาว",
    option_C: "2 × (กว้าง + ยาว)",
    option_D: "พาย × รัศมีกำลังสอง",
    correct_option: "A"
  },
  {
    question_id: "Q009",
    subject_id: "S002",
    question_text: "ผลบวกของจำนวนเฉพาะตั้งแต่ 1 ถึง 15 มีค่าเท่ากับเท่าใด?",
    option_A: "41",
    option_B: "28",
    option_C: "39",
    option_D: "45",
    correct_option: "A" // 2+3+5+7+11+13 = 41
  },
  {
    question_id: "Q010",
    subject_id: "S002",
    question_text: "กล่องใบหนึ่งมีลูกบอลสีแดง 3 ลูก สีน้ำเงิน 5 ลูก สีเขียว 2 ลูก สุ่มหยิบลูกบอล 1 ลูก โอกาสที่จะหยิบได้สีแดงเป็นเท่าใด?",
    option_A: "3 ใน 10 (30%)",
    option_B: "1 ใน 3 (33%)",
    option_C: "1 ใน 2 (50%)",
    option_D: "3 ใน 7 (42%)",
    correct_option: "A"
  },
  {
    question_id: "Q011",
    subject_id: "S002",
    question_text: "รูปสี่เหลี่ยมผืนผ้ามีความกว้าง 8 ซม. มีเส้นรอบรูปยาว 36 ซม. พื้นที่ของรูปสี่เหลี่ยมนี้จะเท่ากับกี่ตารางเซนติเมตร?",
    option_A: "80 ตร.ซม.",
    option_B: "64 ตร.ซม.",
    option_C: "72 ตร.ซม.",
    option_D: "96 ตร.ซม.",
    correct_option: "A" // Perimeter 36 -> width+height = 18 -> height = 10 -> Area = 8 * 10 = 80
  },
  {
    question_id: "Q012",
    subject_id: "S002",
    question_text: "มุมภายในของรูปห้าเหลี่ยมด้านเท่า มีผลรวมกี่องศา?",
    option_A: "540 องศา",
    option_B: "360 องศา",
    option_C: "720 องศา",
    option_D: "180 องศา",
    correct_option: "A" // (5-2)*180 = 540
  },

  // Science
  {
    question_id: "Q013",
    subject_id: "S003",
    question_text: "ดาวเคราะห์ดวงใดในระบบสุริยะของเราที่มีขนาดใหญ่ที่สุด และจัดเป็นประเภทใด?",
    option_A: "ดาวพฤหัสบดี (ดาวเคราะห์แก๊ส)",
    option_B: "ดาวเสาร์ (ดาวเคราะห์หิน)",
    option_C: "ดาวเนปจูน (ดาวเคราะห์แก๊ส)",
    option_D: "โลก (ดาวเคราะห์หิน)",
    correct_option: "A"
  },
  {
    question_id: "Q014",
    subject_id: "S003",
    question_text: "ก๊าซชนิดใดมีสัดส่วนปริมาณมากที่สุดในชั้นบรรยากาศของโลก?",
    option_A: "ก๊าซไนโตรเจน (ประมาณ 78%)",
    option_B: "ก๊าซออกซิเจน (ประมาณ 21%)",
    option_C: "ก๊าซคาร์บอนไดออกไซด์",
    option_D: "ก๊าซอาร์กอน",
    correct_option: "A"
  },
  {
    question_id: "Q015",
    subject_id: "S003",
    question_text: "ปรากฏการณ์สุริยุปราคาเกิดขึ้นเมื่อดวงดาวโคจรมาอยู่ในตำแหน่งใด?",
    option_A: "ดวงอาทิตย์ - ดวงจันทร์ - โลก โคจรมาอยู่ในแนวเส้นตรงเดียวกัน",
    option_B: "ดวงอาทิตย์ - โลก - ดวงจันทร์ โคจรมาอยู่ในแนวเส้นตรงเดียวกัน",
    option_C: "ดวงจันทร์ - ดวงอาทิตย์ - โลก โคจรมาอยู่ในแนวเส้นตรงเดียวกัน",
    option_D: "โลก - ดวงจันทร์ - ดาวพฤหัส โคจรมาอยู่ในแนวเส้นตรงเดียวกัน",
    correct_option: "A"
  },
  {
    question_id: "Q016",
    subject_id: "S003",
    question_text: "อวัยวะใดทำหน้าที่เป็นศูนย์กลางควบคุมระบบประสาทและพฤติกรรมทั้งหมดของมนุษย์?",
    option_A: "สมอง",
    option_B: "ไขสันหลัง",
    option_C: "หัวใจ",
    option_D: "เส้นประสาทส่วนปลาย",
    correct_option: "A"
  },
  {
    question_id: "Q017",
    subject_id: "S003",
    question_text: "แสงจากดวงอาทิตย์ใช้เวลาเดินทางมาถึงโลกของเราประมาณเท่าใด?",
    option_A: "ประมาณ 8 นาที 20 วินาที",
    option_B: "ประมาณ 1 นาที",
    option_C: "ประมาณ 1 ชั่วโมง",
    option_D: "เดินทางมาถึงทันที",
    correct_option: "A"
  }
];

export const INITIAL_RESULTS: ExamResult[] = [
  {
    result_id: "R001",
    student_id: "U002",
    subject_id: "S001",
    score: 4,
    total_questions: 5,
    date_time: "2026-07-01 10:25:31"
  },
  {
    result_id: "R002",
    student_id: "U003",
    subject_id: "S002",
    score: 5,
    total_questions: 5,
    date_time: "2026-07-02 14:12:05"
  }
];

export const CODE_GS_TEMPLATE = `/**
 * ====================================================================
 * Google Apps Script (Code.gs) - ระบบสอบออนไลน์และคลังข้อสอบ
 * ====================================================================
 * ใช้สำหรับจัดการฐานข้อมูลใน Google Sheets และให้บริการ Web App อินเตอร์เฟซ
 * 
 * วิธีการใช้งาน:
 * 1. สร้าง Google Sheets ใหม่
 * 2. ไปที่ Extensions > Apps Script
 * 3. วางโค้ดทั้งหมดนี้ลงในไฟล์ Code.gs
 * 4. สร้างไฟล์ HTML ชื่อ Index.html แล้ววางโค้ดส่วนหน้าบ้านลงไป
 * 5. กดปุ่ม Deploy > New deployment เลือกเป็น Web app
 * --------------------------------------------------------------------
 */

// แสดงหน้าเว็บหลัก
function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('ระบบสอบออนไลน์และคลังข้อสอบ')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * ฟังก์ชันช่วยเหลือสำหรับการเข้าถึงหรือสร้างชีตแบบอัตโนมัติ (Dynamic Database Creation)
 * หากเปิดแอปพลิเคชันครั้งแรก ระบบจะสร้างชีตและส่วนหัว (Headers) ให้ทันทีโดยไม่ต้องสร้างเอง
 */
function getDbSheet(sheetName, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    if (headers && headers.length > 0) {
      sheet.appendRow(headers);
    }
  }
  return sheet;
}

/**
 * 1. ระบบเข้าสู่ระบบ (Login API)
 * ตรวจสอบสิทธิ์จากชีต "Users"
 */
function loginUser(username, password) {
  try {
    const sheet = getDbSheet('Users', ['id', 'username', 'password', 'name', 'role']);
    const data = sheet.getDataRange().getValues();
    
    // ค้นหาข้อมูลผู้ใช้ที่ตรงกับ username และ password
    for (let i = 1; i < data.length; i++) {
      if (data[i][1].toString().trim() === username.toString().trim() && 
          data[i][2].toString().trim() === password.toString().trim()) {
        return {
          success: true,
          user: {
            id: data[i][0],
            username: data[i][1],
            name: data[i][3],
            role: data[i][4]
          }
        };
      }
    }
    
    // กรณีที่ชีตว่างเปล่าและเป็นการเริ่มใช้งานครั้งแรก ให้สร้างบัญชีตัวอย่าง
    if (data.length <= 1 && username === 'admin' && password === '1234') {
      const defaultUser = ['U001', 'admin', '1234', 'ครูผู้ดูแลระบบ', 'teacher'];
      sheet.appendRow(defaultUser);
      return {
        success: true,
        user: { id: 'U001', username: 'admin', name: 'ครูผู้ดูแลระบบ', role: 'teacher' }
      };
    }
    
    return { success: false, message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' };
  } catch (error) {
    return { success: false, message: 'เกิดข้อผิดพลาดหลังบ้าน: ' + error.toString() };
  }
}

/**
 * สมัครสมาชิกใหม่ (Register API)
 */
function registerUser(username, password, name, role) {
  try {
    const sheet = getDbSheet('Users', ['id', 'username', 'password', 'name', 'role']);
    const data = sheet.getDataRange().getValues();
    
    // ตรวจสอบ username ซ้ำ
    for (let i = 1; i < data.length; i++) {
      if (data[i][1].toString().toLowerCase() === username.toString().toLowerCase()) {
        return { success: false, message: 'ชื่อผู้ใช้นี้มีอยู่ในระบบแล้ว' };
      }
    }
    
    // สร้าง ID ใหม่ (เช่น U001, U002)
    const newId = 'U' + String(data.length).padStart(3, '0');
    sheet.appendRow([newId, username, password, name, role]);
    
    return { success: true, message: 'สมัครสมาชิกสำเร็จ' };
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}

/**
 * 2. จัดการรายวิชา (Subjects API)
 */
function getSubjects() {
  try {
    const sheet = getDbSheet('Subjects', ['subject_id', 'subject_name', 'teacher_id']);
    const data = sheet.getDataRange().getValues();
    const subjects = [];
    
    for (let i = 1; i < data.length; i++) {
      subjects.push({
        subject_id: data[i][0].toString(),
        subject_name: data[i][1].toString(),
        teacher_id: data[i][2].toString()
      });
    }
    return { success: true, data: subjects };
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}

function addSubject(subjectName, teacherId) {
  try {
    const sheet = getDbSheet('Subjects', ['subject_id', 'subject_name', 'teacher_id']);
    const data = sheet.getDataRange().getValues();
    
    const newId = 'S' + String(data.length).padStart(3, '0');
    sheet.appendRow([newId, subjectName, teacherId]);
    
    return { success: true, message: 'เพิ่มวิชาสำเร็จ', id: newId };
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}

/**
 * 3. จัดการคลังข้อสอบ (Questions API)
 */
function getQuestions() {
  try {
    const sheet = getDbSheet('Questions', ['question_id', 'subject_id', 'question_text', 'option_A', 'option_B', 'option_C', 'option_D', 'correct_option']);
    const data = sheet.getDataRange().getValues();
    const questions = [];
    
    for (let i = 1; i < data.length; i++) {
      questions.push({
        question_id: data[i][0].toString(),
        subject_id: data[i][1].toString(),
        question_text: data[i][2].toString(),
        option_A: data[i][3].toString(),
        option_B: data[i][4].toString(),
        option_C: data[i][5].toString(),
        option_D: data[i][6].toString(),
        correct_option: data[i][7].toString()
      });
    }
    return { success: true, data: questions };
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}

function addQuestion(subjectId, questionText, optionA, optionB, optionC, optionD, correctOption) {
  try {
    const sheet = getDbSheet('Questions', ['question_id', 'subject_id', 'question_text', 'option_A', 'option_B', 'option_C', 'option_D', 'correct_option']);
    const data = sheet.getDataRange().getValues();
    
    const newId = 'Q' + String(data.length).padStart(3, '0');
    sheet.appendRow([newId, subjectId, questionText, optionA, optionB, optionC, optionD, correctOption]);
    
    return { success: true, message: 'เพิ่มข้อสอบลงคลังสำเร็จ', id: newId };
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}

/**
 * 4. การดึงข้อสอบสำหรับนักเรียน โดย "สุ่มคำถาม" (Randomized Exam Selection API)
 * คัดเลือกข้อสอบเฉพาะวิชานั้นๆ และทำการสุ่มลำดับข้อและคัดมาตามจำนวนที่กำหนด
 */
function getQuestionsForExam(subjectId, limitAmount) {
  try {
    const sheet = getDbSheet('Questions', ['question_id', 'subject_id', 'question_text', 'option_A', 'option_B', 'option_C', 'option_D', 'correct_option']);
    const data = sheet.getDataRange().getValues();
    let filtered = [];
    
    // กรองเฉพาะวิชาที่เลือก
    for (let i = 1; i < data.length; i++) {
      if (data[i][1].toString() === subjectId.toString()) {
        filtered.push({
          question_id: data[i][0].toString(),
          subject_id: data[i][1].toString(),
          question_text: data[i][2].toString(),
          option_A: data[i][3].toString(),
          option_B: data[i][4].toString(),
          option_C: data[i][5].toString(),
          option_D: data[i][6].toString(),
          correct_option: data[i][7].toString() // จะถูกซ่อนหรือส่งไปด้วยเพื่อตรวจทันที
        });
      }
    }
    
    if (filtered.length === 0) {
      return { success: false, message: 'ไม่พบข้อสอบในวิชานี้ กรุณาแจ้งผู้สอนเพื่อเพิ่มข้อสอบ' };
    }
    
    // อัลกอริทึมสุ่มข้อสอบ (Fisher-Yates Shuffle)
    for (let i = filtered.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = filtered[i];
      filtered[i] = filtered[j];
      filtered[j] = temp;
    }
    
    // จำกัดจำนวนข้อสอบตามที่ร้องขอ
    const limit = parseInt(limitAmount, 10) || 10;
    const randomizedExam = filtered.slice(0, Math.min(limit, filtered.length));
    
    return { success: true, data: randomizedExam, total_available: filtered.length };
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}

/**
 * 5. ส่งคำตอบและบันทึกคะแนน (Exam Submit & Result Logger API)
 */
function submitExam(studentId, subjectId, score, totalQuestions) {
  try {
    const sheet = getDbSheet('Exam_Results', ['result_id', 'student_id', 'subject_id', 'score', 'total_questions', 'date_time']);
    const data = sheet.getDataRange().getValues();
    
    const newId = 'R' + String(data.length).padStart(3, '0');
    
    // ตั้งค่าวันเวลาปัจจุบันในไทย (UTC+7)
    const formattedDate = Utilities.formatDate(new Date(), "Asia/Bangkok", "yyyy-MM-dd HH:mm:ss");
    
    sheet.appendRow([newId, studentId, subjectId, score, totalQuestions, formattedDate]);
    
    return { success: true, result_id: newId, date_time: formattedDate };
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}

/**
 * 6. ดึงผลสอบทั้งหมด (สำหรับรายงานผลของครูและนักเรียน)
 */
function getExamResults() {
  try {
    const resultsSheet = getDbSheet('Exam_Results', ['result_id', 'student_id', 'subject_id', 'score', 'total_questions', 'date_time']);
    const usersSheet = getDbSheet('Users', ['id', 'username', 'password', 'name', 'role']);
    const subjectsSheet = getDbSheet('Subjects', ['subject_id', 'subject_name', 'teacher_id']);
    
    const resultsData = resultsSheet.getDataRange().getValues();
    const usersData = usersSheet.getDataRange().getValues();
    const subjectsData = subjectsSheet.getDataRange().getValues();
    
    // สร้าง Map เพื่อลดความซับซ้อนในการ Join ข้อมูล
    const studentMap = {};
    for (let i = 1; i < usersData.length; i++) {
      studentMap[usersData[i][0]] = usersData[i][3]; // Map id -> name
    }
    
    const subjectMap = {};
    for (let i = 1; i < subjectsData.length; i++) {
      subjectMap[subjectsData[i][0]] = subjectsData[i][1]; // Map subject_id -> subject_name
    }
    
    const finalResults = [];
    for (let i = 1; i < resultsData.length; i++) {
      const studentId = resultsData[i][1].toString();
      const subjectId = resultsData[i][2].toString();
      
      finalResults.push({
        result_id: resultsData[i][0].toString(),
        student_id: studentId,
        student_name: studentMap[studentId] || 'ไม่พบรายชื่อ (' + studentId + ')',
        subject_id: subjectId,
        subject_name: subjectMap[subjectId] || 'ไม่พบวิชา (' + subjectId + ')',
        score: parseInt(resultsData[i][3], 10),
        total_questions: parseInt(resultsData[i][4], 10),
        date_time: resultsData[i][5].toString()
      });
    }
    
    return { success: true, data: finalResults.reverse() }; // ดึงผลลัพธ์ล่าสุดขึ้นก่อน
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}
`;

export const INDEX_HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ระบบสอบออนไลน์และคลังข้อสอบ (Google Sheets Database)</title>
  <!-- โหลด Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Sarabun', sans-serif;
      background-color: #f3f4f6;
    }
  </style>
</head>
<body class="min-h-screen text-slate-800 flex flex-col">

  <!-- โหลดดิ้งหลักเมื่อส่งข้อมูลไปยังสคริปต์หลังบ้าน -->
  <div id="global-spinner" class="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 hidden transition-all duration-300">
    <div class="bg-white px-8 py-6 rounded-2xl shadow-xl flex flex-col items-center gap-4 max-w-xs text-center border border-slate-100">
      <div class="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      <p class="font-medium text-slate-700 text-sm" id="spinner-text">กำลังประมวลผลข้อมูล...</p>
    </div>
  </div>

  <!-- แถบด้านบน (Navbar) -->
  <header class="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm hidden" id="main-nav">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="bg-indigo-600 text-white p-2 rounded-xl">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
        </div>
        <div>
          <h1 class="text-lg font-bold text-slate-900 leading-tight">ระบบสอบออนไลน์</h1>
          <p class="text-xs text-slate-500 font-medium">คลังข้อสอบ & ผลประเมินผล</p>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <div class="text-right">
          <p class="text-sm font-semibold text-slate-800" id="nav-user-name">-</p>
          <span class="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider" id="nav-user-role">-</span>
        </div>
        <button onclick="logout()" class="text-slate-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-all" title="ออกจากระบบ">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
        </button>
      </div>
    </div>
  </header>

  <!-- เนื้อหาหลัก -->
  <main class="flex-grow max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8" id="main-content">
    
    <!-- 1. หน้าล็อกอินและสมัครสมาชิก -->
    <section id="auth-section" class="max-w-md mx-auto my-12 transition-all">
      <div class="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div class="bg-indigo-600 px-8 py-10 text-white text-center">
          <svg class="w-16 h-16 mx-auto mb-4 text-indigo-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
          <h2 class="text-2xl font-bold">เข้าสู่ระบบสอบออนไลน์</h2>
          <p class="text-indigo-200 text-sm mt-1 font-light">กรุณาเข้าสู่ระบบด้วยสิทธิ์ผู้สอนหรือผู้เรียน</p>
        </div>
        
        <!-- ฟอร์มเข้าสู่ระบบ -->
        <div class="p-8" id="login-form-wrapper">
          <form id="login-form" onsubmit="handleLogin(event)" class="space-y-5">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">ชื่อผู้ใช้ (Username)</label>
              <input type="text" id="login-username" required class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" placeholder="ป้อนชื่อผู้ใช้ของคุณ">
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">รหัสผ่าน (Password)</label>
              <input type="password" id="login-password" required class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" placeholder="ป้อนรหัสผ่าน">
            </div>
            <div id="login-error" class="hidden text-sm bg-red-50 text-red-600 border border-red-200 px-4 py-3 rounded-xl font-medium"></div>
            <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 px-4 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 flex justify-center items-center gap-2">
              <span>เข้าสู่ระบบ</span>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </button>
          </form>
          <div class="mt-6 text-center">
            <button onclick="toggleAuthMode(true)" class="text-sm font-semibold text-indigo-600 hover:text-indigo-800">ยังไม่มีบัญชีผู้ใช้? สมัครสมาชิกที่นี่</button>
          </div>
        </div>

        <!-- ฟอร์มสมัครสมาชิก -->
        <div class="p-8 hidden" id="register-form-wrapper">
          <form id="register-form" onsubmit="handleRegister(event)" class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">ชื่อ-นามสกุลจริง</label>
              <input type="text" id="reg-name" required class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="เช่น นายสมบูรณ์ ดีใจ">
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">ชื่อผู้ใช้ (ภาษาอังกฤษ)</label>
              <input type="text" id="reg-username" required class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="ภาษาอังกฤษหรือตัวเลข">
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">รหัสผ่าน</label>
              <input type="password" id="reg-password" required class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="ความยาว 4 ตัวอักษรขึ้นไป">
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">บทบาทในระบบ</label>
              <select id="reg-role" required class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                <option value="student">นักเรียน (Student)</option>
                <option value="teacher">ครูผู้สอน (Teacher)</option>
              </select>
            </div>
            <div id="reg-error" class="hidden text-sm bg-red-50 text-red-600 border border-red-200 px-4 py-2.5 rounded-xl"></div>
            <div id="reg-success" class="hidden text-sm bg-emerald-50 text-emerald-600 border border-emerald-200 px-4 py-2.5 rounded-xl"></div>
            <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20">สมัครสมาชิก</button>
          </form>
          <div class="mt-5 text-center">
            <button onclick="toggleAuthMode(false)" class="text-sm font-semibold text-indigo-600 hover:text-indigo-800">ย้อนกลับไปหน้าเข้าสู่ระบบ</button>
          </div>
        </div>
      </div>
    </section>

    <!-- 2. ส่วนหน้าครูผู้สอน (Teacher Dashboard) -->
    <section id="teacher-dashboard" class="hidden space-y-6">
      
      <!-- การ์ดตัวควบคุมแท็บเมนู -->
      <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div class="flex flex-wrap gap-2">
          <button onclick="switchTeacherTab('tab-manage-exam')" id="btn-tab-manage-exam" class="tab-btn px-4 py-2 rounded-xl font-semibold text-sm transition-all bg-indigo-600 text-white">
            จัดการข้อสอบและคอร์ส
          </button>
          <button onclick="switchTeacherTab('tab-results')" id="btn-tab-results" class="tab-btn px-4 py-2 rounded-xl font-semibold text-sm transition-all text-slate-600 hover:bg-slate-100">
            ดูประวัติการสอบของนักเรียน
          </button>
        </div>
        <span class="text-xs text-slate-400 font-medium font-mono">Teacher Controls</span>
      </div>

      <!-- แท็บย่อย 1: จัดการข้อสอบ -->
      <div id="tab-manage-exam" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- บล็อกฟอร์มเพิ่มรายวิชาใหม่ -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5 h-fit">
          <div class="border-b border-slate-100 pb-3 flex items-center gap-2 text-indigo-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <h3 class="font-bold text-slate-900 text-lg">เพิ่มรายวิชาใหม่</h3>
          </div>
          <form onsubmit="handleCreateSubject(event)" class="space-y-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">ชื่อรายวิชา</label>
              <input type="text" id="new-subject-name" required class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="เช่น เคมีเบื้องต้น ม.5">
            </div>
            <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-xl font-bold text-sm transition-all shadow-sm">
              บันทึกรายวิชาลง Sheets
            </button>
          </form>
          <div class="pt-2">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">รายวิชาทั้งหมด</h4>
            <div id="teacher-subjects-list" class="space-y-1.5 max-h-[150px] overflow-y-auto pr-1">
              <!-- รายวิชาถูกโหลดโดย JS -->
            </div>
          </div>
        </div>

        <!-- ฟอร์มสร้างคำถาม/ข้อสอบคลัง -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:col-span-2 space-y-5">
          <div class="border-b border-slate-100 pb-3 flex items-center gap-2 text-indigo-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v3m-3 0h6m-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            <h3 class="font-bold text-slate-900 text-lg">เพิ่มข้อสอบเข้าคลังสะสม</h3>
          </div>
          
          <form id="add-question-form" onsubmit="handleCreateQuestion(event)" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="sm:col-span-2">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">เลือกวิชาปลายทาง</label>
                <select id="q-subject-id" required class="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500">
                  <option value="">-- กรุณาเลือกรายวิชา --</option>
                  <!-- ตัวเลือกวิชาเติมด้วย JS -->
                </select>
              </div>
              <div class="sm:col-span-2">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">โจทย์คำถาม</label>
                <textarea id="q-text" required rows="3" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="พิมพ์คำถามของคุณที่นี่..."></textarea>
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">ตัวเลือก A</label>
                <input type="text" id="q-optA" required class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="คำตอบข้อ A">
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">ตัวเลือก B</label>
                <input type="text" id="q-optB" required class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="คำตอบข้อ B">
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">ตัวเลือก C</label>
                <input type="text" id="q-optC" required class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="คำตอบข้อ C">
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">ตัวเลือก D</label>
                <input type="text" id="q-optD" required class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="คำตอบข้อ D">
              </div>
              <div class="sm:col-span-2">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 text-indigo-600">ตัวเลือกที่เฉลยถูกต้อง</label>
                <div class="flex gap-4 mt-1">
                  ['A', 'B', 'C', 'D'].forEach(letter => {
                    <label class="flex items-center gap-2 border border-slate-200 px-4 py-2 rounded-xl cursor-pointer hover:bg-indigo-50 transition-all select-none">
                      <input type="radio" name="q-correct" value="A" checked required class="w-4 h-4 text-indigo-600">
                      <span class="font-bold text-slate-700">A</span>
                    </label>
                  })
                </div>
              </div>
            </div>
            <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-xl font-bold text-sm transition-all shadow-sm">
              บันทึกข้อสอบลงชีต Questions
            </button>
          </form>
        </div>
      </div>

      <!-- แท็บย่อย 2: ผลสอบของนักเรียน -->
      <div id="tab-results" class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hidden space-y-4">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 gap-2">
          <div>
            <h3 class="font-bold text-slate-900 text-lg">ตารางรายงานคะแนนสอบและผลการวิเคราะห์</h3>
            <p class="text-xs text-slate-500 font-medium">แสดงสถิติความก้าวหน้าและการสอบของนักเรียนทุกคน</p>
          </div>
          <button onclick="loadExamResults()" class="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-xl">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H17"></path></svg>
            รีเฟรชข้อมูล
          </button>
        </div>
        
        <div class="overflow-x-auto rounded-xl border border-slate-200">
          <table class="w-full text-left text-sm border-collapse">
            <thead>
              <tr class="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase text-xs font-bold tracking-wider">
                <th class="p-4">รหัสผลสอบ</th>
                <th class="p-4">นักเรียน</th>
                <th class="p-4">วิชาที่เข้าสอบ</th>
                <th class="p-4 text-center">คะแนนดิบ</th>
                <th class="p-4 text-center">คิดเป็นร้อยละ</th>
                <th class="p-4">วันเวลาที่ส่งกระดาษคำตอบ</th>
              </tr>
            </thead>
            <tbody id="results-table-body" class="divide-y divide-slate-100 text-slate-700">
              <!-- ข้อมูลโหลดด้วย JS -->
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- 3. หน้าจอฝั่งนักเรียน (Student Dashboard) -->
    <section id="student-dashboard" class="hidden space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- รายการวิชาสอบ -->
        <div class="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div class="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h3 class="font-bold text-slate-900 text-lg">เลือกรายวิชาเพื่อเตรียมสอบ</h3>
              <p class="text-xs text-slate-500 font-medium">วิชาที่ครูผู้สอนเปิดระบบสอบออนไลน์ไว้</p>
            </div>
            <span class="bg-indigo-100 text-indigo-700 font-bold px-2.5 py-1 text-xs rounded-full">เปิดระบบอยู่</span>
          </div>

          <div id="student-subjects-grid" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- ข้อมูลเติมโดย JS -->
          </div>
        </div>

        <!-- รายงานผลสอบส่วนตัวของนักเรียน -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 h-fit">
          <div class="border-b border-slate-100 pb-3">
            <h3 class="font-bold text-slate-900 text-lg">ประวัติการสอบของคุณ</h3>
            <p class="text-xs text-slate-500 font-medium">คะแนนย้อนหลังและรายงานความก้าวหน้า</p>
          </div>
          <div id="student-personal-results" class="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            <!-- โหลดผลสอบเดี่ยวโดย JS -->
          </div>
        </div>
      </div>

      <!-- ป็อปอัพกำหนดเงื่อนไขการสุ่มข้อสอบ -->
      <div id="exam-config-modal" class="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 hidden transition-all duration-300">
        <div class="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full mx-4 border border-slate-100 space-y-4">
          <div>
            <h3 class="text-lg font-bold text-slate-900" id="exam-config-subject-title">คณิตศาสตร์ทั่วไป</h3>
            <p class="text-xs text-slate-500 font-medium mt-1">ตั้งค่าจำนวนข้อสอบที่จะทำการสุ่ม</p>
          </div>
          <div class="space-y-3">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">จำนวนข้อสอบที่ต้องการสุ่ม (ข้อ)</label>
              <input type="number" id="exam-rand-limit" min="1" max="50" value="5" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500">
              <p class="text-[10px] text-slate-400 font-medium mt-1" id="exam-available-count">มีข้อสอบในระบบทั้งหมด: 0 ข้อ</p>
            </div>
            <div class="bg-amber-50 text-amber-800 p-3 rounded-xl text-xs border border-amber-200 font-medium leading-relaxed">
              💡 <b>เงื่อนไขการสุ่ม:</b> ระบบจะทำการสลับลำดับคำถาม และเลือกดึงข้อสอบมาเป็นชุดสอบส่วนตัวของผู้เรียนแต่ละคนไม่ซ้ำกัน
            </div>
          </div>
          <div class="flex gap-2">
            <button onclick="closeExamConfig()" class="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-2.5 rounded-xl text-sm transition-all">ยกเลิก</button>
            <button onclick="startTakingExam()" class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-sm transition-all">เริ่มทำการทดสอบ</button>
          </div>
        </div>
      </div>

      <!-- ส่วนทำข้อสอบจริง (Active Test Room) -->
      <div id="active-test-container" class="bg-white rounded-2xl border-2 border-indigo-500 shadow-lg p-6 sm:p-8 space-y-6 hidden">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 gap-4">
          <div>
            <span class="text-xs font-bold bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full uppercase tracking-wider">กำลังทำข้อสอบ</span>
            <h2 class="text-xl font-bold text-slate-900 mt-1.5" id="active-exam-title">วิทยาศาสตร์ทั่วไป</h2>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-sm font-semibold text-slate-500">ข้อที่:</span>
            <div class="flex items-center gap-1" id="exam-question-pills">
              <!-- พูลตารางข้อ เช่น [1] [2] [3] -->
            </div>
          </div>
        </div>

        <div class="space-y-6" id="exam-questions-list-wrapper">
          <!-- โจทน์คำถามและข้อสอบจะถูกเรนเดอร์ทีละข้อ หรือทั้งหมดในหน้านี้อย่างมีลำดับ -->
        </div>

        <div class="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-100 justify-between items-center">
          <span class="text-xs text-amber-600 font-bold">⚠️ กรุณาตอบให้ครบทุกข้อก่อนกดส่งผลสอบ</span>
          <button onclick="submitExamAnswers()" class="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex justify-center items-center gap-2">
            <span>ส่งกระดาษคำตอบ</span>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
        </div>
      </div>

      <!-- หน้าจอรายงานคะแนนสอบเมื่อส่งสำเร็จ (Result Modal/Panel) -->
      <div id="exam-done-panel" class="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-8 text-white text-center hidden space-y-6 max-w-xl mx-auto shadow-2xl relative overflow-hidden">
        <div class="absolute -top-10 -left-10 w-40 h-40 bg-indigo-600/20 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-600/20 rounded-full blur-3xl"></div>
        
        <div class="relative space-y-4">
          <div class="w-20 h-20 bg-emerald-500/10 border-4 border-emerald-400 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-xl animate-bounce">
            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <div>
            <h3 class="text-2xl font-bold">ส่งข้อสอบเรียบร้อยแล้ว!</h3>
            <p class="text-indigo-200/80 text-sm font-light mt-1">ระบบคำนวณคะแนนและลงทะเบียนผลสอบของคุณสำเร็จ</p>
          </div>

          <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 my-6 max-w-sm mx-auto">
            <p class="text-indigo-200 text-xs font-bold uppercase tracking-widest">คะแนนสอบของคุณ</p>
            <div class="flex items-baseline justify-center gap-1.5 my-3">
              <span class="text-6xl font-extrabold text-emerald-400 font-mono" id="done-score">0</span>
              <span class="text-xl text-white/50 font-bold">/</span>
              <span class="text-2xl text-white/80 font-bold font-mono" id="done-total">0</span>
            </div>
            <p class="text-sm font-semibold text-slate-300">คิดเป็น: <span class="text-emerald-400 font-bold" id="done-percent">0%</span></p>
          </div>

          <div class="flex flex-col gap-2 max-w-xs mx-auto">
            <button onclick="backToStudentDashboard()" class="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/20">กลับสู่หน้าแดชบอร์ดหลัก</button>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer class="bg-slate-100 border-t border-slate-200 py-6 mt-12">
    <div class="max-w-7xl mx-auto px-4 text-center space-y-2">
      <p class="text-xs text-slate-500 font-semibold">ระบบสอบออนไลน์ด้วย Google Apps Script & Google Sheets API</p>
      <p class="text-[10px] text-slate-400 font-medium">ออกแบบเพื่อการประเมินผลออนไลน์อย่างรวดเร็วและรองรับความยืดหยุ่นในคลังข้อสอบ</p>
    </div>
  </footer>

  <!-- ส่วนจาวาสคริปต์สำหรับการเชื่อมต่อ GAS -->
  <script>
    // ส่วนเก็บข้อมูลแบบ State
    let currentUser = null;
    let availableSubjects = [];
    let currentQuestions = [];
    let selectedSubject = null;

    // การเปลี่ยนโหมดเข้าสู่ระบบ/สมัครสมาชิก
    function toggleAuthMode(showRegister) {
      document.getElementById('login-form-wrapper').classList.toggle('hidden', showRegister);
      document.getElementById('register-form-wrapper').classList.toggle('hidden', !showRegister);
      document.getElementById('login-error').classList.add('hidden');
      document.getElementById('reg-error').classList.add('hidden');
      document.getElementById('reg-success').classList.add('hidden');
    }

    // แสดง/ซ่อน สปินเนอร์เพื่อโหลดข้อมูล
    function showLoading(show, text = 'กำลังโหลดข้อมูล...') {
      const spinner = document.getElementById('global-spinner');
      const spinnerText = document.getElementById('spinner-text');
      if (spinnerText) spinnerText.innerText = text;
      
      if (show) {
        spinner.classList.remove('hidden');
        setTimeout(() => spinner.classList.add('opacity-100'), 10);
      } else {
        spinner.classList.remove('opacity-100');
        setTimeout(() => spinner.classList.add('hidden'), 200);
      }
    }

    // 1. ส่งข้อมูลเพื่อล็อกอิน
    function handleLogin(e) {
      e.preventDefault();
      const userBox = document.getElementById('login-username').value;
      const passBox = document.getElementById('login-password').value;
      const errBox = document.getElementById('login-error');
      
      errBox.classList.add('hidden');
      showLoading(true, 'กำลังตรวจสอบสิทธิ์ใน Google Sheets...');
      
      google.script.run
        .withSuccessHandler(function(res) {
          showLoading(false);
          if (res.success) {
            currentUser = res.user;
            setupDashboard();
          } else {
            errBox.innerText = res.message;
            errBox.classList.remove('hidden');
          }
        })
        .withFailureHandler(function(err) {
          showLoading(false);
          errBox.innerText = 'เกิดความผิดพลาดจากเซิร์ฟเวอร์: ' + err.toString();
          errBox.classList.remove('hidden');
        })
        .loginUser(userBox, passBox);
    }

    // 2. สมัครสมาชิก
    function handleRegister(e) {
      e.preventDefault();
      const name = document.getElementById('reg-name').value;
      const user = document.getElementById('reg-username').value;
      const pass = document.getElementById('reg-password').value;
      const role = document.getElementById('reg-role').value;
      
      const errBox = document.getElementById('reg-error');
      const succBox = document.getElementById('reg-success');
      
      errBox.classList.add('hidden');
      succBox.classList.add('hidden');
      showLoading(true, 'กำลังลงทะเบียนข้อมูลลง Google Sheets...');
      
      google.script.run
        .withSuccessHandler(function(res) {
          showLoading(false);
          if (res.success) {
            succBox.innerText = 'สมัครสมาชิกสำเร็จ! ย้ายไปหน้าล็อกอินได้เลย';
            succBox.classList.remove('hidden');
            document.getElementById('register-form').reset();
            setTimeout(() => toggleAuthMode(false), 1500);
          } else {
            errBox.innerText = res.message;
            errBox.classList.remove('hidden');
          }
        })
        .withFailureHandler(function(err) {
          showLoading(false);
          errBox.innerText = 'เกิดข้อผิดพลาด: ' + err.toString();
          errBox.classList.remove('hidden');
        })
        .registerUser(user, pass, name, role);
    }

    // จัดเตรียมหน้า Dashboard ตามบทบาทผู้ใช้
    function setupDashboard() {
      // ซ่อนหน้าล็อกอิน
      document.getElementById('auth-section').classList.add('hidden');
      
      // แสดง Navbar และเติมข้อมูลผู้ใช้งาน
      const nav = document.getElementById('main-nav');
      nav.classList.remove('hidden');
      document.getElementById('nav-user-name').innerText = currentUser.name;
      
      const roleBadge = document.getElementById('nav-user-role');
      roleBadge.innerText = currentUser.role === 'teacher' ? 'ครูผู้สอน' : 'ผู้เรียน';
      if (currentUser.role === 'teacher') {
        roleBadge.className = 'inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-indigo-100 text-indigo-700';
        document.getElementById('teacher-dashboard').classList.remove('hidden');
        loadTeacherData();
      } else {
        roleBadge.className = 'inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-emerald-100 text-emerald-700';
        document.getElementById('student-dashboard').classList.remove('hidden');
        loadStudentData();
      }
    }

    // ออกจากระบบ
    function logout() {
      currentUser = null;
      document.getElementById('main-nav').classList.add('hidden');
      document.getElementById('teacher-dashboard').classList.add('hidden');
      document.getElementById('student-dashboard').classList.add('hidden');
      document.getElementById('auth-section').classList.remove('hidden');
      document.getElementById('login-form').reset();
    }

    // เปลี่ยนเมนูแถบครู
    function switchTeacherTab(tabId) {
      document.getElementById('tab-manage-exam').classList.add('hidden');
      document.getElementById('tab-results').classList.add('hidden');
      
      document.getElementById('btn-tab-manage-exam').className = 'tab-btn px-4 py-2 rounded-xl font-semibold text-sm transition-all text-slate-600 hover:bg-slate-100';
      document.getElementById('btn-tab-results').className = 'tab-btn px-4 py-2 rounded-xl font-semibold text-sm transition-all text-slate-600 hover:bg-slate-100';
      
      document.getElementById(tabId).classList.remove('hidden');
      document.getElementById('btn-' + tabId).className = 'tab-btn px-4 py-2 rounded-xl font-semibold text-sm transition-all bg-indigo-600 text-white';
    }

    // โหลดวิชาและผลสอบฝั่งครู
    function loadTeacherData() {
      showLoading(true, 'กำลังโหลดข้อมูลคอร์สเรียนและข้อสอบ...');
      google.script.run
        .withSuccessHandler(function(res) {
          showLoading(false);
          if (res.success) {
            availableSubjects = res.data;
            renderSubjectsInForm();
            loadExamResults();
          }
        })
        .getSubjects();
    }

    function renderSubjectsInForm() {
      const select = document.getElementById('q-subject-id');
      const listDiv = document.getElementById('teacher-subjects-list');
      
      select.innerHTML = '<option value="">-- กรุณาเลือกรายวิชา --</option>';
      listDiv.innerHTML = '';
      
      availableSubjects.forEach(sub => {
        // เพิ่มในดรอปดาวน์
        const opt = document.createElement('option');
        opt.value = sub.subject_id;
        opt.innerText = sub.subject_name;
        select.appendChild(opt);
        
        // เพิ่มในรายการข้างล่าง
        const subRow = document.createElement('div');
        subRow.className = 'flex justify-between items-center bg-slate-50 border border-slate-200/60 p-2.5 rounded-xl text-xs';
        subRow.innerHTML = \`<span class="font-bold text-slate-700">\${sub.subject_name}</span> <span class="text-slate-400 font-semibold">\${sub.subject_id}</span>\`;
        listDiv.appendChild(subRow);
      });
    }

    function handleCreateSubject(e) {
      e.preventDefault();
      const sName = document.getElementById('new-subject-name').value;
      showLoading(true, 'กำลังเพิ่มวิชาลงชีต Subjects...');
      
      google.script.run
        .withSuccessHandler(function(res) {
          if (res.success) {
            document.getElementById('new-subject-name').value = '';
            loadTeacherData();
          } else {
            showLoading(false);
            alert('ล้มเหลว: ' + res.message);
          }
        })
        .addSubject(sName, currentUser.id);
    }

    function handleCreateQuestion(e) {
      e.preventDefault();
      const subjectId = document.getElementById('q-subject-id').value;
      const text = document.getElementById('q-text').value;
      const optA = document.getElementById('q-optA').value;
      const optB = document.getElementById('q-optB').value;
      const optC = document.getElementById('q-optC').value;
      const optD = document.getElementById('q-optD').value;
      
      const correctRadios = document.getElementsByName('q-correct');
      let correctOpt = 'A';
      for (let r of correctRadios) {
        if (r.checked) {
          correctOpt = r.value;
          break;
        }
      }
      
      showLoading(true, 'กำลังบันทึกคำถามลงชีต Questions...');
      google.script.run
        .withSuccessHandler(function(res) {
          showLoading(false);
          if (res.success) {
            document.getElementById('add-question-form').reset();
            alert('เพิ่มข้อสอบลงคลังสำเร็จ!');
          } else {
            alert('ล้มเหลว: ' + res.message);
          }
        })
        .addQuestion(subjectId, text, optA, optB, optC, optD, correctOpt);
    }

    function loadExamResults() {
      google.script.run
        .withSuccessHandler(function(res) {
          if (res.success) {
            const tableBody = document.getElementById('results-table-body');
            tableBody.innerHTML = '';
            
            if (res.data.length === 0) {
              tableBody.innerHTML = \`<tr><td colspan="6" class="p-6 text-center text-slate-400 font-medium">ยังไม่มีผลการสอบส่งเข้ามาในระบบ</td></tr>\`;
              return;
            }
            
            res.data.forEach(row => {
              const tr = document.createElement('tr');
              tr.className = 'hover:bg-slate-50 transition-colors border-b border-slate-100';
              
              const pct = Math.round((row.score / row.total_questions) * 100);
              let badgeColor = 'bg-red-100 text-red-700';
              if (pct >= 80) badgeColor = 'bg-emerald-100 text-emerald-700';
              else if (pct >= 50) badgeColor = 'bg-amber-100 text-amber-700';
              
              tr.innerHTML = \`
                <td class="p-4 font-mono text-xs font-bold text-slate-500">\${row.result_id}</td>
                <td class="p-4 font-semibold text-slate-900">\${row.student_name}</td>
                <td class="p-4 font-medium text-slate-600">\${row.subject_name}</td>
                <td class="p-4 text-center font-bold text-slate-800 font-mono">\${row.score} / \${row.total_questions}</td>
                <td class="p-4 text-center">
                  <span class="inline-block px-2.5 py-1 text-xs font-bold rounded-lg \${badgeColor}">\${pct}%</span>
                </td>
                <td class="p-4 text-slate-400 text-xs font-semibold">\${row.date_time}</td>
              \`;
              tableBody.appendChild(tr);
            });
          }
        })
        .getExamResults();
    }

    // ==========================================
    // ส่วนควบคุมแดชบอร์ดนักเรียน (Student Flow)
    // ==========================================
    function loadStudentData() {
      showLoading(true, 'กำลังดึงรายวิชาสำหรับการสอบ...');
      google.script.run
        .withSuccessHandler(function(res) {
          showLoading(false);
          if (res.success) {
            availableSubjects = res.data;
            renderStudentSubjects();
            loadStudentPersonalHistory();
          }
        })
        .getSubjects();
    }

    function renderStudentSubjects() {
      const grid = document.getElementById('student-subjects-grid');
      grid.innerHTML = '';
      
      if (availableSubjects.length === 0) {
        grid.innerHTML = '<div class="col-span-2 text-center text-slate-400 py-6 font-medium">ไม่มีรายวิชาเปิดสอบในขณะนี้</div>';
        return;
      }
      
      availableSubjects.forEach(sub => {
        const card = document.createElement('div');
        card.className = 'bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-400 transition-all shadow-sm flex flex-col justify-between gap-4';
        card.innerHTML = \`
          <div>
            <div class="bg-indigo-50 text-indigo-700 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm mb-3">\${sub.subject_id}</div>
            <h4 class="font-bold text-slate-900 text-base leading-snug">\${sub.subject_name}</h4>
            <p class="text-xs text-slate-400 font-medium mt-1">อาจารย์ผู้ดูแลคลังข้อสอบ</p>
          </div>
          <button onclick="openExamConfig('\${sub.subject_id}', '\${sub.subject_name}')" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-xl text-xs transition-all flex items-center justify-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
            เข้าทำการทดสอบ
          </button>
        \`;
        grid.appendChild(card);
      });
    }

    function loadStudentPersonalHistory() {
      google.script.run
        .withSuccessHandler(function(res) {
          if (res.success) {
            const historyList = document.getElementById('student-personal-results');
            historyList.innerHTML = '';
            
            const personal = res.data.filter(row => row.student_id === currentUser.id);
            if (personal.length === 0) {
              historyList.innerHTML = '<div class="text-center text-slate-400 py-4 text-xs font-semibold">คุณยังไม่เคยเข้าสอบวิชาใดๆ</div>';
              return;
            }
            
            personal.forEach(row => {
              const pct = Math.round((row.score / row.total_questions) * 100);
              let color = 'text-red-500';
              if (pct >= 80) color = 'text-emerald-500';
              else if (pct >= 50) color = 'text-amber-500';
              
              const rowDiv = document.createElement('div');
              rowDiv.className = 'bg-slate-50 border border-slate-200/50 p-3 rounded-xl flex justify-between items-center text-xs';
              rowDiv.innerHTML = \`
                <div>
                  <p class="font-bold text-slate-800">\${row.subject_name}</p>
                  <p class="text-[10px] text-slate-400 font-semibold">\${row.date_time}</p>
                </div>
                <div class="text-right">
                  <p class="font-bold text-sm \${color} font-mono">\${row.score}/\${row.total_questions}</p>
                  <p class="text-[9px] text-slate-400 font-bold">\${pct}%</p>
                </div>
              \`;
              historyList.appendChild(rowDiv);
            });
          }
        })
        .getExamResults();
    }

    // แสดงหน้าจอตั้งค่าสุ่มวิชาสอบ
    function openExamConfig(subjId, subjName) {
      selectedSubject = { id: subjId, name: subjName };
      document.getElementById('exam-config-subject-title').innerText = subjName;
      
      showLoading(true, 'กำลังตรวจสอบคลังข้อสอบย่อย...');
      // ดึงคลังวิชานี้มาตรวจสอบจำนวนที่มี
      google.script.run
        .withSuccessHandler(function(res) {
          showLoading(false);
          if (res.success) {
            const count = res.total_available || res.data.length;
            document.getElementById('exam-available-count').innerText = 'มีข้อสอบในคลังวิชานี้ทั้งหมด: ' + count + ' ข้อ';
            const limitInput = document.getElementById('exam-rand-limit');
            limitInput.value = Math.min(10, count);
            limitInput.max = count;
            
            if (count === 0) {
              alert('วิชานี้ยังไม่มีข้อสอบในคลัง ไม่สามารถสอบได้');
              return;
            }
            document.getElementById('exam-config-modal').classList.remove('hidden');
          }
        })
        .getQuestionsForExam(subjId, 100);
    }

    function closeExamConfig() {
      document.getElementById('exam-config-modal').classList.add('hidden');
    }

    // เริ่มทำข้อสอบ (Randomized Exam Trigger)
    function startTakingExam() {
      const limit = document.getElementById('exam-rand-limit').value;
      closeExamConfig();
      showLoading(true, 'กำลังสุ่มรวบรวมข้อสอบชุดพิเศษของคุณ...');
      
      google.script.run
        .withSuccessHandler(function(res) {
          showLoading(false);
          if (res.success) {
            currentQuestions = res.data;
            displayActiveExam();
          } else {
            alert(res.message);
          }
        })
        .getQuestionsForExam(selectedSubject.id, limit);
    }

    function displayActiveExam() {
      // ซ่อนหน้าจอส่วนที่เหลือ
      document.getElementById('student-subjects-grid').parentElement.classList.add('hidden');
      document.getElementById('student-personal-results').parentElement.classList.add('hidden');
      
      // แสดง Test Room
      const container = document.getElementById('active-test-container');
      container.classList.remove('hidden');
      document.getElementById('active-exam-title').innerText = selectedSubject.name;
      
      // สร้างตารางข้อสอบย่อย
      const listWrapper = document.getElementById('exam-questions-list-wrapper');
      listWrapper.innerHTML = '';
      
      const pills = document.getElementById('exam-question-pills');
      pills.innerHTML = '';
      
      currentQuestions.forEach((q, idx) => {
        // แถบเม็ดนำทาง
        const pill = document.createElement('span');
        pill.id = 'pill-q-' + idx;
        pill.className = 'w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold border border-slate-200 text-slate-400 font-mono';
        pill.innerText = idx + 1;
        pills.appendChild(pill);
        
        // การ์ดโจทย์ตัวเลือก
        const qCard = document.createElement('div');
        qCard.className = 'bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4';
        qCard.innerHTML = \`
          <div class="flex gap-2 items-start">
            <span class="bg-indigo-600 text-white font-mono font-bold text-xs px-2.5 py-1 rounded-lg">ข้อ \${idx + 1}</span>
            <p class="font-bold text-slate-900 text-base leading-relaxed">\${q.question_text}</p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-2">
            \${['A', 'B', 'C', 'D'].map(ch => \`
              <label onclick="markPillDone(\${idx})" class="flex items-center gap-3 border border-slate-200 bg-white hover:border-indigo-500 hover:bg-indigo-50/20 px-4 py-3 rounded-xl cursor-pointer select-none transition-all">
                <input type="radio" name="ans-\${q.question_id}" value="\${ch}" class="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300">
                <span class="font-bold text-slate-400 font-mono text-sm">\${ch}.</span>
                <span class="text-sm font-medium text-slate-700">\${q['option_' + ch]}</span>
              </label>
            \`).join('')}
          </div>
        \`;
        listWrapper.appendChild(qCard);
      });
    }

    function markPillDone(idx) {
      const pill = document.getElementById('pill-q-' + idx);
      if (pill) {
        pill.className = 'w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold bg-indigo-600 text-white font-mono';
      }
    }

    // ส่งข้อสอบคำนวณและบันทึกคะแนน
    function submitExamAnswers() {
      let score = 0;
      let unanswered = 0;
      
      currentQuestions.forEach(q => {
        const radios = document.getElementsByName('ans-' + q.question_id);
        let answeredVal = null;
        for (let r of radios) {
          if (r.checked) {
            answeredVal = r.value;
            break;
          }
        }
        
        if (!answeredVal) {
          unanswered++;
        } else if (answeredVal === q.correct_option) {
          score++;
        }
      });
      
      if (unanswered > 0) {
        const conf = confirm('คุณยังตอบไม่ครบทุกข้อ เหลืออีก ' + unanswered + ' ข้อที่ต้องการข้าม คุณยืนยันจะส่งกระดาษคำตอบหรือไม่?');
        if (!conf) return;
      }
      
      showLoading(true, 'ระบบกำลังบันทึกคะแนนสอบลงคลาวด์ Google Sheets...');
      
      google.script.run
        .withSuccessHandler(function(res) {
          showLoading(false);
          if (res.success) {
            document.getElementById('active-test-container').classList.add('hidden');
            
            // แสดงหน้าสรุปคะแนน
            const donePanel = document.getElementById('exam-done-panel');
            donePanel.classList.remove('hidden');
            
            document.getElementById('done-score').innerText = score;
            document.getElementById('done-total').innerText = currentQuestions.length;
            const pct = Math.round((score / currentQuestions.length) * 100);
            document.getElementById('done-percent').innerText = pct + '%';
          } else {
            alert('ล้มเหลวในการลงทะเบียนคะแนน: ' + res.message);
          }
        })
        .submitExam(currentUser.id, selectedSubject.id, score, currentQuestions.length);
    }

    function backToStudentDashboard() {
      document.getElementById('exam-done-panel').classList.add('hidden');
      document.getElementById('student-subjects-grid').parentElement.classList.remove('hidden');
      document.getElementById('student-personal-results').parentElement.classList.remove('hidden');
      loadStudentData();
    }
  </script>
</body>
</html>
`;

export const INSTALLATION_GUIDE = `### 📋 คู่มือการติดตั้งระบบสอบออนไลน์ (Google Sheets & Apps Script)

ระบบนี้เปลี่ยน Google Sheets ของคุณให้กลายเป็น **ระบบบริหารจัดการการสอบออนไลน์** ที่มีประสิทธิภาพและปลอดภัยสูง โดยไม่ต้องเช่าเซิร์ฟเวอร์ใดๆ

---

### ขั้นตอนที่ 1: เตรียมไฟล์ฐานข้อมูล Google Sheets
1. ล็อกอินเข้าใช้งานบัญชี Google ไดรฟ์ของคุณ
2. สร้าง Google Sheets ใหม่ขึ้นมา 1 ไฟล์
3. ตั้งชื่อชีตว่า **"ระบบสอบออนไลน์และคลังข้อสอบ"**
4. ในไฟล์ดังกล่าว ให้สร้างแผ่นงาน (Sheets) ทั้งหมด **4 แผ่นงานย่อย** และให้กรอกข้อกำหนดหัวตาราง (Headers) ในแถวที่ 1 (Row 1) ของแต่ละแผ่นงานสะกดคำให้ถูกต้องดังนี้:

   * **ชีตย่อยที่ 1: "Users"**
     * แถวแรกกรอก (A1-E1): \`id\`, \`username\`, \`password\`, \`name\`, \`role\`
     * *หมายเหตุ: บทบาท (role) ต้องมีค่าเป็น "teacher" หรือ "student"*

   * **ชีตย่อยที่ 2: "Subjects"**
     * แถวแรกกรอก (A1-C1): \`subject_id\`, \`subject_name\`, \`teacher_id\`

   * **ชีตย่อยที่ 3: "Questions"**
     * แถวแรกกรอก (A1-H1): \`question_id\`, \`subject_id\`, \`question_text\`, \`option_A\`, \`option_B\`, \`option_C\`, \`option_D\`, \`correct_option\`

   * **ชีตย่อยที่ 4: "Exam_Results"**
     * แถวแรกกรอก (A1-F1): \`result_id\`, \`student_id\`, \`subject_id\`, \`score\`, \`total_questions\`, \`date_time\`

> 💡 **ข้อเสนอพิเศษ:** โค้ดหลังบ้านออกแบบระบบตรวจสอบความผิดพลาด หากชีตย่อยขาดหาย ระบบจะทำการสร้างและวางหัวตารางให้คุณโดยอัตโนมัติในการล็อกอินใช้งานครั้งแรก!

---

### ขั้นตอนที่ 2: การเขียนโค้ดหลังบ้าน (Apps Script)
1. ในแถบเมนูด้านบนของ Google Sheets คลิกไปที่ **ส่วนขยาย (Extensions)** -> **แอปสคริปต์ (Apps Script)**
2. จะมีหน้าต่างสร้างสคริปต์ขึ้นมา ให้ลบโค้ดเดิมในไฟล์ \`Code.gs\` ออกทั้งหมด
3. คัดลอกซอร์สโค้ดจากแท็บ **"โค้ดหลังบ้าน (Code.gs)"** ทั้งหมดไปวางทดแทน
4. กดบันทึกการเปลี่ยนแปลง (ปุ่มรูปดิสก์ 💾 หรือกด Ctrl + S)

---

### ขั้นตอนที่ 3: การสร้างหน้าเว็บอินเตอร์เฟซ (HTML UI)
1. ในแถบด้านซ้ายของแอปสคริปต์ ถัดจากแถบ "ไฟล์" ให้คลิกปุ่ม **เครื่องหมายบวก (+)** แล้วเลือกประเภทไฟล์เป็น **HTML**
2. ตั้งชื่อไฟล์นี้ว่า **"Index"** (สคริปต์จะหาไฟล์นามสกุล \`.html\` ให้อัตโนมัติ โดยอิงชื่อ Index)
3. ลบโค้ดในไฟล์ \`Index.html\` ออกทั้งหมด
4. คัดลอกซอร์สโค้ดจากแท็บ **"โค้ดหน้าบ้าน (Index.html)"** ทั้งหมดไปวางทดแทน
5. กดบันทึกการเปลี่ยนแปลงทั้งหมดอีกครั้ง 💾

---

### ขั้นตอนที่ 4: การนำไปติดตั้งใช้งานจริง (Deployment)
1. มองหาปุ่ม **การทำให้ใช้งานได้ (Deploy)** ที่อยู่มุมขวาบนของแอปสคริปต์ แล้วเลือก **การทำให้ใช้งานได้ใหม่ (New deployment)**
2. คลิกรูปฟันเฟือง ⚙️ ข้างคำว่า "เลือกประเภท" เลือกเป็น **เว็บแอป (Web app)**
3. กำหนดค่าการตั้งค่าต่อไปนี้อย่างรอบคอบ:
   * **คำอธิบาย:** ระบบสอบออนไลน์ เวอร์ชัน 1.0
   * **เรียกใช้งานในฐานะ (Execute as):** เลือกเป็น **"ฉัน" (Me - บัญชีเมลของคุณเอง)**เพื่อให้อินเตอร์เฟซเข้าถึง Google Sheets ผ่านความคุ้มครองของคุณ
   * **ผู้ที่มีสิทธิ์เข้าถึง (Who has access):** เลือกเป็น **"ทุกคน" (Everyone)** (สิ่งนี้สำคัญเพื่อให้คุณครูและนักเรียนสามารถเข้ามาทำการทดสอบได้โดยตรง)
4. คลิกปุ่ม **ทำให้ใช้งานได้ (Deploy)**
5. ในกรณีติดตั้งครั้งแรก Google จะขอสิทธิ์อนุญาตการเข้าถึงข้อมูล Sheets ให้คลิกที่ **ให้สิทธิ์เข้าถึง (Authorize access)** -> เลือกบัญชีอีเมล Google ของคุณ -> คลิก **ขั้นสูง (Advanced)** -> เลือก **ไปที่ (ไม่ปลอดภัย) / Go to Untitled project (unsafe)** -> กด **อนุญาต (Allow)** เพื่อเปิดใช้งาน
6. ระบบจะมอบ URL ของเว็บแอปให้กับคุณ คัดลอกลิงก์นั้นไปส่งต่อให้กับนักเรียนและคุณครูเพื่อเข้าใช้หน้าสอบได้ทันที!
`;
