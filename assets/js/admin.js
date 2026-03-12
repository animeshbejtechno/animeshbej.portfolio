// === Admin Panel Logic ===
(function () {
    // Default password hash (SHA-256 of "admin@123")
    const DEFAULT_PASS_HASH = '2ca53b546c581524395edb84b510eb95b82ecb9c58b7cc1692e306667d8eb8a2';

    // --- Utility: Simple SHA-256 hash ---
    async function hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // --- Toast Notification ---
    function showToast(message) {
        const toast = document.getElementById('toast');
        const toastMsg = document.getElementById('toastMsg');
        if (!toast || !toastMsg) return;
        toastMsg.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    // --- Data Storage ---
    function getData(key) {
        try {
            return JSON.parse(localStorage.getItem('portfolio_' + key)) || [];
        } catch { return []; }
    }

    function setData(key, data) {
        localStorage.setItem('portfolio_' + key, JSON.stringify(data));
    }

    function getPassHash() {
        return localStorage.getItem('portfolio_passHash') || DEFAULT_PASS_HASH;
    }

    function setPassHash(hash) {
        localStorage.setItem('portfolio_passHash', hash);
    }

    // --- Login Logic ---
    const loginOverlay = document.getElementById('loginOverlay');
    const adminDashboard = document.getElementById('adminDashboard');
    const loginBtn = document.getElementById('loginBtn');
    const loginError = document.getElementById('loginError');
    const passwordInput = document.getElementById('adminPassword');
    const logoutBtn = document.getElementById('logoutBtn');

    if (loginBtn) {
        // Toggle password visibility
        const togglePass = document.getElementById('togglePass');
        if (togglePass) {
            togglePass.addEventListener('click', () => {
                const type = passwordInput.type === 'password' ? 'text' : 'password';
                passwordInput.type = type;
                togglePass.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
            });
        }

        loginBtn.addEventListener('click', async () => {
            const pass = passwordInput.value;
            const hash = await hashPassword(pass);
            if (hash === getPassHash()) {
                loginOverlay.style.display = 'none';
                adminDashboard.style.display = 'block';
                sessionStorage.setItem('admin_auth', 'true');
                updateStats();
                renderAllLists();
            } else {
                loginError.classList.add('show');
                passwordInput.value = '';
                setTimeout(() => loginError.classList.remove('show'), 2000);
            }
        });

        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') loginBtn.click();
        });
    }

    // Check session
    if (sessionStorage.getItem('admin_auth') === 'true' && adminDashboard) {
        loginOverlay.style.display = 'none';
        adminDashboard.style.display = 'block';
        updateStats();
        renderAllLists();
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('admin_auth');
            window.location.href = 'index.html';
        });
    }

    // --- Tabs ---
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
        });
    });

    // --- Skills ---
    const skillForm = document.getElementById('skillForm');
    if (skillForm) {
        skillForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const skills = getData('skills');
            skills.push({
                id: Date.now(),
                name: document.getElementById('skillName').value,
                progress: parseInt(document.getElementById('skillProgress').value),
                category: document.getElementById('skillCategory').value
            });
            setData('skills', skills);
            skillForm.reset();
            renderSkills();
            updateStats();
            showToast('Skill added successfully!');
        });
    }

    // --- Certificates ---
    const certForm = document.getElementById('certForm');
    if (certForm) {
        certForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const certs = getData('certificates');
            certs.push({
                id: Date.now(),
                title: document.getElementById('certTitle').value,
                issuer: document.getElementById('certIssuer').value,
                date: document.getElementById('certDate').value,
                status: document.getElementById('certStatus').value
            });
            setData('certificates', certs);
            certForm.reset();
            renderCerts();
            updateStats();
            showToast('Certificate added successfully!');
        });
    }

    // --- Projects ---
    const projectForm = document.getElementById('projectForm');
    if (projectForm) {
        projectForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const projects = getData('projects');
            projects.push({
                id: Date.now(),
                title: document.getElementById('projectTitle').value,
                desc: document.getElementById('projectDesc').value,
                tech: document.getElementById('projectTech').value,
                link: document.getElementById('projectLink').value
            });
            setData('projects', projects);
            projectForm.reset();
            renderProjects();
            updateStats();
            showToast('Project added successfully!');
        });
    }

    // --- Change Password ---
    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const current = document.getElementById('currentPass').value;
            const newPass = document.getElementById('newPass').value;
            const confirm = document.getElementById('confirmPass').value;

            const currentHash = await hashPassword(current);
            if (currentHash !== getPassHash()) {
                showToast('Current password is incorrect!');
                return;
            }
            if (newPass !== confirm) {
                showToast('New passwords do not match!');
                return;
            }
            if (newPass.length < 4) {
                showToast('Password must be at least 4 characters!');
                return;
            }
            const newHash = await hashPassword(newPass);
            setPassHash(newHash);
            passwordForm.reset();
            showToast('Password updated successfully!');
        });
    }

    // --- Render Functions ---
    function renderSkills() {
        const list = document.getElementById('skillsList');
        if (!list) return;
        const skills = getData('skills');
        const categoryNames = {
            programming: 'Programming',
            pentesting: 'Penetration Testing & VAPT',
            networking: 'Networking & SIEM',
            frameworks: 'Frameworks & Security'
        };
        if (skills.length === 0) {
            list.innerHTML = '<p class="empty-msg">No skills added yet from admin panel.</p>';
            return;
        }
        list.innerHTML = skills.map(s => `
            <div class="list-item">
                <div class="list-item-info">
                    <span class="item-name">${s.name} — ${s.progress}%</span>
                    <span class="item-detail">${categoryNames[s.category] || s.category}</span>
                </div>
                <button class="btn-delete" onclick="deleteItem('skills', ${s.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    function renderCerts() {
        const list = document.getElementById('certsList');
        if (!list) return;
        const certs = getData('certificates');
        if (certs.length === 0) {
            list.innerHTML = '<p class="empty-msg">No certificates added yet from admin panel.</p>';
            return;
        }
        list.innerHTML = certs.map(c => `
            <div class="list-item">
                <div class="list-item-info">
                    <span class="item-name">${c.title}</span>
                    <span class="item-detail">${c.issuer} • ${c.date} • ${c.status === 'ongoing' ? '🔄 Ongoing' : '✅ Completed'}</span>
                </div>
                <button class="btn-delete" onclick="deleteItem('certificates', ${c.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    function renderProjects() {
        const list = document.getElementById('projectsList');
        if (!list) return;
        const projects = getData('projects');
        if (projects.length === 0) {
            list.innerHTML = '<p class="empty-msg">No projects added yet from admin panel.</p>';
            return;
        }
        list.innerHTML = projects.map(p => `
            <div class="list-item">
                <div class="list-item-info">
                    <span class="item-name">${p.title}</span>
                    <span class="item-detail">${p.tech}${p.link ? ' • <a href="' + p.link + '" target="_blank" style="color:var(--accent-primary)">GitHub</a>' : ''}</span>
                </div>
                <button class="btn-delete" onclick="deleteItem('projects', ${p.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    function renderAllLists() {
        renderSkills();
        renderCerts();
        renderProjects();
    }

    function updateStats() {
        const sc = document.getElementById('skillCount');
        const cc = document.getElementById('certCount');
        const pc = document.getElementById('projectCount');
        if (sc) sc.textContent = getData('skills').length;
        if (cc) cc.textContent = getData('certificates').length;
        if (pc) pc.textContent = getData('projects').length;
    }

    // --- Delete Item (global) ---
    window.deleteItem = function (type, id) {
        let items = getData(type);
        items = items.filter(item => item.id !== id);
        setData(type, items);
        renderAllLists();
        updateStats();
        showToast('Item deleted!');
    };

    // --- Export Data ---
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const data = {
                skills: getData('skills'),
                certificates: getData('certificates'),
                projects: getData('projects'),
                exportDate: new Date().toISOString()
            };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'portfolio_data_' + new Date().toISOString().slice(0, 10) + '.json';
            a.click();
            URL.revokeObjectURL(url);
            showToast('Data exported successfully!');
        });
    }

    // --- Import Data ---
    const importFile = document.getElementById('importFile');
    if (importFile) {
        importFile.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function (event) {
                try {
                    const data = JSON.parse(event.target.result);
                    if (data.skills) setData('skills', data.skills);
                    if (data.certificates) setData('certificates', data.certificates);
                    if (data.projects) setData('projects', data.projects);
                    renderAllLists();
                    updateStats();
                    showToast('Data imported successfully!');
                } catch {
                    showToast('Invalid JSON file!');
                }
            };
            reader.readAsText(file);
            importFile.value = '';
        });
    }

    // --- Clear All Data ---
    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (confirm('Are you sure? This will delete ALL admin-added skills, certificates, and projects.')) {
                localStorage.removeItem('portfolio_skills');
                localStorage.removeItem('portfolio_certificates');
                localStorage.removeItem('portfolio_projects');
                renderAllLists();
                updateStats();
                showToast('All data cleared!');
            }
        });
    }

})();
