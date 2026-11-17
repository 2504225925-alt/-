document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.nav-item');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const menuToggle = document.querySelector('.menu-toggle');
  const sidebarOverlay = document.querySelector('.sidebar-overlay');

  menuToggle?.addEventListener('click', () => {
    document.body.classList.toggle('sidebar-open');
  });

  sidebarOverlay?.addEventListener('click', () => {
    document.body.classList.remove('sidebar-open');
  });

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const group = button.closest('.filter-group');
      const buttons = group ? group.querySelectorAll('.filter-btn') : filterButtons;
      buttons.forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
    });
  });

  document.querySelectorAll('.bar').forEach((bar, index) => {
    const targetHeight = bar.style.height;
    if (!targetHeight) return;

    bar.style.height = '20%';
    requestAnimationFrame(() => {
      window.setTimeout(() => {
        bar.style.transition = 'height 0.5s ease';
        bar.style.height = targetHeight;
      }, 100 * index);
    });
  });

  let selectedRole = 'patient';
  const roleOptions = document.querySelectorAll('.role-option');
  const loginHint = document.querySelector('#login-hint');

  roleOptions.forEach((option) => {
    option.addEventListener('click', () => {
      selectedRole = option.dataset.role === 'admin' ? 'admin' : 'patient';

      roleOptions.forEach((item) => {
        const isActive = item === option;
        item.classList.toggle('active', isActive);
        item.setAttribute('aria-pressed', String(isActive));
      });

      if (loginHint) {
        loginHint.textContent = selectedRole === 'admin'
          ? '管理者登录后可进入机构运营与服务管理后台。'
          : '患者与家属登录后可查看健康记录、预约和照护提醒。';
      }
    });
  });

  document.querySelector('#login-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    window.location.href = selectedRole === 'admin' ? 'index.html' : 'patient.html';
  });

  const patientActionMessages = {
    appointment: '预约功能为演示原型，请联系您的服务中心确认预约。',
    help: '这是演示求助入口。真实紧急情况请立即拨打当地急救电话。',
    medication: '请按医生或药师的医嘱用药；本页面提醒仅供演示。',
  };

  document.querySelectorAll('[data-patient-action]').forEach((button) => {
    button.addEventListener('click', () => {
      window.alert(patientActionMessages[button.dataset.patientAction] || '该功能为演示原型。');
    });
  });

  // Admin actions are delegated so every existing top-right button works across pages.
  document.addEventListener('click', (event) => {
    const topbarButton = event.target.closest('.topbar-actions button');
    if (topbarButton) {
      event.preventDefault();
      runAdminAction(topbarButton);
      return;
    }

    const iconButton = event.target.closest('.topbar-actions .icon-btn');
    if (iconButton) {
      event.preventDefault();
      if (iconButton.textContent.trim() === '🔔') {
        showDialog('通知中心', '<p>暂无新的系统通知。</p><ul class="action-list"><li>每日健康数据汇总已更新</li><li>设备巡检提醒：今日 16:00</li></ul>', '知道了');
      } else {
        showDialog('快捷入口', '<p>选择一个管理模块继续操作：</p><div class="quick-links"><a href="elderly.html">老人档案</a><a href="service.html">服务工单</a><a href="alarm.html">报警中心</a></div>', '关闭');
      }
      return;
    }

    if (event.target.closest('.topbar-actions .user-card')) {
      showDialog('当前账号', '<p><strong>周主任</strong> · 运营管理</p><p class="muted-copy">此处为演示账号信息，不代表真实登录身份。</p>', '关闭');
      return;
    }

    const heroButton = event.target.closest('.hero-actions button');
    if (heroButton?.textContent.includes('发起服务')) {
      openServiceForm();
      return;
    }
    if (heroButton?.textContent.includes('查看报告')) {
      window.location.href = 'report.html';
      return;
    }

    const viewAllButton = event.target.closest('.badge.neutral');
    if (viewAllButton?.textContent.includes('查看全部')) {
      window.location.href = 'elderly.html';
    }
  });

  function runAdminAction(button) {
    const label = button.textContent.trim();
    if (label.includes('新增档案')) return openElderlyForm();
    if (label.includes('新建工单')) return openServiceForm();
    if (label.includes('导出报告')) return downloadCsv('健康监测演示报告', [['指标', '演示值'], ['平均心率', '72 次/分'], ['血压均值', '118/76 mmHg'], ['睡眠时长', '7.6 小时'], ['异常告警', '14']]);
    if (label.includes('导出报表')) return downloadCsv('运营分析演示报表', [['指标', '演示值'], ['运营收入', '286.4K'], ['服务时长', '4280h'], ['满意度', '96.5%'], ['成本控制', '82.4%']]);
    if (label.includes('设备巡检')) {
      showDialog('设备巡检', '<p>本次演示巡检清单：</p><ul class="action-list"><li>检查床头呼叫器状态</li><li>校准呼吸监测设备</li><li>核对离线设备列表</li></ul>', '开始巡检', () => notify('巡检任务已记录（演示）'));
      return;
    }
    if (label.includes('一键处理')) {
      showDialog('确认处理告警', '<p>将当前列表中的待跟进告警标记为“已处理”。此操作仅更新本页面演示状态。</p>', '确认处理', () => {
        document.querySelectorAll('.table-panel tbody tr').forEach((row) => {
          const status = row.querySelector('td:last-child .status');
          if (status && !status.textContent.includes('已处理')) {
            status.textContent = '已处理';
            status.className = 'status ok';
          }
        });
        notify('告警已更新为已处理（演示）');
      });
      return;
    }
    notify(`${label || '此操作'}已触发（演示）`);
  }

  function openElderlyForm() {
    showDialog('新增老人档案', '<label class="dialog-field">姓名<input name="name" required placeholder="请输入姓名"></label><label class="dialog-field">年龄<input name="age" type="number" min="1" max="120" required placeholder="例如：72"></label><label class="dialog-field">护理等级<select name="level"><option>一级护理</option><option selected>二级护理</option><option>三级护理</option></select></label>', '保存档案', (form) => {
      const data = new FormData(form);
      const tbody = document.querySelector('.table-panel tbody');
      if (tbody) {
        const row = document.createElement('tr');
        [data.get('name'), data.get('age'), data.get('level'), '待评估', '刚刚新增'].forEach((value) => {
          const cell = document.createElement('td');
          cell.textContent = String(value || '');
          row.appendChild(cell);
        });
        tbody.prepend(row);
      }
      notify('档案已添加到当前演示列表');
    });
  }

  function openServiceForm() {
    showDialog('新建服务工单', '<label class="dialog-field">服务对象<input name="person" required placeholder="请输入老人姓名"></label><label class="dialog-field">服务类型<select name="service"><option>健康随访</option><option>送餐照护</option><option>康复陪伴</option><option>陪同就医</option></select></label><label class="dialog-field">预约时间<input name="time" type="datetime-local" required></label>', '创建工单', (form) => {
      const data = new FormData(form);
      const tbody = document.querySelector('.table-panel tbody');
      if (tbody) {
        const row = document.createElement('tr');
        [`#SW-${Date.now().toString().slice(-4)}`, data.get('person'), data.get('service'), '待分配', '待跟进', data.get('time')].forEach((value) => {
          const cell = document.createElement('td');
          cell.textContent = String(value || '');
          row.appendChild(cell);
        });
        tbody.prepend(row);
      }
      notify('工单已添加到当前演示列表');
    });
  }

  function showDialog(title, bodyHtml, submitLabel, onSubmit) {
    document.querySelector('.admin-dialog-backdrop')?.remove();
    const backdrop = document.createElement('div');
    backdrop.className = 'admin-dialog-backdrop';
    backdrop.innerHTML = `<section class="admin-dialog" role="dialog" aria-modal="true" aria-labelledby="admin-dialog-title"><button class="admin-dialog-close" type="button" aria-label="关闭">×</button><h2 id="admin-dialog-title"></h2><form class="admin-dialog-form"><div class="admin-dialog-body"></div><div class="admin-dialog-actions"><button class="ghost-btn dialog-cancel" type="button">取消</button><button class="primary-btn" type="submit"></button></div></form></section>`;
    backdrop.querySelector('#admin-dialog-title').textContent = title;
    backdrop.querySelector('.admin-dialog-body').innerHTML = bodyHtml;
    backdrop.querySelector('.admin-dialog-form button[type="submit"]').textContent = submitLabel;

    const close = () => backdrop.remove();
    backdrop.querySelector('.admin-dialog-close').addEventListener('click', close);
    backdrop.querySelector('.dialog-cancel').addEventListener('click', close);
    backdrop.addEventListener('click', (event) => {
      if (event.target === backdrop) close();
    });
    backdrop.querySelector('form').addEventListener('submit', (event) => {
      event.preventDefault();
      if (onSubmit) onSubmit(event.currentTarget);
      close();
    });
    document.addEventListener('keydown', function escapeDialog(event) {
      if (event.key === 'Escape' && document.body.contains(backdrop)) {
        close();
        document.removeEventListener('keydown', escapeDialog);
      }
    });
    document.body.appendChild(backdrop);
    backdrop.querySelector('input, select, button')?.focus();
  }

  function notify(message) {
    let toast = document.querySelector('.admin-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'admin-toast';
      toast.setAttribute('role', 'status');
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('visible');
    window.clearTimeout(notify.timeout);
    notify.timeout = window.setTimeout(() => toast.classList.remove('visible'), 2600);
  }

  function downloadCsv(filename, rows) {
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\r\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8' }));
    link.download = `${filename}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    notify(`${filename}已导出（演示数据）`);
  }
});
