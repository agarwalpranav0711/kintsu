// Kintsu Interactive Client Logic

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. Dark Mode Toggle with persistence
    // ----------------------------------------------------
    const darkToggle = document.getElementById('darkToggle');
    const themeIcon = document.getElementById('themeIcon');
    const savedTheme = localStorage.getItem('kintsu_theme');

    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.body.classList.add('dark');
        if (themeIcon) themeIcon.textContent = '☀️';
    }

    if (darkToggle) {
        darkToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark');
            const isDark = document.body.classList.contains('dark');
            if (themeIcon) themeIcon.textContent = isDark ? '☀️' : '🌙';
            localStorage.setItem('kintsu_theme', isDark ? 'dark' : 'light');
        });
    }

    // ----------------------------------------------------
    // 2. 3D Flashcard Flip Interaction
    // ----------------------------------------------------
    const demoCard = document.getElementById('demoCard');
    if (demoCard) {
        demoCard.addEventListener('click', () => {
            demoCard.classList.toggle('flipped');
        });

        demoCard.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                demoCard.classList.toggle('flipped');
            }
        });
    }

    // ----------------------------------------------------
    // 3. Selection Bubble & Flashcard Synthesis Simulation
    // ----------------------------------------------------
    const bubbleYes = document.getElementById('bubbleYes');
    const bubbleNo = document.getElementById('bubbleNo');
    const selectionBubble = document.getElementById('selectionBubble');

    if (bubbleYes && demoCard) {
        bubbleYes.addEventListener('click', (e) => {
            e.stopPropagation();
            demoCard.classList.add('flipped');
            setTimeout(() => {
                demoCard.classList.remove('flipped');
            }, 3500);
        });
    }

    if (bubbleNo && selectionBubble) {
        bubbleNo.addEventListener('click', (e) => {
            e.stopPropagation();
            selectionBubble.style.opacity = '0';
            setTimeout(() => {
                selectionBubble.style.opacity = '1';
            }, 4000);
        });
    }
});
