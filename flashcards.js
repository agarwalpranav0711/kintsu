/**
 * Kintsu Flashcard Library
 * Loads stacks from localStorage (kintsu_flashcards), renders them,
 * updates STACKS / CARDS counts, filters by search and sorts by date or name.
 * With no stacks saved, the empty state stays visible, as in the prototype.
 */
let stacks = [];
try {
    const saved = JSON.parse(localStorage.getItem('kintsu_flashcards') || '[]');
    if (Array.isArray(saved)) stacks = saved;
} catch (e) { stacks = []; }

function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderStacks() {
    const grid = document.getElementById('stacksGrid');
    const empty = document.getElementById('emptyState');
    const stackCount = document.getElementById('stackCount');
    const cardCount = document.getElementById('cardCount');
    if (!grid) return;
    const query = (document.getElementById('stackSearch')?.value || '').trim().toLowerCase();
    const sort = document.getElementById('stackSort')?.value || 'newest';
    let filtered = stacks.filter(s => !query || (s.title || '').toLowerCase().includes(query));
    if (sort === 'newest') filtered = filtered.slice().sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    if (sort === 'oldest') filtered = filtered.slice().sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
    if (sort === 'name') filtered = filtered.slice().sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    const totalCards = stacks.reduce((sum, s) => sum + (Array.isArray(s.cards) ? s.cards.length : (s.cardCount || 0)), 0);
    if (stackCount) stackCount.textContent = String(stacks.length);
    if (cardCount) cardCount.textContent = String(totalCards);
    if (empty) empty.style.display = filtered.length === 0 ? 'block' : 'none';
    grid.innerHTML = '';
    filtered.forEach(s => {
        const card = document.createElement('div');
        card.className = 'stack-card';
        const count = Array.isArray(s.cards) ? s.cards.length : (s.cardCount || 0);
        card.innerHTML = '<h3>' + escapeHtml(s.title || 'Untitled stack') + '</h3>' +
            '<p>' + count + ' cards</p>' +
            '<div class="stack-meta"><span>' + escapeHtml(s.source || '') + '</span><span>' + escapeHtml(s.createdLabel || '') + '</span></div>';
        grid.appendChild(card);
    });
}

function initLibrary() {
    const user = JSON.parse(localStorage.getItem('kintsu_user') || '{}');
    if (user.email) {
        const tag = document.getElementById('userEmailTag');
        if (tag) tag.textContent = user.email;
    }
    const themeBtn = document.getElementById('flashThemeToggle');
    if (themeBtn) {
        themeBtn.onclick = () => {
            const isDark = document.body.classList.toggle('dark');
            localStorage.setItem('kintsu_theme', isDark ? 'dark' : 'light');
        };
    }
    const signOut = document.getElementById('signOutBtn');
    if (signOut) {
        signOut.onclick = () => {
            localStorage.removeItem('kintsu_user');
            window.location.href = 'signin.html';
        };
    }
    const search = document.getElementById('stackSearch');
    if (search) search.addEventListener('input', renderStacks);
    const sort = document.getElementById('stackSort');
    if (sort) sort.addEventListener('change', renderStacks);
    document.querySelectorAll('.feedback-type').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.feedback-type').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            const note = document.getElementById('feedbackNote');
            if (note) note.textContent = 'Thanks - feedback type selected: ' + btn.dataset.type;
        };
    });
    const range = document.getElementById('experienceRange');
    const value = document.getElementById('ratingValue');
    if (range && value) range.addEventListener('input', () => { value.textContent = range.value; });
    renderStacks();
}

document.addEventListener('DOMContentLoaded', initLibrary);
