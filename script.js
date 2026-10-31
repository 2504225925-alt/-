document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.nav-item');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const menuToggle = document.querySelector('.menu-toggle');
  const overlay = document.querySelector('.sidebar-overlay');
  const body = document.body;

  navItems.forEach((button) => {
    button.addEventListener('click', () => {
      navItems.forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
    });
  });

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
    });
  });

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      body.classList.toggle('sidebar-open');
    });
  }

  if (overlay) {
    overlay.addEventListener('click', () => {
      body.classList.remove('sidebar-open');
    });
  }

  const chartBars = document.querySelectorAll('.bar');
  chartBars.forEach((bar, index) => {
    const originalHeight = bar.style.height;
    bar.style.height = '20%';
    requestAnimationFrame(() => {
      setTimeout(() => {
        bar.style.transition = 'height 0.5s ease';
        bar.style.height = originalHeight;
      }, 100 * index);
    });
  });

  const loginForm = document.querySelector('.login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      window.location.href = 'index.html';
    });
  }
});
