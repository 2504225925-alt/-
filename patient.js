document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'smart-eldercare-patient-requests';
  const REMINDER_KEY = 'smart-eldercare-reminders';

  function readRequests() {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
  }

  function showToast(message) {
    let toast = document.querySelector('.patient-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'patient-toast';
      toast.setAttribute('role', 'status');
      document.body.append(toast);
    }
    toast.textContent = message;
    toast.classList.add('visible');
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove('visible'), 2600);
  }

  document.querySelectorAll('[data-reminder]').forEach((checkbox) => {
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(REMINDER_KEY) || '{}'); } catch { saved = {}; }
    checkbox.checked = Boolean(saved[checkbox.dataset.reminder]);
    checkbox.addEventListener('change', () => {
      try {
        const current = JSON.parse(localStorage.getItem(REMINDER_KEY) || '{}');
        current[checkbox.dataset.reminder] = checkbox.checked;
        localStorage.setItem(REMINDER_KEY, JSON.stringify(current));
      } catch { /* Local storage may be unavailable in private browsing. */ }
      showToast(checkbox.checked ? '已完成今日提醒' : '已更新提醒状态');
    });
  });

  const form = document.querySelector('#patient-service-form');
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const request = {
      id: `PT-${Date.now()}`,
      service: String(data.get('service') || ''),
      date: String(data.get('date') || ''),
      time: String(data.get('time') || ''),
      phone: String(data.get('phone') || ''),
      note: String(data.get('note') || ''),
      createdAt: new Date().toISOString(),
      status: '待跟进',
    };
    try {
      const requests = readRequests();
      requests.unshift(request);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(requests.slice(0, 50)));
    } catch {
      showToast('浏览器暂不支持保存，请联系服务中心预约');
      return;
    }
    addPatientOrder(request);
    form.reset();
    showToast('预约申请已提交，服务团队将尽快联系您（演示）');
  });

  function addPatientOrder(request) {
    const list = document.querySelector('#patient-order-list');
    if (!list || list.querySelector(`[data-request-id="${request.id}"]`)) return;
    const card = document.createElement('article');
    card.className = 'order-card';
    card.dataset.requestId = request.id;
    const top = document.createElement('div');
    top.className = 'order-top';
    const title = document.createElement('strong');
    title.textContent = request.service;
    const status = document.createElement('span');
    status.className = 'pill pill-orange';
    status.textContent = '待跟进';
    top.append(title, status);
    const description = document.createElement('p');
    description.textContent = request.note || '申请已提交，服务团队将联系您确认安排。';
    const meta = document.createElement('div');
    meta.className = 'order-meta';
    meta.textContent = `${request.date} · ${request.time} · 申请编号 ${request.id}`;
    card.append(top, description, meta);
    list.prepend(card);
  }

  readRequests().forEach(addPatientOrder);

  document.querySelectorAll('.filter-tab').forEach((button) => {
    button.addEventListener('click', () => {
      button.closest('.filter-tabs')?.querySelectorAll('.filter-tab').forEach((tab) => tab.classList.remove('active'));
      button.classList.add('active');
      const range = button.dataset.range;
      const bars = document.querySelectorAll('.trend-column');
      bars.forEach((bar, index) => {
        bar.style.opacity = range === '7' || index < Math.ceil(Number(range) / 5) ? '1' : '.35';
      });
      showToast(`已切换至近 ${range} 天视图（演示）`);
    });
  });
});
