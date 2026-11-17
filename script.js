document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.nav-item');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const menuToggle = document.querySelector('.menu-toggle');
  const overlay = document.querySelector('.sidebar-overlay');
  const body = document.body;

  navItems.forEach((item) => {
    item.addEventListener('click', () => {
      navItems.forEach((navItem) => navItem.classList.remove('active'));
      item.classList.add('active');
    });
  });

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const group = button.closest('.filter-group');
      (group || document).querySelectorAll('.filter-btn').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
    });
  });

  if (menuToggle) menuToggle.addEventListener('click', () => body.classList.toggle('sidebar-open'));
  if (overlay) overlay.addEventListener('click', () => body.classList.remove('sidebar-open'));

  document.querySelectorAll('.bar').forEach((bar, index) => {
    const originalHeight = bar.style.height;
    bar.style.height = '20%';
    requestAnimationFrame(() => setTimeout(() => {
      bar.style.transition = 'height 0.5s ease';
      bar.style.height = originalHeight;
    }, 100 * index));
  });

  let selectedRole = 'patient';
  const roleOptions = document.querySelectorAll('.role-option');
  const loginHint = document.querySelector('#login-hint');
  roleOptions.forEach((option) => {
    option.addEventListener('click', () => {
      selectedRole = option.dataset.role;
      roleOptions.forEach((item) => {
        const active = item === option;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      if (loginHint) {
        loginHint.textContent = selectedRole === 'admin'
          ? '管理者登录后可进入机构运营与服务管理后台。'
          : '患者与家属登录后可查看健康记录、预约和照护提醒。';
      }
    });
  });

  const loginForm = document.querySelector('#login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const destination = selectedRole === 'admin' ? 'index.html' : 'patient.html';
      window.location.href = destination;
    });
  }

  document.querySelectorAll('[data-patient-action]').forEach((button) => {
    button.addEventListener('click', () => {
      const action = button.dataset.patientAction;
      const messages = {
        appointment: '预约功能为演示原型，请联系您的服务中心确认预约。',
        help: '已展示求助入口。真实紧急情况请立即拨打当地急救电话。',
        medication: '已记录您查看了用药提醒，请按医生或药师的医嘱用药。',
      };
      window.alert(messages[action] || '该功能为演示原型。');
    });
  });
});
