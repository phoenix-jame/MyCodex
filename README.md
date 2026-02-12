# Grok Auto Creator (Chrome Extension)

Chrome extension นี้ช่วยทำงาน automation เบื้องต้นบนหน้า Grok เพื่อส่ง prompt สำหรับสร้างภาพหรือวิดีโอจาก popup

## ความสามารถ
- กรอก prompt แล้วกด **Generate Image**
- กรอก prompt แล้วกด **Generate Video**
- extension จะพยายาม:
  1. หา input/textarea บนหน้าเว็บ
  2. ใส่ prompt ให้
  3. กดปุ่มโหมดภาพ/วิดีโอ (ถ้าพบ)
  4. กดปุ่มส่งคำสั่ง

> หมายเหตุ: selector ของหน้า Grok อาจเปลี่ยนได้ตลอด หากปุ่มหาไม่เจอ ให้ส่ง prompt เองหลัง extension เติมข้อความแล้ว

## วิธีติดตั้ง (Developer mode)
1. เปิด Chrome ไปที่ `chrome://extensions`
2. เปิด **Developer mode**
3. กด **Load unpacked** แล้วเลือกโฟลเดอร์นี้

## วิธีใช้งาน
1. เปิดหน้า Grok (เช่น `https://grok.com` หรือหน้าที่มี Grok บน X)
2. คลิกไอคอน extension
3. วาง prompt ที่ต้องการ
4. เลือกปุ่ม **Generate Image** หรือ **Generate Video**
5. ตรวจสอบผลลัพธ์บนหน้า Grok

## โครงสร้างไฟล์
- `manifest.json` — การตั้งค่า extension (MV3)
- `popup.html`, `popup.css`, `popup.js` — UI และ logic ฝั่ง popup
- `content.js` — automation logic บนหน้า Grok
- `background.js` — service worker พื้นฐาน

## แนวทางต่อยอด
- เพิ่มระบบ preset prompts
- เพิ่ม retry logic และ fallback selectors
- เพิ่มการรองรับหลายภาษาในปุ่มของหน้า Grok
