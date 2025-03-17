/**
 * server.js
 * ตัวอย่าง Server (Node.js + Express) สำหรับดึงข้อมูลจาก Google Sheets
 * และเสิร์ฟหน้าเว็บพร้อมกราฟ
 */
const express = require('express');
const { google } = require('googleapis');
const path = require('path');
const app = express();
const PORT = 3000;

// 1) โหลดไฟล์ credentials.json
const credentials = require('./credentials.json');

// 2) ตั้งค่า scope
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

// 3) สร้าง client จาก service account
const auth = new google.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key,
  SCOPES
);

/**
 * ฟังก์ชันดึงข้อมูลจาก Google Sheets
 * - รับค่า spreadsheetId, range
 * - คืนค่าเป็น array ของข้อมูล
 */
async function getSheetData(spreadsheetId, range) {
  // รอให้ auth พร้อม
  await auth.authorize();
  const sheets = google.sheets({ version: 'v4', auth });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  const rows = response.data.values;
  if (!rows || rows.length === 0) {
    return [];
  }
  return rows;
}

// เสิร์ฟไฟล์ static จากโฟลเดอร์ public
app.use(express.static(path.join(__dirname, 'public')));

/**
 * สร้าง endpoint /api/data
 * ให้ front-end เรียกเพื่อดึงข้อมูลจาก Google Sheets
 */
app.get('/api/data', async (req, res) => {
  try {
    // TODO: ใส่ Spreadsheet ID ของคุณ
    const spreadsheetId = '1fRtTmVbGJq5vGYpl22oirTJwJ3bsdLj042UmaWXGVB8';
    // TODO: ใส่ range ตามชีต เช่น 'Sheet1!A2:C'
    const range = 'มีนาคม-2568!A2:C';

    const rows = await getSheetData(spreadsheetId, range);

    // สร้าง chartData สำหรับ Google Charts
    // หัวตาราง เช่น ["DateTime", "Value"]
    let chartData = [["DateTime", "Value"]];

    // สมมติ rows[i] = [ "2025-03-14 08:00", "25.5", ... ]
    rows.forEach((row) => {
      const dateTimeStr = row[0];  // คอลัมน์ A: วันที่+เวลา
      const valueStr = row[1];     // คอลัมน์ B: ค่าที่จะนำไปใช้

      if (!dateTimeStr || !valueStr) return;

      // แปลงเป็น Date object
      let dateObj = new Date(dateTimeStr); // ถ้าฟอร์แมตตรงกัน หากไม่, อาจต้องปรับโค้ด parse
      let val = parseFloat(valueStr);

      chartData.push([dateObj, val]);
    });

    // ส่งกลับเป็น JSON
    res.json(chartData);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: err.message });
  }
});

// เริ่มต้น server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
