const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const sidebarButtons = document.querySelectorAll('.sidebar-list-item button');
    const cards = document.querySelectorAll('.cards');

    function openSidebar() {
        sidebar.classList.add('open');
        sidebarOverlay.classList.add('active');

        // Animate sidebar buttons sequentially
        sidebarButtons.forEach((btn, index) => {
            setTimeout(() => btn.classList.add('show'), index * 100);
        });
    }

    function closeSidebar() {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');

        sidebarButtons.forEach(btn => btn.classList.remove('show'));
    }

    // Toggle sidebar with menu icon
    menuToggle.addEventListener('click', () => {
        if(sidebar.classList.contains('open')){
            closeSidebar();
        } else {
            openSidebar();
        }
    });

    // Animate cards on page load
    window.addEventListener('load', () => {
        cards.forEach((card, index) => {
            setTimeout(() => card.classList.add('show'), index * 150);
        });
    });