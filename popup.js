const promptInput = document.getElementById('prompt');
const imageBtn = document.getElementById('imageBtn');
const videoBtn = document.getElementById('videoBtn');
const statusEl = document.getElementById('status');

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.classList.toggle('error', isError);
}

async function getActiveTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0];
}

function isLikelyGrokUrl(url) {
  if (!url) return false;
  return /grok\.com|x\.com|twitter\.com/.test(url);
}

async function sendAction(mode) {
  const prompt = promptInput.value.trim();
  if (!prompt) {
    setStatus('กรุณาใส่ prompt ก่อน', true);
    return;
  }

  const tab = await getActiveTab();
  if (!tab?.id || !isLikelyGrokUrl(tab.url)) {
    setStatus('กรุณาเปิดหน้า Grok ก่อนใช้งาน', true);
    return;
  }

  setStatus('กำลังส่งคำสั่ง...');

  try {
    const response = await chrome.tabs.sendMessage(tab.id, {
      type: 'GROK_AUTOMATION',
      payload: { mode, prompt }
    });

    if (!response?.ok) {
      throw new Error(response?.error || 'ไม่สามารถสั่ง automation ได้');
    }

    setStatus(response.message || 'ส่งคำสั่งสำเร็จ');
  } catch (error) {
    setStatus(`เกิดข้อผิดพลาด: ${error.message}`, true);
  }
}

imageBtn.addEventListener('click', () => sendAction('image'));
videoBtn.addEventListener('click', () => sendAction('video'));
