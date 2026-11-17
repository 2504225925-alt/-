document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'smart-eldercare-patient-requests';
  const requests = (() => {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  })();

  // Give every management page a direct route back to the patient experience.
  const actions = document.querySelector('.topbar-actions');
  if (actions && !actions.querySelector('[data-patient-portal-link]')) {
    const link = document.createElement('a');
    link.href = 'patient.html';
    link.className = 'badge neutral';
    link.dataset.patientPortalLink = 'true';
    link.textContent = '患者服务端';
    link.style.cssText = 'display:inline-flex;align-items:center;margin-right:10px;text-decoration:none';
    actions.prepend(link);
  }

  // Patient requests are stored locally in this static prototype and shown as admin work orders.
  const table = document.querySelector('.table-panel tbody');
  if (!table) return;
  requests.slice().reverse().forEach((request) => {
    if (!request || !request.id || table.querySelector(`[data-patient-request-id="${request.id}"]`)) return;
    const row = document.createElement('tr');
    row.dataset.patientRequestId = request.id;
    const created = request.createdAt ? new Date(request.createdAt) : null;
    const displayTime = created && !Number.isNaN(created.getTime())
      ? `${String(created.getHours()).padStart(2, '0')}:${String(created.getMinutes()).padStart(2, '0')}`
      : '刚刚';
    [request.id, '王阿姨', request.service || '患者服务申请', '待分配', '待跟进', `${request.date || ''} ${request.time || displayTime}`.trim()].forEach((value, index) => {
      const cell = document.createElement('td');
      if (index === 4) {
        const status = document.createElement('span');
        status.className = 'status pending';
        status.textContent = String(value);
        cell.append(status);
      } else {
        cell.textContent = String(value);
      }
      row.append(cell);
    });
    table.prepend(row);
  });
});
