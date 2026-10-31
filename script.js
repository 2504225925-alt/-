document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.nav-item');
  const filterButtons = document.querySelectorAll('.filter-btn');

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
});
