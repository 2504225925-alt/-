document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.nav-item');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const menuToggle = document.querySelector('.menu-toggle');
  const sidebarOverlay = document.querySelector('.sidebar-overlay');

  // Keep the mobile navigation dismissible by both its toggle and the backdrop.
  menuToggle?.addEventListener('click', () => {
    document.body.classList.toggle('sidebar-open');
  });

  sidebarOverlay?.addEventListener('click', () => {
    document.body.classList.remove('sidebar-open');
  });

  // Tabs are scoped to their nearest filter group so unrelated controls stay selected.
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const group = button.closest('.filter-group');
      const buttons = group ? group.querySelectorAll('.filter-btn') : filterButtons;
      buttons.forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
    });
  });

  // Animate dashboard bars only on pages that contain a chart.
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

  const loginForm = document.querySelector('#login-form');
  loginForm?.addEventListener('submit', (event) => {
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
      const action = button.dataset.patientAction;
      window.alert(patientActionMessages[action] || '该功能为演示原型。');
    });
  });
});
