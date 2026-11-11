'use strict';
(() => {
  const config = window.SURVEY_CONFIG || {};
  const endpoint = typeof config.endpoint === 'string' ? config.endpoint.trim() : '';
  const form = document.getElementById('survey');
  const button = document.getElementById('submit-button');
  const note = document.getElementById('config-note');
  const status = document.getElementById('submit-status');
  const nickname = document.getElementById('nickname');
  let submitting = false;
  document.getElementById('event-name').textContent = config.eventName || 'ケア体験会';
  note.hidden = Boolean(endpoint);
  button.disabled = !endpoint;
  form.addEventListener('change', () => {
    const show = form.elements.nameDisplay.value === 'ニックネーム';
    document.getElementById('nickname-wrap').hidden = !show;
    nickname.disabled = !show;
    nickname.required = show;
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submitting || !endpoint) return;
    form.querySelectorAll('.error').forEach(el => { el.hidden = true; el.textContent = ''; });
    form.querySelectorAll('[aria-invalid]').forEach(el => el.removeAttribute('aria-invalid'));
    let firstInvalid;
    for (const control of form.elements) {
      if (!control.willValidate) continue;
      const blank = control.required && ['text', 'textarea'].includes(control.type) && !control.value.trim();
      if (blank || !control.validity.valid) {
        const error = document.getElementById(`${control.name}-error`);
        if (error) {
          error.textContent = control.type === 'checkbox' ? 'この項目への同意が必要です。' : control.type === 'radio' ? 'いずれかを選択してください。' : 'この項目を入力してください。';
          error.hidden = false;
        }
        control.setAttribute('aria-invalid', 'true');
        firstInvalid ||= control;
      }
    }
    if (firstInvalid) {
      status.textContent = '未回答の必須項目があります。各項目をご確認ください。';
      firstInvalid.focus();
      return;
    }
    const data = new FormData(form);
    if (data.get('website')) {
      status.textContent = '送信できませんでした。ページを再読み込みしてお試しください。';
      return;
    }
    const payload = { eventName: config.eventName || 'ケア体験会' };
    for (const key of ['name', 'instagram', 'age', 'concerns', 'satisfaction', 'impressions', 'staffFeedback', 'futureInterest', 'photoPermission', 'nameDisplay', 'nickname', 'website']) payload[key] = String(data.get(key) || '').trim();
    for (const key of ['treatments', 'menus']) payload[key] = data.getAll(key);
    for (const key of ['consentPhoto', 'consentInstagram', 'consentSurvey', 'consentPublication']) payload[key] = data.has(key);
    submitting = true;
    button.disabled = true;
    button.textContent = '送信中…';
    status.textContent = '送信しています。そのままお待ちください。';
    try {
      // no-cors responses are opaque: spreadsheet storage cannot be confirmed here.
      await fetch(endpoint, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(payload) });
      form.hidden = true;
      const thanks = document.getElementById('thank-you');
      thanks.hidden = false;
      thanks.focus();
    } catch {
      status.textContent = '通信エラーのため送信できませんでした。入力内容は保持されています。通信環境を確認して、もう一度送信してください。';
      status.focus();
    } finally {
      submitting = false;
      button.disabled = !endpoint;
      button.textContent = '回答を送信する';
    }
  });
})();
