document.addEventListener('DOMContentLoaded', () => {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const mobileMenu = document.querySelector('.mobile-menu');
    const overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay';
    document.body.appendChild(overlay);

    navbarToggler.addEventListener('click', () => {
        mobileMenu.classList.toggle('show');
        overlay.style.display = mobileMenu.classList.contains('show') ? 'block' : 'none';
    });

    overlay.addEventListener('click', () => {
        mobileMenu.classList.remove('show');
        overlay.style.display = 'none';
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            mobileMenu.classList.remove('show');
            overlay.style.display = 'none';
        }
    });

    mobileMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('show');
            overlay.style.display = 'none';
        });
    });
});