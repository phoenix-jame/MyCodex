function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function fireInputEvents(el) {
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.dispatchEvent(new Event('change', { bubbles: true }));
}

function findPromptBox() {
  const selectors = [
    'textarea',
    '[contenteditable="true"]',
    'div[role="textbox"]'
  ];

  for (const selector of selectors) {
    const node = document.querySelector(selector);
    if (node) return node;
  }

  return null;
}

function setPrompt(node, prompt) {
  if (node instanceof HTMLTextAreaElement || node instanceof HTMLInputElement) {
    node.focus();
    node.value = prompt;
    fireInputEvents(node);
    return;
  }

  if (node instanceof HTMLElement && node.isContentEditable) {
    node.focus();
    node.textContent = prompt;
    fireInputEvents(node);
  }
}

function findButtonByTerms(terms) {
  const buttons = [...document.querySelectorAll('button, [role="button"]')];
  const lowered = terms.map((term) => term.toLowerCase());

  return buttons.find((button) => {
    const text = (button.textContent || '').trim().toLowerCase();
    return lowered.some((term) => text.includes(term));
  });
}

async function runAutomation(mode, prompt) {
  const promptBox = findPromptBox();
  if (!promptBox) {
    throw new Error('ไม่พบช่องกรอก prompt บนหน้านี้');
  }

  setPrompt(promptBox, prompt);
  await sleep(250);

  const modeTerms =
    mode === 'video'
      ? ['video', 'vdo', 'generate video', 'create video']
      : ['image', 'generate image', 'create image', 'photo'];

  const modeButton = findButtonByTerms(modeTerms);
  if (modeButton) {
    modeButton.click();
    await sleep(200);
  }

  const submitBtn = findButtonByTerms(['send', 'submit', 'generate', 'enter']);
  if (!submitBtn) {
    throw new Error('ไม่พบปุ่มส่งคำสั่ง กรุณากดส่งเองหลังจากเติม prompt');
  }

  submitBtn.click();
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== 'GROK_AUTOMATION') {
    return;
  }

  const { mode, prompt } = message.payload || {};

  runAutomation(mode, prompt)
    .then(() => {
      sendResponse({
        ok: true,
        message:
          mode === 'video'
            ? 'ส่งคำสั่งสร้างวิดีโอแล้ว (ตรวจสอบผลบนหน้า Grok)'
            : 'ส่งคำสั่งสร้างภาพแล้ว (ตรวจสอบผลบนหน้า Grok)'
      });
    })
    .catch((error) => {
      sendResponse({ ok: false, error: error.message });
    });

  return true;
});
